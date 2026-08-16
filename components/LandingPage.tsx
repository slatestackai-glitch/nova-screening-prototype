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
  FileCode
} from 'lucide-react';

interface LandingPageProps {
  selectedRole: RoleType;
  onSelectRole: (role: RoleType) => void;
  onStartInteractive: () => void;
  onStartAutoTour: () => void;
  onOpenPrompt: () => void;
  onOpenSubmissionDoc: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  selectedRole,
  onSelectRole,
  onStartInteractive,
  onStartAutoTour,
  onOpenPrompt,
  onOpenSubmissionDoc
}) => {
  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900 flex flex-col justify-between">
      {/* Minimal Top Navigation */}
      <header className="h-16 border-b border-slate-200/80 bg-white/80 backdrop-blur-md px-6 lg:px-12 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white font-bold text-sm">
            N
          </div>
          <div>
            <span className="font-bold text-slate-900 tracking-tight text-sm">NOVA</span>
            <span className="text-slate-400 text-xs ml-2 font-normal hidden sm:inline">Adaptive Screening Intelligence</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenSubmissionDoc}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-white text-slate-800 text-xs font-medium transition-colors shadow-2xs"
          >
            <FileText className="w-3.5 h-3.5 text-slate-600" />
            <span>Executive Memo</span>
          </button>

          <button
            onClick={onOpenPrompt}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-white text-slate-700 text-xs font-medium transition-colors shadow-2xs hidden md:flex"
          >
            <FileCode className="w-3.5 h-3.5 text-slate-500" />
            <span>Prompt Spec</span>
          </button>
          
          <button
            onClick={onStartAutoTour}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-colors shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>60s Demo</span>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-5xl mx-auto px-6 py-12 lg:py-16 flex-1 flex flex-col justify-center">
        {/* Tagline Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-medium shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Adaptive AI Phone Screener • Production Prototype</span>
          </div>
        </div>

        {/* Main Headline */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-950 leading-[1.15]">
            The first phone screen that <span className="underline decoration-indigo-400/80 decoration-3 underline-offset-4">listens</span>, probes, and gathers verified evidence.
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Traditional AI screeners recite fixed question lists and default every score to medium. Nova actively probes vague answers, isolates individual engineering contribution, and compiles a live evidence ledger.
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto w-full">
          {/* Engineering Role Card */}
          <div
            onClick={() => onSelectRole('ENGINEERING')}
            className={`p-5 rounded-xl border cursor-pointer transition-all ${
              selectedRole === 'ENGINEERING'
                ? 'bg-white border-slate-900 shadow-md ring-1 ring-slate-900'
                : 'bg-white/60 border-slate-200 hover:border-slate-300 hover:bg-white'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-lg ${selectedRole === 'ENGINEERING' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'}`}>
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">Senior Backend Engineer</h3>
                  <p className="text-xs text-slate-500">Meridian Labs • Bangalore (Hybrid)</p>
                </div>
              </div>
              <input
                type="radio"
                checked={selectedRole === 'ENGINEERING'}
                onChange={() => onSelectRole('ENGINEERING')}
                className="w-4 h-4 text-slate-900 focus:ring-slate-900"
              />
            </div>
            <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-3">
              <div className="flex justify-between">
                <span className="text-slate-400">Comp Band:</span>
                <span className="font-medium text-slate-800">38–52 LPA fixed base</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Core Stack:</span>
                <span className="font-medium text-slate-800">Go, Postgres, Kafka</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Tone Register:</span>
                <span className="font-medium text-slate-800">Precise, peer-level, technical</span>
              </div>
            </div>
          </div>

          {/* Frontline Role Card */}
          <div
            onClick={() => onSelectRole('FRONTLINE')}
            className={`p-5 rounded-xl border cursor-pointer transition-all ${
              selectedRole === 'FRONTLINE'
                ? 'bg-white border-slate-900 shadow-md ring-1 ring-slate-900'
                : 'bg-white/60 border-slate-200 hover:border-slate-300 hover:bg-white'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-lg ${selectedRole === 'FRONTLINE' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'}`}>
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">Math Educator (Grades 6–10)</h3>
                  <p className="text-xs text-slate-500">Meridian Learn • 100% Remote</p>
                </div>
              </div>
              <input
                type="radio"
                checked={selectedRole === 'FRONTLINE'}
                onChange={() => onSelectRole('FRONTLINE')}
                className="w-4 h-4 text-slate-900 focus:ring-slate-900"
              />
            </div>
            <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-3">
              <div className="flex justify-between">
                <span className="text-slate-400">Hourly Rate:</span>
                <span className="font-medium text-slate-800">₹450–600 / teaching hour</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Commitment:</span>
                <span className="font-medium text-slate-800">15–25 hrs/week flexible</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Tone Register:</span>
                <span className="font-medium text-slate-800">Warm, conversational, human beat</span>
              </div>
            </div>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto w-full">
          <button
            onClick={onStartInteractive}
            className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold shadow-sm transition-all hover:shadow"
          >
            <span>Launch Live Screen</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onStartAutoTour}
            className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 text-sm font-semibold shadow-2xs transition-all"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Play 60s Demo</span>
          </button>
        </div>

        {/* 3 Core Architecture Pillars */}
        <div className="mt-14 pt-10 border-t border-slate-200/80 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-900">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
              <span>Adaptive Probe Engine</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Silently classifies answers as concrete, vague, or claimed-but-unowned. Probes personal contribution with a 2-probe maximum budget.
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-900">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              <span>Evidence Ledger</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Banks concrete claims with verbatim quotes, specificity tags, and direct linkages to required role competencies in real time.
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-900">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
              <span>Distinct Confidence Tiers</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Separates insufficient evidence (a failed screen) from medium (a mid candidate). Solves the root cause of scoring calibration decay.
            </p>
          </div>
        </div>
      </main>

      {/* Clean Footer */}
      <footer className="border-t border-slate-200/60 bg-white py-4 px-6 text-center text-xs text-slate-500">
        Nova Adaptive Screening Intelligence • Ajith P Nayak • Powered by Google Gemini
      </footer>
    </div>
  );
};
