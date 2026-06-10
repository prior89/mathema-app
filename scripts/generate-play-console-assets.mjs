import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const outDir = path.join(root, 'store-assets', 'play-console');
const screenshotsDir = path.join(outDir, 'phone-screenshots');

const shortDescription = 'NCERT maths practice with AI help, mocks, and smart wrong-note review.';

const longDescription = `matheo helps students build stronger mathematics habits from Class 7 to Class 12 with structured lessons, adaptive practice, mock exams, an AI maths helper, and automatic wrong-note review.

Learn by chapter
Follow an NCERT-aligned lesson path that breaks each topic into clear concept steps, worked examples, common mistakes, and guided practice. Each chapter is designed to move from understanding to recall, then into independent problem solving.

Practise what matters
After a chapter is unlocked, matheo recommends practice from the areas that need attention. You can solve one problem at a time, use a handwriting pad for working, and get immediate feedback after each answer.

Review mistakes automatically
Wrong answers are saved into your Notes tab, grouped by error pattern, and queued for later review. The review flow helps you revisit mistakes after a cooldown instead of repeating them immediately and forgetting them again.

Prepare with mock exams
Use mini tests, wrong-note redo sessions, and broader mock-style practice to check readiness. Results show score trends, accuracy, and areas to improve next.

Use AI when stuck
Upload a photo or PDF of a maths problem. matheo extracts the question, solves it step by step, and lets you practise the problem again later.

Built for focused study
matheo tracks study activity, accuracy, chapter progress, mastery, and repeated error patterns so every session has a clear next step.

Privacy and control
Students can manage consent settings, request account deletion, and review privacy information from inside the app. Parent and teacher roles are available for supported learning environments.

Spend your study time on the problems that actually matter.`;

const screenshotSpecs = [
  {
    file: '01-home-plan.png',
    title: 'Today, clearly planned',
    subtitle: 'Chapter progress, weak spots, and next steps in one place',
    screen: 'Home',
    blocks: [
      { type: 'hero', label: 'Good evening, Aarav', value: 'Ready for a 20 minute focus session?' },
      { type: 'plan', label: 'Today\'s plan', items: ['Fractions and decimals', 'Review sign-handling slips', 'Mini practice set'] },
      { type: 'bars', label: 'Where you slip', items: [['Calculation', 72], ['Concept application', 48], ['Logic flow', 32]] },
      { type: 'progress', label: 'Chapter progress', items: [['Linear Equations', 65], ['Rational Numbers', 100]] },
    ],
  },
  {
    file: '02-learn-chapters.png',
    title: 'Learn by chapter',
    subtitle: 'Structured NCERT lessons from Class 7 to Class 12',
    screen: 'Learn',
    blocks: [
      { type: 'chips', label: 'Class', items: ['7', '8', '9', '10', '11', '12'] },
      { type: 'lesson', label: 'Class 10', items: ['Real Numbers', 'Polynomials', 'Pair of Linear Equations', 'Quadratic Equations'] },
      { type: 'note', label: 'Each chapter includes concept steps, examples, and practice.' },
    ],
  },
  {
    file: '03-concept-lesson.png',
    title: 'Concepts before shortcuts',
    subtitle: 'Worked examples and common mistakes before practice',
    screen: 'Lesson',
    blocks: [
      { type: 'math', label: 'Big Idea', value: 'A quadratic equation can be solved by factoring, completing the square, or the formula.' },
      { type: 'steps', label: 'Lesson flow', items: ['Hook', 'Concrete', 'Abstract', 'Worked example', 'Common mistake'] },
      { type: 'example', label: 'Worked example', value: 'x² - 5x + 6 = 0  →  (x - 2)(x - 3) = 0' },
    ],
  },
  {
    file: '04-practice.png',
    title: 'Practice one problem at a time',
    subtitle: 'Use the working pad, hints, and instant answer feedback',
    screen: 'Practice',
    blocks: [
      { type: 'question', label: 'Problem 4', value: 'If 3x + 7 = 22, what is x?' },
      { type: 'choices', label: 'Choose', items: ['3', '5', '7', '9'] },
      { type: 'canvas', label: 'Working pad' },
      { type: 'feedback', label: 'Correct', value: 'Next: a slightly harder equation.' },
    ],
  },
  {
    file: '05-wrong-notes.png',
    title: 'Mistakes become a review queue',
    subtitle: 'Wrong notes are saved, grouped, and revisited later',
    screen: 'Notes',
    blocks: [
      { type: 'stats', label: 'Wrong notes', items: [['Pending', '12'], ['Mastered', '31'], ['Due', '4']] },
      { type: 'noteCards', label: 'Recent mistakes', items: ['Formula choice slip', 'Sign-handling slip', 'Skipped condition'] },
      { type: 'review', label: 'Spaced review', value: 'Try again after the concept has settled.' },
    ],
  },
  {
    file: '06-ai-helper.png',
    title: 'AI help for textbook problems',
    subtitle: 'Upload a photo or PDF, then practise the solved problem later',
    screen: 'AI Solver',
    blocks: [
      { type: 'upload', label: 'Upload problem', value: 'Camera or PDF' },
      { type: 'solution', label: 'Step-by-step solution', items: ['Extract the maths', 'Check deterministic steps', 'Explain the reasoning'] },
      { type: 'library', label: 'Saved to practice', value: 'The problem is added to your review flow.' },
    ],
  },
];

