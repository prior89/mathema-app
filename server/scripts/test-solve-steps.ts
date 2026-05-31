/**
 * test-solve-steps.ts — quick local end-to-end sanity check of /solve
 * returning a Step 1..N structured solution. Hits the math-helper directly.
 */
const QUESTION = `두 다항함수 f(x), g(x)가 다음 조건을 만족시킨다.
(가) lim(x→1) [f(x) - g(x)] / (x - 1) = 5
(나) lim(x→1) [f(x) + g(x) - 2f(1)] / (x - 1) = 7
두 실수 a, b에 대하여 lim(x→1) [f(x) - a] / (x - 1) = b × g(1) 일 때, ab의 값은?`;

async function main() {
  const res = await fetch('http://127.0.0.1:8000/solve', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      classLevel: 12,
      question: QUESTION,
      studentProfile: {},
    }),
  });
  const json: any = await res.json();
  console.log('answer:', json.answer);
  console.log('steps:', JSON.stringify(json.steps, null, 2));
  console.log('explanation:', json.explanation);
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
