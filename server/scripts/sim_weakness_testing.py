"""
Monte-Carlo simulation: how much knowledge a *blank* learner accumulates by
studying ONLY through this app, and which weakness-based testing strategy
(10 candidate "models") is most effective.

Faithful to the app's real mechanics:
  - Concept DAG = the 43 real KR chapters + their prerequisiteCodes (_kr_dag.tsv).
  - Observed mastery score uses the app's exact delta rule:
      +5 correct / -6 wrong, -2 hint, -1 slow, +2 hard&correct, -2 active error-pattern,
      clamp[0,100]; idle decay: 14d grace, then -0.5/day, floor 35 (mastery-decay.util).
  - Error pattern ACTIVE = same failure >=3 of last 5 attempts on a concept.
  - Strategies pick concepts from the *observed* mastery (what the app can see),
    never the latent truth — as the real recommender must.

Latent learning model (learning-science grounded):
  - True knowledge k_c in [0,1], starts 0. Learning needs prerequisites (the
    "prerequisite frontier" — weak prereqs cap performance AND learning) and
    desirable difficulty (max learning when challenge ~ ability; too-hard teaches
    little even with the wrong-note re-teach).
  - Forgetting: k decays between sessions with a per-concept stability that grows
    with *spaced* successful retrievals (spacing effect) — so review timing matters.

Run: python server/scripts/sim_weakness_testing.py
"""
import math, random, os, statistics

HERE = os.path.dirname(os.path.abspath(__file__))
DAG_PATH = os.path.join(HERE, "_kr_dag.tsv")

# ---------------- load real DAG ----------------
def load_dag():
    nodes, prereqs = [], {}
    with open(DAG_PATH, encoding="utf-8") as f:
        for line in f:
            line = line.rstrip("\n")
            if not line.strip():
                continue
            parts = line.split("|")
            code = parts[0].strip()
            pres = [p.strip() for p in (parts[1].split(",") if len(parts) > 1 and parts[1].strip() else []) if p.strip()]
            nodes.append(code)
            prereqs[code] = pres
    # keep only prereqs that exist as nodes
    nodeset = set(nodes)
    for c in prereqs:
        prereqs[c] = [p for p in prereqs[c] if p in nodeset]
    return nodes, prereqs

NODES, PREREQ = load_dag()
N_C = len(NODES)
IDX = {c: i for i, c in enumerate(NODES)}
PRE_IDX = {IDX[c]: [IDX[p] for p in PREREQ[c]] for c in NODES}

# ---------------- learner / attempt model ----------------
GUESS = 0.20          # 5-choice MC
SLIP = 0.05
SLOPE = 5.0
LEARN_RATE = 0.22     # base learning per well-targeted attempt
ZPD_SIGMA = 0.28      # width of the desirable-difficulty learning band
STAB_INIT = 8.0       # initial retention stability (days)
STAB_FLOOR = 4.0
MASTER_K = 0.80       # latent mastery threshold
PROBLEMS_PER_SESSION = 20
SESSION_GAP_DAYS = 2.0   # spacing between study sessions
COOLDOWN = 12            # can't re-pick a concept within N attempts (app: 3-day/FIFO cooldown)
DIFF_POLICY = "obs"      # "obs" = difficulty from observed mastery; "zpd" = all strategies control difficulty to ZPD
BUDGET = 600          # total attempts (~weeks of usage)
RETENTION_DELAY_DAYS = 30

def readiness(k, cidx):
    pres = PRE_IDX[cidx]
    if not pres:
        return 1.0
    mn = min(k[p] for p in pres)
    mean = sum(k[p] for p in pres) / len(pres)
    return 0.5 * mn + 0.5 * mean          # weakest-link + average blend

def ability(k, cidx):
    return k[cidx] * (0.4 + 0.6 * readiness(k, cidx))

def p_correct(k, cidx, diff):
    a = ability(k, cidx)
    return GUESS + (1 - GUESS - SLIP) / (1 + math.exp(-SLOPE * (a - diff)))

def zpd_factor(a, diff):
    # Max learning when difficulty just above current ability (desirable difficulty).
    return math.exp(-((diff - (a + 0.10)) ** 2) / (2 * ZPD_SIGMA ** 2))

# ---------------- app observed-mastery (exact delta rule) ----------------
def obs_update(obs, correct, hint, slow, hard, active_err):
    d = 5 if correct else -6
    if hint: d -= 2
    if slow: d -= 1
    if hard and correct: d += 2
    if active_err: d -= 2
    return max(0.0, min(100.0, obs + d))

def obs_decay(obs, idle_days):
    if idle_days <= 14:
        return obs
    floor = min(obs, 35.0)
    return max(floor, obs - 0.5 * (idle_days - 14))

