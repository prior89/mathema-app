import re

from pydantic import BaseModel, Field, field_validator
from typing import List
from llm import structured
from deterministic_check import compare_answers, deterministic_check, normalize
from curriculum_data import retrieve_context
from student_store import get_student_profile, record_attempt


def _question_is_korean(question: str) -> bool:
    """Language routing for user-facing strings the LLM does not generate."""
    return bool(re.search(r"[가-힣]", question or ""))


class Classification(BaseModel):
    classLevel: int
    chapter: str
    topic: str
    chapterCode: str | None = None
    topicCode: str | None = None
    concepts: List[str] = Field(default_factory=list)
    conceptCodes: List[str | None] = Field(default_factory=list)

    # gpt-4o-mini occasionally returns `null` for empty list fields instead of `[]`.
    # Coerce to empty list so model validation doesn't blow up on edge questions.
    @field_validator('concepts', 'conceptCodes', mode='before')
    @classmethod
    def _none_to_empty_list(cls, v):
        return v if v is not None else []


class SolutionDraft(BaseModel):
    answer: str
    steps: List[str]
    # Pedagogical "why" for each step — same length as `steps`. Explains the
    # insight or rule behind that move without repeating the algebra.
    stepRationales: List[str] = Field(default_factory=list)
    explanation: str


class AiVerification(BaseModel):
    isVerified: bool
    issues: List[str]
    confidence: float
    correctedAnswer: str | None = None


class AnswerEquivalence(BaseModel):
    isEquivalent: bool
    reason: str


async def classify(state):
    prompt = f"""
Classify this India NCERT/CBSE Class 7-12 maths question.

Return JSON only:
Example format:
{{
  "classLevel": 9,
  "chapter": "Polynomials",
  "topic": "Remainder Theorem",
  "chapterCode": "NCERT-MATH-9-POLYNOMIALS",
  "topicCode": "NCERT-MATH-9-POLYNOMIALS-REMAINDER-THEOREM",
  "concepts": ["Polynomial substitution", "Remainder theorem"],
  "conceptCodes": ["NCERT-MATH-9-POLYNOMIAL-EVALUATION", "NCERT-MATH-9-REMAINDER-THEOREM"]
}}

If you are not confident about a code, return null for that code instead of inventing it.

Given classLevel: {state.get("classLevel")}
Question: {state["question"]}
"""
    result = await structured(prompt, Classification)

    if state.get("classLevel"):
        result.classLevel = state["classLevel"]

    result.conceptCodes = [code for code in result.conceptCodes if code]

    return {"detected": result.model_dump()}


async def retrieve_curriculum(state):
    detected = state["detected"]
    context = retrieve_context(
        question=state["question"],
        class_level=detected.get("classLevel"),
        detected=detected,
    )
    return {"curriculumContext": context}


async def retrieve_student_profile(state):
    if state.get("studentProfile") is not None:
        return {"studentProfile": state["studentProfile"]}
    return {"studentProfile": get_student_profile(state.get("userId"))}


def should_personalize(state):
    profile = state.get("studentProfile", {})
    if profile.get("weakConcepts") or profile.get("frequentUnits") or profile.get("recentWrongNotes"):
        return "personalize_learning"
    return "solve"


async def personalize_learning(state):
    profile = state.get("studentProfile", {})
    context = state.get("curriculumContext", {})
    current_codes = {c.get("conceptCode") for c in context.get("concepts", []) if c.get("conceptCode")}
    weak_matches = [
        c for c in profile.get("weakConcepts", [])
        if c.get("conceptCode") in current_codes
    ]
    weak_source = weak_matches or profile.get("weakConcepts", [])[:2]
    frequent_units = profile.get("frequentUnits", [])[:2]
    recent_wrong = profile.get("recentWrongNotes", [])[-2:]

    focus_parts = []
    if weak_source:
        labels = [c.get("conceptCode") for c in weak_source if c.get("conceptCode")]
        focus_parts.append(f"Reinforce weak concepts: {', '.join(labels)}")
    if frequent_units:
        labels = [u.get("unit") for u in frequent_units if u.get("unit")]
        focus_parts.append(f"Connect with frequently studied units: {', '.join(labels)}")
    if recent_wrong:
        focus_parts.append("Use extra care around mistakes similar to the student's recent wrong notes.")

    return {
        "personalizedContext": {
            "hasProfile": True,
            "weakConcepts": weak_source,
            "frequentUnits": frequent_units,
            "recentWrongNotes": recent_wrong,
            "teachingFocus": " ".join(focus_parts),
        }
    }


