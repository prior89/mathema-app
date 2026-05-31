/**
 * 고2~고3 일반·진로 선택 — 대수(3) + 미적분Ⅰ(3) + 확률과통계(3) + 미적분Ⅱ(3) + 기하(3) = 15.
 */
import { KoreanChapterContentMap } from './types';

export const HIGH_ELECTIVE_CONTENT: KoreanChapterContentMap = {
  // ─── 대수 (수능 출제) ───────────────────────────────────────────────────

  'K-G11-ALG-CH01-EXP-LOG': {
    hook: '복리 이자, 박테리아 증식, 방사능 붕괴 — 모두 같은 식 $a^x$ 형태. 그 역연산이 로그.',
    concrete: '$2^3 = 8 \\Leftrightarrow \\log_2 8 = 3$. $\\log_{10} 100 = 2$. $\\ln e^5 = 5$.',
    pictorial: '$y = 2^x$ 그래프는 우상향 폭증. $y = \\log_2 x$는 그 그래프를 $y=x$에 대해 대칭이동.',
    abstract: `**지수 확장**: 정수 → 유리수 ($a^{1/n} = \\sqrt[n]{a}$) → 실수.

**지수법칙**: $a^{m+n} = a^m a^n$.

**로그 정의**: $a^x = N \\Leftrightarrow x = \\log_a N$ ($a > 0, a \\neq 1, N > 0$).

**로그법칙**: $\\log_a MN = \\log_a M + \\log_a N$, $\\log_a M^k = k \\log_a M$, $\\log_a M = \\frac{\\log_b M}{\\log_b a}$ (밑변환).`,
    worked: {
      intro: '$\\log_2 12 - \\log_2 3$을 계산.',
      steps: [
        { math: '$\\log_2 12 - \\log_2 3 = \\log_2 \\frac{12}{3}$', narration: '뺄셈 → 나눗셈.' },
        { math: '$= \\log_2 4 = 2$', narration: '$2^2 = 4$.' },
      ],
    },
    misconception: {
      wrong: '$\\log(a + b) = \\log a + \\log b$',
      why: '로그 법칙을 덧셈에도 적용.',
      correct: '로그는 **곱**을 합으로 바꿈: $\\log(ab) = \\log a + \\log b$. 덧셈엔 적용 안 됨.',
    },
    retrieval: {
      prompt: '$\\log_3 81 = ?$',
      accept: ['4'],
      explain: '$3^4 = 81$.',
    },
  },

  'K-G11-ALG-CH02-TRIG-FN': {
    hook: '$90°$보다 큰 각의 사인? 직각삼각형으로는 안 됨 — 단위원이 답.',
    concrete: '$\\sin 30° = \\frac{1}{2}$, $\\sin 150° = \\frac{1}{2}$. 보각: $\\sin(180° - \\theta) = \\sin\\theta$.',
    pictorial: '단위원 ($r=1$). 각 $\\theta$에 대한 종점 $(\\cos\\theta, \\sin\\theta)$. 사분면별 부호 다름.',
    abstract: `**호도법**: $\\pi$ rad $= 180°$.

**삼각함수**: $\\sin, \\cos, \\tan$ — 모든 실수 각에서 정의.

**항등식**: $\\sin^2\\theta + \\cos^2\\theta = 1$, $\\tan\\theta = \\sin\\theta/\\cos\\theta$.

**주기**: $\\sin, \\cos$은 $2\\pi$, $\\tan$은 $\\pi$.

**덧셈정리**: $\\sin(A+B) = \\sin A\\cos B + \\cos A\\sin B$.`,
    worked: {
      intro: '$\\sin 75°$ 의 값을 덧셈정리로.',
      steps: [
        { math: '$75° = 45° + 30°$', narration: '특수각 합으로 분해.' },
        { math: '$\\sin 75° = \\sin 45°\\cos 30° + \\cos 45°\\sin 30°$', narration: '덧셈정리.' },
        { math: '$= \\frac{\\sqrt{2}}{2} \\cdot \\frac{\\sqrt{3}}{2} + \\frac{\\sqrt{2}}{2} \\cdot \\frac{1}{2} = \\frac{\\sqrt{6} + \\sqrt{2}}{4}$', narration: '대입·정리.' },
      ],
    },
    misconception: {
      wrong: '$\\sin 2\\theta = 2\\sin\\theta$',
      why: '함수에 곱셈 분배.',
      correct: '$\\sin 2\\theta = 2\\sin\\theta\\cos\\theta$ (2배각 공식). 단순히 2배 아님.',
    },
    retrieval: {
      prompt: '$\\cos\\theta = \\frac{3}{5}$, $\\theta$는 1사분면. $\\sin\\theta$?',
      accept: ['4/5', '0.8'],
      explain: '$\\sin^2 = 1 - \\frac{9}{25} = \\frac{16}{25}$, 1사분면 양수 → $\\frac{4}{5}$.',
    },
  },

  'K-G11-ALG-CH03-SEQUENCE': {
    hook: '저축통장: 매달 같은 액수를 더하면 잔액이 등차수열로 증가. 이자가 붙으면 등비수열.',
    concrete: '등차 $1, 4, 7, 10, ...$ → $a_n = 3n - 2$. 첫째항 1, 공차 3. 등비 $2, 6, 18, 54, ...$ → $a_n = 2 \\cdot 3^{n-1}$.',
    pictorial: '점화식 $a_{n+1} = a_n + d$ (등차) vs $a_{n+1} = a_n \\cdot r$ (등비). 그래프는 직선 vs 지수곡선.',
    abstract: `**등차수열** $a_n = a + (n-1)d$, 합 $S_n = \\frac{n(2a + (n-1)d)}{2}$.

**등비수열** $a_n = ar^{n-1}$, 합 $S_n = \\frac{a(r^n - 1)}{r - 1}$ ($r \\neq 1$).

**핵심 관계**: $a_n = S_n - S_{n-1}$ ($n \\geq 2$).

**시그마**: $\\sum_{k=1}^{n} k = \\frac{n(n+1)}{2}$, $\\sum k^2 = \\frac{n(n+1)(2n+1)}{6}$.`,
    worked: {
      intro: '$S_n = n^2 + 2n$ 일 때 $a_n$.',
      steps: [
        { math: '$a_n = S_n - S_{n-1}$ ($n \\geq 2$)', narration: '핵심 관계.' },
        { math: '$S_{n-1} = (n-1)^2 + 2(n-1) = n^2 - 1$', narration: '대입.' },
        { math: '$a_n = (n^2 + 2n) - (n^2 - 1) = 2n + 1$', narration: '차.' },
        { math: '$a_1 = S_1 = 3 = 2 \\cdot 1 + 1$ ✓', narration: '$n=1$도 같은 식.' },
      ],
    },
    misconception: {
      wrong: '$S_n = n^2 + 2n$의 $a_n$ 구하려고 미분.',
      why: '연속함수 미분과 이산수열을 혼동.',
      correct: `수열은 이산 — 미분 X.

**$a_n = S_n - S_{n-1}$** 차분으로 구함.`,
    },
    retrieval: {
      prompt: '등차수열 $a_1 = 2$, $d = 3$. $a_{10}$?',
      accept: ['29'],
      explain: '$a_{10} = 2 + 9 \\cdot 3 = 29$.',
    },
  },

  // ─── 미적분Ⅰ (수능 출제) ────────────────────────────────────────────────

  'K-G11-CAL1-CH01-LIMIT-CONT': {
    hook: '$\\frac{x^2 - 1}{x - 1}$에 $x = 1$ 대입하면 $\\frac{0}{0}$. 그런데 그래프는 $x = 1$ 근처에서 분명히 어떤 값으로 다가간다.',
    concrete: '$\\frac{x^2 - 1}{x - 1} = \\frac{(x-1)(x+1)}{x-1} = x + 1$. $x \\to 1$일 때 $\\to 2$.',
    pictorial: '$y = x + 1$ 그래프에서 $x = 1$ 자리만 비어있는 그림. 극한은 그 비어있는 위치의 "도달하려는 값".',
    abstract: `**극한** $\\lim_{x \\to a} f(x) = L$: $x$가 $a$에 한없이 가까워질 때 $f(x)$가 $L$에 한없이 가까워진다.

**연속**: $\\lim_{x \\to a} f(x) = f(a)$.

**사잇값 정리**: 폐구간에서 연속이면 두 함숫값 사이의 모든 값을 가짐. $\\frac{0}{0}$ 꼴은 인수분해·유리화·치환으로 해결.`,
    worked: {
      intro: '$\\lim_{x \\to 2} \\frac{x^2 - 4}{x - 2}$.',
      steps: [
        { math: '$\\frac{x^2 - 4}{x - 2} = \\frac{(x-2)(x+2)}{x-2} = x + 2$ ($x \\neq 2$)', narration: '인수분해 + 약분.' },
        { math: '$\\lim_{x \\to 2}(x + 2) = 4$', narration: '직접 대입.' },
      ],
    },
    misconception: {
      wrong: '$\\lim_{x \\to 1} f(x) = f(1)$이 항상 성립.',
      why: '연속함수만 다뤘던 경험.',
      correct: '극한이 존재해도 함숫값과 다를 수 있음. 같을 때만 "연속". 불연속점이 있는 함수는 위반.',
    },
    retrieval: {
      prompt: '$\\lim_{x \\to 3}(x^2 + 2x - 5)$?',
      accept: ['10'],
      explain: '다항함수는 연속 → 직접 대입 = $9 + 6 - 5 = 10$.',
    },
  },

  'K-G11-CAL1-CH02-DIFFERENTIATION': {
    hook: '자동차 속도계는 "지금 이 순간의 속력". 평균이 아니라 순간. 그 정확한 정의가 미분.',
    concrete: '$f(x) = x^2$의 $x = 3$에서 미분계수: $f\'(3) = \\lim_{h \\to 0}\\frac{(3+h)^2 - 9}{h} = \\lim_{h \\to 0}(6 + h) = 6$.',
    pictorial: '곡선 위 한 점의 접선 기울기 = 미분계수. 평균변화율 (할선 기울기) 의 $\\Delta x \\to 0$ 극한.',
    abstract: `**미분계수** $f\'(a) = \\lim_{h \\to 0}\\frac{f(a+h) - f(a)}{h}$.

**도함수** $f\'(x)$: 미분계수를 함수로.

**미분법**: $(x^n)\' = nx^{n-1}$, $(c)\' = 0$, 합·차·실수배 모두 분배.

**극값**: $f\'(x) = 0$ 인 점이 후보. $f\'$ 부호 변화로 극대·극소 판정.`,
    worked: {
      intro: '$f(x) = x^3 - 3x$의 극값.',
      steps: [
        { math: '$f\'(x) = 3x^2 - 3 = 3(x-1)(x+1)$', narration: '도함수.' },
        { math: '$f\'(x) = 0 \\Rightarrow x = \\pm 1$', narration: '극값 후보.' },
        { math: '$x = -1$ 극대값 $= 2$, $x = 1$ 극솟값 $= -2$', narration: '$f\'$ 부호 변화 확인.' },
      ],
    },
    misconception: {
      wrong: '$f\'(a) = 0$이면 $x = a$는 항상 극값.',
      why: '"기울기 0이면 봉우리·골짜기"라는 직관.',
      correct: '$f\'(a) = 0$이지만 부호 변화 없으면 변곡점 (예: $f(x) = x^3$의 $x = 0$). 부호 변화를 함께 확인.',
    },
    retrieval: {
      prompt: '$f(x) = x^4$의 도함수?',
      accept: ['4x^3', '4x³', '4*x^3'],
      explain: '$(x^n)\' = nx^{n-1}$.',
    },
  },

  'K-G11-CAL1-CH03-INTEGRATION': {
    hook: '곡선 아래 넓이를 어떻게 구할까? 잘게 자른 직사각형의 합 → 그 극한이 적분.',
    concrete: '$\\int_0^2 x \\, dx = \\left[\\frac{x^2}{2}\\right]_0^2 = 2$. 삼각형 넓이 ($\\frac{1}{2} \\cdot 2 \\cdot 2 = 2$) 와 일치.',
    pictorial: '직사각형들로 곡선 아래 영역 채우기. 폭이 0으로 가면 정확한 넓이. 부정적분 → 정적분 → 넓이.',
    abstract: `**부정적분** $\\int f(x) dx$: 미분하면 $f$가 되는 함수 + $C$.

**정적분** $\\int_a^b f(x) dx$: $a$부터 $b$까지의 함수값 누적합.

**미적분의 기본정리**: $\\int_a^b f(x) dx = F(b) - F(a)$ ($F\' = f$).

**적분 공식**: $\\int x^n dx = \\frac{x^{n+1}}{n+1} + C$ ($n \\neq -1$).`,
    worked: {
      intro: '$\\int_1^3 (2x + 1) dx$.',
      steps: [
        { math: '부정적분 $= x^2 + x + C$', narration: '$(x^2)\' = 2x$, $(x)\' = 1$.' },
        { math: '$[x^2 + x]_1^3 = (9 + 3) - (1 + 1) = 10$', narration: '$F(3) - F(1)$.' },
      ],
    },
    misconception: {
      wrong: '$\\int x^{-1} dx = \\frac{x^0}{0} + C$',
      why: '공식 $\\int x^n dx = \\frac{x^{n+1}}{n+1}$을 $n = -1$에도 적용.',
      correct: '$n = -1$은 공식 예외. $\\int \\frac{1}{x} dx = \\ln|x| + C$ (자연로그). 분모가 0이 되는 케이스 따로.',
    },
    retrieval: {
      prompt: '$\\int (3x^2) dx$ (적분상수 생략)?',
      accept: ['x^3', 'x³', 'x*x*x'],
      explain: '$\\int 3x^2 dx = x^3 + C$.',
    },
  },

  // ─── 확률과 통계 (수능 출제) ───────────────────────────────────────────

  'K-G11-STAT-CH01-COUNTING-ADV': {
    hook: '(a+b)⁵ 전개 시 $a^2 b^3$ 항의 계수? 다 곱하지 말고 — 이항계수 ${}_5\\mathrm{C}_2 = 10$.',
    concrete: '$(a+b)^4 = a^4 + 4a^3 b + 6a^2 b^2 + 4ab^3 + b^4$. 계수 1, 4, 6, 4, 1 = ${}_4\\mathrm{C}_0, {}_4\\mathrm{C}_1, ..., {}_4\\mathrm{C}_4$.',
    pictorial: '파스칼 삼각형. 각 칸은 위 두 칸의 합. $n$번째 줄이 $(a+b)^n$ 계수.',
    abstract: `**이항정리**: $(a+b)^n = \\sum_{k=0}^{n} {}_n\\mathrm{C}_k a^{n-k} b^k$.

**중복순열** \${}_n\\Pi_r = n^r$ (서로 다른 $n$개에서 $r$개 뽑되 중복 허용).

**중복조합** \${}_n\\mathrm{H}_r = {}_{n+r-1}\\mathrm{C}_r$.`,
    worked: {
      intro: '$(2x + 1)^4$ 의 $x^2$ 항 계수.',
      steps: [
        { math: '일반항 $= {}_4\\mathrm{C}_k (2x)^{4-k} \\cdot 1^k$', narration: '이항정리.' },
        { math: '$x^2$ 항 → $4 - k = 2 \\Rightarrow k = 2$', narration: '지수 맞추기.' },
        { math: '${}_4\\mathrm{C}_2 \\cdot (2x)^2 = 6 \\cdot 4x^2 = 24x^2$', narration: '계수 = 24.' },
      ],
    },
    misconception: {
      wrong: '$(a+b)^n$ 전개 항 수는 $n$개.',
      why: '"지수만큼"으로 외움.',
      correct: '$n+1$개. $(a+b)^3 = a^3 + 3a^2 b + 3ab^2 + b^3$ — 4개 항.',
    },
    retrieval: {
      prompt: '$(x + 2)^3$ 전개 시 $x$ 항의 계수?',
      accept: ['12'],
      explain: '${}_3\\mathrm{C}_2 \\cdot 2^2 = 3 \\cdot 4 = 12$.',
    },
  },

  'K-G11-STAT-CH02-PROBABILITY': {
    hook: '병원 검사가 양성일 때 진짜 환자일 확률? 검사 정확도만으로는 부족 — 조건부 확률.',
    concrete: '주사위 짝수 나왔다는 조건 아래 4 이상일 확률: $P(\\geq 4 | \\text{짝수}) = \\frac{P(4 \\text{ 또는 } 6)}{P(\\text{짝수})} = \\frac{2/6}{3/6} = \\frac{2}{3}$.',
    pictorial: '벤다이어그램에서 사건 $B$ 영역만 보고 그 안에서 $A$ 비율.',
    abstract: `**조건부 확률** $P(A|B) = \\frac{P(A \\cap B)}{P(B)}$ ($P(B) > 0$).

**곱셈정리** $P(A \\cap B) = P(B) P(A|B)$.

**독립**: $P(A \\cap B) = P(A) P(B)$.

**베이즈 정리**: $P(A|B) = \\frac{P(B|A) P(A)}{P(B)}$ — 원인의 사후 확률.`,
    worked: {
      intro: '주머니 안 빨강 3, 파랑 2. 한 개씩 두 번 (복원 없이) 꺼낼 때 둘 다 빨강일 확률.',
      steps: [
        { math: '$P(\\text{첫째 빨강}) = \\frac{3}{5}$', narration: '5개 중 3개.' },
        { math: '$P(\\text{둘째 빨강} | \\text{첫째 빨강}) = \\frac{2}{4}$', narration: '남은 4개 중 빨강 2개.' },
        { math: '$P = \\frac{3}{5} \\cdot \\frac{2}{4} = \\frac{3}{10}$', narration: '곱셈정리.' },
      ],
    },
    misconception: {
      wrong: '$P(A|B) = P(B|A)$',
      why: '조건의 방향을 무시.',
      correct: '일반적으로 다름. "비올 때 우산 있을 확률"과 "우산 있을 때 비 올 확률"은 다른 정보.',
    },
    retrieval: {
      prompt: '주사위 1번 던졌을 때, 짝수 조건에서 6일 확률?',
      accept: ['1/3'],
      explain: '짝수 = {2, 4, 6} 세 가지 중 6은 하나. $1/3$.',
    },
  },

  'K-G11-STAT-CH03-STATISTICS': {
    hook: '수능 점수 한 줄에 80점 받은 학생, 전국 분포에서 상위 몇 %? — 정규분포가 답한다.',
    concrete: '평균 $\\mu = 60$, 표준편차 $\\sigma = 10$인 정규분포에서 $X = 80$ → $Z = \\frac{80 - 60}{10} = 2$. 표 보면 상위 약 2.3%.',
    pictorial: '종 모양 곡선. 평균 좌우로 1σ 안에 68%, 2σ 안에 95%, 3σ 안에 99.7% (정규분포 경험법칙).',
    abstract: `**확률변수**: 이산·연속.

**기댓값** $E(X) = \\sum x_i p_i$ (이산) 또는 $\\int x f(x) dx$ (연속).

**분산** $V(X) = E(X^2) - E(X)^2$.

**이항분포** $B(n, p)$: $E = np$, $V = np(1-p)$.

**정규분포** $N(\\mu, \\sigma^2)$: 표준화 $Z = \\frac{X - \\mu}{\\sigma}$ → 표준정규분포 표 활용.`,
    worked: {
      intro: '$X \\sim B(100, 0.4)$의 평균과 표준편차.',
      steps: [
        { math: '$E(X) = np = 100 \\cdot 0.4 = 40$', narration: '이항분포 평균.' },
        { math: '$V(X) = np(1-p) = 100 \\cdot 0.4 \\cdot 0.6 = 24$', narration: '분산.' },
        { math: '표준편차 $\\sigma = \\sqrt{24} \\approx 4.9$', narration: '제곱근.' },
      ],
    },
    misconception: {
      wrong: '표준편차 $\\sigma$가 작으면 평균도 작다.',
      why: '두 통계량을 같은 축으로 봄.',
      correct: '둘은 독립. $\\sigma$는 흩어짐만 측정. 평균 100이고 $\\sigma = 1$일 수도 있고, 평균 1이고 $\\sigma = 100$일 수도 있다.',
    },
    retrieval: {
      prompt: '$X \\sim N(50, 10^2)$에서 $X = 70$의 $Z$값?',
      accept: ['2'],
      explain: '$\\frac{70 - 50}{10} = 2$.',
    },
  },

  // ─── 미적분Ⅱ (진로 선택) ────────────────────────────────────────────────

  'K-G12-CAL2-CH01-SEQ-LIMIT': {
    hook: '$1 + \\frac{1}{2} + \\frac{1}{4} + \\frac{1}{8} + \\ldots$ 무한히 더하면 발산할까? 그렇지 않다 — 2로 수렴.',
    concrete: '등비급수 $a + ar + ar^2 + \\ldots$ ($|r| < 1$) → $\\frac{a}{1-r}$. $1 + \\frac{1}{2} + \\ldots = \\frac{1}{1 - 1/2} = 2$.',
    pictorial: '단위 정사각형. 반쪽 칠하고 그 반쪽 다시 반 칠하고... 영원히 색칠해도 1만큼만 채움 ($1 = \\sum_{n=1}^{\\infty}\\frac{1}{2^n}$).',
    abstract: `**수열 극한** $\\lim_{n \\to \\infty} a_n = L$: $n$ 커질 때 $a_n$이 $L$에 한없이 가까워짐.

**무한급수** $\\sum_{n=1}^{\\infty} a_n = \\lim_{N \\to \\infty}\\sum_{n=1}^{N} a_n$.

**등비급수 수렴조건**: $|r| < 1$. 수렴 시 $S_\\infty = \\frac{a_1}{1 - r}$.`,
    worked: {
      intro: '$\\sum_{n=1}^{\\infty} \\frac{3}{4^n}$ 의 합.',
      steps: [
        { math: '첫째항 $a = \\frac{3}{4}$, 공비 $r = \\frac{1}{4}$', narration: '등비수열.' },
        { math: '$|r| < 1$이므로 수렴', narration: '조건 확인.' },
        { math: '$S = \\frac{3/4}{1 - 1/4} = \\frac{3/4}{3/4} = 1$', narration: '공식.' },
      ],
    },
    misconception: {
      wrong: '$\\sum \\frac{1}{n}$ ($n = 1, 2, ...$) 은 각 항이 0으로 가니까 수렴.',
      why: '"항이 0으로 가면 합 유한"이라는 잘못된 직관.',
      correct: '조화급수는 발산. 항이 0으로 가는 것은 수렴의 **필요조건**일 뿐 충분조건 아님.',
    },
    retrieval: {
      prompt: '$\\sum_{n=0}^{\\infty}(0.5)^n$ 의 합?',
      accept: ['2'],
      explain: '$\\frac{1}{1 - 0.5} = 2$.',
    },
  },

  'K-G12-CAL2-CH02-DIFF-METHOD': {
    hook: '$y = \\sin(x^2)$를 미분하면? 합성함수 — 안 미분 × 바깥 미분 (연쇄법칙).',
    concrete: '$\\frac{d}{dx}\\sin(x^2) = \\cos(x^2) \\cdot 2x$. $(\\sin u)\' \\cdot u\'$.',
    pictorial: '바깥 함수 $\\sin$, 안 함수 $x^2$. 양쪽 모두 미분 후 곱하기 — "체인"으로 연결된 두 변화율.',
    abstract: `**여러 함수 미분**: $(\\sin x)\' = \\cos x$, $(\\cos x)\' = -\\sin x$, $(e^x)\' = e^x$, $(\\ln x)\' = \\frac{1}{x}$.

**곱의 미분** $(fg)\' = f\'g + fg\'$.

**몫의 미분** $\\left(\\frac{f}{g}\\right)\' = \\frac{f\'g - fg\'}{g^2}$.

**연쇄법칙** $(f(g(x)))\' = f\'(g(x)) \\cdot g\'(x)$.`,
    worked: {
      intro: '$y = e^{x^2}$의 도함수.',
      steps: [
        { math: '바깥 $e^u$, 안 $u = x^2$', narration: '합성 분해.' },
        { math: '$(e^u)\' \\cdot (x^2)\' = e^{x^2} \\cdot 2x$', narration: '연쇄법칙.' },
        { math: '$y\' = 2x e^{x^2}$', narration: '정리.' },
      ],
    },
    misconception: {
      wrong: '$(fg)\' = f\' g\'$',
      why: '미분에 분배법칙을 곱셈에도 적용.',
      correct: '$(fg)\' = f\'g + fg\'$ (곱의 미분). 두 항 모두 필요.',
    },
    retrieval: {
      prompt: '$y = (3x + 1)^4$의 도함수?',
      accept: ['12(3x+1)^3', '12*(3x+1)^3'],
      explain: '연쇄법칙: $4(3x+1)^3 \\cdot 3 = 12(3x+1)^3$.',
    },
  },

  'K-G12-CAL2-CH03-INT-METHOD': {
    hook: '$\\int x \\cos x \\, dx$ — 직접 안 보임. 적분에도 "묶음" 기술이 있다 — 부분적분.',
    concrete: '$\\int x \\cos x \\, dx$, $u = x$, $dv = \\cos x \\, dx$. $\\int u \\, dv = uv - \\int v \\, du = x \\sin x - \\int \\sin x \\, dx = x \\sin x + \\cos x + C$.',
    pictorial: '회전체 부피: 곡선 $y = f(x)$를 $x$축 둘레 회전. 단면이 반지름 $f(x)$인 원, 부피 = $\\pi \\int_a^b [f(x)]^2 dx$.',
    abstract: `**치환적분**: $\\int f(g(x)) g\'(x) dx = \\int f(u) du$ ($u = g(x)$).

**부분적분**: $\\int u \\, dv = uv - \\int v \\, du$ — 미분 곱의 역.

**회전체 부피** $V = \\pi \\int_a^b [f(x)]^2 dx$ ($x$축 회전).

**곡선의 길이** $L = \\int_a^b \\sqrt{1 + (f\'(x))^2} dx$.`,
    worked: {
      intro: '$\\int 2x e^{x^2} dx$ (치환).',
      steps: [
        { math: '$u = x^2 \\Rightarrow du = 2x \\, dx$', narration: '치환 변수 설정.' },
        { math: '$\\int e^u du = e^u + C$', narration: '$u$에 대해 적분.' },
        { math: '$= e^{x^2} + C$', narration: '원래 변수로.' },
      ],
    },
    misconception: {
      wrong: '$\\int (fg) dx = (\\int f dx)(\\int g dx)$',
      why: '적분에 곱셈 분배.',
      correct: '곱의 적분은 일반적으로 위 등식 X. 부분적분 $\\int u \\, dv = uv - \\int v \\, du$ 사용.',
    },
    retrieval: {
      prompt: '$\\int e^{3x} dx$ (상수 생략)?',
      accept: ['e^(3x)/3', '(1/3)e^3x', 'e^{3x}/3'],
      explain: '치환 $u = 3x$ → $\\int e^u \\frac{du}{3} = \\frac{e^u}{3}$.',
    },
  },

  // ─── 기하 (진로 선택) ──────────────────────────────────────────────────

  'K-G12-GEO-CH01-CONIC': {
    hook: '망원경 반사거울 모양은? 위성 안테나 단면은? 모두 포물선 — 빛/신호가 초점에 모이는 마법의 곡선.',
    concrete: '포물선 $y^2 = 4x$. 초점 $(1, 0)$, 준선 $x = -1$. 포물선 위 점 → 초점 거리 = 점에서 준선까지 거리.',
    pictorial: '원뿔을 평면으로 자르면: 평행 자르기 = 원, 비스듬히 = 타원, 모선과 평행 = 포물선, 더 가파르게 = 쌍곡선.',
    abstract: `**포물선**: 한 점(초점)과 한 직선(준선)까지의 거리가 같은 점들. $y^2 = 4px$ → 초점 $(p, 0)$, 준선 $x = -p$.

**타원**: 두 초점까지 거리의 합 일정. $\\frac{x^2}{a^2} + \\frac{y^2}{b^2} = 1$.

**쌍곡선**: 두 초점까지 거리의 차 일정. $\\frac{x^2}{a^2} - \\frac{y^2}{b^2} = 1$.`,
    worked: {
      intro: '$\\frac{x^2}{9} + \\frac{y^2}{4} = 1$의 초점.',
      steps: [
        { math: '$a^2 = 9, b^2 = 4$, $a > b$', narration: '장축이 $x$축.' },
        { math: '$c^2 = a^2 - b^2 = 5 \\Rightarrow c = \\sqrt{5}$', narration: '초점까지 거리.' },
        { math: '초점 $(\\pm\\sqrt{5}, 0)$', narration: '$x$축 위.' },
      ],
    },
    misconception: {
      wrong: '타원 $\\frac{x^2}{a^2} + \\frac{y^2}{b^2} = 1$의 초점은 $(\\pm a, 0)$.',
      why: '$a^2$ 위치 = 초점 위치라고 착각.',
      correct: '초점 거리 $c = \\sqrt{a^2 - b^2}$ (장축이 $x$축일 때). 초점 $(\\pm c, 0)$. $a$가 아님.',
    },
    retrieval: {
      prompt: '포물선 $y^2 = 8x$의 초점?',
      accept: ['(2,0)', '(2, 0)', '2,0'],
      explain: '$y^2 = 4px$에서 $4p = 8 \\Rightarrow p = 2$. 초점 $(2, 0)$.',
    },
  },

  'K-G12-GEO-CH02-VECTOR-2D': {
    hook: '"북쪽으로 3km 가서 동쪽으로 4km" — 두 화살표를 이으면 결국 어디? 벡터 합.',
    concrete: '$\\vec{a} = (3, 0)$, $\\vec{b} = (0, 4)$. $\\vec{a} + \\vec{b} = (3, 4)$. $|\\vec{a} + \\vec{b}| = 5$.',
    pictorial: '화살표 = 벡터. 시작점·끝점 평행이동해도 같은 벡터. 두 벡터 합 = 시작점 맞춰서 평행사변형 대각선.',
    abstract: `**벡터** = 크기 + 방향. 성분 $\\vec{a} = (a_1, a_2)$.

**합** $\\vec{a} + \\vec{b} = (a_1 + b_1, a_2 + b_2)$.

**내적** $\\vec{a} \\cdot \\vec{b} = a_1 b_1 + a_2 b_2 = |\\vec{a}||\\vec{b}|\\cos\\theta$.

**수직** $\\Leftrightarrow$ $\\vec{a} \\cdot \\vec{b} = 0$.`,
    worked: {
      intro: '$\\vec{a} = (2, 1)$, $\\vec{b} = (3, -1)$의 내적과 이루는 각.',
      steps: [
        { math: '$\\vec{a} \\cdot \\vec{b} = 2 \\cdot 3 + 1 \\cdot (-1) = 5$', narration: '성분 곱의 합.' },
        { math: '$|\\vec{a}| = \\sqrt{5}, |\\vec{b}| = \\sqrt{10}$', narration: '각각 크기.' },
        { math: '$\\cos\\theta = \\frac{5}{\\sqrt{5} \\cdot \\sqrt{10}} = \\frac{5}{\\sqrt{50}} = \\frac{1}{\\sqrt{2}}$ → $\\theta = 45°$', narration: '코사인 공식.' },
      ],
    },
    misconception: {
      wrong: '$\\vec{a} \\cdot \\vec{b}$ 도 벡터다.',
      why: '곱셈이라 결과도 같은 종류라 착각.',
      correct: '내적은 **스칼라** (실수). 외적이 벡터지만 2D에선 외적 정의 안 함.',
    },
    retrieval: {
      prompt: '$(1, 2)$와 $(3, -1)$이 수직인가?',
      accept: ['no', 'X', '아니오', '아님'],
      explain: '내적 $= 3 - 2 = 1 \\neq 0$. 수직 아님.',
    },
  },

  'K-G12-GEO-CH03-SPACE-3D': {
    hook: '평면 위 점 두 좌표 → 공간에선 세 좌표. 직선·평면의 방정식도 같은 원리로 확장.',
    concrete: '공간 좌표 $A(1, 2, 3)$, $B(4, 6, 3)$. 거리 $\\sqrt{9 + 16 + 0} = 5$.',
    pictorial: '$x, y, z$ 축 3개 직교. 평면 $z = 0$은 바닥, $z = 5$는 그 위 5층.',
    abstract: `**공간 거리** $d = \\sqrt{(x_2-x_1)^2 + (y_2-y_1)^2 + (z_2-z_1)^2}$.

**직선의 방정식** (점 $P_0$, 방향벡터 $\\vec{d}$): $\\vec{r} = \\vec{r}_0 + t\\vec{d}$.

**평면의 방정식** (법선 $\\vec{n} = (a, b, c)$): $ax + by + cz = d$.

**두 평면 사잇각** = 법선 사잇각.`,
    worked: {
      intro: '점 $(1, 0, 2)$를 지나고 법선 $(2, -1, 3)$인 평면.',
      steps: [
        { math: '$2x - y + 3z = d$ 꼴', narration: '법선 = 계수.' },
        { math: '점 대입: $2(1) - 0 + 3(2) = 8$', narration: '$d$ 결정.' },
        { math: '$2x - y + 3z = 8$', narration: '완성.' },
      ],
    },
    misconception: {
      wrong: '공간 직선의 방정식은 $y = mx + c$ 처럼 하나의 식.',
      why: '평면 직선 경험.',
      correct: '공간 직선은 두 식 (평면 두 개의 교선) 또는 매개변수형 $\\vec{r} = \\vec{r}_0 + t\\vec{d}$. 하나로 안 됨.',
    },
    retrieval: {
      prompt: '$A(0, 0, 0)$과 $B(2, 3, 6)$ 사이 공간 거리?',
      accept: ['7'],
      explain: '$\\sqrt{4 + 9 + 36} = \\sqrt{49} = 7$.',
    },
  },
};