# ---------------- SM-2-ish due tracking for spaced strategies ----------------
def sm2_next_interval(prev_int, reps, correct):
    if not correct:
        return 1.0, 0
    reps += 1
    if reps == 1: return 1.0, reps
    if reps == 2: return 3.0, reps
    return prev_int * 2.2, reps

# ---------------- strategies (the 10 models) ----------------
def unlocked(cidx, obs, thresh=50.0):
    pres = PRE_IDX[cidx]
    return all(obs[p] >= thresh for p in pres) if pres else True

# Mirror of the shipped util (difficulty-matcher.util.ts productiveStruggleWeight):
# weight = weakness(room) x reachability(reach), floored. This is the rule we
# actually wired into ai-recommend-exam.service; strategy 11 validates it in-sim.
def prod_struggle_weight(score):   # score is the app's 0..100 observed mastery
    s = max(0.0, min(100.0, score))
    room = (100 - s) / 100.0
    reach = min(1.0, s / 30.0)
    return 10.0 + 90.0 * room * reach

def pick_concept(strategy, st):
    obs = st["obs"]; day = st["day"]
    due = st["due"]; active = st["active_err"]; rng = st["rng"]
    hot = st["hot"]                       # concepts on cooldown (app: 3-day/FIFO)
    allc = list(range(N_C))
    order = [c for c in allc if c not in hot] or allc  # never all-hot

    def weakest(cands):
        return min(cands, key=lambda c: obs[c]) if cands else rng.randrange(N_C)

    if strategy == "1_random":
        cands = [c for c in order if unlocked(c, obs)]
        return rng.choice(cands) if cands else rng.randrange(N_C)
    if strategy == "2_pure_weakness":
        return weakest(order)                      # ignores prereqs
    if strategy == "3_frontier_weakness":
        cands = [c for c in order if unlocked(c, obs) and obs[c] < 100]
        return weakest(cands if cands else order)
    if strategy == "4_spaced_only":
        due_c = [c for c in order if due[c] <= day and unlocked(c, obs)]
        if due_c: return min(due_c, key=lambda c: due[c])
        cands = [c for c in order if unlocked(c, obs) and obs[c] < 100]
        return rng.choice(cands) if cands else rng.randrange(N_C)
    if strategy == "5_weak_x_spaced":
        cands = [c for c in order if unlocked(c, obs)]
        if not cands: cands = order
        def score(c):
            dueness = 1.0 if due[c] <= day else max(0.0, 1 - (due[c] - day) / 20.0)
            return 0.6 * (1 - obs[c] / 100.0) + 0.4 * dueness
        return max(cands, key=score)
    if strategy == "6_error_pattern":
        errs = [c for c in order if active[c] and unlocked(c, obs)]
        if errs: return weakest(errs)
        cands = [c for c in order if unlocked(c, obs) and obs[c] < 100]
        return weakest(cands if cands else order)
    if strategy == "7_desirable_diff":
        # pick unlocked concept whose predicted success (from obs) is nearest 0.85
        cands = [c for c in order if unlocked(c, obs) and obs[c] < 100]
        if not cands: cands = order
        def gap(c):
            p = 0.2 + 0.75 * (obs[c] / 100.0)      # crude obs->success proxy
            return abs(p - 0.85)
        return min(cands, key=gap)
    if strategy == "8_interleaved_weak":
        cands = [c for c in order if unlocked(c, obs) and obs[c] < 100]
        if not cands: cands = order
        topk = sorted(cands, key=lambda c: obs[c])[:5]     # 5 weakest, rotate
        st["rr"] = (st.get("rr", 0) + 1) % len(topk)
        return topk[st["rr"]]
    if strategy == "9_guard_gated":
        below = [c for c in order if obs[c] < 60 and unlocked(c, obs)]  # guard 0.6
        if below: return weakest(below)                    # fix weak first
        cands = [c for c in order if unlocked(c, obs) and obs[c] < 100] # else advance frontier
        return weakest(cands if cands else order)
    if strategy == "11_productive_struggle":
        # THE SHIPPED RULE: pick the unlocked concept with the highest
        # productive-struggle weight (reachable-weak), from observed mastery.
        cands = [c for c in order if unlocked(c, obs) and obs[c] < 100]
        if not cands: cands = order
        return max(cands, key=lambda c: prod_struggle_weight(obs[c]))
    if strategy == "10_adaptive_frontier":
        # target the concept at the learner's ability edge (max info), advancing.
        cands = [c for c in order if unlocked(c, obs) and obs[c] < 100]
        if not cands: cands = order
        # ability edge ~ mean obs of unlocked; pick concept whose obs is just below it
        edge = statistics.mean(obs[c] for c in cands)
        return min(cands, key=lambda c: abs(obs[c] - max(0, edge - 15)))
    raise ValueError(strategy)