async def solve(state):
    detected = state["detected"]
    context = state.get("curriculumContext", {})
    student_profile = state.get("studentProfile", {})
    personalized_context = state.get("personalizedContext", {})
    matched_problem = context.get("matchedProblem")

    # Trust deterministic solvers ahead of NCERT lookup. The lookup matches
    # similar-shaped problems by text, which can pick a wrong neighbour
    # (e.g. "2x+7=15" matched "2x+5=17" and answered x=6 instead of x=4).
    # Hand-rolled solvers in deterministic_check.py operate on the actual
    # equation and are exact when they can parse it.
    deterministic = deterministic_check(state["question"])
    if deterministic and not personalized_context.get("hasProfile"):
        steps = deterministic.get("steps", []) or []
        concepts = ", ".join(deterministic.get("concepts", []) or [])
        explanation_lines = []
        if concepts:
            explanation_lines.append(f"This is a {concepts.lower()} problem.")
        explanation_lines.extend(steps)
        return {
            "solutionDraft": {
                "answer": deterministic["answer"],
                "steps": steps,
                "stepRationales": _fallback_rationales(steps),
                "explanation": " ".join(explanation_lines),
            }
        }

    if matched_problem and matched_problem.get("solution") and not personalized_context.get("hasProfile"):
        solution = matched_problem["solution"]
        ncert_steps = solution.get("steps", []) or []
        return {
            "solutionDraft": {
                "answer": solution.get("finalAnswer") or matched_problem.get("answer"),
                "steps": ncert_steps,
                "stepRationales": _fallback_rationales(ncert_steps),
                "explanation": solution.get("explanation", ""),
            }
        }

    # Lv 2 RAG — few-shot examples from APPROVED problems in the student's
    # current chapter (selected by NestJS buildFewShotExamples). Injected as
    # verified worked solutions so the LLM grounds its answer in our own
    # quality-graded corpus instead of generic web priors. Empty list when no
    # APPROVED neighbour exists → falls back to zero-shot behaviour.
    few_shot = (student_profile or {}).get("fewShotExamples") or []
    few_shot_block = ""
    if few_shot:
        rendered = []
        for idx, ex in enumerate(few_shot, 1):
            q = (ex.get("question") or "").strip()
            a = (ex.get("answer") or "").strip()
            expl = (ex.get("explanation") or "").strip()
            chapter = ex.get("chapter") or ""
            head = f"Example {idx}"
            if chapter:
                head += f" — {chapter}"
            block = f"{head}\nQ: {q}\nA: {a}"
            if expl:
                block += f"\nSolution: {expl}"
            rendered.append(block)
        few_shot_block = (
            "\n\nWorked examples from our verified curriculum bank "
            "(same chapter, quality-graded APPROVED). Use them as anchors "
            "for method and notation; do not copy unless the new question "
            "is literally identical:\n\n" + "\n\n".join(rendered) + "\n"
        )

    prompt = f"""
Solve this maths problem for a Class {detected["classLevel"]} student.

LANGUAGE: Write `steps` and `explanation` in the same language as the question. Korean question → Korean answer. English question → English answer. Hindi question → Hindi answer. Mathematical notation stays as LaTeX in every language.

IMPORTANT — multi-part questions:
If the input contains labelled sub-problems — e.g. (1), (2), (가), (나), (i), (ii), Part A, Part B — you MUST answer EVERY part. Put all answers into the single `answer` string, one per line, prefixed with the part label exactly as it appears in the source. Example:
  "answer": "(1) n(n+1)(4n+3)/2\\n(2) 1977400"
Do NOT silently drop a part. If you only solve one part, the response is considered wrong.

IMPORTANT — Korean / CSAT-style "find ab" limit problems:
When the question gives two limit conditions on f and g (often labelled (가)/(나)) and asks for the value of ab (or a+b, a·b, a/b, …):
1. A finite limit of the form lim (x→c) F(x)/(x−c) forces F(c)=0 and equals F'(c) when F is differentiable.
2. From lim (f−g)/(x−1)=5 you get f(1)=g(1) and f'(1)−g'(1)=5.
3. From lim (f+g−2f(1))/(x−1)=7 you get f'(1)+g'(1)=7 (using f(1)=g(1)).
4. Then f'(1)=6, g'(1)=1. For lim (f−a)/(x−1)=b·g(1) to be finite, a=f(1); the left side is f'(1)=6, so a·b=b·g(1)=6 when g(1)=a.
5. NEVER answer "cannot be determined" when these two limits uniquely fix ab. Commit to a concrete number.
If multiple-choice options ①–⑤ (or 1–5) are present, put the chosen value in `answer` (e.g. "6"), not only the option number.

Sequence-vs-calculus reminder:
If the question gives the sum of the first n terms S_n of a sequence, the individual terms are recovered by **subtraction**: a_n = S_n − S_(n−1) for n ≥ 2, and a_1 = S_1. Never differentiate S_n with respect to n — these are discrete sequences, not continuous functions.

STEPS FORMAT — strict requirements:
- Produce 4-7 entries in the `steps` array, NOT a single hand-wavy paragraph.
- Each entry MUST begin with "Step N." where N is 1, 2, 3, ... (or "Step N (Part A)." for multi-part).
- After the "Step N." header, write 2-5 short lines that show:
    (a) the insight or rule being applied (one short sentence), and
    (b) the actual algebra/computation, with all formulas in inline LaTeX delimited by single dollar signs: $...$
- Inline LaTeX example: "If $f(1) = g(1) = c$, then $\\lim_{{x\\to 1}} \\frac{{f(x)-g(x)}}{{x-1}} = f'(1) - g'(1) = 5$."
- Multi-line entries: separate lines inside one step with a literal "\\n" newline. The UI preserves these.
- The last step states the final answer plainly, prefixed with "최종 답:" (Korean), "Final answer:" (English), or "अंतिम उत्तर:" (Hindi) according to the language above, then the numeric/expression result.
- Do NOT write meta-commentary like "We first analyze the conditions..." — show the derivation directly.

`explanation` is a 1-2 sentence intuitive summary AFTER the steps array (e.g., what concept this connects to, what a student should remember). It is NOT a replacement for steps.

STEP RATIONALES — strict requirements:
- Produce a `stepRationales` array with EXACTLY the same length as `steps`.
- `stepRationales[i]` is 1-2 sentences explaining WHY step i+1 is the right move (the insight, rule, or common pitfall avoided).
- Do NOT repeat the algebra from `steps[i]` — explain the reasoning behind it.
- Write in the same language as the question (Korean / English / Hindi).
- Example rationale tone: "분모가 0으로 가면 분자도 0이어야 극한이 유한하므로, 먼저 f(1)=g(1) 조건을 잡습니다."

Return JSON only:
Example format (English):
{{
  "answer": "6",
  "steps": [
    "Step 1. Since the denominator $x-1 \\to 0$ in (가), the numerator must also vanish at $x=1$. Therefore $f(1) - g(1) = 0$, so $f(1) = g(1) = c$.",
    "Step 2. Rewriting (가) as a derivative: $\\lim_{{x\\to 1}} \\frac{{f(x)-g(x)}}{{x-1}} = f'(1) - g'(1) = 5$.\\nSimilarly (나): $\\lim_{{x\\to 1}} \\frac{{f(x)+g(x)-2c}}{{x-1}} = f'(1) + g'(1) = 7$.",
    "Step 3. Adding: $2 f'(1) = 12 \\Rightarrow f'(1) = 6$.\\nSubtracting: $-2 g'(1) = -2 \\Rightarrow g'(1) = 1$.",
    "Step 4. For the third limit to be finite, $a = f(1) = c$. Then the left side equals $f'(1) = 6$ and the right side is $b \\cdot g(1) = b c$, so $bc = 6$.",
    "Step 5. Therefore $ab = c \\cdot b = bc = 6$.\\nFinal answer: $ab = 6$."
  ],
  "stepRationales": [
    "When the denominator goes to 0, the numerator must also vanish for a finite limit — so we pin down f(1) = g(1) first.",
    "Rewriting each limit as a derivative at x=1 turns the given numbers into equations for f'(1) and g'(1).",
    "Adding and subtracting the two derivative equations gives a simple 2×2 system.",
    "The third limit forces a = f(1); matching both sides yields bc = 6.",
    "Since a = c, ab equals bc, giving the final value."
  ],
  "explanation": "The key idea is that whenever a limit of the form $\\lim_{{x\\to 1}} \\frac{{F(x)}}{{x-1}}$ is finite, $F(1)$ must be 0, and the limit then equals $F'(1)$. Applying this to both given limits gives a 2×2 linear system in $f'(1)$ and $g'(1)$."
}}

For multi-part answers, the `steps` array should cover EACH part — label step headers like "Step 1 (Part 1).", "Step 2 (Part 1).", ..., "Step N (Part 2).", etc.

Chapter: {detected["chapter"]}
Topic: {detected["topic"]}
Concepts: {detected["concepts"]}

Curriculum context:
{context}

Student weak/frequent learning context:
{student_profile}

Personalized teaching focus:
{personalized_context}
{few_shot_block}
Adapt the explanation to the personalized teaching focus when present. If the student has weak concepts, rebuild that prerequisite before solving. If the student often studies related units, connect the current method to those units without distracting from the solution.

Question:
{state["question"]}
"""
    result = await structured(prompt, SolutionDraft)
    draft = result.model_dump()
    draft["stepRationales"] = _align_rationales(
        draft.get("steps", []) or [],
        draft.get("stepRationales", []) or [],
    )
    return {"solutionDraft": draft}


