import logging
from typing import TypedDict, Optional, Dict, Any
from langgraph.graph import StateGraph, START, END
from schemas import SolveRequest
from deterministic_check import deterministic_check, compare_answers
from nodes import (
    classify,
    retrieve_curriculum,
    retrieve_student_profile,
    should_personalize,
    personalize_learning,
    solve,
    retry_solve,
    verify,
    should_retry_or_format,
    format_response,
    record_learning,
)

_logger = logging.getLogger(__name__)


class MathState(TypedDict, total=False):
    classLevel: Optional[int]
    userId: Optional[str]
    question: str
    studentAnswer: Optional[str]
    detected: Dict[str, Any]
    curriculumContext: Dict[str, Any]
    studentProfile: Dict[str, Any]
    personalizedContext: Dict[str, Any]
    solutionDraft: Dict[str, Any]
    verification: Dict[str, Any]
    retryCount: int
    finalResponse: Dict[str, Any]


builder = StateGraph(MathState)

builder.add_node("classify", classify)
builder.add_node("retrieve_curriculum", retrieve_curriculum)
builder.add_node("retrieve_student_profile", retrieve_student_profile)
builder.add_node("personalize_learning", personalize_learning)
builder.add_node("solve", solve)
builder.add_node("retry_solve", retry_solve)
builder.add_node("verify", verify)
builder.add_node("format_response", format_response)
builder.add_node("record_learning", record_learning)

builder.add_edge(START, "classify")
builder.add_edge("classify", "retrieve_curriculum")
builder.add_edge("retrieve_curriculum", "retrieve_student_profile")
builder.add_conditional_edges("retrieve_student_profile", should_personalize)
builder.add_edge("personalize_learning", "solve")
builder.add_edge("solve", "verify")
builder.add_conditional_edges("verify", should_retry_or_format)
builder.add_edge("retry_solve", "verify")
builder.add_edge("format_response", "record_learning")
builder.add_edge("record_learning", END)

graph = builder.compile()


async def solve_math_problem(req: SolveRequest):
    """Entry point. Tries a deterministic shortcut before falling back to the
    LangGraph LLM pipeline.

    Rationale: equation-style questions (linear, quadratic, polynomial eval,
    arithmetic) are 100% solvable by the hand-rolled solvers in
    `deterministic_check.py`. Running them through `classify → retrieve →
    solve → verify` wastes 3 LLM calls per request, costs ~$0.0005 each, takes
    ~5s, and exposes the user to gpt-4o-mini's occasional null-field schema
    failures. The deterministic path costs $0, finishes in <50ms, and is exact.

    The LangGraph pipeline still handles word problems, geometry proofs, and
    anything the deterministic solvers can't parse. If that pipeline fails
    (LLM provider auth error, network blip, schema-decode timeout), we return
    a polite degraded response instead of a 500 so the UI can render
    something the student can act on.
    """
    deterministic = deterministic_check(req.question, req.studentAnswer)
    if deterministic:
        return _fast_response_from_deterministic(req, deterministic)
    try:
        result = await graph.ainvoke(req.model_dump())
        return result["finalResponse"]
    except Exception as exc:  # noqa: BLE001 — catch broad to keep API available
        _logger.exception("math-helper graph failed")
        return _fallback_response(req, exc)


def _fallback_response(req: SolveRequest, exc: Exception) -> Dict[str, Any]:
    """Render a polite degraded response when the LLM pipeline can't complete.
    The student still gets a usable payload — never a 500 — and the API caller
    can decide whether to surface the failure tag or retry later.
    """
    reason = type(exc).__name__
    explanation = (
        "I couldn't work through this question right now — the AI service is "
        "temporarily unreachable. Please try a simpler form (e.g. write the "
        "equation directly like '2x + 7 = 15') or try again in a moment."
    )
    return {
        "detected": {
            "classLevel": req.classLevel or 8,
            "chapter": "Unknown",
            "topic": "Unknown",
            "chapterCode": None,
            "topicCode": None,
            "concepts": [],
            "conceptCodes": [],
        },
        "answer": "",
        "isStudentCorrect": None,
        "explanation": explanation,
        "personalizedLearning": None,
        "mistakeDiagnosis": None,
        "hints": [
            "Try rewriting the question as an equation if possible.",
            "Break the problem into the numbers and the unknown.",
        ],
        "nextPractice": [],
        "verification": {
            "isVerified": False,
            "method": "fallback",
            "issues": [f"upstream_unavailable:{reason}"],
            "confidence": 0.0,
            "verifiedAnswer": None,
            "attempts": 0,
            "caution": "AI service temporarily unavailable — answer not produced.",
        },
    }


def _fast_response_from_deterministic(req: SolveRequest, det: Dict[str, Any]) -> Dict[str, Any]:
    """Build a SolveResponse-shaped dict directly from a deterministic result,
    skipping classify / retrieve / solve / verify entirely. Mirrors the shape
    `format_response` produces so the NestJS client can't tell the difference.
    """
    concepts = det.get("concepts") or []
    steps = det.get("steps") or []
    chapter = concepts[0] if concepts else "Algebra"
    is_student_correct: Optional[bool] = None
    if req.studentAnswer:
        is_student_correct = compare_answers(det["answer"], req.studentAnswer)
    return {
        "detected": {
            "classLevel": req.classLevel or 8,
            "chapter": chapter,
            "topic": chapter,
            "chapterCode": None,
            "topicCode": None,
            "concepts": concepts,
            "conceptCodes": [],
        },
        "answer": det["answer"],
        "isStudentCorrect": is_student_correct,
        "explanation": " ".join(steps) if steps else "Solved using the standard step-by-step method.",
        "personalizedLearning": None,
        "mistakeDiagnosis": det.get("mistake_diagnosis"),
        "hints": steps[:4],
        "nextPractice": concepts[:5],
        "verification": {
            "isVerified": True,
            "method": "deterministic",
            "issues": [],
            "confidence": det.get("confidence", 0.98),
            "verifiedAnswer": det["answer"],
            "attempts": 1,
        },
    }
