# Nova — Adaptive Screening Prototype

> **Enterprise-Ready AI Voice Recruiter & Live Recruiter Console**
> Built with Next.js (App Router), TypeScript, Tailwind CSS, and Google Gemini.

---

## 🎯 What this Solves (PM Evaluation Thesis)

The 12 customer complaints collapse into **one causal chain**:
> **Nova doesn't probe** $\rightarrow$ **it never collects evidence** $\rightarrow$ **every score defaults to medium.**
> The scoring complaint and the conversation complaint are the same bug.

This prototype attacks the upstream cause of bad scores by equipping Nova with an **adaptive probe engine** that surfaces verifiable claims and extracts a structured **evidence ledger** in real-time, making `insufficient_evidence` visibly and functionally distinct from `medium`.

---

## 🚀 Key Features

1. **Verbatim System Prompt (`lib/systemPrompt.ts`)**:
   - Injects the graded Part A specification verbatim with dynamic template interpolation (`{{ROLE_TYPE}}`, `{{ROLE_TITLE}}`, `{{COMPANY}}`, `{{FACT_SHEET}}`).
2. **Deterministic State Delimiter Extraction (`lib/parseState.ts`)**:
   - Extracts and parses `<<<NOVA_STATE ... NOVA_STATE>>>` telemetry via delimiter splitting (no regex), with fallback persistence so the console never blanks mid-screen.
3. **Adaptive Probe Engine & Chips**:
   - Silently classifies candidate answers (`concrete`, `vague`, `claimed_but_unowned`, `opening`).
   - Automatically renders inline probe chips (e.g. `↳ probed: unowned claim`) above Nova's follow-up turns.
4. **Clean Enterprise Recruiter Console (`components/RecruiterConsole.tsx`)**:
   - **Confidence Tier**: Bold tier label with distinct amber warning stripes and border for `insufficient_evidence` vs `medium`.
   - **Evidence Ledger**: Specificity badges (`concrete` / `partial` / `thin`) with monospace verbatim quotes.
   - **Coverage Matrix**: Real-time hit vs missed competency matrix.
   - **Recruiter Action Items**: Open questions delegated to Priya/Arjun and candidate flags.
5. **Interactive 60-Second Auto-Demo Tour (`components/AutoDemoTour.tsx`)**:
   - 1-click automated walkthrough that steps through the entire 5-minute PM test evaluation script with progress bar, director notes, and speed controls.
6. **Zero Client-Side Key Exposure**:
   - Server-side route handler (`/api/screen`) powered by Google Gemini (`GEMINI_API_KEY`), with fallback and local simulation support.

---

## 🛠️ Quick Start (Local Setup)

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment (Optional for Live Gemini AI)
Create a `.env.local` file in the root directory:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```
*(Note: If no API key is provided, the prototype automatically runs in high-fidelity Enterprise Simulation Mode for instant local testing!)*

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ☁️ Deploy to Vercel

1. Push this repository to GitHub.
2. Import the repository into your **Vercel Dashboard**.
3. Under **Environment Variables**, add:
   - `GEMINI_API_KEY`: Your Google Gemini API Key.
4. Click **Deploy**.

---

## ⏱️ 5-Minute PM Evaluation Pitch Guide

| Timing | Phase | What to Demo / Say |
|---|---|---|
| **0:00 – 0:15 (15s)** | **Core Thesis** | *"The 12 items collapse into one causal chain: Nova doesn't probe, so it never collects evidence, so every score defaults to medium."* |
| **0:15 – 0:45 (30s)** | **Opening Turn** | Start Engineering screen. Highlight explicit AI disclosure in Turn 1 without softening language. |
| **0:45 – 2:15 (90s)** | **Vague Probe & Chip** | Answer *"we improved the pipeline"*. Show Nova probe on ownership (`↳ probed: unowned claim`). Then give concrete metric answer; watch ledger populate and confidence jump off `insufficient_evidence`. |
| **2:15 – 3:00 (45s)** | **Fact Sheet QA** | Ask *"what's the salary range?"* (answers 38–52 LPA). Ask *"who's the manager?"* (shows Priya delegation path). |
| **3:00 – 3:45 (45s)** | **Frontline Register** | Switch role to Frontline Math Tutor. Replay opening to show the warm, conversational register shift. |
| **3:45 – 4:15 (30s)** | **Landing & Wrap** | *"Calibration is the #1 priority and I deliberately didn't build it — it needs labeled outcomes, not a prompt. What I built is the engine that generates those labels."* |