async def retry_solve(state):
    detected = state["detected"]
    context = state.get("curriculumContext", {})
    personalized_context = state.get("personalizedContext", {})
    previous = state.get("solutionDraft", {})
    verification = state.get("verification", {})

    prompt = f"""
Re-solve this maths problem for a Class {detected["classLevel"]} student because verification found issues.

Return JSON only:
Example format:
{{
  "answer": "-3",
  "steps": ["step 1", "step 2"],
  "stepRationales": ["why step 1", "why step 2"],
  "explanation": "student-friendly explanation"
}}

Do not copy the previous answer unless it is actually correct. Recompute from the original question.

LANGUAGE: Write `steps`, `stepRationales` and `explanation` in the same language as the question. Korean question → Korean. English question → English. Hindi question → Hindi. Mathematical notation stays as LaTeX in every language.

Chapter: {detected["chapter"]}
Topic: {detected["topic"]}
Concepts: {detected["concepts"]}

Curriculum context:
{context}

Personalized teaching focus:
{personalized_context}

Previous draft:
{previous}

Verification issues:
{verification.get("issues", [])}

Question:
{state["question"]}
"""
    result = await structured(prompt, SolutionDraft)
    draft = result.model_dump()
    draft["stepRationales"] = _align_rationales(
        draft.get("steps", []) or [],
        draft.get("stepRationales", []) or [],
    )
    return {"solutionDraft": draft, "retryCount": state.get("retryCount", 0) + 1}