STRATEGIES = ["1_random","2_pure_weakness","3_frontier_weakness","4_spaced_only",
              "5_weak_x_spaced","6_error_pattern","7_desirable_diff",
              "8_interleaved_weak","9_guard_gated","10_adaptive_frontier",
              "11_productive_struggle"]

# ---------------- one learner run ----------------
def run_learner(strategy, seed, budget):
    rng = random.Random(seed)
    # Per-learner weakness profile: each learner finds some concepts intrinsically
    # harder (>1 = a weak spot — harder problems + slower learning). This is what
    # weakness-based testing exists to find and target.
    hard = [min(1.7, max(0.5, rng.gauss(1.0, 0.35))) for _ in range(N_C)]
    k = [0.0] * N_C                 # latent knowledge
    stab = [STAB_INIT] * N_C        # retention stability (days)
    last_day = [0.0] * N_C
    obs = [0.0] * N_C               # app observed mastery
    due = [0.0] * N_C
    reps = [0] * N_C
    interval = [0.0] * N_C
    recent = [[] for _ in range(N_C)]   # last-5 correctness for error-pattern
    active_err = [False] * N_C
    last_pick = [-999] * N_C        # cooldown / interleaving tracker
    st = {"obs": obs, "due": due, "active_err": active_err, "rng": rng,
          "day": 0.0, "hot": set()}

    day = 0.0
    p_experienced = []
    for i in range(budget):
        if i > 0 and i % PROBLEMS_PER_SESSION == 0:
            day += SESSION_GAP_DAYS
            # apply forgetting + obs decay for idle
            for c in range(N_C):
                idle = day - last_day[c]
                if idle > 0:
                    k[c] *= math.exp(-idle / max(1.0, stab[c]))
                obs[c] = obs_decay(obs[c], idle if last_day[c] > 0 else 0)
        st["day"] = day
        st["hot"] = {cc for cc in range(N_C) if i - last_pick[cc] < COOLDOWN}
        c = pick_concept(strategy, st)
        last_pick[c] = i

        a = ability(k, c)
        # difficulty: strategy 7/10 aim near ability; others sample a spread
        use_zpd = (DIFF_POLICY == "zpd") or (strategy in ("7_desirable_diff", "10_adaptive_frontier"))
        if use_zpd:
            diff = min(0.85, max(0.30, a + 0.10 + rng.gauss(0, 0.05)))
        else:
            diff = min(0.85, max(0.30, 0.45 + 0.4 * (obs[c] / 100.0) + rng.gauss(0, 0.08)))
        eff = min(0.95, diff * hard[c])       # weak-spot concepts are effectively harder
        p = p_correct(k, c, eff)
        p_experienced.append(p)
        correct = rng.random() < p
        hint = (not correct) and rng.random() < 0.4
        slow = rng.random() < (0.5 if not correct else 0.2)
        is_hard = eff >= 0.7

        # learning: needs readiness + desirable difficulty; wrong still teaches (re-teach)
        # less; weak-spot concepts (hard>1) accrue knowledge slower per attempt.
        r = readiness(k, c)
        gain = LEARN_RATE * r * zpd_factor(a, eff) * (1 - k[c]) / hard[c]
        if not correct:
            gain *= 0.55                      # wrong-note re-teach partial credit
        k[c] = min(1.0, k[c] + gain)

        # spacing effect: successful *spaced* retrieval grows stability more
        idle_since = day - last_day[c]
        if correct:
            spacing_bonus = 1.0 + min(2.0, idle_since / 3.0)   # reward spaced success
            stab[c] = min(120.0, stab[c] + 3.0 * spacing_bonus)
        else:
            stab[c] = max(STAB_FLOOR, stab[c] * 0.85)
        last_day[c] = day

        # error-pattern tracking (last 5)
        recent[c].append(0 if correct else 1)
        recent[c] = recent[c][-5:]
        active_err[c] = sum(recent[c]) >= 3

        obs[c] = obs_update(obs[c], correct, hint, slow, is_hard, active_err[c])

        # SM-2 schedule
        interval[c], reps[c] = sm2_next_interval(interval[c], reps[c], correct)
        due[c] = day + interval[c]

    # immediate knowledge
    immediate = sum(k)
    mastered = sum(1 for x in k if x >= MASTER_K)
    # retention after delay (forgetting, no review)
    retained = sum(x * math.exp(-RETENTION_DELAY_DAYS / max(1.0, stab[c])) for c, x in enumerate(k))
    avg_p = statistics.mean(p_experienced)
    return immediate, retained, mastered, avg_p

