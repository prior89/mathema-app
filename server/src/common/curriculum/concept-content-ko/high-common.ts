/**
 * 고1 공통수학1 (4) + 공통수학2 (3) — 7 chapters.
 */
import { KoreanChapterContentMap } from './types';

export const HIGH_COMMON_CONTENT: KoreanChapterContentMap = {
  // ─── 공통수학1 ─────────────────────────────────────────────────────────

  'K-G10-CS1-CH01-POLYNOMIAL': {
    hook: '$x^3 - 6x^2 + 11x - 6$ 을 $x-1$ 로 나눈 나머지? 직접 나누지 말고 $f(1)$ 대입 — 나머지정리.',
    concrete: '$f(x) = x^3 - 6x^2 + 11x - 6$. $f(1) = 1 - 6 + 11 - 6 = 0$. 나머지 0 → $x-1$이 인수.',
    pictorial: '조립제법 표: 계수 $1, -6, 11, -6$ 옆에 1을 두고 차례로 내림·곱·더하기. 마지막 칸이 나머지.',
    abstract: `**나머지정리**: 다항식 $f(x)$를 $x - a$로 나눈 나머지 = $f(a)$.

**인수정리**: $f(a) = 0 \\Leftrightarrow (x - a)$가 $f(x)$의 인수. 다항식의 사칙연산은 정수 연산과 평행: 나눗셈 알고리듬 $f = (x-a) \\cdot q + r$.`,
    worked: {
      intro: '$x^3 - 7x + 6$을 $(x-1)$로 인수분해.',
      steps: [
        { math: '$f(1) = 1 - 7 + 6 = 0$', narration: '인수정리로 $(x-1)$ 확인.' },
        { math: '조립제법 → $x^2 + x - 6$', narration: '몫.' },
        { math: '$x^2 + x - 6 = (x+3)(x-2)$', narration: '이차식 추가 인수분해.' },
        { math: '$x^3 - 7x + 6 = (x-1)(x+3)(x-2)$', narration: '최종 인수분해.' },
      ],
    },
    misconception: {
      wrong: '$f(x)$를 $x - a$로 나눈 나머지는 $f(-a)$다.',
      why: '부호를 바꿔서 외움.',
      correct: '$x - a$의 영점은 $a$. 따라서 $f(a)$가 나머지. $x + 3$으로 나누면 $f(-3)$.',
    },
    retrieval: {
      prompt: '$f(x) = x^2 + 3x - 4$. $f(x)$를 $x - 2$로 나눈 나머지?',
      accept: ['6'],
      explain: '$f(2) = 4 + 6 - 4 = 6$.',
    },
  },

  'K-G10-CS1-CH02-EQ-INEQ': {
    hook: '$x^2 + 1 = 0$의 해는? 실수 범위엔 없다 — 그래서 만들어진 가짜(?) 수, $i$.',
    concrete: '$i^2 = -1$. $i^3 = -i$, $i^4 = 1$. $(2 + 3i)(1 - i) = 2 - 2i + 3i - 3i^2 = 5 + i$.',
    pictorial: '복소평면: 실수축(가로) + 허수축(세로). 점 $(a, b)$ ↔ $a + bi$. 절댓값 $|a + bi| = \\sqrt{a^2 + b^2}$.',
    abstract: `**복소수** $z = a + bi$ ($a, b \\in \\mathbb{R}$, $i^2 = -1$). 모든 이차방정식이 해를 갖는다 (대수학의 기본정리 일부).

**이차방정식 판별식** $D = b^2 - 4ac$: $D > 0$ 서로 다른 두 실근, $D = 0$ 중근, $D < 0$ 서로 다른 두 허근.

**삼차·고차 방정식**: 인수분해 → 이차로 환원.`,
    worked: {
      intro: '$x^2 - 2x + 5 = 0$의 해.',
      steps: [
        { math: '판별식 $D = 4 - 20 = -16$', narration: '$D < 0$ → 허근.' },
        { math: '$x = \\frac{2 \\pm \\sqrt{-16}}{2} = \\frac{2 \\pm 4i}{2}$', narration: '근의 공식.' },
        { math: '$x = 1 \\pm 2i$', narration: '서로 켤레인 두 복소근.' },
      ],
    },
    misconception: {
      wrong: '$\\sqrt{-4} \\times \\sqrt{-9} = \\sqrt{36} = 6$',
      why: '음수의 제곱근에 실수 곱셈법칙을 그대로 적용.',
      correct: '$\\sqrt{-4} = 2i$, $\\sqrt{-9} = 3i$. $\\sqrt{-4} \\cdot \\sqrt{-9} = 2i \\cdot 3i = 6i^2 = -6$. 음수 제곱근에선 곱셈 전 $i$로 변환 필수.',
    },
    retrieval: {
      prompt: '$x^2 + 4 = 0$의 두 해?',
      accept: ['±2i', '2i,-2i', '-2i,2i', '+-2i'],
      explain: '$x^2 = -4 \\Rightarrow x = \\pm 2i$.',
    },
  },

  'K-G10-CS1-CH03-COUNTING': {
    hook: '5명을 한 줄로 세우는 경우 vs 5명 중 3명만 뽑는 경우 — 순서가 중요하냐 아니냐.',
    concrete: '학생 5명 중 회장·부회장 뽑기 → 순열 ${}_5\\mathrm{P}_2 = 20$. 5명 중 대표 2명 뽑기 → 조합 ${}_5\\mathrm{C}_2 = 10$.',
    pictorial: '수형도: 한 자리 선택 후 다음 자리. 곱의 법칙 적용. 조합은 순열 ÷ (배열 가짓수).',
    abstract: `**곱의 법칙**: 사건 $A$가 $m$가지, $B$가 $n$가지 → 동시에 $mn$가지.

**합의 법칙**: 동시에 안 일어나면 $m + n$.

**순열** \${}_n\\mathrm{P}_r = \\frac{n!}{(n-r)!}$.

**조합** \${}_n\\mathrm{C}_r = \\frac{n!}{r!(n-r)!}$.`,
    worked: {
      intro: '서로 다른 책 7권에서 3권을 골라 한 줄로 진열.',
      steps: [
        { math: '${}_7\\mathrm{P}_3 = 7 \\times 6 \\times 5$', narration: '순서가 중요 (진열).' },
        { math: '$= 210$', narration: '계산.' },
      ],
    },
    misconception: {
      wrong: '5명 중 3명 뽑는 조합 = $5 \\times 4 \\times 3 = 60$.',
      why: '순열과 조합 혼동.',
      correct: '${}_5\\mathrm{C}_3 = \\frac{5 \\times 4 \\times 3}{3!} = 10$. 순열을 $3!$로 나눠야 조합.',
    },
    retrieval: {
      prompt: '${}_6\\mathrm{C}_2$의 값?',
      accept: ['15'],
      explain: '$\\frac{6 \\times 5}{2} = 15$.',
    },
  },

  'K-G10-CS1-CH04-MATRIX': {
    hook: '연립방정식 $x + 2y = 5, 3x - y = 1$ 의 계수만 따로 모아 표로? 그게 행렬.',
    concrete: '$A = \\begin{pmatrix} 1 & 2 \\\\ 3 & -1 \\end{pmatrix}$. $A \\cdot \\begin{pmatrix} x \\\\ y \\end{pmatrix} = \\begin{pmatrix} 5 \\\\ 1 \\end{pmatrix}$.',
    pictorial: '$2 \\times 2$ 행렬 그리드. 곱셈은 "행 × 열" — 왼쪽 행렬의 행 하나와 오른쪽 행렬의 열 하나가 내적되어 한 칸 결과.',
    abstract: `**$m \\times n$ 행렬**: $m$행 $n$열. 덧셈: 같은 크기끼리 성분별.

**곱셈** $A_{m \\times k} \\cdot B_{k \\times n} = C_{m \\times n}$.

**행렬은 일반적으로 교환법칙 성립 X**: $AB \\neq BA$. 단위행렬 $E$는 곱셈의 항등원: $EA = AE = A$.`,
    worked: {
      intro: '$A = \\begin{pmatrix} 1 & 2 \\\\ 0 & 1 \\end{pmatrix}$, $B = \\begin{pmatrix} 3 \\\\ 4 \\end{pmatrix}$. $AB$.',
      steps: [
        { math: '첫째 행: $1 \\cdot 3 + 2 \\cdot 4 = 11$', narration: '행 × 열.' },
        { math: '둘째 행: $0 \\cdot 3 + 1 \\cdot 4 = 4$', narration: '동일 패턴.' },
        { math: '$AB = \\begin{pmatrix} 11 \\\\ 4 \\end{pmatrix}$', narration: '$2 \\times 1$ 결과.' },
      ],
    },
    misconception: {
      wrong: '$A + B$는 행렬 크기가 달라도 정의된다.',
      why: '실수 덧셈처럼 생각.',
      correct: '행렬 덧셈은 **같은 크기**에서만. $2 \\times 3$과 $2 \\times 2$는 더할 수 없다.',
    },
    retrieval: {
      prompt: '$\\begin{pmatrix} 2 & 0 \\\\ 1 & 3 \\end{pmatrix} + \\begin{pmatrix} 1 & 4 \\\\ -1 & 2 \\end{pmatrix} = ?$',
      accept: ['[[3,4],[0,5]]', '3 4 / 0 5', '(3,4),(0,5)'],
      explain: '성분별 더하기: $(3, 4), (0, 5)$.',
    },
  },

  // ─── 공통수학2 ─────────────────────────────────────────────────────────

  'K-G10-CS2-CH01-COORD-FIG': {
    hook: '"$x^2 + y^2 = 25$ 가 그리는 그림은?" — 반지름 5 원. 도형이 방정식으로, 방정식이 도형으로.',
    concrete: '두 점 $A(1, 2)$, $B(4, 6)$ 사이 거리 $= \\sqrt{9 + 16} = 5$. 중점 $\\left(\\frac{1+4}{2}, \\frac{2+6}{2}\\right) = (2.5, 4)$.',
    pictorial: '좌표평면. 직선 $y = mx + c$의 기울기는 $m$. 원은 중심+반지름 모양. 평행: 기울기 같음. 수직: 기울기 곱 $= -1$.',
    abstract: `**거리 공식**: $d = \\sqrt{(x_2-x_1)^2 + (y_2-y_1)^2}$.

**내분점**: $\\overline{AB}$를 $m:n$으로 내분 → $\\left(\\frac{nx_1 + mx_2}{m+n}, \\frac{ny_1 + my_2}{m+n}\\right)$.

**원의 방정식** $(x - a)^2 + (y - b)^2 = r^2$ — 중심 $(a, b)$, 반지름 $r$.`,
    worked: {
      intro: '중심 $(2, -1)$, 반지름 3인 원의 방정식.',
      steps: [
        { math: '$(x - 2)^2 + (y - (-1))^2 = 3^2$', narration: '표준식 대입.' },
        { math: '$(x - 2)^2 + (y + 1)^2 = 9$', narration: '정리.' },
      ],
    },
    misconception: {
      wrong: '두 직선의 기울기가 같으면 일치한다.',
      why: '"평행"과 "일치"를 구분 못함.',
      correct: '기울기가 같고 $y$절편도 같아야 일치. $y$절편 다르면 평행 (만나지 않음).',
    },
    retrieval: {
      prompt: '점 $(0, 0)$과 $(3, 4)$ 사이의 거리?',
      accept: ['5'],
      explain: '$\\sqrt{9+16} = 5$.',
    },
  },

  'K-G10-CS2-CH02-SETS-PROP': {
    hook: '"모든 새는 난다"는 참인가? 펭귄 한 마리만 있어도 거짓 — 명제의 세계.',
    concrete: '$A = \\{1, 2, 3\\}$, $B = \\{2, 3, 4\\}$. $A \\cap B = \\{2, 3\\}$, $A \\cup B = \\{1, 2, 3, 4\\}$.',
    pictorial: '벤 다이어그램으로 합집합·교집합·여집합·차집합 영역 색칠.',
    abstract: `**집합**: 명확히 구분되는 대상들의 모임.

**명제** = 참·거짓 명확.

**역**: $p \\to q$의 역 = $q \\to p$.

**대우**: $\\sim q \\to \\sim p$.

**원래 명제 ⇔ 대우** (동치).

**충분조건**: $p \\Rightarrow q$이면 $p$는 $q$의 충분조건.`,
    worked: {
      intro: '명제 "$x = 2$이면 $x^2 = 4$"의 역과 대우.',
      steps: [
        { math: '원래: $x = 2 \\Rightarrow x^2 = 4$ (참)', narration: '제곱하면 됨.' },
        { math: '역: $x^2 = 4 \\Rightarrow x = 2$ (거짓)', narration: '$x = -2$도 가능.' },
        { math: '대우: $x^2 \\neq 4 \\Rightarrow x \\neq 2$ (참)', narration: '원래와 동치.' },
      ],
    },
    misconception: {
      wrong: '$p \\Rightarrow q$가 참이면 역 $q \\Rightarrow p$도 참.',
      why: '동치와 함의를 혼동.',
      correct: '원래 명제와 동치인 것은 **대우**. 역은 별개 — 따로 검증해야.',
    },
    retrieval: {
      prompt: '$A = \\{1, 2, 3, 4\\}$, $B = \\{3, 4, 5\\}$일 때 $A - B$?',
      accept: ['{1,2}', '1,2', '{1, 2}'],
      explain: '$A$에 있고 $B$에 없는 원소.',
    },
  },

  'K-G10-CS2-CH03-FUNCTION-GRAPH': {
    hook: '$f(x) = 2x + 1$의 역함수는? "원래 한 일을 되돌리기" — $x$를 $y$ 자리에 두고 풀면 끝.',
    concrete: '$f(x) = 2x + 1$, 역함수 $f^{-1}(x) = \\frac{x - 1}{2}$. $f(3) = 7$, $f^{-1}(7) = 3$. 서로 되돌림.',
    pictorial: '함수와 역함수 그래프는 $y = x$에 대해 대칭. $y = 2x + 1$과 $y = (x-1)/2$를 같은 평면에 그려보면 보임.',
    abstract: `**함수** $f: A \\to B$ — 각 $x$에 정확히 하나의 $y$.

**합성** $(g \\circ f)(x) = g(f(x))$.

**역함수** $f^{-1}$ 존재 ⇔ $f$가 일대일대응.

**유리함수** $y = \\frac{k}{x}$: 점근선 $x = 0, y = 0$.

**무리함수** $y = \\sqrt{x}$: 정의역 $x \\geq 0$.`,
    worked: {
      intro: '$f(x) = 3x - 5$의 역함수.',
      steps: [
        { math: '$y = 3x - 5$로 놓고 $x, y$ 교환', narration: '역함수 정의.' },
        { math: '$x = 3y - 5 \\Rightarrow 3y = x + 5$', narration: '$y$에 대해 정리.' },
        { math: '$f^{-1}(x) = \\frac{x + 5}{3}$', narration: '완성.' },
      ],
    },
    misconception: {
      wrong: '$f^{-1}(x) = \\frac{1}{f(x)}$',
      why: '"역수"와 "역함수"를 혼동.',
      correct: '역함수 ≠ 역수. $f(x) = 2x$의 역수는 $\\frac{1}{2x}$, 역함수는 $\\frac{x}{2}$.',
    },
    retrieval: {
      prompt: '$f(x) = x + 7$의 역함수?',
      accept: ['x-7', 'f^-1(x)=x-7', 'x - 7'],
      explain: '더한 것을 빼면 원위치.',
    },
  },
};