async def verify(state):
    attempts = state.get("retryCount", 0) + 1
    draft_answer = state["solutionDraft"]["answer"]

    # 1. Deterministic check FIRST. When a hand-rolled solver parses the
    #    question, its answer is authoritative — overrides both the LLM
    #    draft and the NCERT lookup (lookup can match a similar-shaped but
    #    numerically different problem and give the wrong answer).
    deterministic = deterministic_check(state["question"])
    if deterministic:
        verified_answer = deterministic["answer"]
        same = normalize(draft_answer) == normalize(verified_answer)
        return {
            "verification": {
                "isVerified": True,  # deterministic IS the source of truth — skip retry
                "method": "deterministic",
                "issues": (
                    []
                    if same
                    else [
                        f"Draft answer {draft_answer} did not match deterministic answer {verified_answer} — using deterministic."
                    ]
                ),
                "confidence": deterministic["confidence"],
                "verifiedAnswer": verified_answer,
                "attempts": attempts,
            }
        }

    # 2. Fall back to NCERT lookup only when no deterministic solver applies
    #    (e.g. word problems, geometry proofs). Confidence is bounded since
    #    lookup is a similarity match, not a real solve.
    matched_problem = state.get("curriculumContext", {}).get("matchedProblem")
    if matched_problem and matched_problem.get("answer"):
        verified_answer = matched_problem["answer"]
        same = normalize(draft_answer) == normalize(verified_answer)
        return {
            "verification": {
                "isVerified": same,
                "method": "ncert-json",
                "issues": (
                    []
                    if same
                    else [
                        f"Draft answer {draft_answer} did not match stored answer {verified_answer}"
                    ]
                ),
                "confidence": 0.7,  # similarity match — not as trustworthy as deterministic
                "verifiedAnswer": verified_answer,
                "attempts": attempts,
            }
        }

    prompt = f"""
Verify this solution independently.

Return JSON only:
Example format:
{{
  "isVerified": true,
  "issues": [],
  "confidence": 0.9,
  "correctedAnswer": null
}}

Rules:
- Write `issues` in the same language as the question (Korean question → Korean issues).
- `correctedAnswer` must be ONLY the corrected final answer value (e.g. "6" or "x = 2"),
  never working, reasoning, or commentary. Use null when you cannot state a confident
  corrected value.

Question:
{state["question"]}

Draft:
{state["solutionDraft"]}
"""
    result = await structured(prompt, AiVerification)

    return {
        "verification": {
            "isVerified": result.isVerified,
            "method": "ai",
            "issues": result.issues,
            "confidence": result.confidence,
            "verifiedAnswer": result.correctedAnswer,
            "attempts": attempts,
        }
    }


