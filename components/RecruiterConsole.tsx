'use client';

import React, { useState } from 'react';
import { NovaState, RoleType, ConfidenceTier, Specificity } from '@/lib/types';
import { 
  AlertCircle, 
  CheckCircle, 
  Check, 
  Copy, 
  ChevronDown, 
  ChevronUp, 
  UserCheck, 
  ShieldAlert, 
  FileCheck2, 
  Sparkles,
  ClipboardList
} from 'lucide-react';

interface RecruiterConsoleProps {
  state: NovaState;
  roleType: RoleType;
}

export const RecruiterConsole: React.FC<RecruiterConsoleProps> = ({
  state,
  roleType
}) => {
  const [activeTab, setActiveTab] = useState<'assessment' | 'skills' | 'notes'>('assessment');
  const [showRawJson, setShowRawJson] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);

  const confidence = state.confidence || {
    tier: 'insufficient_evidence',
    rationale: 'Call in progress. Awaiting candidate responses.',
    coverage: 'Pending evaluation.'
  };

  const evidence = state.evidence || [];
  const openQuestions = state.open_questions || [];
  const flags = state.flags || [];

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(state, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const expectedSkills = roleType === 'ENGINEERING'
    ? [
        'Distributed Systems Architecture',
        'Latency & Throughput Optimization',
        'Data Storage & Partitioning',
        'Fault Tolerance & Resilience',
        'Individual Technical Ownership'
      ]
    : [
        'Math Pedagogy & Simplification',
        'Student Empathy & Patience',
        'Online Classroom Engagement',
        'Parent Feedback & Communication'
      ];

  const matchedCount = expectedSkills.filter(skill => 
    evidence.some(e => 
      e.competency.toLowerCase().includes(skill.split(' ')[0].toLowerCase()) ||
      skill.toLowerCase().includes(e.competency.split(' ')[0].toLowerCase())
    )
  ).length;

  const matchPercent = Math.round((matchedCount / expectedSkills.length) * 100);

  const getStatusBadge = (tier: ConfidenceTier) => {
    switch (tier) {
      case 'high':
        return {
          title: 'Strong Fit (High Confidence)',
          pillClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          icon: <CheckCircle className="w-4 h-4 text-emerald-600" />,
          cardClass: 'bg-emerald-50/50 border-emerald-200'
        };
      case 'medium':
        return {
          title: 'Moderate Fit (Medium Confidence)',
          pillClass: 'bg-blue-50 text-blue-700 border-blue-200',
          icon: <UserCheck className="w-4 h-4 text-blue-600" />,
          cardClass: 'bg-blue-50/50 border-blue-200'
        };
      case 'low':
        return {
          title: 'Gaps Identified (Low Confidence)',
          pillClass: 'bg-rose-50 text-rose-700 border-rose-200',
          icon: <ShieldAlert className="w-4 h-4 text-rose-600" />,
          cardClass: 'bg-rose-50/50 border-rose-200'
        };
      case 'insufficient_evidence':
      default:
        return {
          title: 'Needs More Evidence',
          pillClass: 'bg-amber-50 text-amber-800 border-amber-300',
          icon: <AlertCircle className="w-4 h-4 text-amber-600" />,
          cardClass: 'bg-amber-50/60 border-amber-200 border-dashed'
        };
    }
  };

  const status = getStatusBadge(confidence.tier);

  return (
    <div className="w-full lg:w-[460px] xl:w-[480px] flex flex-col bg-white border-l border-slate-200/80 h-full overflow-hidden text-slate-900 shadow-sm">
      {/* Header */}
      <div className="p-5 border-b border-slate-100 space-y-3.5 bg-slate-50/50">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-950 flex items-center gap-2">
              <span>Candidate Evaluation</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </h2>
            <p className="text-xs text-slate-500">Live AI Interview Insights</p>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-2xs">
            <span>Topic:</span>
            <span className="text-slate-950 font-bold">{state.topic || 'General'}</span>
          </div>
        </div>

        {/* 3 Simple Navigation Tabs */}
        <div className="grid grid-cols-3 gap-1 p-1 bg-slate-200/60 rounded-xl text-xs font-semibold text-slate-600">
          <button
            onClick={() => setActiveTab('assessment')}
            className={`py-1.5 rounded-lg transition-all ${
              activeTab === 'assessment'
                ? 'bg-white text-slate-950 shadow-xs font-bold'
                : 'hover:text-slate-950'
            }`}
          >
            Assessment
          </button>

          <button
            onClick={() => setActiveTab('skills')}
            className={`py-1.5 rounded-lg transition-all ${
              activeTab === 'skills'
                ? 'bg-white text-slate-950 shadow-xs font-bold'
                : 'hover:text-slate-950'
            }`}
          >
            Skills ({evidence.length})
          </button>

          <button
            onClick={() => setActiveTab('notes')}
            className={`py-1.5 rounded-lg transition-all ${
              activeTab === 'notes'
                ? 'bg-white text-slate-950 shadow-xs font-bold'
                : 'hover:text-slate-950'
            }`}
          >
            Notes ({openQuestions.length + flags.length})
          </button>
        </div>
      </div>

      {/* Main Content Feed */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/30">
        {/* TAB 1: ASSESSMENT */}
        {activeTab === 'assessment' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            {/* Status Card */}
            <div className={`p-4 rounded-2xl border ${status.cardClass} space-y-3`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {status.icon}
                  <span className="text-xs font-bold text-slate-900">{status.title}</span>
                </div>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${status.pillClass}`}>
                  {confidence.tier.toUpperCase().replace('_', ' ')}
                </span>
              </div>

              <div className="bg-white/90 p-3 rounded-xl border border-slate-200/80 shadow-2xs">
                <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Summary Note</div>
                <p className="text-xs text-slate-700 leading-relaxed font-normal">
                  {confidence.rationale}
                </p>
              </div>
            </div>

            {/* Match Progress */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-950">Role Requirements Match</span>
                <span className="font-mono font-bold text-indigo-600">{matchPercent}%</span>
              </div>

              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200/60">
                <div 
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.max(matchPercent, 5)}%` }}
                />
              </div>

              <div className="space-y-1.5 pt-1">
                {expectedSkills.map((skill, idx) => {
                  const isVerified = evidence.some(e => 
                    e.competency.toLowerCase().includes(skill.split(' ')[0].toLowerCase()) ||
                    skill.toLowerCase().includes(e.competency.split(' ')[0].toLowerCase())
                  );

                  return (
                    <div
                      key={idx}
                      className={`flex items-center justify-between p-2.5 rounded-xl border text-xs transition-all ${
                        isVerified
                          ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950 font-semibold'
                          : 'bg-slate-50/60 border-slate-200/70 text-slate-500'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className={`w-2 h-2 rounded-full ${isVerified ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                        <span className="truncate">{skill}</span>
                      </div>
                      <span className="text-[10px] font-mono font-bold">
                        {isVerified ? 'VERIFIED' : 'PENDING'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: VERIFIED SKILLS */}
        {activeTab === 'skills' && (
          <div className="space-y-3 animate-in fade-in duration-150">
            {evidence.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-slate-200 rounded-2xl bg-white p-6">
                <FileCheck2 className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-700">No verified skills yet</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Nova is exploring candidate experience during the conversation.</p>
              </div>
            ) : (
              evidence.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                      {item.competency}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                      {item.specificity}
                    </span>
                  </div>

                  <p className="text-xs text-slate-800 font-medium leading-relaxed">
                    {item.claim}
                  </p>

                  {item.verbatim && (
                    <div className="text-[11px] font-mono text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200/70">
                      <span className="text-indigo-500 mr-1">&quot;</span>
                      {item.verbatim}
                      <span className="text-indigo-500 ml-1">&quot;</span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 3: NOTES */}
        {activeTab === 'notes' && (
          <div className="space-y-3 animate-in fade-in duration-150">
            {openQuestions.length === 0 && flags.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-slate-200 rounded-2xl bg-white p-6">
                <ClipboardList className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-700">No open follow-ups</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Candidate questions were answered directly from fact sheets.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {openQuestions.map((q, idx) => (
                  <div
                    key={`q-${idx}`}
                    className="p-3.5 rounded-2xl bg-indigo-50/80 border border-indigo-200 text-xs text-indigo-950 shadow-2xs space-y-1"
                  >
                    <div className="font-bold flex items-center gap-1.5 text-indigo-900">
                      <span>Follow-up for {roleType === 'ENGINEERING' ? 'Priya' : 'Arjun'}:</span>
                    </div>
                    <p className="text-indigo-950 leading-relaxed">{q}</p>
                  </div>
                ))}

                {flags.map((f, idx) => (
                  <div
                    key={`f-${idx}`}
                    className="p-3.5 rounded-2xl bg-rose-50/80 border border-rose-200 text-xs text-rose-950 shadow-2xs space-y-1"
                  >
                    <div className="font-bold text-rose-900">Candidate Flag:</div>
                    <p className="text-rose-950 leading-relaxed">{f}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Raw JSON Debug (Minimized) */}
      <div className="border-t border-slate-100 bg-white">
        <button
          onClick={() => setShowRawJson(!showRawJson)}
          className="w-full px-4 py-2.5 flex items-center justify-between text-xs text-slate-500 font-mono hover:bg-slate-50 transition-colors"
        >
          <span>Raw State Data (JSON)</span>
          {showRawJson ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showRawJson && (
          <div className="p-3 border-t border-slate-100 bg-slate-900 text-slate-200 space-y-2">
            <div className="flex justify-end">
              <button
                onClick={handleCopyJson}
                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded text-[10px] font-mono text-slate-300 flex items-center gap-1"
              >
                {copiedJson ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedJson ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="font-mono text-[10px] text-slate-300 max-h-40 overflow-y-auto p-2 bg-black/40 rounded">
              {JSON.stringify(state, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