function todayInSeoul() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const css = `
  * { box-sizing: border-box; }
  body {
    margin: 0;
    font-family: Inter, "Segoe UI", Arial, sans-serif;
    color: #142850;
    background: #f7f4ed;
  }
  .asset {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    background:
      linear-gradient(140deg, #f7f4ed 0%, #fffaf0 42%, #e9f4ef 100%);
  }
  .phone-shot {
    width: 1080px;
    height: 1920px;
    padding: 78px 76px 60px;
    display: flex;
    flex-direction: column;
    gap: 34px;
  }
  .shot-kicker {
    font-size: 26px;
    letter-spacing: .08em;
    text-transform: uppercase;
    color: #347b72;
    font-weight: 800;
  }
  .shot-title {
    font-family: Georgia, "Times New Roman", serif;
    font-size: 78px;
    line-height: .98;
    letter-spacing: 0;
    max-width: 880px;
  }
  .shot-subtitle {
    font-size: 31px;
    line-height: 1.35;
    color: #536172;
    max-width: 850px;
  }
  .phone-ui {
    flex: 1;
    border-radius: 48px;
    background: #fffdf8;
    border: 2px solid #ded6c8;
    box-shadow: 0 38px 90px rgba(20,40,80,.16);
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  .status {
    height: 58px;
    padding: 18px 34px 0;
    display: flex;
    justify-content: space-between;
    color: #142850;
    font-weight: 700;
    font-size: 20px;
  }
  .appbar {
    padding: 20px 34px 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .brand {
    font-family: Georgia, "Times New Roman", serif;
    font-size: 40px;
    font-weight: 700;
  }
  .screen-pill {
    border: 1px solid #d6cbbc;
    border-radius: 999px;
    padding: 9px 16px;
    color: #347b72;
    font-size: 18px;
    font-weight: 800;
    background: #edf7f4;
  }
  .content {
    padding: 20px 34px 30px;
    display: flex;
    flex-direction: column;
    gap: 18px;
    flex: 1;
  }
  .card {
    border: 1px solid #ded6c8;
    border-radius: 18px;
    background: #ffffff;
    padding: 24px;
  }
  .card.tint { background: #edf7f4; border-color: transparent; }
  .card.warm { background: #fff0dd; border-color: transparent; }
  .label {
    font-size: 18px;
    letter-spacing: .06em;
    text-transform: uppercase;
    color: #347b72;
    font-weight: 900;
    margin-bottom: 10px;
  }
  .value {
    font-family: Georgia, "Times New Roman", serif;
    font-size: 34px;
    line-height: 1.17;
  }
  .muted { color: #536172; font-size: 23px; line-height: 1.45; }
  .row { display: flex; align-items: center; justify-content: space-between; gap: 16px; }
  .list { display: grid; gap: 12px; }
  .item {
    min-height: 54px;
    padding: 14px 16px;
    border-radius: 14px;
    background: #f6f2e9;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
    font-size: 23px;
    font-weight: 700;
  }
  .tag {
    background: #347b72;
    color: white;
    padding: 8px 12px;
    border-radius: 999px;
    font-size: 16px;
    white-space: nowrap;
  }
  .bar {
    height: 14px;
    border-radius: 7px;
    background: #ece5da;
    overflow: hidden;
    margin-top: 8px;
  }
  .fill { height: 100%; background: #347b72; border-radius: 7px; }
  .chips { display: flex; flex-wrap: wrap; gap: 10px; }
  .chip {
    min-width: 76px;
    text-align: center;
    border: 1px solid #d6cbbc;
    border-radius: 999px;
    padding: 12px 14px;
    font-size: 22px;
    font-weight: 800;
    background: #fffdf8;
  }
  .chip.active { background: #347b72; color: white; border-color: #347b72; }
  .math {
    font-family: "Cambria Math", Georgia, serif;
    font-size: 31px;
    line-height: 1.35;
  }
  .choice {
    border: 1px solid #ded6c8;
    background: #fffdf8;
    border-radius: 16px;
    padding: 18px 20px;
    font-size: 24px;
    font-weight: 800;
    display: flex;
    gap: 14px;
    align-items: center;
  }
  .letter {
    width: 36px;
    height: 36px;
    border-radius: 18px;
    background: #edf7f4;
    color: #347b72;
    display: grid;
    place-items: center;
    font-size: 18px;
  }
  .canvas {
    height: 230px;
    border: 2px dashed #cfc5b7;
    border-radius: 16px;
    background:
      linear-gradient(#f7f4ed 1px, transparent 1px),
      linear-gradient(90deg, #f7f4ed 1px, transparent 1px);
    background-size: 32px 32px;
    position: relative;
  }
  .scribble {
    position: absolute;
    inset: 52px 76px;
    border-bottom: 6px solid #347b72;
    border-left: 6px solid #347b72;
    transform: skewX(-18deg) rotate(-3deg);
    opacity: .75;
  }
  .bottom-nav {
    height: 86px;
    border-top: 1px solid #ded6c8;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    align-items: center;
    padding: 0 18px;
    font-size: 18px;
    color: #6d7684;
    background: #fffdf8;
  }
  .bottom-nav span:nth-child(2) { color: #347b72; font-weight: 900; }
  .feature {
    width: 1024px;
    height: 500px;
    padding: 44px 58px;
    display: grid;
    grid-template-columns: 1.05fr .95fr;
    gap: 42px;
    align-items: center;
    background:
      linear-gradient(130deg, #fffaf0 0%, #edf7f4 52%, #f6efe1 100%);
  }
  .feature h1 {
    font-family: Georgia, "Times New Roman", serif;
    margin: 0;
    font-size: 62px;
    line-height: 1.02;
    letter-spacing: 0;
    color: #142850;
  }
  .feature p {
    font-size: 23px;
    line-height: 1.35;
    color: #536172;
    margin: 20px 0 0;
  }
  .feature-brand {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    color: #347b72;
    font-size: 21px;
    font-weight: 900;
    letter-spacing: .08em;
    text-transform: uppercase;
    margin-bottom: 18px;
  }
  .mini-stack {
    display: grid;
    gap: 14px;
  }
  .mini-card {
    background: rgba(255,255,255,.86);
    border: 1px solid #ded6c8;
    border-radius: 18px;
    padding: 20px 22px;
    box-shadow: 0 18px 44px rgba(20,40,80,.10);
  }
  .mini-card strong { display: block; color: #142850; font-size: 22px; }
  .mini-card span { display: block; margin-top: 6px; color: #536172; font-size: 17px; line-height: 1.32; }
`;

