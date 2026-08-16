'use client';

import React from 'react';
import { RoleType } from '@/lib/types';
import { 
  Play, 
  Sparkles, 
  Cpu, 
  GraduationCap, 
  ArrowRight, 
  FileText,
  FileCode,
  Settings
} from 'lucide-react';

interface LandingPageProps {
  selectedRole: RoleType;
  onSelectRole: (role: RoleType) => void;
  onStartInteractive: () => void;
  onStartAutoTour: () => void;
  onOpenPrompt: () => void;
  onOpenSubmissionDoc: () => void;
  onOpenSettings: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  selectedRole,
  onSelectRole,
  onStartInteractive,
  onStartAutoTour,
  onOpenPrompt,
  onOpenSubmissionDoc,
  onOpenSettings
}) => {
  return (
    <div className="min-h-screen mesh-gradient-bg text-slate-900 flex flex-col justify-between relative overflow-hidden">
      {/* Subtle Glow Blobs */}
      <div className="absolute top-[-10%] left-[-5%] w-[45vw] h-[45vw] rounded-full bg-indigo-200/30 blur-3xl pointer-events-none" />
      <div className="absolute top-[20%] right-[-5%] w-[40vw] h-[40vw] rounded-full bg-amber-200/20 blur-3xl pointer-events-none" />

      {/* Glassmorphic Top Navigation */}
      <header className="h-16 glass-panel px-6 lg:px-12 flex items-center justify-between sticky top-0 z-20 border-b border-slate-200/60 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-slate-900 to-slate-800 flex items-center justify-center text-white font-bold text-sm shadow-md">
            N
          </div>
          <div>
            <span className="font-extrabold text-slate-950 tracking-tight text-sm">NOVA</span>
            <span className="text-slate-400 text-xs ml-2 font-medium hidden sm:inline">Adaptive Screening Intelligence</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenSubmissionDoc}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200/80 hover:border-slate-300 bg-white/80 hover:bg-white text-slate-800 text-xs font-semibold transition-all shadow-2xs backdrop-blur-md"
          >
            <FileText className="w-3.5 h-3.5 text-indigo-600" />
            <span>Executive Memo</span>
          </button>

          <button
            onClick={onOpenPrompt}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200/80 hover:border-slate-300 bg-white/80 hover:bg-white text-slate-700 text-xs font-medium transition-all shadow-2xs backdrop-blur-md hidden md:flex"
          >
            <FileCode className="w-3.5 h-3.5 text-slate-500" />
            <span>Prompt Spec</span>
          </button>

          <button
            onClick={onOpenSettings}
            className="p-2 rounded-xl border border-slate-200/80 hover:border-slate-300 bg-white/80 hover:bg-white text-slate-700 hover:text-slate-950 transition-all shadow-2xs backdrop-blur-md"
            title="Configure API Keys & Voices"
          >
            <Settings className="w-4 h-4" />
          </button>
          
          <button
            onClick={onStartAutoTour}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-all shadow-md hover:shadow-lg"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>60s Guided Demo</span>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-5xl mx-auto px-6 py-12 lg:py-16 flex-1 flex flex-col justify-center relative z-10">
        {/* Animated Tagline Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card border-slate-200/80 text-slate-700 text-xs font-semibold shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Adaptive AI Phone Screener • Enterprise Release</span>
            <span className="text-slate-400">|</span>
            <span className="text-indigo-600 font-mono text-[11px]">Gemini 2.0 Engine</span>
          </div>
        </div>

        {/* Main Headline */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-950 leading-[1.12]">
            The first phone screen that <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">listens</span>, probes, and gathers verified evidence.
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto font-normal">
            Traditional AI screeners recite fixed question lists and default every score to medium. Nova actively probes vague answers, isolates individual engineering contribution, and compiles a live evidence ledger.
          </p>
        </div>

        {/* Role Selection Glass Cards */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-5 max-w-2xl mx-auto w-full">
          {/* Engineering Role Card */}
          <div
            onClick={() => onSelectRole('ENGINEERING')}
            className={`p-5 rounded-2xl cursor-pointer transition-all ${
              selectedRole === 'ENGINEERING'
                ? 'glass-card border-slate-900 ring-2 ring-slate-900/10 shadow-lg bg-white/95'
                : 'glass-card hover:bg-white/90 border-slate-200/80'
            }`}
          >
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${selectedRole === 'ENGINEERING' ? 'bg-slate-900 text-white shadow-md' : 'bg-slate-100 text-slate-700'}`}>
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-950">Senior Backend Engineer</h3>
                  <p className="text-xs text-slate-500 font-medium">Meridian Labs • Bangalore (Hybrid)</p>
                </div>
              </div>
              <input
                type="radio"
                checked={selectedRole === 'ENGINEERING'}
                onChange={() => onSelectRole('ENGINEERING')}
                className="w-4 h-4 text-slate-900 focus:ring-slate-900"
              />
            </div>
            <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-100/80 pt-3">
              <div className="flex justify-between">
                <span className="text-slate-400">Comp Band:</span>
                <span className="font-semibold text-slate-800 font-mono">38–52 LPA fixed base</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Core Stack:</span>
                <span className="font-semibold text-slate-800">Go, Postgres, Kafka</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Tone Register:</span>
                <span className="font-semibold text-indigo-700">Precise, peer-level, technical</span>
              </div>
            </div>
          </div>

          {/* Frontline Role Card */}
          <div
            onClick={() => onSelectRole('FRONTLINE')}
            className={`p-5 rounded-2xl cursor-pointer transition-all ${
              selectedRole === 'FRONTLINE'
                ? 'glass-card border-slate-900 ring-2 ring-slate-900/10 shadow-lg bg-white/95'
                : 'glass-card hover:bg-white/90 border-slate-200/80'
            }`}
          >
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${selectedRole === 'FRONTLINE' ? 'bg-slate-900 text-white shadow-md' : 'bg-slate-100 text-slate-700'}`}>
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-950">Math Educator (Grades 6–10)</h3>
                  <p className="text-xs text-slate-500 font-medium">Meridian Learn • 100% Remote</p>
                </div>
              </div>
              <input
                type="radio"
                checked={selectedRole === 'FRONTLINE'}
                onChange={() => onSelectRole('FRONTLINE')}
                className="w-4 h-4 text-slate-900 focus:ring-slate-900"
              />
            </div>
            <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-100/80 pt-3">
              <div className="flex justify-between">
                <span className="text-slate-400">Hourly Rate:</span>
                <span className="font-semibold text-slate-800 font-mono">₹450–600 / teaching hour</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Commitment:</span>
                <span className="font-semibold text-slate-800">15–25 hrs/week flexible</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Tone Register:</span>
                <span className="font-semibold text-amber-700">Warm, conversational, human beat</span>
              </div>
            </div>
          </div>
        </div>

        {/* Primary CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto w-full">
          <button
            onClick={onStartInteractive}
            className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-950 hover:bg-slate-800 text-white text-sm font-bold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
          >
            <span>Launch Live Screen</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onStartAutoTour}
            className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl glass-card hover:bg-white text-slate-900 border border-slate-300 text-sm font-bold shadow-sm transition-all hover:-translate-y-0.5"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Play 60s Demo</span>
          </button>
        </div>

        {/* 3 Architecture Pillar Glass Cards */}
        <div className="mt-14 pt-10 border-t border-slate-200/70 grid grid-cols-1 md:grid-cols-3 gap-5 text-left">
          <div className="p-4 rounded-2xl glass-card space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-950">
              <span className="w-2 h-2 rounded-full bg-indigo-600" />
              <span>Adaptive Probe Engine</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              Silently classifies answers as concrete, vague, or claimed-but-unowned. Probes personal contribution with a 2-probe maximum budget.
            </p>
          </div>

          <div className="p-4 rounded-2xl glass-card space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-950">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              <span>Evidence Ledger</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              Banks concrete claims with verbatim quotes, specificity tags, and direct linkages to required role competencies in real time.
            </p>
          </div>

          <div className="p-4 rounded-2xl glass-card space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-950">
              <span className="w-2 h-2 rounded-full bg-amber-600" />
              <span>Distinct Confidence Tiers</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              Separates insufficient evidence (a failed screen) from medium (a mid candidate). Solves the root cause of scoring calibration decay.
            </p>
          </div>
        </div>
      </main>

      {/* Glassmorphic Footer */}
      <footer className="glass-panel border-t border-slate-200/60 py-4 px-6 text-center text-xs text-slate-500">
        Nova Adaptive Screening Intelligence • Ajith P Nayak • Powered by Google Gemini
      </footer>
    </div>
  );
};
