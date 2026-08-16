'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, RoleType, NovaState } from '@/lib/types';
import { playCallConnectChime } from '@/lib/audioChimes';
import { 
  Send, 
  Mic, 
  MicOff, 
  User, 
  Bot, 
  Volume2, 
  Phone,
  ArrowRight,
  Sparkles,
  BarChart3,
  Layers,
  CheckCircle2
} from 'lucide-react';

interface ChatProps {
  messages: ChatMessage[];
  isLoading: boolean;
  onSendMessage: (text: string) => void;
  roleType: RoleType;
  onStartScreen: () => void;
  isCallActive: boolean;
  isSpeaking: boolean;
  currentState: NovaState;
  onOpenAnalytics: () => void;
}

export const Chat: React.FC<ChatProps> = ({
  messages,
  isLoading,
  onSendMessage,
  roleType,
  onStartScreen,
  isCallActive,
  isSpeaking,
  currentState,
  onOpenAnalytics
}) => {
  const [inputText, setInputText] = useState('');
  const [isRecordingMic, setIsRecordingMic] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, isSpeaking]);

  useEffect(() => {
    if (messages.length === 1) {
      playCallConnectChime();
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const handleQuickPrompt = (prompt: string) => {
    if (isLoading) return;
    onSendMessage(prompt);
  };

  const toggleSpeechRecognition = () => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please type your response.');
      return;
    }

    if (isRecordingMic) {
      recognitionRef.current?.stop();
      setIsRecordingMic(false);
    } else {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsRecordingMic(true);
      };

      recognition.onresult = (event: any) => {
        const spoken = event.results[0][0].transcript;
        if (spoken) {
          setInputText(spoken);
        }
      };

      recognition.onerror = () => {
        setIsRecordingMic(false);
      };

      recognition.onend = () => {
        setIsRecordingMic(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    }
  };

  const evidenceCount = currentState.evidence?.length || 0;
  const confidenceTier = currentState.confidence?.tier || 'insufficient_evidence';

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-b from-slate-50/80 via-white to-slate-50/60 h-full overflow-hidden relative">
      {/* Sleek Minimal Header */}
      <div className="px-6 py-3.5 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className={`w-9 h-9 rounded-2xl flex items-center justify-center font-bold text-xs shadow-md ${
              roleType === 'ENGINEERING' ? 'bg-slate-950 text-white' : 'bg-amber-600 text-white'
            }`}>
              <Bot className="w-5 h-5" />
            </div>
            {isCallActive && (
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white animate-pulse" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold text-slate-950">
                Nova AI Recruiter
              </h3>
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                {roleType === 'ENGINEERING' ? 'Candidate: Alex (Backend)' : 'Candidate: Priya (Math Tutor)'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              {isCallActive ? 'Live Phone Screening In Progress' : 'Standby • Ready to Start'}
            </p>
          </div>
        </div>

        {/* Right Header: Floating Insights Trigger Pill & Voice Indicator */}
        <div className="flex items-center gap-2.5">
          {isSpeaking && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200 animate-pulse shadow-2xs">
              <Volume2 className="w-3.5 h-3.5" />
              <span>Nova Speaking...</span>
            </div>
          )}

          <button
            onClick={onOpenAnalytics}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200/90 text-xs font-bold shadow-2xs transition-all hover:scale-102"
            title="Open Live Evaluation & Skills Drawer"
          >
            <Layers className="w-3.5 h-3.5 text-indigo-600" />
            <span>Candidate Evaluation</span>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
              confidenceTier === 'high' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
            }`}>
              {evidenceCount} Skills
            </span>
          </button>
        </div>
      </div>

      {/* Main Conversation Feed (Centered, Spacious, Lambo-Grade) */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6 max-w-4xl mx-auto w-full">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 max-w-md mx-auto my-auto">
            <div className="w-16 h-16 rounded-3xl bg-slate-900 text-white flex items-center justify-center mb-5 shadow-xl">
              <Phone className="w-7 h-7" />
            </div>
            <h4 className="text-base font-extrabold text-slate-950 mb-2">
              Ready to Launch Phone Screen
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed font-normal">
              Nova introduces herself upfront as an AI, frames the conversation, actively probes vague claims, and builds a verified skills evaluation.
            </p>
            <button
              onClick={onStartScreen}
              className="flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-slate-950 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
            >
              <span>Begin Phone Interview</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isAssistant = msg.role === 'assistant';
            const probeChip = msg.probeChip;

            return (
              <div
                key={msg.id || index}
                className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'} space-y-1.5 animate-in fade-in duration-150`}
              >
                {/* Follow-up / Adaptive Probe Chip */}
                {isAssistant && probeChip && (
                  <div className="ml-11 flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-[11px] font-bold shadow-2xs">
                    <Sparkles className="w-3 h-3 text-amber-600" />
                    <span>Follow-up: {probeChip.replace('↳ probed: ', '')}</span>
                  </div>
                )}

                <div className={`flex items-start gap-3 max-w-[85%] ${isAssistant ? 'flex-row' : 'flex-row-reverse'}`}>
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-2xl flex items-center justify-center shrink-0 text-xs font-bold shadow-xs ${
                    isAssistant
                      ? 'bg-slate-950 text-white'
                      : 'bg-indigo-600 text-white'
                  }`}>
                    {isAssistant ? 'N' : <User className="w-4 h-4" />}
                  </div>

                  {/* Speech Card */}
                  <div className={`p-4 sm:p-5 rounded-3xl text-xs sm:text-sm leading-relaxed ${
                    isAssistant
                      ? 'bg-white border border-slate-200/90 text-slate-900 font-normal shadow-xs'
                      : 'bg-indigo-600 text-white font-medium shadow-md'
                  }`}>
                    <p className="whitespace-pre-wrap font-sans">
                      {msg.cleanContent || msg.content}
                    </p>
                  </div>
                </div>

                <span className="text-[10px] font-mono text-slate-400 px-3">
                  {msg.timestamp || 'just now'}
                </span>
              </div>
            );
          })
        )}

        {/* Loading Spinner Bubble */}
        {isLoading && (
          <div className="flex items-start gap-3 max-w-[80%] animate-in fade-in">
            <div className="w-8 h-8 rounded-2xl bg-slate-950 text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-xs">
              N
            </div>
            <div className="p-4 rounded-3xl bg-white border border-slate-200 text-slate-600 text-xs flex items-center gap-2.5 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-slate-900 animate-pulse" />
              <span className="w-2 h-2 rounded-full bg-slate-900 animate-pulse delay-150" />
              <span className="w-2 h-2 rounded-full bg-slate-900 animate-pulse delay-300" />
              <span className="text-slate-600 font-semibold ml-1">Nova is analyzing and listening...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts Bar */}
      {isCallActive && (
        <div className="px-6 py-2 bg-white/70 backdrop-blur-md border-t border-slate-100 flex items-center gap-2 overflow-x-auto text-xs max-w-4xl mx-auto w-full">
          <span className="text-slate-400 font-semibold shrink-0 text-[11px]">Quick prompts:</span>
          
          <button
            onClick={() => handleQuickPrompt('Yes, ready to proceed.')}
            disabled={isLoading}
            className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium whitespace-nowrap transition-colors shadow-2xs"
          >
            &quot;Yes, ready to proceed&quot;
          </button>

          <button
            onClick={() => handleQuickPrompt('I built a Python data analysis tool and a backend API.')}
            disabled={isLoading}
            className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium whitespace-nowrap transition-colors shadow-2xs"
          >
            &quot;Python data analysis&quot;
          </button>

          <button
            onClick={() => handleQuickPrompt('I migrated our Postgres ingestion pipeline to Kafka with Go consumer groups, cutting p99 latency from 420ms to 65ms.')}
            disabled={isLoading}
            className="px-3.5 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 font-bold whitespace-nowrap transition-colors shadow-2xs"
          >
            ⚡ &quot;Go & Kafka p99 65ms&quot;
          </button>

          <button
            onClick={() => handleQuickPrompt('What is the salary range for this role?')}
            disabled={isLoading}
            className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium whitespace-nowrap transition-colors shadow-2xs"
          >
            💰 &quot;Salary range?&quot;
          </button>
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-slate-200 bg-white shadow-lg">
        <div className="relative flex items-center gap-2 max-w-4xl mx-auto">
          {/* Voice Input Mic */}
          <button
            type="button"
            onClick={toggleSpeechRecognition}
            className={`p-3 rounded-2xl border transition-all ${
              isRecordingMic
                ? 'bg-rose-50 border-rose-300 text-rose-600 animate-pulse shadow-md'
                : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
            }`}
            title="Speak your reply"
          >
            {isRecordingMic ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isLoading}
            placeholder={isCallActive ? 'Type your reply or click a quick prompt above...' : 'Click "Begin Phone Interview" to start call...'}
            className="flex-1 bg-slate-100/80 border border-slate-200/90 rounded-2xl px-5 py-3 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-slate-950 focus:bg-white transition-all disabled:opacity-50"
          />

          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="p-3.5 rounded-2xl bg-slate-950 hover:bg-slate-800 text-white disabled:opacity-30 transition-all shadow-md"
            title="Send reply"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
