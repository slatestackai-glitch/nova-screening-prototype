'use client';

import React from 'react';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  X, 
  Sparkles, 
  Zap,
  RotateCcw
} from 'lucide-react';
import { SCRIPTED_TOUR_STEPS } from '@/lib/autoDemoScript';

interface AutoDemoTourProps {
  isActive: boolean;
  currentStepIndex: number;
  isPlaying: boolean;
  speed: number;
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  onClose: () => void;
  onSpeedChange: (speed: number) => void;
}

export const AutoDemoTour: React.FC<AutoDemoTourProps> = ({
  isActive,
  currentStepIndex,
  isPlaying,
  speed,
  onPlay,
  onPause,
  onNext,
  onPrev,
  onClose,
  onSpeedChange
}) => {
  if (!isActive) return null;

  const currentStep = SCRIPTED_TOUR_STEPS[currentStepIndex] || SCRIPTED_TOUR_STEPS[0];
  const progressPercent = ((currentStepIndex + 1) / SCRIPTED_TOUR_STEPS.length) * 100;

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-2xl bg-white border border-slate-300 rounded-2xl shadow-xl p-4 animate-in slide-in-from-bottom-4">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-md bg-slate-900 text-white">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-900">
              60s Guided Demo Walkthrough
            </span>
            <span className="text-[10px] font-mono ml-2 px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200">
              Step {currentStepIndex + 1} of {SCRIPTED_TOUR_STEPS.length}
            </span>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onSpeedChange(speed === 1 ? 1.5 : speed === 1.5 ? 2 : 1)}
            className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-[10px] font-mono text-slate-700 border border-slate-200 transition-colors"
            title="Toggle playback speed"
          >
            {speed}x
          </button>

          <button
            onClick={onPrev}
            disabled={currentStepIndex === 0}
            className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-30 transition-colors"
            title="Previous step"
          >
            <SkipBack className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={isPlaying ? onPause : onPlay}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white transition-colors shadow-2xs"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
          </button>

          <button
            onClick={onNext}
            disabled={currentStepIndex >= SCRIPTED_TOUR_STEPS.length - 1}
            className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-30 transition-colors"
            title="Next step"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onClose}
            className="p-1 ml-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            title="Exit Tour"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 rounded-full h-1 mb-2.5 overflow-hidden">
        <div 
          className="bg-slate-900 h-1 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Step Narration */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 flex items-start gap-2.5">
        <Zap className="w-4 h-4 text-slate-700 mt-0.5 shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h4 className="text-xs font-semibold text-slate-900 truncate">{currentStep.title}</h4>
            <span className="text-[10px] font-mono px-1 rounded bg-white border border-slate-200 text-slate-600">
              {currentStep.roleType}
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-sans">
            {currentStep.narration}
          </p>
        </div>
      </div>
    </div>
  );
};
