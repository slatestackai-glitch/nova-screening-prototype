'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Key, 
  Sparkles, 
  Check, 
  Volume2, 
  ShieldCheck, 
  ExternalLink,
  Cpu,
  RefreshCw
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose
}) => {
  const [geminiKey, setGeminiKey] = useState('');
  const [elevenLabsKey, setElevenLabsKey] = useState('');
  const [selectedVoice, setSelectedVoice] = useState('21m00Tcm4TlvDq8ikWAM');
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setGeminiKey(localStorage.getItem('nova_gemini_key') || '');
      setElevenLabsKey(localStorage.getItem('nova_elevenlabs_key') || '');
      setSelectedVoice(localStorage.getItem('nova_voice_id') || '21m00Tcm4TlvDq8ikWAM');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (typeof window !== 'undefined') {
      if (geminiKey.trim()) {
        localStorage.setItem('nova_gemini_key', geminiKey.trim());
      } else {
        localStorage.removeItem('nova_gemini_key');
      }

      if (elevenLabsKey.trim()) {
        localStorage.setItem('nova_elevenlabs_key', elevenLabsKey.trim());
      } else {
        localStorage.removeItem('nova_elevenlabs_key');
      }

      localStorage.setItem('nova_voice_id', selectedVoice);
    }

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 1200);
  };

  const handleClear = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('nova_gemini_key');
      localStorage.removeItem('nova_elevenlabs_key');
      setGeminiKey('');
      setElevenLabsKey('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
      <div 
        className="w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-slate-900 text-white shadow-xs">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-950">Model & Voice Settings</h2>
              <p className="text-xs text-slate-500 font-medium">Configure Gemini AI & ElevenLabs Voice keys</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-xs text-slate-700">
          {/* Gemini API Key Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-900 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-indigo-600" />
                <span>Google Gemini API Key</span>
              </label>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
              >
                <span>Get Free Key (Google AI Studio)</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <input
              type="password"
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
              placeholder="Paste your Gemini API key (AIzaSy...)"
              className="w-full glass-card bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
            />
            <p className="text-[11px] text-slate-500 font-medium">
              Free Tier: 15 Requests/Min, 1M Tokens/Min. Automatically rate-limited for safety.
            </p>
          </div>

          {/* ElevenLabs API Key Section */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-900 flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-amber-600" />
                <span>ElevenLabs API Key (Optional)</span>
              </label>
              <a
                href="https://elevenlabs.io/app/speech-synthesis"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-amber-600 hover:text-amber-800 font-semibold flex items-center gap-1"
              >
                <span>Get Key (elevenlabs.io)</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <input
              type="password"
              value={elevenLabsKey}
              onChange={(e) => setElevenLabsKey(e.target.value)}
              placeholder="Paste ElevenLabs key (or leave blank for Neural Voice)"
              className="w-full glass-card bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
            />
          </div>

          {/* Voice Personality Selector */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="font-bold text-slate-900 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Voice Model Profile</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSelectedVoice('21m00Tcm4TlvDq8ikWAM')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  selectedVoice === '21m00Tcm4TlvDq8ikWAM'
                    ? 'border-slate-900 bg-slate-900 text-white shadow-xs font-bold'
                    : 'glass-card text-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="text-xs">Rachel (ElevenLabs)</div>
                <div className={`text-[10px] ${selectedVoice === '21m00Tcm4TlvDq8ikWAM' ? 'text-slate-300' : 'text-slate-500'}`}>
                  Calm, professional recruiter
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedVoice('EXAVITQu4vr4xnSDxMaL')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  selectedVoice === 'EXAVITQu4vr4xnSDxMaL'
                    ? 'border-slate-900 bg-slate-900 text-white shadow-xs font-bold'
                    : 'glass-card text-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="text-xs">Sarah (ElevenLabs)</div>
                <div className={`text-[10px] ${selectedVoice === 'EXAVITQu4vr4xnSDxMaL' ? 'text-slate-300' : 'text-slate-500'}`}>
                  Warm & conversational
                </div>
              </button>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              If no ElevenLabs key is provided, Nova automatically uses high-definition Neural Web Speech voices (*Google US English / Samantha*).
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            onClick={handleClear}
            className="text-xs text-rose-600 hover:text-rose-800 font-semibold"
          >
            Clear Stored Keys
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-200 text-xs font-semibold transition-colors"
            >
              Cancel
            </button>

            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-md transition-all"
            >
              {saveSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Saved!</span>
                </>
              ) : (
                <span>Save Settings</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
