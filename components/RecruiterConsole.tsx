'use client';

import React, { useState } from 'react';
import { NovaState, RoleType, ConfidenceTier, Specificity } from '@/lib/types';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Database, 
  Award, 
  ChevronDown, 
  ChevronUp, 
  Copy, 
  Check, 
  Tag, 
  AlertOctagon,
  Layers,
  HelpCircle
} from 'lucide-react';

interface RecruiterConsoleProps {
  state: NovaState;
  roleType: RoleType;
}

export const RecruiterConsole: React.FC<RecruiterConsoleProps> = ({
  state,
  roleType
}) => {
  const [showRawJson, setShowRawJson] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);

  const confidence = state.confidence || {
    tier: 'insufficient_evidence',
    rationale: 'Screen initiated. Awaiting substantive evidence.',
    coverage: 'Pending competency evaluation.'
  };

  const evidence = state.evidence || [];
  const openQuestions = state.open_questions || [];
  const flags = state.flags || [];

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(state, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const expectedCompetencies = roleType === 'ENGINEERING'
    ? [
        'Distributed Systems & Architecture',
        'Performance & Latency Optimization',
        'Technical Tradeoffs & Data Storage',
        'Fault Tolerance & Resiliency',
        'Individual Ownership & Decision Making'
      ]
    : [
        'Math Pedagogy & Simplification',
        'Student Empathy & Patience',
        'Online Engagement & Classroom Tech',
        'Parent Communication & Feedback'
      ];

  const getSpecificityBadge = (specificity: Specificity) => {
    switch (specificity) {
      case 'concrete':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            concrete
          </span>
        );
      case 'partial':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-sky-50 text-sky-700 border border-sky-200 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
            partial
          </span>
        );
      case 'thin':
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-slate-100 text-slate-600 border border-slate-200 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            thin
          </span>
        );
    }
  };

  const getTierDisplay = (tier: ConfidenceTier) => {
    switch (tier) {
      case 'insufficient_evidence':
        return {
          label: 'INSUFFICIENT EVIDENCE',
          badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
          containerClass: 'insufficient-evidence-pattern',
          icon: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />,
          desc: 'Screen has not yet surfaced enough verifiable claims to evaluate candidate ability.'
        };
      case 'high':
        return {
          label: 'HIGH CONFIDENCE',
          badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          containerClass: 'bg-emerald-50/60 border-emerald-300 border',
          icon: <Award className="w-5 h-5 text-emerald-600 shrink-0" />,
          desc: 'Verified ≥ 3 concrete claims across multiple key competencies.'
        };
      case 'medium':
        return {
          label: 'MEDIUM CONFIDENCE',
          badgeClass: 'bg-blue-100 text-blue-800 border-blue-300',
          containerClass: 'bg-blue-50/50 border-blue-200 border',
          icon: <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />,
          desc: 'Adequate evidence gathered; candidate demonstrates mid-tier competency fit.'
        };
      case 'low':
        return {
          label: 'LOW CONFIDENCE',
          badgeClass: 'bg-rose-100 text-rose-800 border-rose-300',
          containerClass: 'bg-rose-50/50 border-rose-200 border',
          icon: <AlertOctagon className="w-5 h-5 text-rose-600 shrink-0" />,
          desc: 'Clear negative signal or fundamental gaps identified.'
        };
      default:
        return {
          label: 'INSUFFICIENT EVIDENCE',
          badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
          containerClass: 'insufficient-evidence-pattern',
          icon: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />,
          desc: 'Awaiting evidence.'
        };
    }
  };

  const tierInfo = getTierDisplay(confidence.tier);

  return (
    <div className="w-full lg:w-[460px] xl:w-[500px] flex flex-col bg-slate-50 h-full overflow-y-auto p-4 space-y-4 text-slate-800">
      {/* Console Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-slate-900 text-white">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Recruiter Live Console
            </h2>
            <p className="text-[11px] text-slate-500">Structured evidence ledger & telemetry</p>
          </div>
        </div>

        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-600">
          Topic: <span className="font-semibold text-slate-800">{state.topic || 'General'}</span>
        </span>
      </div>

      {/* 1. CONFIDENCE PANEL (Visually distinct insufficient_evidence vs medium) */}
      <div className={`p-4 rounded-xl transition-all shadow-2xs ${tierInfo.containerClass}`}>
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2.5">
            {tierInfo.icon}
            <div>
              <div className="text-[10px] uppercase font-mono tracking-wider text-slate-500 font-semibold">
                Evaluation Tier
              </div>
              <div className="text-sm font-bold tracking-tight text-slate-950">
                {tierInfo.label}
              </div>
            </div>
          </div>

          <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded border font-semibold ${tierInfo.badgeClass}`}>
            {confidence.tier.replace('_', ' ')}
          </span>
        </div>

        {/* Evidence Rationale */}
        <div className="mt-2 pt-2 border-t border-slate-200/60">
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1 font-semibold">
            Evidence-Linked Rationale:
          </div>
          <p className="text-xs text-slate-800 leading-relaxed font-sans bg-white/80 p-2.5 rounded-lg border border-slate-200/80 shadow-2xs">
            {confidence.rationale}
          </p>
        </div>
      </div>

      {/* 2. EVIDENCE LEDGER */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-slate-700" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Evidence Ledger ({evidence.length})
            </h3>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">
            {evidence.filter(e => e.specificity === 'concrete').length} concrete claims
          </span>
        </div>

        {evidence.length === 0 ? (
          <div className="text-center py-6 border border-dashed border-slate-200 rounded-lg bg-slate-50/50">
            <p className="text-xs text-slate-400 font-mono">Ledger empty. Probing for concrete claims...</p>
          </div>
        ) : (
          <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
            {evidence.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg bg-slate-50/80 border border-slate-200 hover:border-slate-300 transition-colors space-y-1.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200 truncate max-w-[240px]">
                    {item.competency}
                  </span>
                  {getSpecificityBadge(item.specificity)}
                </div>

                <p className="text-xs text-slate-800 font-medium">
                  {item.claim}
                </p>

                {item.verbatim && (
                  <div className="text-[11px] font-mono-code text-slate-600 bg-white p-2 rounded border border-slate-200/80">
                    <span className="text-slate-400 select-none mr-1">&quot;</span>
                    {item.verbatim}
                    <span className="text-slate-400 select-none ml-1">&quot;</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. COVERAGE MATRIX */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2.5 shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Competency Coverage
            </h3>
          </div>
          <span className="text-[10px] font-mono text-slate-500">
            {evidence.length > 0 ? `${Math.min(evidence.length, expectedCompetencies.length)} / ${expectedCompetencies.length} verified` : '0 verified'}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-1.5">
          {expectedCompetencies.map((comp, idx) => {
            const isCovered = evidence.some(e => 
              e.competency.toLowerCase().includes(comp.split(' ')[0].toLowerCase()) ||
              comp.toLowerCase().includes(e.competency.split(' ')[0].toLowerCase())
            );

            return (
              <div
                key={idx}
                className={`flex items-center justify-between p-2 rounded-lg border text-xs transition-colors ${
                  isCovered
                    ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900 font-medium'
                    : 'bg-slate-50 border-slate-200 text-slate-500'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span className={`w-1.5 h-1.5 rounded-full ${isCovered ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                  <span className="truncate">{comp}</span>
                </div>
                <span className="text-[10px] font-mono font-medium">
                  {isCovered ? 'EVIDENCED' : 'UNCOVERED'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. RECRUITER ACTION ITEMS (Delegated Priya/Arjun questions & Flags) */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2.5 shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-amber-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Recruiter Action Items ({openQuestions.length + flags.length})
            </h3>
          </div>
        </div>

        {openQuestions.length === 0 && flags.length === 0 ? (
          <div className="text-center py-4 border border-dashed border-slate-200 rounded-lg bg-slate-50/50">
            <p className="text-xs text-slate-400 font-mono">No open questions or recruiter flags logged.</p>
          </div>
        ) : (
          <div className="space-y-2 text-xs">
            {openQuestions.map((q, idx) => (
              <div
                key={`q-${idx}`}
                className="p-2.5 rounded-lg bg-indigo-50 border border-indigo-200 flex items-start gap-2 text-indigo-950"
              >
                <Tag className="w-3.5 h-3.5 text-indigo-600 mt-0.5 shrink-0" />
                <div className="flex-1">
                  <span className="font-semibold text-indigo-900">Candidate Question for Recruiter: </span>
                  <span>{q}</span>
                </div>
              </div>
            ))}

            {flags.map((f, idx) => (
              <div
                key={`f-${idx}`}
                className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 flex items-start gap-2 text-rose-950"
              >
                <AlertOctagon className="w-3.5 h-3.5 text-rose-600 mt-0.5 shrink-0" />
                <div className="flex-1">
                  <span className="font-semibold text-rose-900">Recruiter Flag: </span>
                  <span>{f}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Raw State JSON Telemetry */}
      <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
        <button
          onClick={() => setShowRawJson(!showRawJson)}
          className="w-full px-4 py-2 bg-slate-50 hover:bg-slate-100 flex items-center justify-between text-xs text-slate-700 font-mono transition-colors"
        >
          <span>Telemetry: &lt;&lt;&lt;NOVA_STATE Block</span>
          {showRawJson ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showRawJson && (
          <div className="p-3 border-t border-slate-200 space-y-2 bg-slate-900 text-slate-200">
            <div className="flex justify-end">
              <button
                onClick={handleCopyJson}
                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded text-[10px] font-mono text-slate-300 flex items-center gap-1"
              >
                {copiedJson ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedJson ? 'Copied' : 'Copy JSON'}</span>
              </button>
            </div>
            <pre className="font-mono-code text-[11px] text-slate-300 whitespace-pre-wrap max-h-56 overflow-y-auto p-2 bg-black/40 rounded">
              {JSON.stringify(state, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
