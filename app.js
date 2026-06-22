/* Quiz Game — loads data.json (question bank built by build_questions.py),
   runs a timed multiple-choice quiz, and shows a score at the end.
   Pure vanilla JS, fully static. */

const $ = id => document.getElementById(id);
const SHAPES = ["▲", "◆", "●", "■"];
const PER_QUESTION = 15;          // seconds per question

let DATA = null;
let quiz = [];                    // current run's questions
let idx = 0, score = 0, locked = false;
let timer = null, timeLeft = 0;

const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const show = id => {
  ["start", "quiz", "result"].forEach(s => $(s).classList.toggle("hidden", s !== id));
  $("app").classList.toggle("playing", id === "quiz");
};

function buildDots(n) {
  $("dots").innerHTML = Array.from({ length: n }, () => "<i></i>").join("");
}
function updateDots() {
  const dots = [...document.querySelectorAll("#dots i")];
  dots.forEach((d, i) => { if (i === idx) d.classList.add("now"); else d.classList.remove("now"); });
}

function startQuiz() {
  const cat = $("category").value;
  const amount = +$("amount").value;
  let pool = DATA.questions.filter(q => cat === "All" || q.category === cat);
  pool = shuffle(pool.slice());
  quiz = amount > 0 ? pool.slice(0, amount) : pool;
  idx = 0; score = 0;
  $("qTotal").textContent = quiz.length;
  buildDots(quiz.length);
  show("quiz");
  renderQuestion();
}

function renderQuestion() {
  locked = false;
  const q = quiz[idx];
  $("qCat").textContent = q.category;
  $("qNum").textContent = idx + 1;
  $("qScore").textContent = score;
  updateDots();
  $("qText").textContent = q.q;

  const box = $("options");
  box.innerHTML = "";
  box.classList.remove("revealed");
  q.options.forEach((opt, i) => {
    const b = document.createElement("button");
    b.className = "opt";
    b.innerHTML = `<span class="num">${i + 1}</span><span class="label">${opt}</span><span class="mark"></span>`;
    b.addEventListener("click", () => answer(i, b));
    box.appendChild(b);
  });

  startTimer();
}

function startTimer() {
  clearInterval(timer);
  timeLeft = PER_QUESTION;
  $("timerFill").style.width = "100%";
  timer = setInterval(() => {
    timeLeft -= 0.1;
    $("timerFill").style.width = Math.max(0, (timeLeft / PER_QUESTION) * 100) + "%";
    if (timeLeft <= 0) { clearInterval(timer); answer(-1, null); }
  }, 100);
}

function answer(choice, btn) {
  if (locked) return;
  locked = true;
  clearInterval(timer);
  const q = quiz[idx];
  const opts = [...document.querySelectorAll(".opt")];
  opts.forEach(o => o.disabled = true);
  $("options").classList.add("revealed");

  opts[q.answer].classList.add("correct");
  opts[q.answer].querySelector(".mark").textContent = "✓";
  const dot = document.querySelectorAll("#dots i")[idx];
  if (choice === q.answer) { score++; $("qScore").textContent = score; if (dot) dot.classList.add("ok"); }
  else { if (btn) { btn.classList.add("wrong"); btn.querySelector(".mark").textContent = "✗"; } if (dot) dot.classList.add("no"); }

  setTimeout(() => {
    idx++;
    if (idx < quiz.length) renderQuestion();
    else finish();
  }, choice === q.answer ? 750 : 1300);
}

function finish() {
  show("result");
  const total = quiz.length;
  const pct = Math.round(score / total * 100);
  $("rScore").textContent = `${score} / ${total}`;
  const svg = p => `<svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
  const ICON = {
    trophy: svg('<path d="M8 21h8M12 17v4M6 4h12v5a6 6 0 0 1-12 0V4z"/><path d="M18 5h3v2a3 3 0 0 1-3 3M6 5H3v2a3 3 0 0 0 3 3"/>'),
    star: svg('<path d="M12 3.5l2.6 5.3 5.9.9-4.2 4.1 1 5.8L12 17l-5.3 2.6 1-5.8L3.5 9.7l5.9-.9z"/>'),
    thumb: svg('<path d="M7 11v9H4a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1h3zM7 11l4-7a2 2 0 0 1 2 2v3h5a2 2 0 0 1 2 2.3l-1.2 6A2 2 0 0 1 17 20H7"/>'),
    redo: svg('<path d="M21 12a9 9 0 1 1-3-6.7M21 4v5h-5"/>'),
  };
  let icon, title, line;
  if (pct === 100) { icon = ICON.trophy; title = "Perfect!"; line = "Flawless — every answer correct."; }
  else if (pct >= 70) { icon = ICON.star; title = "Great job!"; line = `You scored ${pct}%. Sharp work.`; }
  else if (pct >= 40) { icon = ICON.thumb; title = "Not bad!"; line = `You scored ${pct}%. A little more practice and you've got this.`; }
  else { icon = ICON.redo; title = "Keep going!"; line = `You scored ${pct}%. Try another round.`; }
  $("rEmoji").innerHTML = icon;
  $("rTitle").textContent = title;
  $("rLine").textContent = line;
}

async function init() {
  DATA = await (await fetch("data.json")).json();
  const sel = $("category");
  ["All", ...DATA.categories].forEach(c => {
    const o = document.createElement("option"); o.value = c; o.textContent = c; sel.appendChild(o);
  });
  $("startBtn").addEventListener("click", startQuiz);
  $("againBtn").addEventListener("click", () => show("start"));
  show("start");
}

init();
