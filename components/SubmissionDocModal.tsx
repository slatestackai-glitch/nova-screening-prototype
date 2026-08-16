'use client';

import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  FileText, 
  Layers, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Target, 
  ChevronRight 
} from 'lucide-react';

interface SubmissionDocModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SubmissionDocModal: React.FC<SubmissionDocModalProps> = ({
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'synthesis' | 'prioritisation' | 'build' | 'prompt'>('synthesis');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
      <div 
        className="w-full max-w-4xl bg-white border border-slate-200 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-slate-900 text-white shadow-2xs">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">Nova Take Home Exercise</h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-semibold">
                  Ajith P Nayak • 16/08/2026
                </span>
              </div>
              <p className="text-xs text-slate-500">Triage, prioritisation, and a working prototype</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-white px-6 overflow-x-auto text-xs font-medium">
          <button
            onClick={() => setActiveTab('synthesis')}
            className={`py-3 px-4 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'synthesis'
                ? 'border-slate-900 text-slate-950 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Part 1: Triage & Synthesis
          </button>
          <button
            onClick={() => setActiveTab('prioritisation')}
            className={`py-3 px-4 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'prioritisation'
                ? 'border-slate-900 text-slate-950 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Part 2: Prioritisation
          </button>
          <button
            onClick={() => setActiveTab('build')}
            className={`py-3 px-4 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'build'
                ? 'border-slate-900 text-slate-950 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Part 3: The Build & Defenses
          </button>
          <button
            onClick={() => setActiveTab('prompt')}
            className={`py-3 px-4 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'prompt'
                ? 'border-slate-900 text-slate-950 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Appendix: System Prompt
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm text-slate-700 leading-relaxed font-sans bg-slate-50/40">
          {/* TAB 1: TRIAGE & SYNTHESIS */}
          {activeTab === 'synthesis' && (
            <div className="space-y-5">
              {/* Executive Finding Callout */}
              <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-950 space-y-1.5 shadow-2xs">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800">
                  The Finding This Whole Submission Rests On
                </h4>
                <p className="text-xs leading-relaxed text-amber-900">
                  &quot;The twelve pieces of feedback look like twelve problems. They are closer to one problem seen from four angles. Nova executes a fixed question list. Because it never probes, it never collects evidence. Because it has no evidence, every confidence score defaults to the safe middle. Engineering screens suffer worst because engineering signal only appears at depth, which is exactly what a fixed list never reaches.&quot;
                </p>
              </div>

              {/* The 4 Themes */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">Part 1: Triage by Root Cause</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
                    <h4 className="text-xs font-bold text-slate-900">Theme 1. Nova recites, it does not listen</h4>
                    <span className="text-[10px] font-mono text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">Items 2, 3, 9</span>
                    <p className="text-xs text-slate-600 pt-1">
                      Nova runs its list regardless of what the candidate says. It does not branch on vague answers, ignore tech mentioned in passing, or isolate individual contribution. This is the root cause node.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
                    <h4 className="text-xs font-bold text-slate-900">Theme 2. The score is not broken, it is starved</h4>
                    <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">Items 5, 10, 12</span>
                    <p className="text-xs text-slate-600 pt-1">
                      Two hired candidates came back medium because the scoring model is fed almost nothing. Item 12 is the tell: the recruiter cannot see a rationale because no rationale exists.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
                    <h4 className="text-xs font-bold text-slate-900">Theme 3. Nova mismanages airtime</h4>
                    <span className="text-[10px] font-mono text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">Items 4, 7, 11</span>
                    <p className="text-xs text-slate-600 pt-1">
                      Questions stack up, consent line gets glossed, and closing rate is too fast. Item 7 carries legal exposure around AI disclosure and recording consent.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
                    <h4 className="text-xs font-bold text-slate-900">Theme 4. One voice, one direction</h4>
                    <span className="text-[10px] font-mono text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded">Items 1, 6, 8</span>
                    <p className="text-xs text-slate-600 pt-1">
                      Same register used for engineers and math tutors. Stonewalling candidate salary questions disengages candidates and thins every subsequent answer.
                    </p>
                  </div>
                </div>
              </div>

              {/* Triage Matrix Table */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">Item-Level Triage Matrix</h3>
                <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-700">
                      <tr>
                        <th className="py-2.5 px-3 w-10">#</th>
                        <th className="py-2.5 px-3">Item Description</th>
                        <th className="py-2.5 px-3 w-40">Diagnostic Tag</th>
                        <th className="py-2.5 px-3">PM Note</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-600">
                      <tr>
                        <td className="py-2 px-3 font-mono">1</td>
                        <td className="py-2 px-3 font-medium text-slate-900">Sounds like reading a script (frontline)</td>
                        <td className="py-2 px-3"><span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[10px]">Conversation gap</span></td>
                        <td className="py-2 px-3">Symptom of recitation plus flat register</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-mono">2</td>
                        <td className="py-2 px-3 font-medium text-slate-900">No pushback on vague technical answers</td>
                        <td className="py-2 px-3"><span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-mono text-[10px]">Conversation gap</span></td>
                        <td className="py-2 px-3 font-semibold text-indigo-700">Root cause item</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-mono">3</td>
                        <td className="py-2 px-3 font-medium text-slate-900">Wants follow-ups instead of a fixed list</td>
                        <td className="py-2 px-3"><span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[10px]">Feature as phrased</span></td>
                        <td className="py-2 px-3">Actually a conversation gap</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-mono">4</td>
                        <td className="py-2 px-3 font-medium text-slate-900">Three questions back to back, candidate hung up</td>
                        <td className="py-2 px-3"><span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 font-mono text-[10px]">Bug</span></td>
                        <td className="py-2 px-3">Turn taking and endpointing failure</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-mono">5</td>
                        <td className="py-2 px-3 font-medium text-slate-900">Strong hires both scored medium</td>
                        <td className="py-2 px-3"><span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 font-mono text-[10px]">Bug</span></td>
                        <td className="py-2 px-3">Score miscalibration, needs data not prompt</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-mono">6</td>
                        <td className="py-2 px-3 font-medium text-slate-900">Wants different tone per role type</td>
                        <td className="py-2 px-3"><span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 font-mono text-[10px]">Feature request</span></td>
                        <td className="py-2 px-3">Genuine new capability</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-mono">7</td>
                        <td className="py-2 px-3 font-medium text-slate-900">Candidate did not register it was an AI</td>
                        <td className="py-2 px-3"><span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 font-mono text-[10px]">Compliance risk</span></td>
                        <td className="py-2 px-3 font-semibold text-rose-700">Consent line exists, delivery fails</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-mono">8</td>
                        <td className="py-2 px-3 font-medium text-slate-900">Cannot answer candidate questions</td>
                        <td className="py-2 px-3"><span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[10px]">Expectation mismatch</span></td>
                        <td className="py-2 px-3">Conversion impact, not cosmetic</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-mono">9</td>
                        <td className="py-2 px-3 font-medium text-slate-900">No digging into named technologies</td>
                        <td className="py-2 px-3"><span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-mono text-[10px]">Conversation gap</span></td>
                        <td className="py-2 px-3 font-semibold text-indigo-700">Root cause item</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-mono">10</td>
                        <td className="py-2 px-3 font-medium text-slate-900">Engineering pass rate below human baseline</td>
                        <td className="py-2 px-3"><span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 font-mono text-[10px]">Suspected gap</span></td>
                        <td className="py-2 px-3">Unresolved, needs diagnosis</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-mono">11</td>
                        <td className="py-2 px-3 font-medium text-slate-900">Closing speech rate too fast</td>
                        <td className="py-2 px-3"><span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[10px]">Bug</span></td>
                        <td className="py-2 px-3">TTS configuration value</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-mono">12</td>
                        <td className="py-2 px-3 font-medium text-slate-900">Wants rationale, not just a score</td>
                        <td className="py-2 px-3"><span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-mono text-[10px]">Feature request</span></td>
                        <td className="py-2 px-3">Downstream of scoring theme</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PRIORITISATION */}
          {activeTab === 'prioritisation' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Priority 1. Score Calibration
                  </h4>
                  <span className="text-[10px] font-mono bg-rose-50 text-rose-700 px-2 py-0.5 rounded font-semibold">
                    Highest Business Priority • Not Buildable in Prototype
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  When two later hires both come back medium, trust breaks, and recruiters re-screen anyway. But fixing calibration needs labeled hiring outcomes, not a prompt change. Anyone fixing it with a prompt change is guessing.
                </p>
                <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-900 text-xs border border-emerald-200 font-medium">
                  <strong>The half shipped now:</strong> Evidence-linked rationale (Item 12). Shows its working, gives recruiters sanity check today, and generates labeled data for future calibration.
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-900 shadow-2xs space-y-2 ring-1 ring-slate-900">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Priority 2. Adaptive Probing
                  </h4>
                  <span className="text-[10px] font-mono bg-slate-900 text-white px-2 py-0.5 rounded font-semibold">
                    What Was Built
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  The upstream cause of Priority 1. Fixing listening improves the scoring input as a byproduct. Covers the engineering gap where technical signal only surfaces at depth.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Priority 3. Airtime and Register (Themes 3 & 4 Merged)
                  </h4>
                  <span className="text-[10px] font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                    High ROI Quick Wins
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Consent chunking into 3 distinct turns, slower closing rate, and role-conditioned registers are cheap to ship and directly impact candidate experience and legal compliance.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: THE BUILD & DEFENSES */}
          {activeTab === 'build' && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                The 4 Decisions Inside the Prompt Worth Defending
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
                  <strong className="text-slate-900">1. Insufficient evidence is a separate tier from medium</strong>
                  <p className="text-slate-600">
                    Medium means candidate is average. Insufficient means the screen failed. Splitting them stops the safe middle from absorbing bad screens.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
                  <strong className="text-slate-900">2. Probe budget capped at two</strong>
                  <p className="text-slate-600">
                    Unbounded probing feels like an interrogation. After 2 probes, Nova banks what it has, marks it thin, and moves on.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
                  <strong className="text-slate-900">3. Answers classified before Nova replies</strong>
                  <p className="text-slate-600">
                    Isolates <em>claimed_but_unowned</em> &quot;we&quot; claims to probe individual engineering ownership.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
                  <strong className="text-slate-900">4. Nova never evaluates out loud</strong>
                  <p className="text-slate-600">
                    No praise or encouraging noises that distort candidate answers or imply premature hiring outcomes.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-100 text-xs text-slate-700 space-y-1">
                <strong>What was deliberately left out:</strong> Seniority-weighted scoring (needs calibration data), sentiment analysis (unreliable), auto-reject paths (screens shouldn&apos;t be terminal), and example answers inside questions (contaminates signal).
              </div>
            </div>
          )}

          {/* TAB 4: SYSTEM PROMPT APPENDIX */}
          {activeTab === 'prompt' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Appendix: Verbatim System Prompt
                </h4>
              </div>
              <pre className="font-mono-code text-[11px] text-slate-800 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto">
                {`You are Nova, an AI voice recruiter running a first-round phone screen for {{COMPANY}} for the role of {{ROLE_TITLE}}. Role type: {{ROLE_TYPE}} (one of: ENGINEERING | FRONTLINE).

Your job is NOT to collect answers to a list of questions. Your job is to leave the call with enough concrete evidence that a human recruiter can make a confident yes/no without re-screening the candidate...`}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-500">Ajith P Nayak • Strategy & Architecture Submission</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium transition-colors"
          >
            Close Memo
          </button>
        </div>
      </div>
    </div>
  );
};