function renderBlocks(spec) {
  return spec.blocks.map((block) => {
    if (block.type === 'hero') {
      return `<section class="card tint"><div class="label">${escapeHtml(block.label)}</div><div class="value">${escapeHtml(block.value)}</div></section>`;
    }
    if (block.type === 'plan') {
      return `<section class="card"><div class="label">${escapeHtml(block.label)}</div><div class="list">${block.items.map((item, i) => `<div class="item"><span>${escapeHtml(item)}</span><span class="tag">${i === 0 ? 'Start' : i === 1 ? 'Review' : 'Test'}</span></div>`).join('')}</div></section>`;
    }
    if (block.type === 'bars' || block.type === 'progress') {
      return `<section class="card"><div class="label">${escapeHtml(block.label)}</div><div class="list">${block.items.map(([name, pct]) => `<div><div class="row muted"><span>${escapeHtml(name)}</span><strong>${pct}%</strong></div><div class="bar"><div class="fill" style="width:${pct}%"></div></div></div>`).join('')}</div></section>`;
    }
    if (block.type === 'chips') {
      return `<section class="card warm"><div class="label">${escapeHtml(block.label)}</div><div class="chips">${block.items.map((item, i) => `<span class="chip ${i === 3 ? 'active' : ''}">${escapeHtml(item)}</span>`).join('')}</div></section>`;
    }
    if (block.type === 'lesson') {
      return `<section class="card"><div class="label">${escapeHtml(block.label)}</div><div class="list">${block.items.map((item, i) => `<div class="item"><span>${escapeHtml(item)}</span><span class="tag">CH ${i + 1}</span></div>`).join('')}</div></section>`;
    }
    if (block.type === 'note') {
      return `<section class="card tint"><div class="muted">${escapeHtml(block.label)}</div></section>`;
    }
    if (block.type === 'math' || block.type === 'example') {
      return `<section class="card ${block.type === 'math' ? 'tint' : ''}"><div class="label">${escapeHtml(block.label)}</div><div class="math">${escapeHtml(block.value)}</div></section>`;
    }
    if (block.type === 'steps') {
      return `<section class="card"><div class="label">${escapeHtml(block.label)}</div><div class="chips">${block.items.map((item, i) => `<span class="chip ${i === 2 ? 'active' : ''}">${escapeHtml(item)}</span>`).join('')}</div></section>`;
    }
    if (block.type === 'question') {
      return `<section class="card tint"><div class="label">${escapeHtml(block.label)}</div><div class="math">${escapeHtml(block.value)}</div></section>`;
    }
    if (block.type === 'choices') {
      return `<section class="card"><div class="label">${escapeHtml(block.label)}</div><div class="list">${block.items.map((item, i) => `<div class="choice"><span class="letter">${String.fromCharCode(65 + i)}</span><span>${escapeHtml(item)}</span></div>`).join('')}</div></section>`;
    }
    if (block.type === 'canvas') {
      return `<section class="card"><div class="label">${escapeHtml(block.label)}</div><div class="canvas"><div class="scribble"></div></div></section>`;
    }
    if (block.type === 'feedback') {
      return `<section class="card tint"><div class="label">${escapeHtml(block.label)}</div><div class="muted">${escapeHtml(block.value)}</div></section>`;
    }
    if (block.type === 'stats') {
      return `<section class="card tint"><div class="label">${escapeHtml(block.label)}</div><div class="row">${block.items.map(([k, v]) => `<div><div class="value">${escapeHtml(v)}</div><div class="muted">${escapeHtml(k)}</div></div>`).join('')}</div></section>`;
    }
    if (block.type === 'noteCards') {
      return `<section class="card"><div class="label">${escapeHtml(block.label)}</div><div class="list">${block.items.map((item) => `<div class="item"><span>${escapeHtml(item)}</span><span class="tag">Due</span></div>`).join('')}</div></section>`;
    }
    if (block.type === 'review' || block.type === 'upload' || block.type === 'library') {
      return `<section class="card ${block.type === 'upload' ? 'warm' : 'tint'}"><div class="label">${escapeHtml(block.label)}</div><div class="value">${escapeHtml(block.value)}</div></section>`;
    }
    if (block.type === 'solution') {
      return `<section class="card"><div class="label">${escapeHtml(block.label)}</div><div class="list">${block.items.map((item, i) => `<div class="item"><span>${escapeHtml(item)}</span><span class="tag">${i + 1}</span></div>`).join('')}</div></section>`;
    }
    return '';
  }).join('');
}

