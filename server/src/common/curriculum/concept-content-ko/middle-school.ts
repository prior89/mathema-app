/**
 * 중1 / 중2 / 중3 수학 — 21 chapters total.
 */
import { KoreanChapterContentMap } from './types';

export const MIDDLE_SCHOOL_CONTENT: KoreanChapterContentMap = {
  // ─── 중1 수학 1 (8 chapters) ───────────────────────────────────────────

  'K-G7-MATH1-CH01-FACTORIZATION': {
    hook: '12를 가장 작은 조각들로 쪼개면? 2·2·3 — 더 이상 쪼갤 수 없는 소수들의 곱.',
    concrete: '60 = 2² · 3 · 5. 60의 약수 개수 = (2+1)(1+1)(1+1) = 12개. 약수 트리로 보면 한눈에.',
    pictorial: '소인수분해 트리: 60 → 6×10 → (2×3)×(2×5). 잎(leaf)이 모두 소수가 되면 끝.',
    abstract: `1보다 큰 자연수를 소수들의 곱으로 분해한 결과를 소인수분해라 한다.

**모든 자연수는 단 한 가지 방법으로 소인수분해된다** (산술의 기본정리). 약수 개수 공식: $N = p_1^{a_1} \\cdots p_k^{a_k}$ 일 때 약수의 수 = $(a_1+1)(a_2+1)\\cdots(a_k+1)$.`,
    worked: {
      intro: '180을 소인수분해하고 약수의 개수를 구하라.',
      steps: [
        { math: '180 ÷ 2 = 90', narration: '가장 작은 소수 2로 나눈다.' },
        { math: '90 ÷ 2 = 45, 45 ÷ 3 = 15, 15 ÷ 3 = 5', narration: '2가 더 이상 안 나누면 3으로, 그 다음 5로.' },
        { math: '180 = 2² · 3² · 5', narration: '소인수분해 완성.' },
        { math: '약수 = (2+1)(2+1)(1+1) = 18개', narration: '각 소인수의 지수+1을 곱한다.' },
      ],
    },
    misconception: {
      wrong: '1도 소수다.',
      why: '"자기 자신과 1만 약수"로 잘못 외운 결과.',
      correct: '소수의 정의는 "1보다 큰 자연수 중 약수가 1과 자기 자신뿐". 1은 제외된다.',
    },
    retrieval: {
      prompt: '72의 소인수분해는?',
      accept: ['2^3·3^2', '2³·3²', '2*2*2*3*3', '8·9'],
      explain: '72 = 8 × 9 = 2³ × 3².',
    },
  },

  'K-G7-MATH1-CH02-INTEGERS': {
    hook: '온도가 -3°C일 때 5도 더 떨어지면? 단순한 뺄셈이 음수의 세계로 들어가는 출발점.',
    concrete: '$(-3) + (-5) = -8$. 부호가 같으면 절댓값을 더하고 같은 부호. $(-7) + 4 = -3$. 부호가 다르면 절댓값의 차에 큰 쪽 부호.',
    pictorial: '수직선 위에서 +는 오른쪽 이동, −는 왼쪽 이동. $(-2) + 5$ = -2에서 오른쪽 5칸 → +3.',
    abstract: `정수 = ..., -3, -2, -1, 0, 1, 2, 3, ... 유리수 = $\\frac{a}{b}$ ($b \\neq 0$, $a, b$는 정수).

**부호 규칙**: $(-) \\times (-) = +$, $(-) \\times (+) = -$. 절댓값 $|a|$ = 수직선에서 0까지의 거리. $|-7| = 7$.`,
    worked: {
      intro: '$(-6) \\div (-2) \\times (-3) = ?$',
      steps: [
        { math: '$(-6) \\div (-2) = 3$', narration: '음수 ÷ 음수 = 양수.' },
        { math: '$3 \\times (-3) = -9$', narration: '양수 × 음수 = 음수.' },
        { math: '답: $-9$', narration: '왼쪽부터 차례대로 계산.' },
      ],
    },
    misconception: {
      wrong: '$(-2)^2 = -4$',
      why: '음수의 거듭제곱과 음수 부호를 혼동.',
      correct: '$(-2)^2 = (-2)(-2) = 4$. 음수 두 번 곱하면 양수. 반면 $-2^2 = -(2^2) = -4$ (괄호 없으면 부호 먼저 빼고 제곱).',
    },
    retrieval: {
      prompt: '$(-3) - (-7) + (-2) = ?$',
      accept: ['2'],
      explain: '$-3 + 7 - 2 = 2$. 빼기 음수는 더하기.',
    },
  },

  'K-G7-MATH1-CH03-LETTERS-EQ': {
    hook: '"3개에 2000원인 사과를 $x$개 사면 얼마?" — 문자 $x$가 모르는 수를 대신 표시.',
    concrete: '$x = 5$일 때 사과값 = $\\frac{2000}{3} \\times 5 \\approx 3333$원. 식 $\\frac{2000x}{3}$.',
    pictorial: '저울 그림: 왼쪽에 $2x + 3$, 오른쪽에 $11$. 양변에서 같은 양을 빼고 나눠도 균형 유지.',
    abstract: `문자는 변수 또는 미지수를 표시. 일차방정식 $ax + b = c$ ($a \\neq 0$)의 해는 $x = \\frac{c-b}{a}$.

**등식의 성질**: 양변에 같은 수를 더하거나 빼거나 곱하거나 (0이 아닌 수로) 나눠도 등식이 유지된다.`,
    worked: {
      intro: '$3(x - 2) = 2x + 5$ 의 해.',
      steps: [
        { math: '$3x - 6 = 2x + 5$', narration: '왼쪽 괄호 풀기.' },
        { math: '$3x - 2x = 5 + 6$', narration: '문자는 왼쪽, 수는 오른쪽.' },
        { math: '$x = 11$', narration: '정리.' },
      ],
    },
    misconception: {
      wrong: '$x + 3 = 7$의 해는 $x = 7 - 3 \\times 1 = 4$ 이므로 양변에 1을 곱했다.',
      why: '"양변에 같은 수"의 의미를 잘못 일반화.',
      correct: '$x + 3 = 7$ → 양변에서 3을 **빼서** $x = 4$. 곱한 게 아니라 같은 수를 더하거나 뺐다.',
    },
    retrieval: {
      prompt: '$2x + 5 = 13$의 해는?',
      accept: ['4'],
      explain: '$2x = 8 \\Rightarrow x = 4$.',
    },
  },

  'K-G7-MATH1-CH04-COORD-GRAPH': {
    hook: '지도에서 "북위 37도, 동경 127도"가 한 점을 정확히 표시하듯, 두 수로 평면 위 점을 콕 찍는다.',
    concrete: '점 $(3, 2)$는 원점에서 오른쪽 3, 위로 2. 점 $(-2, -1)$은 왼쪽 2, 아래 1. 두 점을 이으면 직선.',
    pictorial: '좌표평면 4분면. 제1사분면 $(+,+)$, 제2사분면 $(-,+)$, 제3사분면 $(-,-)$, 제4사분면 $(+,-)$. $x$축은 $y=0$, $y$축은 $x=0$.',
    abstract: `$x$좌표(가로), $y$좌표(세로)로 점을 표시 $\\to$ 점 $P(x, y)$.

**그래프**는 두 변수의 관계를 시각화한다. 시간-거리 그래프의 기울기 = 속력.`,
    worked: {
      intro: '점 $A(2, 3)$과 $B(2, -1)$ 사이의 거리.',
      steps: [
        { math: '두 점의 $x$좌표가 같음', narration: '$y$축에 평행한 선분.' },
        { math: '거리 $= |3 - (-1)| = 4$', narration: '$y$좌표 차이의 절댓값.' },
      ],
    },
    misconception: {
      wrong: '$(3, 2)$와 $(2, 3)$은 같은 점이다.',
      why: '순서를 신경 쓰지 않음.',
      correct: '좌표는 순서쌍 (ordered pair). $x$ 먼저, $y$ 나중. 두 점은 다르다.',
    },
    retrieval: {
      prompt: '점 $(-3, 5)$는 몇 사분면?',
      accept: ['제2사분면', '2사분면', '제2', '2', 'II'],
      explain: '$x < 0, y > 0$ → 제2사분면.',
    },
  },

  'K-G7-MATH1-CH05-BASIC-FIGURES': {
    hook: '"점이 모여 선이 되고 선이 모여 면이 된다" — 모든 도형의 출발.',
    concrete: '두 점을 지나는 직선은 단 하나. 한 점에서 만나는 두 직선이 이루는 각 4개의 합은 항상 $360°$.',
    pictorial: '직선·반직선·선분의 차이를 화살표로 시각화. 평행: 만나지 않음. 수직: $90°$.',
    abstract: `점(0차원), 선(1차원), 면(2차원). 두 직선의 위치 관계: 만난다·평행하다·꼬인 위치.

**평각** $180°$, **직각** $90°$, **예각** $0°<\\theta<90°$, **둔각** $90°<\\theta<180°$.`,
    worked: {
      intro: '두 직선이 한 점에서 만나 만든 4개 각 중 한 각이 $35°$. 나머지 세 각.',
      steps: [
        { math: '맞꼭지각 = $35°$', narration: '반대편 각은 같다.' },
        { math: '이웃한 각 = $180° - 35° = 145°$', narration: '직선의 한 각은 $180°$.' },
        { math: '반대편 이웃 = $145°$', narration: '이것도 맞꼭지각.' },
      ],
    },
    misconception: {
      wrong: '두 직선이 만나지 않으면 평행이다.',
      why: '평면 도형만 생각.',
      correct: '공간(3D)에서는 만나지도 평행하지도 않은 "꼬인 위치"가 존재한다.',
    },
    retrieval: {
      prompt: '한 각이 $48°$일 때 그 보각은?',
      accept: ['132', '132도', '132°'],
      explain: '보각 = $180° - 48° = 132°$.',
    },
  },

  'K-G7-MATH1-CH06-PLANE-FIG': {
    hook: '왜 삼각형 내각의 합은 항상 $180°$일까? 한 변에 평행선을 그으면 보인다.',
    concrete: '$\\triangle ABC$에서 두 각이 $50°, 70°$. 세 번째 각 = $180° - 50° - 70° = 60°$.',
    pictorial: '$n$각형 내각의 합 = $(n-2) \\times 180°$. 사각형 $360°$, 오각형 $540°$. 한 꼭짓점에서 대각선으로 삼각형 분할.',
    abstract: '**삼각형의 합동조건**: SSS(세 변), SAS(두 변과 끼인 각), ASA(두 각과 끼인 변). 정$n$각형 한 내각 = $\\frac{(n-2) \\times 180°}{n}$. 정육각형 한 각 = $120°$.',
    worked: {
      intro: '정십각형의 한 내각.',
      steps: [
        { math: '내각의 합 $= (10-2) \\times 180° = 1440°$', narration: '$(n-2) \\times 180°$ 적용.' },
        { math: '한 내각 $= \\frac{1440°}{10} = 144°$', narration: '정다각형은 모든 내각이 같음.' },
      ],
    },
    misconception: {
      wrong: '두 변의 길이가 같으면 합동.',
      why: '필요한 정보가 부족.',
      correct: '두 변 + 끼인 각 (SAS) 또는 두 변 + 다른 한 변 (SSS) 등 세 조건이 필요.',
    },
    retrieval: {
      prompt: '정팔각형의 한 외각은?',
      accept: ['45', '45도', '45°'],
      explain: '외각의 합은 항상 $360°$. $360°/8 = 45°$.',
    },
  },

  'K-G7-MATH1-CH07-SOLID-FIG': {
    hook: '피라미드와 정육면체의 부피, 어느 게 더 클까? 모양만으로 답할 수 없다 — 공식이 필요.',
    concrete: '한 모서리 $5$cm 정육면체의 부피 $= 5^3 = 125$ cm³. 겉넓이 $= 6 \\times 5^2 = 150$ cm².',
    pictorial: '회전체: 직사각형 회전 → 원기둥, 직각삼각형 → 원뿔, 반원 → 구. 단면이 회전축 따라 같은 모양 유지.',
    abstract: `**부피 공식**: 원기둥 $V = \\pi r^2 h$. 원뿔 $V = \\frac{1}{3}\\pi r^2 h$. 구 $V = \\frac{4}{3}\\pi r^3$.

**겉넓이**: 구 $S = 4\\pi r^2$. 같은 밑면·높이 원뿔 부피는 원기둥의 $\\frac{1}{3}$.`,
    worked: {
      intro: '반지름 $3$cm 구의 부피.',
      steps: [
        { math: '$V = \\frac{4}{3}\\pi r^3$', narration: '공식.' },
        { math: '$V = \\frac{4}{3}\\pi \\times 27 = 36\\pi$ cm³', narration: '$3^3 = 27$ 대입.' },
      ],
    },
    misconception: {
      wrong: '원뿔 부피 = $\\pi r^2 h$ (원기둥과 같음).',
      why: '$\\frac{1}{3}$ 계수를 잊음.',
      correct: '원뿔 = 같은 밑·높이 원기둥의 1/3. 카발리에리 원리에서 유도.',
    },
    retrieval: {
      prompt: '반지름 $2$cm, 높이 $5$cm 원기둥의 부피 (단위 cm³, $\\pi$ 그대로)?',
      accept: ['20π', '20pi', '20*π'],
      explain: '$V = \\pi r^2 h = \\pi \\cdot 4 \\cdot 5 = 20\\pi$.',
    },
  },

  'K-G7-MATH1-CH08-STATISTICS-INTRO': {
    hook: '같은 시험 평균 70점인 반 두 곳, 한 반은 다 70점 근처고 한 반은 30~100점이 섞여있다면? 평균만으론 부족.',
    concrete: '점수 [60, 70, 80, 90, 100]. 평균 $\\frac{60+70+80+90+100}{5} = 80$. 중앙값 = 80 (가운데 값).',
    pictorial: '도수분포표 → 막대그래프 → 히스토그램. 줄기와 잎 그림으로 분포 한눈에. 원그래프는 비율, 막대그래프는 비교.',
    abstract: `**평균** $\\bar{x} = \\frac{\\sum x_i}{n}$.

**중앙값**: 값을 정렬했을 때 가운데.

**최빈값**: 가장 많이 나타나는 값.

**계급** = 자료를 일정 간격으로 묶은 구간.`,
    worked: {
      intro: '자료 [12, 15, 18, 12, 20, 15, 12]의 평균·중앙값·최빈값.',
      steps: [
        { math: '평균 $= \\frac{104}{7} \\approx 14.9$', narration: '합 ÷ 개수.' },
        { math: '정렬: [12, 12, 12, 15, 15, 18, 20] → 중앙값 = 15', narration: '4번째 값.' },
        { math: '최빈값 = 12 (3번)', narration: '가장 많이 등장.' },
      ],
    },
    misconception: {
      wrong: '평균이 중앙값보다 항상 작거나 같다.',
      why: '대칭 분포만 생각.',
      correct: '극단값이 있으면 평균이 한쪽으로 끌려간다. 소득 분포처럼 한쪽으로 치우치면 평균 > 중앙값.',
    },
    retrieval: {
      prompt: '자료 [3, 7, 7, 8, 10]의 중앙값?',
      accept: ['7'],
      explain: '5개 중 가운데 = 3번째 = 7.',
    },
  },

  // ─── 중2 수학 2 (7 chapters) ───────────────────────────────────────────

  'K-G8-MATH2-CH01-RATIONAL-REPEAT': {
    hook: '$\\frac{1}{3} = 0.333...$ 끝없이 이어지는 3. 어떤 분수는 유한소수, 어떤 건 순환소수, 왜 갈릴까?',
    concrete: '$\\frac{3}{20} = 0.15$ (유한). $\\frac{1}{6} = 0.1\\overline{6}$ (순환). $\\frac{5}{12} = 0.41\\overline{6}$.',
    pictorial: '분수 → 소수 나눗셈 알고리듬. 나머지가 0이면 유한소수, 나머지가 반복되면 순환.',
    abstract: '기약분수 $\\frac{q}{p}$ ($p, q$ 서로소)에서 **분모 $p$의 소인수가 2와 5뿐**이면 유한소수, 그 외 소인수가 있으면 순환소수. 순환소수 → 분수: $0.\\overline{3} = \\frac{3}{9} = \\frac{1}{3}$.',
    worked: {
      intro: '$x = 0.\\overline{27}$을 분수로.',
      steps: [
        { math: '$100x = 27.\\overline{27}$', narration: '순환마디 2자리이므로 100배.' },
        { math: '$100x - x = 27 \\Rightarrow 99x = 27$', narration: '순환부분 소거.' },
        { math: '$x = \\frac{27}{99} = \\frac{3}{11}$', narration: '기약분수로 약분.' },
      ],
    },
    misconception: {
      wrong: '$0.\\overline{9} < 1$',
      why: '"9가 영원히 와도 1엔 못 미친다"는 직관.',
      correct: '$0.\\overline{9} = 1$. 위 방법으로 $9x = 9 \\Rightarrow x = 1$.',
    },
    retrieval: {
      prompt: '$0.\\overline{6}$을 분수로?',
      accept: ['2/3', '⅔'],
      explain: '$9x = 6 \\Rightarrow x = \\frac{2}{3}$.',
    },
  },

  'K-G8-MATH2-CH02-CALC-EXPR': {
    hook: '$2^3 \\times 2^4 = 2^?$ — 지수를 더하기만 하면 끝나는 마법.',
    concrete: '$x^2 \\cdot x^5 = x^{2+5} = x^7$. $(x^3)^2 = x^{6}$. $\\frac{x^7}{x^3} = x^4$.',
    pictorial: '곱셈을 거듭제곱 박스로 시각화. $x^2 \\cdot x^3 = (x \\cdot x)(x \\cdot x \\cdot x) = x^5$.',
    abstract: `**지수 법칙** ($m, n$ 자연수): $a^m \\cdot a^n = a^{m+n}$, $(a^m)^n = a^{mn}$, $(ab)^n = a^n b^n$, $a^m \\div a^n = a^{m-n}$ ($a \\neq 0$).

**분배법칙**으로 다항식 곱 전개.`,
    worked: {
      intro: '$(2x + 3)(x - 4)$ 전개.',
      steps: [
        { math: '$2x \\cdot x + 2x \\cdot (-4) + 3 \\cdot x + 3 \\cdot (-4)$', narration: 'FOIL 분배.' },
        { math: '$2x^2 - 8x + 3x - 12$', narration: '각 항 계산.' },
        { math: '$2x^2 - 5x - 12$', narration: '동류항 정리.' },
      ],
    },
    misconception: {
      wrong: '$(a + b)^2 = a^2 + b^2$',
      why: '괄호 안 각 항을 따로 제곱하는 잘못된 분배.',
      correct: '$(a + b)^2 = a^2 + 2ab + b^2$. 곱셈 공식 — 교차항 $2ab$ 잊지 말기.',
    },
    retrieval: {
      prompt: '$(x + 5)(x - 5)$ 전개?',
      accept: ['x^2-25', 'x²-25', 'x*x-25'],
      explain: '합·차 공식 $(a+b)(a-b) = a^2 - b^2$.',
    },
  },

  'K-G8-MATH2-CH03-LINEAR-INEQ': {
    hook: '"용돈 10000원으로 1000원짜리 빵 몇 개?" — 등식이 아닌 부등식의 세계.',
    concrete: '$1000x \\leq 10000 \\Rightarrow x \\leq 10$. 최대 10개. $-2x < 6 \\Rightarrow x > -3$ (음수로 나누면 부등호 뒤집힘).',
    pictorial: '수직선 위 해의 영역을 ●(포함) ○(미포함) 표시. 연립방정식의 해는 두 직선의 교점.',
    abstract: `**부등식의 성질**: 양변에 같은 수 더하기·빼기, 양수 곱·나누기 OK.

**음수 곱·나누기 시 부등호 뒤집힘**. 연립일차방정식: 두 미지수 $x, y$에 대한 두 방정식 — 가감법·대입법으로 해.`,
    worked: {
      intro: '$\\begin{cases} x + y = 7 \\\\ 2x - y = 2 \\end{cases}$',
      steps: [
        { math: '두 식 더하기: $3x = 9 \\Rightarrow x = 3$', narration: '$y$ 소거 (가감법).' },
        { math: '$3 + y = 7 \\Rightarrow y = 4$', narration: '첫 번째 식에 대입.' },
        { math: '$(x, y) = (3, 4)$', narration: '해.' },
      ],
    },
    misconception: {
      wrong: '$-2x < 6 \\Rightarrow x < -3$',
      why: '음수로 나눌 때 부등호 방향을 그대로 둠.',
      correct: '음수로 나누면 부등호 뒤집힘 → $x > -3$.',
    },
    retrieval: {
      prompt: '$3x - 5 \\geq 7$의 해.',
      accept: ['x≥4', 'x>=4', 'x ≥ 4'],
      explain: '$3x \\geq 12 \\Rightarrow x \\geq 4$.',
    },
  },

  'K-G8-MATH2-CH04-LINEAR-FN': {
    hook: '"매일 같은 속도로 걸으면 시간-거리 그래프는?" 일직선. 이 직선의 기울기가 곧 속력.',
    concrete: '$y = 2x + 1$. $x=0$일 때 $y=1$ ($y$절편). 기울기 $2$ (오른쪽 1 갈 때 위로 2).',
    pictorial: '좌표평면에 직선 두 점 — $(0, 1)$과 $(1, 3)$ — 잇기. 기울기 = $\\frac{y \\text{ 변화}}{x \\text{ 변화}}$.',
    abstract: `$y = ax + b$.

**$a$ = 기울기 (변화율)**, **$b$ = $y$절편**. 두 직선 $y = a_1 x + b_1$과 $y = a_2 x + b_2$가 만나면 → 연립방정식의 해. $a_1 = a_2$ 이면 평행 또는 일치.`,
    worked: {
      intro: '두 점 $(1, 3)$과 $(4, 9)$를 지나는 직선의 방정식.',
      steps: [
        { math: '기울기 $a = \\frac{9-3}{4-1} = 2$', narration: '$\\Delta y / \\Delta x$.' },
        { math: '$y - 3 = 2(x - 1)$', narration: '점-기울기 형식.' },
        { math: '$y = 2x + 1$', narration: '정리.' },
      ],
    },
    misconception: {
      wrong: '기울기가 큰 직선이 더 빠르게 올라간다고, 기울기 $\\frac{1}{2}$ 직선이 기울기 $-3$ 보다 더 가파르다.',
      why: '음수 기울기의 절댓값을 무시.',
      correct: '가파름은 **기울기의 절댓값**으로 비교. $|-3| > |\\frac{1}{2}|$ 이므로 $-3$ 쪽이 더 가파르다.',
    },
    retrieval: {
      prompt: '$y = -3x + 2$의 $x$절편?',
      accept: ['2/3'],
      explain: '$y = 0$ 대입: $0 = -3x + 2 \\Rightarrow x = \\frac{2}{3}$.',
    },
  },

  'K-G8-MATH2-CH05-PROPERTIES-FIG': {
    hook: '두 삼각형이 합동임을 어떻게 "증명"할까? 직관 말고 논리로.',
    concrete: '$\\triangle ABC \\equiv \\triangle DEF$인 SAS 조건: $AB = DE$, $\\angle A = \\angle D$, $AC = DF$.',
    pictorial: '평행선의 성질: 동위각·엇각이 같다. $l \\parallel m$일 때 가로지른 직선이 만든 각들의 대칭.',
    abstract: `**증명** = 가정 → 근거(공리·정리) → 결론의 사슬.

**삼각형의 합동조건**: SSS, SAS, ASA.

**평행선과 각**: 동위각 같음, 엇각 같음 ⇔ 평행.

**이등변삼각형**: 두 변 같음 ⇔ 두 밑각 같음.`,
    worked: {
      intro: '이등변삼각형 $ABC$ ($AB = AC$)에서 $\\angle B = \\angle C$ 증명.',
      steps: [
        { math: '꼭짓점 $A$에서 $BC$로 수선 $AD$', narration: '보조선 긋기.' },
        { math: '$\\triangle ABD$ vs $\\triangle ACD$: $AB=AC$, $AD$ 공통, $\\angle ADB = \\angle ADC = 90°$', narration: 'SAS의 조건들 확인.' },
        { math: '$\\therefore \\triangle ABD \\equiv \\triangle ACD$, 대응각 $\\angle B = \\angle C$', narration: '합동 → 대응 부분 같음.' },
      ],
    },
    misconception: {
      wrong: '두 삼각형의 세 각이 같으면 합동.',
      why: 'AAA를 합동조건으로 착각.',
      correct: 'AAA는 **닮음** 조건. 합동은 변 길이까지 필요 (SSS, SAS, ASA).',
    },
    retrieval: {
      prompt: '평행선에서 한 동위각이 $65°$일 때 그에 해당하는 엇각은?',
      accept: ['65', '65도', '65°'],
      explain: '평행선 → 동위각 = 엇각 = $65°$.',
    },
  },

  'K-G8-MATH2-CH06-SIMILARITY': {
    hook: '실제 크기 1.7m인 사람이 1m 거울에 다 보이려면 거울이 얼마나 커야 할까? — 닮음비의 응용.',
    concrete: '닮음비 $1:2$인 두 사각형: 변 길이 2배 → 넓이 $2^2 = 4$배 → 부피 $2^3 = 8$배.',
    pictorial: '확대·축소 사진. 같은 모양, 다른 크기. 대응변 비율 일정 = 닮음비.',
    abstract: '**닮음 조건**: SSS 닮음 (세 변 비율 같음), SAS 닮음 (두 변 비율 + 끼인 각 같음), AA 닮음 (두 각 같음). 닮음비 $k$일 때 **넓이비 $k^2$**, **부피비 $k^3$**.',
    worked: {
      intro: '$\\triangle ABC \\sim \\triangle DEF$, 닮음비 $2 : 3$. $\\triangle ABC$ 넓이가 $12$cm²일 때 $\\triangle DEF$ 넓이.',
      steps: [
        { math: '넓이비 $= 2^2 : 3^2 = 4 : 9$', narration: '닮음비 제곱.' },
        { math: '$\\frac{12}{S} = \\frac{4}{9} \\Rightarrow S = 27$ cm²', narration: '비례식.' },
      ],
    },
    misconception: {
      wrong: '닮음비 $1:2$ → 부피비 $1:2$.',
      why: '닮음비를 직접 부피에 적용.',
      correct: '부피는 3차원이므로 닮음비의 세제곱. $1:2$ → $1:8$.',
    },
    retrieval: {
      prompt: '닮음비 $3:5$인 두 도형의 넓이비?',
      accept: ['9:25', '9 : 25'],
      explain: '닮음비 제곱.',
    },
  },

  'K-G8-MATH2-CH07-PROBABILITY': {
    hook: '동전을 던져 앞면? "어차피 반반" — 그 직관을 수로 표현하는 것이 확률.',
    concrete: '주사위 한 개. 짝수 나올 확률 = $\\frac{3}{6} = \\frac{1}{2}$. (짝수 = 2, 4, 6, 세 경우).',
    pictorial: '수형도 (tree diagram): 동전 두 번 던지기 → 4가지 경우 (HH, HT, TH, TT). 한 가지 사건이 차지하는 가지 수 / 전체 가지.',
    abstract: `**확률** $P(A) = \\frac{\\text{사건 } A \\text{의 경우의 수}}{\\text{전체 경우의 수}}$, $0 \\leq P(A) \\leq 1$.

**여사건** $P(A^c) = 1 - P(A)$.

**배반사건** (동시에 일어날 수 없음): $P(A \\cup B) = P(A) + P(B)$.`,
    worked: {
      intro: '주사위 두 개의 눈의 합이 7일 확률.',
      steps: [
        { math: '전체 경우 = $6 \\times 6 = 36$', narration: '곱의 법칙.' },
        { math: '합이 7: (1,6)(2,5)(3,4)(4,3)(5,2)(6,1) = 6가지', narration: '나열.' },
        { math: '$P = \\frac{6}{36} = \\frac{1}{6}$', narration: '약분.' },
      ],
    },
    misconception: {
      wrong: '앞면이 5번 연속 나왔으니 다음엔 뒷면 확률이 더 크다.',
      why: '"평균으로 회귀"를 과거 결과에 적용 (도박사의 오류).',
      correct: '독립시행에서 매번 확률은 $\\frac{1}{2}$로 같다. 과거는 미래를 바꾸지 않는다.',
    },
    retrieval: {
      prompt: '6 면 주사위 한 개를 던질 때 소수가 나올 확률?',
      accept: ['1/2', '0.5', '3/6'],
      explain: '소수 = 2, 3, 5 → 3가지. $3/6 = 1/2$.',
    },
  },

  // ─── 중3 수학 3 (6 chapters) ───────────────────────────────────────────

  'K-G9-MATH3-CH01-REAL-NUMBERS': {
    hook: '$\\sqrt{2}$를 분수로 나타낼 수 있을까? 피타고라스 학파가 증명한 충격적인 사실 — 못 한다.',
    concrete: '$\\sqrt{2} \\approx 1.414$. $\\sqrt{3} \\approx 1.732$. $\\sqrt{4} = 2$ (정수). $\\sqrt{a^2 b} = a\\sqrt{b}$.',
    pictorial: '수직선 위에 $\\sqrt{2}$를 작도: 1×1 직사각형 대각선 길이 = $\\sqrt{2}$. 모든 실수는 수직선의 한 점.',
    abstract: `**실수** = 유리수 ∪ 무리수.

**무리수**: 분수로 표현 불가, 순환하지 않는 무한소수.

**제곱근**: $\\sqrt{a}$ ($a \\geq 0$)는 제곱하면 $a$가 되는 음 아닌 수.

**분모의 유리화**: $\\frac{1}{\\sqrt{2}} = \\frac{\\sqrt{2}}{2}$.`,
    worked: {
      intro: '$\\frac{2}{\\sqrt{3} - 1}$ 분모 유리화.',
      steps: [
        { math: '분자·분모에 $\\sqrt{3} + 1$ 곱하기', narration: '켤레 사용.' },
        { math: '$= \\frac{2(\\sqrt{3}+1)}{(\\sqrt{3}-1)(\\sqrt{3}+1)} = \\frac{2(\\sqrt{3}+1)}{3-1}$', narration: '합·차 공식.' },
        { math: '$= \\sqrt{3} + 1$', narration: '약분.' },
      ],
    },
    misconception: {
      wrong: '$\\sqrt{a^2 + b^2} = a + b$',
      why: '제곱근을 안에서 따로따로 적용.',
      correct: '$\\sqrt{a^2 + b^2} \\neq a + b$ 일반적으로. 예: $\\sqrt{9 + 16} = \\sqrt{25} = 5 \\neq 3 + 4 = 7$.',
    },
    retrieval: {
      prompt: '$\\sqrt{12}$를 가장 간단한 꼴로?',
      accept: ['2√3', '2sqrt(3)', '2*sqrt(3)'],
      explain: '$\\sqrt{12} = \\sqrt{4 \\cdot 3} = 2\\sqrt{3}$.',
    },
  },

  'K-G9-MATH3-CH02-FACTOR-QUAD': {
    hook: '$x^2 + 5x + 6 = 0$의 해는? "두 수 더해 5, 곱해 6" → 2와 3 → $(x+2)(x+3) = 0$.',
    concrete: '$x^2 - 7x + 12 = (x-3)(x-4)$. 해 $x = 3$ 또는 $x = 4$.',
    pictorial: '곱셈공식 → 인수분해: 사각형 넓이 → 두 변의 곱. $x^2 + 5x + 6 = (x+2)(x+3)$ ↔ $(x+2)$ × $(x+3)$ 직사각형.',
    abstract: `**인수분해 공식**: $a^2 - b^2 = (a+b)(a-b)$, $a^2 \\pm 2ab + b^2 = (a \\pm b)^2$, $x^2 + (p+q)x + pq = (x+p)(x+q)$.

**근의 공식**: $ax^2 + bx + c = 0$의 해 = $\\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$.`,
    worked: {
      intro: '$2x^2 - 5x - 3 = 0$의 해 (근의 공식).',
      steps: [
        { math: '$a=2, b=-5, c=-3$', narration: '계수 확인.' },
        { math: '판별식 $b^2 - 4ac = 25 + 24 = 49$', narration: '제곱수 → 유리수 해.' },
        { math: '$x = \\frac{5 \\pm 7}{4} = 3 \\text{ 또는 } -\\frac{1}{2}$', narration: '근의 공식 대입.' },
      ],
    },
    misconception: {
      wrong: '$(x - 3)^2 = x^2 - 9$',
      why: '$(a-b)^2$ 공식을 합·차 공식과 혼동.',
      correct: '$(x - 3)^2 = x^2 - 6x + 9$. 교차항 $-6x$ 빠뜨리지 말기.',
    },
    retrieval: {
      prompt: '$x^2 - 4x - 5 = 0$의 두 해?',
      accept: ['5,-1', '-1,5', '5 -1', '5, -1'],
      explain: '$(x-5)(x+1) = 0 \\Rightarrow x = 5, -1$.',
    },
  },

  'K-G9-MATH3-CH03-QUAD-FN': {
    hook: '농구공 던지는 궤적 — 위로 갔다가 내려오는 곡선의 정체는? 이차함수 그래프, 포물선.',
    concrete: '$y = x^2 - 4x + 3 = (x-2)^2 - 1$. 꼭짓점 $(2, -1)$, 최솟값 $-1$.',
    pictorial: '포물선: 꼭짓점 중심으로 좌우 대칭. $a > 0$이면 아래로 볼록 (최솟값 존재). $a < 0$이면 위로 볼록 (최댓값).',
    abstract: `**이차함수** $y = ax^2 + bx + c = a(x - p)^2 + q$. 꼭짓점 $(p, q)$, 대칭축 $x = p$.

**변환**: $y = x^2$ → 평행이동·확대로 모든 포물선 도출. 최댓값·최솟값 = 꼭짓점의 $y$좌표.`,
    worked: {
      intro: '$y = -2x^2 + 8x - 3$의 최댓값.',
      steps: [
        { math: '$y = -2(x^2 - 4x) - 3 = -2(x-2)^2 + 8 - 3$', narration: '완전제곱 변환.' },
        { math: '$y = -2(x-2)^2 + 5$', narration: '꼭짓점식.' },
        { math: '꼭짓점 $(2, 5)$, $a < 0$이므로 최댓값 = 5', narration: '$x = 2$일 때.' },
      ],
    },
    misconception: {
      wrong: '$y = ax^2 + bx + c$의 꼭짓점은 $(0, c)$다.',
      why: '$y$절편과 꼭짓점을 혼동.',
      correct: '꼭짓점 $x$좌표 = $-\\frac{b}{2a}$. $(0, c)$는 $y$절편 (그래프와 $y$축이 만나는 점).',
    },
    retrieval: {
      prompt: '$y = (x-3)^2 + 2$의 꼭짓점?',
      accept: ['(3,2)', '3,2', '(3, 2)'],
      explain: '꼭짓점식 $a(x-p)^2 + q$에서 $(p, q) = (3, 2)$.',
    },
  },

  'K-G9-MATH3-CH04-TRIG-RATIO': {
    hook: '나무의 높이를 자 없이 어떻게 잴까? 그림자 길이와 태양 각도 — 삼각비.',
    concrete: '직각삼각형의 한 예각 $30°$에서 $\\sin 30° = \\frac{1}{2}$, $\\cos 30° = \\frac{\\sqrt{3}}{2}$, $\\tan 30° = \\frac{\\sqrt{3}}{3}$.',
    pictorial: '직각삼각형, 한 예각 $\\theta$. $\\sin\\theta = \\frac{\\text{대변}}{\\text{빗변}}$, $\\cos\\theta = \\frac{\\text{인접변}}{\\text{빗변}}$, $\\tan\\theta = \\frac{\\text{대변}}{\\text{인접변}}$.',
    abstract: `특수각: $\\sin 45° = \\cos 45° = \\frac{\\sqrt{2}}{2}$, $\\sin 60° = \\cos 30° = \\frac{\\sqrt{3}}{2}$.

**항등식**: $\\sin^2\\theta + \\cos^2\\theta = 1$, $\\tan\\theta = \\frac{\\sin\\theta}{\\cos\\theta}$.

**측량 활용**: 거리·높이 계산.`,
    worked: {
      intro: '$\\sin\\theta = \\frac{3}{5}$이고 $\\theta$가 예각일 때 $\\cos\\theta$와 $\\tan\\theta$.',
      steps: [
        { math: '$\\cos^2\\theta = 1 - \\frac{9}{25} = \\frac{16}{25}$', narration: '항등식.' },
        { math: '$\\cos\\theta = \\frac{4}{5}$', narration: '예각이므로 양수.' },
        { math: '$\\tan\\theta = \\frac{3/5}{4/5} = \\frac{3}{4}$', narration: '정의.' },
      ],
    },
    misconception: {
      wrong: '$\\sin(A + B) = \\sin A + \\sin B$',
      why: '함수에 분배법칙을 적용.',
      correct: '$\\sin(A+B) = \\sin A \\cos B + \\cos A \\sin B$. 일반적으로 $\\sin(A+B) \\neq \\sin A + \\sin B$.',
    },
    retrieval: {
      prompt: '$\\tan 45°$의 값?',
      accept: ['1'],
      explain: '$45°$에서 $\\sin = \\cos = \\frac{\\sqrt{2}}{2}$, 비율 1.',
    },
  },

  'K-G9-MATH3-CH05-CIRCLES': {
    hook: '시계 12시 방향과 3시 방향 사이의 중심각은 $90°$. 같은 시간에 시계 가장자리(원주)에서 본 각은?',
    concrete: '한 호에 대한 원주각은 중심각의 절반. 중심각 $80°$ → 원주각 $40°$. 같은 호의 원주각은 모두 같다.',
    pictorial: '원 그림에서 중심 $O$, 호 $AB$, 점 $P$가 원주 위. $\\angle APB = \\frac{1}{2} \\angle AOB$.',
    abstract: `**원주각 정리**: 같은 호에 대한 원주각 = 중심각의 $\\frac{1}{2}$.

**접선의 성질**: 접선 ⊥ 반지름.

**현의 수직이등분**: 원의 중심을 지난다.

**접선과 현이 이루는 각** = 그 현에 대한 원주각.`,
    worked: {
      intro: '원 $O$ 위 두 점 $A, B$에 대한 중심각이 $120°$일 때 원주각.',
      steps: [
        { math: '원주각 $= \\frac{1}{2} \\times 120°$', narration: '원주각 정리.' },
        { math: '$= 60°$', narration: '계산.' },
      ],
    },
    misconception: {
      wrong: '원주각 = 중심각 × 2.',
      why: '관계를 거꾸로 외움.',
      correct: '원주각 = 중심각 $\\times \\frac{1}{2}$. 항상 원주각이 더 작다.',
    },
    retrieval: {
      prompt: '한 호에 대한 중심각이 $140°$일 때 원주각?',
      accept: ['70', '70도', '70°'],
      explain: '$140° \\div 2 = 70°$.',
    },
  },

  'K-G9-MATH3-CH06-STATISTICS': {
    hook: '평균이 같은 두 반의 성적, 한 반은 모두 비슷, 다른 반은 들쭉날쭉. 평균만으론 못 구분 — 분산이 필요.',
    concrete: '자료 [4, 6, 8]: 평균 6, 편차 $(-2, 0, 2)$, 분산 $\\frac{4+0+4}{3} = \\frac{8}{3}$, 표준편차 $\\sqrt{8/3}$.',
    pictorial: '두 자료의 도수분포 곡선 — 종 모양. 분산 작으면 좁고 뾰족, 분산 크면 넓고 평평.',
    abstract: `**대푯값**: 평균, 중앙값, 최빈값.

**편차** $x_i - \\bar{x}$.

**분산** $V = \\frac{1}{n}\\sum (x_i - \\bar{x})^2$ (편차의 제곱평균).

**표준편차** $\\sigma = \\sqrt{V}$. 분산·표준편차가 클수록 자료가 평균에서 흩어져 있음.`,
    worked: {
      intro: '자료 [2, 4, 6, 8]의 평균과 분산.',
      steps: [
        { math: '평균 $= \\frac{2+4+6+8}{4} = 5$', narration: '합/개수.' },
        { math: '편차 $= -3, -1, 1, 3$', narration: '$x_i - 5$.' },
        { math: '분산 $= \\frac{9+1+1+9}{4} = 5$', narration: '편차 제곱 평균.' },
      ],
    },
    misconception: {
      wrong: '편차의 평균 = 자료의 흩어짐 정도.',
      why: '제곱을 빠뜨림.',
      correct: '편차의 평균은 항상 0 (양·음 상쇄). 흩어짐은 **편차 제곱의 평균** = 분산.',
    },
    retrieval: {
      prompt: '자료 [3, 3, 3]의 표준편차?',
      accept: ['0'],
      explain: '모두 같으면 평균과의 차이 0, 분산 0, 표준편차 0.',
    },
  },
};