# ---------------- run population ----------------
def run_budget(budget, n_learners, show=True):
    results = {}
    for s in STRATEGIES:
        imm, ret, mas, ap = [], [], [], []
        for j in range(n_learners):
            a, b, m, p = run_learner(s, seed=1000 * STRATEGIES.index(s) + j, budget=budget)
            imm.append(a); ret.append(b); mas.append(m); ap.append(p)
        ci = 1.96 * (statistics.stdev(ret) / math.sqrt(n_learners))   # 95% CI half-width
        results[s] = (statistics.mean(imm), statistics.mean(ret),
                      statistics.mean(mas), statistics.mean(ap), ci)
    ranked = sorted(results.items(), key=lambda kv: -kv[1][1])
    if show:
        maxret = ranked[0][1][1] or 1.0
        print(f"\n=== budget {budget} ({'scarce' if budget<=300 else 'ample'}) | diff-policy={DIFF_POLICY} | ranked by 30-day RETAINED (mean +/-95%CI) ===")
        print(f"{'strategy':<22}{'immed':>8}{'retain':>9}{'95CI':>7}{'master':>8}{'avgP':>7}{'rel%':>7}")
        print("-" * 68)
        for s, (imm, ret, mas, ap, ci) in ranked:
            print(f"{s:<22}{imm:8.1f}{ret:9.2f}{ci:7.2f}{mas:8.1f}{ap:7.2f}{100*ret/maxret:7.1f}")
    return ranked

def rank_of(ranked, name):
    return [i for i, (s, _) in enumerate(ranked) if s == name][0] + 1

def main():
    global DIFF_POLICY, LEARN_RATE, STAB_INIT, ZPD_SIGMA
    N = 400
    print(f"DAG: {N_C} concepts, {sum(len(v) for v in PREREQ.values())} prereq edges | {N} learners/strategy | weakness profiles ON | scale 0..{N_C}")

    print("\n########## REGIME A: baseline (obs-difficulty; strat 7/10 control difficulty) ##########")
    DIFF_POLICY = "obs"
    a250 = run_budget(250, N); a600 = run_budget(600, N)

    print("\n########## REGIME B: ALL strategies control difficulty to ZPD (isolates CONCEPT-selection) ##########")
    print("  If desirable-difficulty's win was just difficulty-control, the concept strategies now converge and its edge shrinks.")
    DIFF_POLICY = "zpd"
    b250 = run_budget(250, N); b600 = run_budget(600, N)
    DIFF_POLICY = "obs"

    print("\n########## SENSITIVITY SWEEP (do the KEY findings hold under parameter perturbation?) ##########")
    base_lr, base_stab, base_zpd = LEARN_RATE, STAB_INIT, ZPD_SIGMA
    regimes = [
        ("baseline",        base_lr,      base_stab, base_zpd),
        ("slow_learn",      base_lr*0.6,  base_stab, base_zpd),
        ("fast_learn",      base_lr*1.5,  base_stab, base_zpd),
        ("fast_forget",     base_lr,      base_stab*0.5, base_zpd),
        ("slow_forget",     base_lr,      base_stab*2.0, base_zpd),
        ("wide_zpd(flat)",  base_lr,      base_stab, 0.55),   # learning nearly diff-independent -> tests tautology
        ("narrow_zpd",      base_lr,      base_stab, 0.16),
    ]
    print(f"{'regime':<18}{'winner':<22}{'pureWeak_rank':>14}{'desDiff_vs_random(pp)':>24}")
    print("-" * 78)
    for name, lr, stab, zpd in regimes:
        LEARN_RATE, STAB_INIT, ZPD_SIGMA = lr, stab, zpd
        r = run_budget(400, N, show=False)
        winner = r[0][0]
        pw_rank = rank_of(r, "2_pure_weakness")
        d = dict((s, v[1]) for s, v in r)
        gap = 100 * (d["7_desirable_diff"] - d["1_random"]) / (d["1_random"] or 1)
        print(f"{name:<18}{winner:<22}{pw_rank:>14}{gap:>23.1f}")
    LEARN_RATE, STAB_INIT, ZPD_SIGMA = base_lr, base_stab, base_zpd

    print("\n########## VERDICT ##########")
    print(f"- pure-weakness rank (baseline 600): {rank_of(a600,'2_pure_weakness')} of {len(STRATEGIES)} (lower=worse) -> prereq-gating essential is ROBUST if always last.")
    print(f"- desirable-difficulty rank: obs-policy #{rank_of(a600,'7_desirable_diff')}, zpd-policy(all) #{rank_of(b600,'7_desirable_diff')}")

if __name__ == "__main__":
    main()