function screenshotHtml(spec) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body><main class="asset phone-shot">
    <div class="shot-kicker">matheo</div>
    <div class="shot-title">${escapeHtml(spec.title)}</div>
    <div class="shot-subtitle">${escapeHtml(spec.subtitle)}</div>
    <div class="phone-ui">
      <div class="status"><span>9:41</span><span>100%</span></div>
      <div class="appbar"><div class="brand">matheo</div><div class="screen-pill">${escapeHtml(spec.screen)}</div></div>
      <div class="content">${renderBlocks(spec)}</div>
      <nav class="bottom-nav"><span>Home</span><span>Learn</span><span>Study</span><span>Notes</span><span>Me</span></nav>
    </div>
  </main></body></html>`;
}

function featureHtml() {
  return `<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body><main class="asset feature">
    <section>
      <div class="feature-brand">matheo · NCERT maths</div>
      <h1>Study the problems that matter next</h1>
      <p>Concept lessons, adaptive practice, mock exams, AI solving help, and automatic wrong-note review for Class 7-12.</p>
    </section>
    <section class="mini-stack">
      <div class="mini-card"><strong>Chapter mastery</strong><span>Learn concepts, then unlock targeted practice.</span></div>
      <div class="mini-card"><strong>Smart wrong notes</strong><span>Mistakes become a timed review queue.</span></div>
      <div class="mini-card"><strong>AI maths helper</strong><span>Upload a photo or PDF and practise it later.</span></div>
    </section>
  </main></body></html>`;
}

async function writeAndCapture(browser, html, file, viewport) {
  const tmp = path.join(outDir, `.tmp-${path.basename(file)}.html`);
  await fs.writeFile(tmp, html, 'utf8');
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
  await page.goto(`file://${tmp.replace(/\\/g, '/')}`);
  await page.screenshot({ path: file, type: 'png' });
  await page.close();
  await fs.rm(tmp, { force: true });
}

