'use client';

import React, { useState } from 'react';
import { RoleType } from '@/lib/types';
import { buildSystemPrompt } from '@/lib/systemPrompt';
import { X, Copy, Check, FileCode, ShieldCheck } from 'lucide-react';

interface PromptDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  roleType: RoleType;
}

export const PromptDrawer: React.FC<PromptDrawerProps> = ({
  isOpen,
  onClose,
  roleType
}) => {
  const [copied, setCopied] = useState(false);
  const promptText = buildSystemPrompt(roleType);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(promptText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in">
      <div 
        className="w-full max-w-2xl bg-white border-l border-slate-200 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-white border border-slate-200 text-slate-800 shadow-2xs">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-semibold text-slate-900 text-sm">Prompt Architecture & Invariants</h2>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-mono">
                  {roleType}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Server-side system prompt with active {roleType} fact sheet
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium border border-slate-200 transition-colors shadow-2xs"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-semibold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>Copy Prompt</span>
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              title="Close drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Invariant Banner */}
        <div className="px-6 py-2 bg-emerald-50 border-b border-emerald-100 flex items-center gap-2 text-emerald-800 text-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            Verbatim specification: Injected server-side with zero client exposure.
          </span>
        </div>

        {/* Monospace Prompt Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
          <pre className="font-mono-code text-xs text-slate-800 whitespace-pre-wrap leading-relaxed bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
            {promptText}
          </pre>
        </div>

        {/* Drawer Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>Engine: <strong className="text-slate-800">Google Gemini 2.0 Flash</strong></span>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
