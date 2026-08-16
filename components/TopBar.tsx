'use client';

import React from 'react';
import { RoleType, ScreenPhase } from '@/lib/types';
import { 
  RotateCcw, 
  Play, 
  Sparkles, 
  FileCode, 
  Cpu, 
  GraduationCap,
  ArrowLeft,
  Volume2,
  VolumeX,
  FileText
} from 'lucide-react';

interface TopBarProps {
  roleType: RoleType;
  onRoleChange: (newRole: RoleType) => void;
  onStartScreen: () => void;
  onReset: () => void;
  onOpenPrompt: () => void;
  onOpenSubmissionDoc: () => void;
  onStartAutoDemo: () => void;
  isAutoDemoActive: boolean;
  isCallActive: boolean;
  screenPhase: ScreenPhase;
  messageCount: number;
  onBackToLanding: () => void;
  voiceEnabled: boolean;
  onToggleVoice: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  roleType,
  onRoleChange,
  onStartScreen,
  onReset,
  onOpenPrompt,
  onOpenSubmissionDoc,
  onStartAutoDemo,
  isAutoDemoActive,
  isCallActive,
  screenPhase,
  messageCount,
  onBackToLanding,
  voiceEnabled,
  onToggleVoice
}) => {
  return (
    <header className="h-15 border-b border-slate-200 bg-white px-4 lg:px-6 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
      {/* Left: Brand & Role Switcher */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBackToLanding}
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          title="Back to Overview"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-slate-900 flex items-center justify-center text-white font-bold text-xs">
            N
          </div>
          <span className="font-bold text-slate-900 tracking-tight text-sm hidden sm:inline">
            NOVA
          </span>
        </div>

        <div className="h-4 w-px bg-slate-200 mx-1 hidden md:block" />

        {/* Clean Role Toggle */}
        <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200/80">
          <button
            onClick={() => onRoleChange('ENGINEERING')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
              roleType === 'ENGINEERING'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Engineering</span>
          </button>

          <button
            onClick={() => onRoleChange('FRONTLINE')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
              roleType === 'FRONTLINE'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Frontline</span>
          </button>
        </div>
      </div>

      {/* Center Status */}
      <div className="hidden lg:flex items-center gap-2">
        {isCallActive ? (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="capitalize">{screenPhase.replace('_', ' ')} Phase</span>
            <span className="text-[11px] text-emerald-600 font-mono">({messageCount} turns)</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-500 text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            <span>Standby • Ready to Screen</span>
          </div>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        {/* Executive Memo Document */}
        <button
          onClick={onOpenSubmissionDoc}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium border border-slate-200 transition-colors shadow-2xs"
          title="View Ajith P Nayak Executive Memo"
        >
          <FileText className="w-3.5 h-3.5 text-slate-600" />
          <span className="hidden sm:inline">Executive Memo</span>
        </button>

        {/* Voice Audio Toggle */}
        <button
          onClick={onToggleVoice}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
            voiceEnabled
              ? 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100'
              : 'bg-slate-100 border-slate-200 text-slate-500 hover:bg-slate-200'
          }`}
          title={voiceEnabled ? 'Nova Voice Synthesis Active' : 'Nova Voice Muted'}
        >
          {voiceEnabled ? <Volume2 className="w-3.5 h-3.5 text-indigo-600" /> : <VolumeX className="w-3.5 h-3.5" />}
          <span className="hidden md:inline">{voiceEnabled ? 'Voice On' : 'Muted'}</span>
        </button>

        {/* 60s Auto Tour */}
        <button
          onClick={onStartAutoDemo}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            isAutoDemoActive
              ? 'bg-slate-900 text-white shadow-sm ring-2 ring-slate-400'
              : 'bg-slate-900 hover:bg-slate-800 text-white'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span className="font-semibold">60s Demo</span>
        </button>

        {/* Start / Reset */}
        {!isCallActive ? (
          <button
            onClick={onStartScreen}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-800 text-xs font-medium border border-slate-200 transition-colors shadow-2xs"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Start</span>
          </button>
        ) : (
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium border border-slate-200 transition-colors shadow-2xs"
            title="Reset conversation and state"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        )}

        {/* Prompt Invariants Drawer */}
        <button
          onClick={onOpenPrompt}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium border border-slate-200 transition-colors shadow-2xs"
          title="View Prompt Spec"
        >
          <FileCode className="w-3.5 h-3.5 text-slate-500" />
          <span className="hidden xl:inline">Prompt Spec</span>
        </button>
      </div>
    </header>
  );
};