async function main() {
  await fs.mkdir(screenshotsDir, { recursive: true });
  await fs.copyFile(
    path.join(root, 'store-assets', 'matheo-icon-512.png'),
    path.join(outDir, 'app-icon-512.png'),
  );

  const browser = await chromium.launch();
  await writeAndCapture(
    browser,
    featureHtml(),
    path.join(outDir, 'feature-graphic-1024x500.png'),
    { width: 1024, height: 500 },
  );
  for (const spec of screenshotSpecs) {
    await writeAndCapture(
      browser,
      screenshotHtml(spec),
      path.join(screenshotsDir, spec.file),
      { width: 1080, height: 1920 },
    );
  }
  await browser.close();

  const listing = `# Google Play Console Listing Assets

Generated: ${todayInSeoul()}

## Image assets

- App icon: \`store-assets/play-console/app-icon-512.png\` (512 x 512 PNG)
- Feature graphic: \`store-assets/play-console/feature-graphic-1024x500.png\` (1024 x 500 PNG)
- Phone screenshots:
${screenshotSpecs.map((s) => `  - \`store-assets/play-console/phone-screenshots/${s.file}\` (1080 x 1920 PNG)`).join('\n')}

## Short description

${shortDescription}

Character count: ${shortDescription.length} / 80

## Full description

${longDescription}

Character count: ${longDescription.length} / 4000
`;
  await fs.writeFile(path.join(outDir, 'PLAY_CONSOLE_LISTING.md'), listing, 'utf8');
  console.log(`Play Console assets written to ${outDir}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
