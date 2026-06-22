# ❓ Quiz Game

A timed multiple-choice quiz. Pick a category and a length, answer before the clock runs out, and get a score at the end. A Python script holds the question bank, shuffles each question's options at build time, and writes it to `data.json` — so the app is fully static and the answer key never ships in an obvious order.

![Python](https://img.shields.io/badge/Python-3776AB?logo=python&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-vanilla-F7DF1E?logo=javascript&logoColor=black)
![License](https://img.shields.io/badge/license-MIT-ff7a18)

> **Play it live:** https://evelinvee.github.io/quiz-game/ — choose a category, beat the timer, and see how you score.

---

## ✨ Features

- **40 questions** across 5 categories — Geography, Science, History, Math and Arts
- **Per-question timer** with a countdown bar; running out counts as a miss
- **Instant feedback** — the correct answer turns green, a wrong pick turns red
- **Choose category and length** (5, 10, or all questions)
- **Score screen** with a rating message based on your percentage
- **Shuffled options** every build, plus a fresh question order each round
- Clean, responsive single-card UI — no dependencies

## ▶️ Run it

Rebuild the question bank (optional — `data.json` is committed):

```bash
python build_questions.py
```

Serve the folder and open it:

```bash
python -m http.server 8000
# http://localhost:8000
```

## 🗂️ Structure

```
build_questions.py   # question bank -> shuffled data.json
data.json            # categories + questions + answer key
index.html           # start / quiz / result screens
style.css            # styling
app.js               # quiz flow, timer and scoring
requirements.txt
LICENSE
```

## 🛠️ Tech

Python (standard library) · vanilla JavaScript · HTML · CSS. The question bank is generated and
shuffled in Python; the quiz runs entirely in the browser.

## 📄 License

MIT © [evelinvee](https://github.com/evelinvee)