def should_retry_or_format(state):
    verification = state.get("verification", {})
    if not verification.get("isVerified") and state.get("retryCount", 0) < 1:
        return "retry_solve"
    return "format_response"


async def format_response(state):
    detected = state["detected"]
    draft = state["solutionDraft"]
    verification = state["verification"]

    # Only let the verifier override the answer when it actually VERIFIED the
    # solution. A failed verification's correctedAnswer is untrusted by
    # definition — using it replaced a clean draft answer ("6") with the
    # verifier's critique essay in a reported prod incident.
    if verification.get("isVerified"):
        answer = verification.get("verifiedAnswer") or draft["answer"]
    else:
        answer = draft["answer"]
        caution = (
            "재검토 후에도 답을 확신하기 어려워요. 최종 답을 쓰기 전에 풀이 과정을 한 번 확인해 주세요."
            if _question_is_korean(state.get("question", ""))
            else "I could not verify the answer confidently after retrying. Review the method before relying on the final answer."
        )
        verification = {**verification, "caution": caution}

    student_answer = state.get("studentAnswer")
    is_correct = None
    if student_answer:
        is_correct = compare_answers(answer, student_answer)
        if is_correct is False:
            is_correct = await _ai_answer_equivalence(state["question"], answer, student_answer)

    mistake = None
    if student_answer and not is_correct:
        mistake = _mistake_diagnosis(state)
    elif student_answer and is_correct:
        mistake = (
            "입력하신 답이 검증된 답과 일치해요."
            if _question_is_korean(state.get("question", ""))
            else "Your answer matches the verified answer."
        )

    context = state.get("curriculumContext", {})
    matched_problem = context.get("matchedProblem") or {}
    stored_hints = matched_problem.get("hints", [])

    return {
        "finalResponse": {
            "detected": detected,
            "answer": answer,
            "isStudentCorrect": is_correct,
            "explanation": draft["explanation"],
            "steps": draft.get("steps", []) or [],
            "stepRationales": _align_rationales(
                draft.get("steps", []) or [],
                draft.get("stepRationales", []) or [],
            ),
            "personalizedLearning": _personalized_learning_summary(state),
            "mistakeDiagnosis": mistake,
            "hints": [
                *stored_hints[:2],
                f"Identify the topic: {detected['topic']}.",
                (
                    draft["steps"][0]
                    if draft["steps"]
                    else "Start by writing the known values."
                ),
            ][:4],
            "nextPractice": _next_practice(state),
            "verification": verification,
        }
    }


