# ExamPilot — CBSE Class 10 Exam Clarity Engine (v1.0)

> **Production-Ready MVP designed specifically for CBSE Class 10 students preparing for board exams.**  
> *Not another generic notes app, superficial AI chatbot, or static question-bank website.*

---

## 🎯 The Core Problem: Exam Clarity

Class 10 students frequently know a chapter conceptually, yet lose 10–25 marks in board exams because they:
1. **Misinterpret unfamiliar questions** (cannot connect real-world scenarios or applied contexts to NCERT principles).
2. **Choose the wrong concept or formula** (e.g. confusing mirror formula with lens formula, or mixing up sign conventions).
3. **Fail step-by-step derivation** (jumping straight to an answer and forfeiting official CBSE step marking points).
4. **Mismanage time** (spending 12 minutes on a 3-mark question, causing unattempted Section E case studies).
5. **Fail CBSE answer writing expectations** (omitting SI units, missing "Given / To Prove", writing dense paragraphs instead of point-wise keywords, or leaving out theorem citations like BPT).

**ExamPilot systematically solves this by enforcing an adaptive 6-step thinking engine, 6-dimensional chapter tracking, automatic mistake taxonomy, and an authentic timed CBSE exam simulator.**

---

## 🏛️ Official CBSE 2026–27 Scheme of Studies Compliance

ExamPilot is designed around the official **CBSE Class X Curriculum & Sample Question Paper Blueprints (2026–27)**.

### Configurable Subject Architecture
Students can customize their exact 5–6 subject combination via the **Profile** screen:
- **Language 1**: English Language & Literature (`Code 184`), English Communicative (`Code 101`), Hindi Course A (`Code 002`), Hindi Course B (`Code 085`)
- **Language 2**: Hindi Course A (`002`), Hindi Course B (`085`), Sanskrit (`122`), French (`018`), English Language & Literature (`184`), or None
- **Mathematics**: Standard (`Code 041`) or Basic (`Code 241`)
- **Science**: Physics, Chemistry, Biology (`Code 086`)
- **Social Science**: History, Geography, Political Science, Economics (`Code 087`)
- **Optional / Skill Subject**: Information Technology (`Code 402`), Artificial Intelligence (`Code 417`), or None

### Academic Terminology & Mock Blueprint Disclaimer
All practice mocks are labeled as **"CBSE Pattern Practice Mock"** or **"Exam-Style Mock"** structured to match official 80-mark, 3-hour blueprints (Sections A to E) with 50% competency-focused questions (MCQ, Assertion-Reason, Short Answer, Long Answer, Case-Based/Integrated).

---

## 🧠 Core Intelligence Engines

### 1. 6-Dimension Readiness Engine (`readinessEngine.ts`)
Never reduces student preparation to a misleading generic percentage. Every chapter tracks:
1. `Concept Understanding`
2. `Application`
3. `Question Solving`
4. `Answer Writing`
5. `Time & Speed`
6. `Active Revision`

- Color-coded: **GREEN** = strong, **YELLOW** = needs practice, **RED** = weak.
- Dynamically calculated from live student attempt logs, question difficulties, error frequency, and time spent.

### 2. Adaptive Question Engine (`adaptiveQuestionEngine.ts`)
Selects the next question intelligently based on:
1. Repeated mistake patterns (e.g. repeated calculation errors in Electricity)
2. Weakest dimension in the chapter (Concept vs Application vs Writing)
3. Weakest question type (Case-based vs A/R vs Numerical)
4. Dynamic difficulty scaling

### 3. Mistake Intelligence Engine (`mistakeEngine.ts`)
Systematically logs and classifies errors into the 8 CBSE mistake types:
- `Concept`
- `Misread question`
- `Wrong method`
- `Calculation`
- `Missing unit`
- `Incomplete answer`
- `Poor answer structure`
- `Time issue`

Detects recurring patterns and surfaces diagnostic insights (e.g. *"Missing unit accounts for 40% of lost marks in Science"*).

### 4. Progressive Hint System & Question Deconstruction
- **Hint 1**: Identify what the question is asking
- **Hint 2**: Identify the relevant concept
- **Hint 3**: Identify the formula / method
- **Hint 4**: Give the next solving step
- **Question Deconstruction**: Breaks down attempted questions into "What was tested", "What information mattered", "What was distraction", "Common traps", and "CBSE presentation rubric".

### 5. CBSE Written Answer Rubric Evaluator (`aiEvaluatorService.ts`)
Evaluates free-response answers against 5 core CBSE rubric criteria:
1. Concept Accuracy
2. Step-by-Step Structure
3. Terminology & Keywords
4. Units & Final Statements
5. CBSE Presentation

Operates with deterministic keyword matching and offline-safe fallback heuristics.

---

## 💻 Tech Stack & Architecture

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS (Light SaaS theme, Dark Navy sidebar, Lavender/Blue accents)
- **Icons**: Lucide React
- **Celebration**: Canvas-Confetti
- **Testing**: Vitest (27 unit tests covering all core engines)
- **Linting**: Oxlint & TypeScript strict mode

```
src/
├── components/
│   ├── clarity/          # 6-step thinking engine & interactive modal
│   ├── common/           # Error boundary, empty states, modals, buttons
│   ├── dashboard/        # Hero recommendation, readiness cards, health grid
│   ├── layout/           # Dark navy sidebar & header with live countdown
│   ├── mistakes/         # Mistake book, taxonomy filter, manual & auto-logging
│   ├── practice/         # 6 question formats, adaptive practice, rubric evaluator
│   ├── profile/          # CBSE Scheme of Studies builder, countdown, backup import/export
│   ├── results/          # Diagnostic analysis, score cards, pacing analysis
│   ├── revision/         # 15-minute 3-phase micro-revision sprint
│   ├── simulator/        # Timed CBSE exam simulator (5-status question palette)
│   └── subjects/         # Enrolled subject syllabus explorer & chapter drawer
├── data/                 # Configurable subjects, chapters, questions & mock papers
├── services/             # Storage, readiness, adaptive, mistake, recommendation & AI evaluator
└── types/                # Strict TypeScript domain interfaces
```

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js 18+ or 20+
- npm 9+

### Install Dependencies
```bash
npm install
```

### Run Tests
```bash
npm test
```
*Executes all 27 unit tests covering readiness calculation, adaptive selection, mistake taxonomy, and recommendation logic.*

### Code Quality & Lint Check
```bash
npm run lint
```
*Executes fast oxlint verification with 0 errors and 0 warnings.*

### Production Build
```bash
npm run build
```
*Compiles strict TypeScript and outputs production-optimized bundle to `dist/`.*

### Preview Production Build
```bash
npm run preview
```

---

## 🔒 Local-First Persistence & Privacy

- **100% Offline Capable**: All student data, attempt histories, and mistake entries are stored in browser `localStorage`.
- **Zero Mandatory APIs**: No external paid APIs or server databases required.
- **Backup & Restore**: Full JSON state export and instant import/restore directly in the **Profile** tab.
- **Demo Mode**: Built-in toggle to switch between realistic sample student data and a clean live slate.

---

## ⚖️ Academic Disclaimer

*ExamPilot is an independent educational tool designed to help students master CBSE Class 10 exam technique and question interpretation. ExamPilot is not affiliated with, endorsed by, or sponsored by the Central Board of Secondary Education (CBSE). All practice papers are original pattern mocks aligned with CBSE curriculum guidelines.*
