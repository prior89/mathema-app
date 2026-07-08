// Business-viability simulation for Matheo (KR-first freemium math app).
// Deterministic funnel + unit-economics model to VERIFY which interventions move
// the two numbers the whole thesis reduces to: organic activated->paid >= 2.5%
// and viral K-factor > 0.3. Assumptions are grounded in the VC-diligence pass
// (RevenueCat freemium 2.1%, edu D30 ~2%, guest-first +~25pt activation, KR CPI ~$2).
// Run: node scripts/business-model-sim.mjs

const BASE = {
  installs: 10_000,
  openRate: 0.88,
  activationWall: 0.40,   // signup-wall (current default)
  activationGuest: 0.65,  // guest-first ON
  d30Dormant: 0.02,       // FCM creds unset -> inherit edu floor
  d30Live: 0.08,          // FCM re-engagement crons active
  convActivated: 0.013,   // 60d free->paid, below 2.1% floor BY DESIGN (generous free)
  costPerSolve: 0.012,    // blended after 39% cache + deterministic offload
  freeSolvesMo: 10,       // realistic light-MAU intensity
  arpuNetMo: 7.5,         // ~KRW12,900 net of store fee + yearly blend
  paidCogsMo: 2.3,        // unlimited power-user solve + adaptive LLM
  tenureMo: 4,            // median paid tenure (RevenueCat yr1 ~27%)
  cpi: 2.0,               // KR cost-per-install
};

// Interventions (hypotheses) — each mutates the parameter set.
const H = {
  H1_guestOn:      p => ({ ...p, activation: p.activationGuest }),
  H2_fcmLive:      p => ({ ...p, d30: p.d30Live }),
  H3_billingOn:    p => ({ ...p, billing: true }),                 // without this, revenue = 0
  H4_masteryGate:  p => ({ ...p, convActivated: p.convActivated * 1.9 }), // paywall at mastery gate + outcome legibility (0.013 -> ~0.025)
  H5_yearlyPush:   p => ({ ...p, tenureMo: 7 }),                   // annual-plan emphasis extends tenure
  H6_accuracyTrust:p => ({ ...p, tenureMo: p.tenureMo + 1, convActivated: p.convActivated + 0.003 }), // humble accuracy + report -> less churn, more trust
  H7_referral:     p => ({ ...p, kFactor: 0.35 }),                 // parent-invite / share loop
};

function run(p) {
  const activation = p.activation ?? p.activationWall;
  const d30 = p.d30 ?? p.d30Dormant;
  const billing = p.billing ?? false;
  const k = p.kFactor ?? 0.0;

  const opens = p.installs * p.openRate;
  const activated = opens * activation;
  const conv = billing ? p.convActivated : 0; // meter disconnected if billing OFF
  const payers = activated * conv;
  const installToPaid = payers / p.installs;

  // Unit economics per 1,000 MAU
  const mau1k = 1000;
  const freeCogs = mau1k * (1 - conv) * (p.freeSolvesMo * p.costPerSolve);
  const paidCogs = mau1k * conv * p.paidCogsMo;
  const revenue  = mau1k * conv * p.arpuNetMo;
  const contribPer1kMau = revenue - freeCogs - paidCogs;

  const payerContribMo = p.arpuNetMo - p.paidCogsMo;
  const payerLTV = payerContribMo * p.tenureMo;
  const ltvPerActivated = conv * payerLTV - (1 - conv) * (p.freeSolvesMo * p.costPerSolve) * p.tenureMo;
  const cacPaidPerPayer = conv > 0 ? p.cpi / conv : Infinity;
  const ltvCacPaid = conv > 0 ? payerLTV / cacPaidPerPayer : 0;
  const organicAmp = k < 1 ? 1 / (1 - k) : Infinity; // steady-state cohort multiplier

  return {
    activationPct: activation * 100,
    activated: Math.round(activated),
    convActivatedPct: conv * 100,
    installToPaidPct: installToPaid * 100,
    d30Pct: d30 * 100,
    contribPer1kMau,
    payerLTV,
    ltvCacPaid,
    kFactor: k,
    organicAmp,
    hitConv: conv >= 0.025,
    hitK: k > 0.3,
  };
}

function fmt(r) {
  return [
    `activation ${r.activationPct.toFixed(0)}%`,
    `conv(activated) ${r.convActivatedPct.toFixed(2)}%`,
    `install→paid ${r.installToPaidPct.toFixed(2)}%`,
    `D30 ${r.d30Pct.toFixed(0)}%`,
    `contrib/1kMAU $${r.contribPer1kMau.toFixed(0)}`,
    `payerLTV $${r.payerLTV.toFixed(0)}`,
    `LTV:CAC(paid) ${r.ltvCacPaid.toFixed(2)}`,
    `K ${r.kFactor.toFixed(2)} (amp ${r.organicAmp === Infinity ? '∞' : r.organicAmp.toFixed(2)}x)`,
    `[conv≥2.5% ${r.hitConv ? '✓' : '✗'} | K>0.3 ${r.hitK ? '✓' : '✗'}]`,
  ].join(' · ');
}

const apply = (p, keys) => keys.reduce((acc, key) => H[key](acc), { ...p });

console.log('=== BASELINE (current default: signup-wall, billing OFF, FCM dormant, no referral) ===');
console.log(fmt(run(BASE)));

console.log('\n=== SINGLE interventions (each alone, billing ON so the meter reads) ===');
for (const key of Object.keys(H)) {
  const keys = key === 'H3_billingOn' ? ['H3_billingOn'] : ['H3_billingOn', key];
  console.log(`${key.padEnd(18)} ${fmt(run(apply(BASE, keys)))}`);
}

console.log('\n=== STACKED scenarios ===');
const tier1 = ['H3_billingOn', 'H1_guestOn', 'H2_fcmLive'];       // 4 config switches (accuracy is manual)
const tier12 = [...tier1, 'H4_masteryGate', 'H6_accuracyTrust'];  // + conversion engine
const full = [...tier12, 'H5_yearlyPush', 'H7_referral'];         // + LTV + viral
console.log(`Tier1 (switches on)         ${fmt(run(apply(BASE, tier1)))}`);
console.log(`Tier1+2 (conversion engine) ${fmt(run(apply(BASE, tier12)))}`);
console.log(`FULL (+yearly +referral)    ${fmt(run(apply(BASE, full)))}`);