def _align_rationales(steps: list[str], rationales: list[str]) -> list[str]:
    """Pad or trim rationales so len == len(steps); empty strings when missing."""
    if not steps:
        return []
    aligned = [str(r).strip() for r in (rationales or [])]
    if len(aligned) < len(steps):
        aligned.extend([""] * (len(steps) - len(aligned)))
    return aligned[: len(steps)]


def _fallback_rationales(steps: list[str]) -> list[str]:
    """Deterministic / NCERT paths have no LLM rationales — return empty slots."""
    return [""] * len(steps)


def _mistake_diagnosis(state):
    context = state.get("curriculumContext", {})
    matched_problem = context.get("matchedProblem") or {}
    concepts = context.get("concepts", []) or []
    distractors = matched_problem.get("distractors", []) or []
    student_answer = normalize(state.get("studentAnswer"))

    for distractor in distractors:
        if normalize(distractor.get("answer")) == student_answer:
            return f"Likely issue: {distractor.get('reason')}"

    for concept in concepts:
        misconceptions = concept.get("commonMisconceptions", []) or []
        if misconceptions:
            m = misconceptions[0]
            return f"Likely concept gap: {m.get('wrongIdea')} Correction: {m.get('correction')}"

    return "Your answer does not match the verified answer. Recheck the concept and each simplification step."


async def _ai_answer_equivalence(question: str, expected_answer: str, student_answer: str) -> bool:
    prompt = f"""
Decide whether the student's answer is mathematically equivalent to the expected answer.

Return JSON only:
{{
  "isEquivalent": true,
  "reason": "brief reason"
}}

Rules:
- Treat algebraically equivalent expressions as the same, e.g. -(3a + 3b + 32) and -3a - 3b - 32.
- Ignore harmless formatting, spaces, expanded vs factored form, and equivalent fractions/decimals.
- Do not mark equivalent if variables, signs, domains, units, or required solution sets differ.

Question:
{question}

Expected answer:
{expected_answer}

Student answer:
{student_answer}
"""
    try:
        result = await structured(prompt, AnswerEquivalence)
        return result.isEquivalent
    except Exception:
        return False


def _next_practice(state):
    profile = state.get("studentProfile", {})
    weak = [
        c.get("conceptCode")
        for c in profile.get("weakConcepts", [])
        if c.get("conceptCode")
    ]
    context = state.get("curriculumContext", {})
    current = [
        c.get("conceptCode") or c.get("name") for c in context.get("concepts", [])
    ]
    detected = state.get("detected", {})
    fallback = detected.get("concepts", [])

    result = []
    for item in [*weak, *current, *fallback]:
        if item and item not in result:
            result.append(item)
    return result[:5]


def _personalized_learning_summary(state):
    context = state.get("personalizedContext", {})
    if not context.get("hasProfile"):
        return None

    focus = context.get("teachingFocus")
    if focus:
        return focus

    weak = [c.get("conceptCode") for c in context.get("weakConcepts", []) if c.get("conceptCode")]
    frequent = [u.get("unit") for u in context.get("frequentUnits", []) if u.get("unit")]
    parts = []
    if weak:
        parts.append(f"Practice this with weak concepts: {', '.join(weak)}")
    if frequent:
        parts.append(f"Connect it with units you study often: {', '.join(frequent)}")
    return " ".join(parts) if parts else None


async def record_learning(state):
    if state.get("studentProfile") is not None:
        return {}
    return record_attempt(state)
