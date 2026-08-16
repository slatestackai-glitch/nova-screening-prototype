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
  Sparkles,
  Activity,
  BarChart3,
  ListFilter
} from 'lucide-react';

interface RecruiterConsoleProps {
  state: NovaState;
  roleType: RoleType;
}

export const RecruiterConsole: React.FC<RecruiterConsoleProps> = ({
  state,
  roleType
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'ledger' | 'actions'>('overview');
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

  const coveredCount = expectedCompetencies.filter(comp => 
    evidence.some(e => 
      e.competency.toLowerCase().includes(comp.split(' ')[0].toLowerCase()) ||
      comp.toLowerCase().includes(e.competency.split(' ')[0].toLowerCase())
    )
  ).length;

  const coveragePercent = Math.round((coveredCount / expectedCompetencies.length) * 100);

  const getSpecificityBadge = (specificity: Specificity) => {
    switch (specificity) {
      case 'concrete':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-300 flex items-center gap-1 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            concrete
          </span>
        );
      case 'partial':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-sky-50 text-sky-800 border border-sky-300 flex items-center gap-1 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
            partial
          </span>
        );
      case 'thin':
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-slate-100 text-slate-600 border border-slate-200 flex items-center gap-1 shadow-2xs">
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
          badgeClass: 'bg-amber-100 text-amber-900 border-amber-300 font-bold',
          containerClass: 'insufficient-evidence-pattern',
          icon: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />,
          desc: 'Screen has not yet surfaced enough verifiable claims to evaluate candidate ability.'
        };
      case 'high':
        return {
          label: 'HIGH CONFIDENCE',
          badgeClass: 'bg-emerald-100 text-emerald-900 border-emerald-300 font-bold',
          containerClass: 'bg-emerald-50/70 border-emerald-300 border shadow-xs',
          icon: <Award className="w-5 h-5 text-emerald-600 shrink-0" />,
          desc: 'Verified ≥ 3 concrete claims across multiple key competencies.'
        };
      case 'medium':
        return {
          label: 'MEDIUM CONFIDENCE',
          badgeClass: 'bg-blue-100 text-blue-900 border-blue-300 font-bold',
          containerClass: 'bg-blue-50/60 border-blue-200 border shadow-xs',
          icon: <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />,
          desc: 'Adequate evidence gathered; candidate demonstrates mid-tier competency fit.'
        };
      case 'low':
        return {
          label: 'LOW CONFIDENCE',
          badgeClass: 'bg-rose-100 text-rose-900 border-rose-300 font-bold',
          containerClass: 'bg-rose-50/60 border-rose-200 border shadow-xs',
          icon: <AlertOctagon className="w-5 h-5 text-rose-600 shrink-0" />,
          desc: 'Clear negative signal or fundamental gaps identified.'
        };
      default:
        return {
          label: 'INSUFFICIENT EVIDENCE',
          badgeClass: 'bg-amber-100 text-amber-900 border-amber-300 font-bold',
          containerClass: 'insufficient-evidence-pattern',
          icon: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />,
          desc: 'Awaiting evidence.'
        };
    }
  };

  const tierInfo = getTierDisplay(confidence.tier);

  return (
    <div className="w-full lg:w-[480px] xl:w-[520px] flex flex-col glass-panel h-full overflow-hidden text-slate-800 border-l border-slate-200/70">
      {/* Header & Segmented Tab Controller */}
      <div className="p-4 border-b border-slate-200/70 bg-white/70 backdrop-blur-md space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-slate-950 flex items-center justify-center text-white font-bold text-xs shadow-xs">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-950">
                Recruiter Telemetry
              </h2>
              <p className="text-[11px] text-slate-500 font-medium">Live Evidence Ledger & Scoring</p>
            </div>
          </div>

          <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-semibold shadow-2xs">
            {state.topic || 'General'}
          </span>
        </div>

        {/* Clean Segmented Control Tabs */}
        <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-slate-100/90 border border-slate-200/80 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'overview'
                ? 'bg-white text-slate-950 shadow-xs font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Score ({confidence.tier.slice(0, 4)})</span>
          </button>

          <button
            onClick={() => setActiveTab('ledger')}
            className={`py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'ledger'
                ? 'bg-white text-slate-950 shadow-xs font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Database className="w-3.5 h-3.5 text-indigo-600" />
            <span>Ledger ({evidence.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('actions')}
            className={`py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'actions'
                ? 'bg-white text-slate-950 shadow-xs font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Tag className="w-3.5 h-3.5 text-amber-600" />
            <span>Actions ({openQuestions.length + flags.length})</span>
          </button>
        </div>
      </div>

      {/* Main Scrollable Telemetry View */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/30">
        {/* TAB 1: OVERVIEW & SCORING */}
        {activeTab === 'overview' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* 1. Evaluation Tier Glass Card */}
            <div className={`p-4 rounded-2xl transition-all shadow-sm ${tierInfo.containerClass}`}>
              <div className="flex items-start justify-between gap-3 mb-2.5">
                <div className="flex items-center gap-2.5">
                  {tierInfo.icon}
                  <div>
                    <div className="text-[10px] uppercase font-mono tracking-wider text-slate-500 font-bold">
                      Confidence Tier
                    </div>
                    <div className="text-sm font-extrabold tracking-tight text-slate-950">
                      {tierInfo.label}
                    </div>
                  </div>
                </div>

                <span className={`text-[10px] uppercase font-mono px-2.5 py-0.5 rounded-full border ${tierInfo.badgeClass}`}>
                  {confidence.tier.replace('_', ' ')}
                </span>
              </div>

              {/* Evidence Rationale */}
              <div className="mt-2.5 pt-2.5 border-t border-slate-200/60">
                <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1.5 font-bold">
                  Evidence-Linked Rationale:
                </div>
                <p className="text-xs text-slate-800 leading-relaxed font-sans bg-white/90 p-3 rounded-xl border border-slate-200/80 shadow-2xs">
                  {confidence.rationale}
                </p>
              </div>
            </div>

            {/* 2. Competency Coverage Progress Card */}
            <div className="glass-card rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-950">
                    Competency Coverage ({coveredCount}/{expectedCompetencies.length})
                  </h3>
                </div>
                <span className="text-xs font-mono font-bold text-slate-900">
                  {coveragePercent}% Verified
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200/60">
                <div 
                  className="bg-gradient-to-r from-emerald-500 to-indigo-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(coveragePercent, 5)}%` }}
                />
              </div>

              <div className="space-y-1.5 pt-1">
                {expectedCompetencies.map((comp, idx) => {
                  const isCovered = evidence.some(e => 
                    e.competency.toLowerCase().includes(comp.split(' ')[0].toLowerCase()) ||
                    comp.toLowerCase().includes(e.competency.split(' ')[0].toLowerCase())
                  );

                  return (
                    <div
                      key={idx}
                      className={`flex items-center justify-between p-2 rounded-xl border text-xs transition-colors ${
                        isCovered
                          ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950 font-bold'
                          : 'bg-white/60 border-slate-200 text-slate-500 font-medium'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className={`w-2 h-2 rounded-full ${isCovered ? 'bg-emerald-500 shadow-xs' : 'bg-slate-300'}`} />
                        <span className="truncate">{comp}</span>
                      </div>
                      <span className="text-[10px] font-mono font-bold">
                        {isCovered ? 'EVIDENCED' : 'UNCOVERED'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: EVIDENCE LEDGER */}
        {activeTab === 'ledger' && (
          <div className="space-y-3 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-1">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Banked Claims ({evidence.length})
              </span>
              <span className="text-[10px] font-mono text-slate-500 font-semibold">
                {evidence.filter(e => e.specificity === 'concrete').length} concrete
              </span>
            </div>

            {evidence.length === 0 ? (
              <div className="text-center py-10 border border-dashed border-slate-200 rounded-2xl bg-white/60">
                <Database className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs text-slate-500 font-medium">Ledger empty.</p>
                <p className="text-[11px] text-slate-400">Probing candidate for verifiable technical claims...</p>
              </div>
            ) : (
              evidence.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl glass-card border-slate-200/90 space-y-2 shadow-2xs"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200 truncate max-w-[240px]">
                      {item.competency}
                    </span>
                    {getSpecificityBadge(item.specificity)}
                  </div>

                  <p className="text-xs text-slate-800 font-semibold leading-relaxed">
                    {item.claim}
                  </p>

                  {item.verbatim && (
                    <div className="text-[11px] font-mono-code text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                      <span className="text-indigo-500 select-none mr-1">&quot;</span>
                      {item.verbatim}
                      <span className="text-indigo-500 select-none ml-1">&quot;</span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 3: RECRUITER ACTION ITEMS */}
        {activeTab === 'actions' && (
          <div className="space-y-3 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-1">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Recruiter Follow-ups ({openQuestions.length + flags.length})
              </span>
            </div>

            {openQuestions.length === 0 && flags.length === 0 ? (
              <div className="text-center py-10 border border-dashed border-slate-200 rounded-2xl bg-white/60">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                <p className="text-xs text-slate-500 font-medium">All candidate questions answered from fact sheet.</p>
              </div>
            ) : (
              <div className="space-y-2.5 text-xs">
                {openQuestions.map((q, idx) => (
                  <div
                    key={`q-${idx}`}
                    className="p-3 rounded-2xl bg-indigo-50/80 border border-indigo-200 flex items-start gap-2.5 text-indigo-950 shadow-2xs"
                  >
                    <Tag className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
                    <div className="flex-1">
                      <div className="font-bold text-indigo-950 mb-0.5">Delegated to {roleType === 'ENGINEERING' ? 'Priya' : 'Arjun'}:</div>
                      <div className="text-indigo-900 leading-relaxed font-medium">{q}</div>
                    </div>
                  </div>
                ))}

                {flags.map((f, idx) => (
                  <div
                    key={`f-${idx}`}
                    className="p-3 rounded-2xl bg-rose-50/80 border border-rose-200 flex items-start gap-2.5 text-rose-950 shadow-2xs"
                  >
                    <AlertOctagon className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
                    <div className="flex-1">
                      <div className="font-bold text-rose-950 mb-0.5">Recruiter Flag:</div>
                      <div className="text-rose-900 leading-relaxed font-medium">{f}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Collapsible Telemetry JSON Drawer */}
      <div className="border-t border-slate-200/80 bg-white/80 backdrop-blur-md">
        <button
          onClick={() => setShowRawJson(!showRawJson)}
          className="w-full px-4 py-2 flex items-center justify-between text-xs text-slate-700 font-mono font-medium hover:bg-slate-50 transition-colors"
        >
          <span>Raw Telemetry: &lt;&lt;&lt;NOVA_STATE Block</span>
          {showRawJson ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showRawJson && (
          <div className="p-3 border-t border-slate-200 space-y-2 bg-slate-950 text-slate-200">
            <div className="flex justify-end">
              <button
                onClick={handleCopyJson}
                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded text-[10px] font-mono text-slate-300 flex items-center gap-1"
              >
                {copiedJson ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedJson ? 'Copied' : 'Copy JSON'}</span>
              </button>
            </div>
            <pre className="font-mono-code text-[11px] text-slate-300 whitespace-pre-wrap max-h-48 overflow-y-auto p-2 bg-black/40 rounded">
              {JSON.stringify(state, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
