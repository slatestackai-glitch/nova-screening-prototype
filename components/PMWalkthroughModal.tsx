'use client';

import React, { useState } from 'react';
import { X, CheckCircle2, AlertTriangle, ArrowRight, Lightbulb, ShieldCheck, Target, Layers } from 'lucide-react';

interface PMWalkthroughModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PMWalkthroughModal: React.FC<PMWalkthroughModalProps> = ({
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'script' | 'defense' | 'causality'>('script');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
      <div 
        className="w-full max-w-3xl bg-[#0d1322] border border-slate-700 rounded-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-[#0e1628] flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-white">PM Evaluation Guide & Defense Notes</h2>
              <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-900 text-indigo-300 font-mono uppercase">
                PM Test Cheat Sheet
              </span>
            </div>
            <p className="text-xs text-slate-400">Spec Parts C & D: 5-minute evaluation pitch script and architectural justifications</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-900/60 px-6">
          <button
            onClick={() => setActiveTab('script')}
            className={`py-2.5 px-4 text-xs font-medium border-b-2 transition-colors ${
              activeTab === 'script'
                ? 'border-indigo-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            5-Minute Pitch Script (Part C)
          </button>
          <button
            onClick={() => setActiveTab('defense')}
            className={`py-2.5 px-4 text-xs font-medium border-b-2 transition-colors ${
              activeTab === 'defense'
                ? 'border-indigo-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Interview Q&A Defense (Part D)
          </button>
          <button
            onClick={() => setActiveTab('causality')}
            className={`py-2.5 px-4 text-xs font-medium border-b-2 transition-colors ${
              activeTab === 'causality'
                ? 'border-indigo-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Core Causal Thesis
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 text-sm text-slate-300">
          {activeTab === 'script' && (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-indigo-950/40 border border-indigo-800/40">
                <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-1">Timing & Pitch Flow</h4>
                <p className="text-xs text-indigo-200/80">Follow this exact sequence during your interview to maximize rubric score.</p>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-emerald-400">1. Core Thesis (15s)</span>
                    <span className="text-[10px] font-mono bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">0:00 – 0:15</span>
                  </div>
                  <p className="text-xs text-slate-300 italic">
                    &quot;The 12 customer complaints collapse into one causal chain: Nova doesn&apos;t probe, so it never collects evidence, so every score defaults to medium. The scoring complaint and the conversation complaint are the same bug.&quot;
                  </p>
                </div>

                <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-indigo-400">2. Opening & AI Consent (30s)</span>
                    <span className="text-[10px] font-mono bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">0:15 – 0:45</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Start an Engineering screen. Point out that consent lands on its own turn, with explicit AI disclosure in the first two sentences without softening language.
                  </p>
                </div>

                <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-amber-400">3. Vague Probe & Confidence Shift (90s)</span>
                    <span className="text-[10px] font-mono bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">0:45 – 2:15</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Give a deliberately vague answer (&quot;we improved the pipeline&quot;). Show Nova probing on ownership. Show the probe chip <code className="text-amber-300 bg-amber-950 px-1 py-0.5 rounded text-[11px]">↳ probed: unowned claim</code> render. Then give a concrete answer and watch the ledger populate and confidence move off <code className="text-amber-300 bg-amber-950 px-1 py-0.5 rounded text-[11px]">insufficient_evidence</code>.
                  </p>
                </div>

                <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-sky-400">4. Fact Sheet QA & Omission (45s)</span>
                    <span className="text-[10px] font-mono bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">2:15 – 3:00</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Ask &quot;what&apos;s the salary range?&quot; — show it answering 38–52 LPA from the fact sheet, then bridging back. Ask &quot;who&apos;s the manager?&quot; — show the &quot;I don&apos;t have that, Priya will&quot; delegation path.
                  </p>
                </div>

                <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-purple-400">5. Frontline Register Shift (45s)</span>
                    <span className="text-[10px] font-mono bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">3:00 – 3:45</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Reset, switch to Frontline, replay the opening line. Same underlying probe logic, audibly different register (warm, lower stakes, conversational).
                  </p>
                </div>

                <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-emerald-400">6. Conclusion & Landing (30s)</span>
                    <span className="text-[10px] font-mono bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">3:45 – 4:15</span>
                  </div>
                  <p className="text-xs text-slate-300 italic">
                    &quot;Calibration is the #1 priority and I deliberately didn&apos;t build it — it needs labeled outcomes, not a prompt. What I built is the engine that generates those labels.&quot;
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'defense' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800">
                <h4 className="text-xs font-semibold text-indigo-400 mb-1">Why this fix over Score Calibration?</h4>
                <p className="text-xs text-slate-300">
                  It&apos;s the upstream cause of the highest-priority problem. Fixing listening improves scoring as a byproduct; fixing scoring without fixing listening just re-weights noise.
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800">
                <h4 className="text-xs font-semibold text-indigo-400 mb-1">What did you deliberately leave out of the prompt?</h4>
                <p className="text-xs text-slate-300">
                  1. Any scoring rubric tied to role seniority (requires historical calibration data).<br />
                  2. Any sentiment analysis (unreliable from transcript, and recruiters shouldn&apos;t act on it).<br />
                  3. Any auto-reject logic (a first phone screen should NEVER be terminal without human oversight).
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800">
                <h4 className="text-xs font-semibold text-indigo-400 mb-1">What would you build next in Phase 2?</h4>
                <p className="text-xs text-slate-300">
                  1. Fact-sheet self-serve onboarding flow for hiring managers.<br />
                  2. Offline transcript replay against past screens to start training and calibrating human-recruiter baseline scores.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'causality' && (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">The Causal Chain Breakdown</h4>
                
                <div className="flex flex-col gap-2 text-xs">
                  <div className="p-2.5 rounded bg-rose-950/40 border border-rose-900/40 text-rose-300">
                    <strong>Old Bug:</strong> Nova accepts vague answers (&quot;we improved speed&quot;) without follow-up.
                  </div>
                  <div className="flex justify-center text-slate-500">↓</div>
                  <div className="p-2.5 rounded bg-rose-950/40 border border-rose-900/40 text-rose-300">
                    <strong>Consequence:</strong> No concrete quotes or personal claims exist in transcript.
                  </div>
                  <div className="flex justify-center text-slate-500">↓</div>
                  <div className="p-2.5 rounded bg-amber-950/40 border border-amber-900/40 text-amber-300">
                    <strong>Scoring Failure:</strong> LLM defaults all candidates to &quot;medium&quot; because evidence is missing.
                  </div>
                  <div className="flex justify-center text-slate-500">↓</div>
                  <div className="p-2.5 rounded bg-emerald-950/40 border border-emerald-900/40 text-emerald-300">
                    <strong>Nova Fix:</strong> Adaptive probe engine forces concrete evidence ledger → makes <code className="bg-slate-900 px-1 py-0.5 rounded text-amber-300">insufficient_evidence</code> distinct from <code className="bg-slate-900 px-1 py-0.5 rounded text-indigo-300">medium</code>!
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-[#0e1628] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-medium transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
