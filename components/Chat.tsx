'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, RoleType } from '@/lib/types';
import { playCallConnectChime, playProbeBeep } from '@/lib/audioChimes';
import { 
  Send, 
  Mic, 
  MicOff, 
  User, 
  Bot, 
  Sparkles, 
  Volume2, 
  PhoneCall,
  CornerDownRight,
  Radio,
  Activity
} from 'lucide-react';

interface ChatProps {
  messages: ChatMessage[];
  isLoading: boolean;
  onSendMessage: (text: string) => void;
  roleType: RoleType;
  onStartScreen: () => void;
  isCallActive: boolean;
  isSpeaking: boolean;
}

export const Chat: React.FC<ChatProps> = ({
  messages,
  isLoading,
  onSendMessage,
  roleType,
  onStartScreen,
  isCallActive,
  isSpeaking
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

  // Play subtle connect chime when first turn lands
  useEffect(() => {
    if (messages.length === 1) {
      playCallConnectChime();
    } else if (messages.length > 1) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg.role === 'assistant' && lastMsg.probeChip) {
        playProbeBeep();
      }
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

  // Toggle Browser Speech Recognition (STT)
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

  return (
    <div className="flex-1 flex flex-col glass-panel border-r border-slate-200/80 h-full overflow-hidden relative">
      {/* Call Header */}
      <div className="px-5 py-3.5 border-b border-slate-200/70 bg-white/70 backdrop-blur-md flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shadow-xs ${
              roleType === 'ENGINEERING' ? 'bg-indigo-600 text-white' : 'bg-amber-600 text-white'
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
                Nova AI Voice Recruiter
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium border border-slate-200">
                {roleType === 'ENGINEERING' ? 'Candidate: Alex (Go/Backend)' : 'Candidate: Priya (Math Tutor)'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              {isCallActive ? 'Live Audio Phone Call • Recruiter Recording Active' : 'Call Standby'}
            </p>
          </div>
        </div>

        {/* Dynamic Equalizer Wave */}
        <div className="flex items-center gap-2.5">
          {isSpeaking && (
            <span className="text-[11px] text-indigo-600 font-semibold flex items-center gap-1.5 animate-pulse">
              <Volume2 className="w-3.5 h-3.5" />
              <span>Nova Speaking</span>
            </span>
          )}
          <div className="flex items-center gap-1 h-5 px-2.5 py-1 rounded-xl bg-slate-100/80 border border-slate-200/60 shadow-2xs">
            <span className={`w-1 rounded-full bg-indigo-600 ${isSpeaking ? 'animate-audio-bar-1' : isCallActive ? 'h-2.5 bg-slate-700' : 'h-1.5 bg-slate-400'}`} />
            <span className={`w-1 rounded-full bg-indigo-600 ${isSpeaking ? 'animate-audio-bar-2' : isCallActive ? 'h-4 bg-slate-700' : 'h-1.5 bg-slate-400'}`} />
            <span className={`w-1 rounded-full bg-indigo-600 ${isSpeaking ? 'animate-audio-bar-3' : isCallActive ? 'h-3 bg-slate-700' : 'h-1.5 bg-slate-400'}`} />
            <span className={`w-1 rounded-full bg-indigo-600 ${isSpeaking ? 'animate-audio-bar-4' : isCallActive ? 'h-3.5 bg-slate-700' : 'h-1.5 bg-slate-400'}`} />
            <span className={`w-1 rounded-full bg-indigo-600 ${isSpeaking ? 'animate-audio-bar-5' : isCallActive ? 'h-2 bg-slate-700' : 'h-1.5 bg-slate-400'}`} />
          </div>
        </div>
      </div>

      {/* Messages Transcript */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/40">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 max-w-sm mx-auto">
            <div className="w-12 h-12 rounded-2xl glass-card flex items-center justify-center text-slate-700 mb-3.5 shadow-md">
              <PhoneCall className="w-6 h-6 text-indigo-600" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 mb-1.5">
              No screen running. Pick a role type and start.
            </h4>
            <p className="text-xs text-slate-500 mb-5 leading-relaxed">
              Launch an Engineering screen to observe Nova&apos;s adaptive probe engine, real-time claim extraction, and evidence-linked scoring.
            </p>
            <button
              onClick={onStartScreen}
              className="px-5 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all"
            >
              Start Phone Screen
            </button>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isAssistant = msg.role === 'assistant';
            const probeChip = msg.probeChip;

            return (
              <div
                key={msg.id || index}
                className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'}`}
              >
                {/* Adaptive Probe Chip */}
                {isAssistant && probeChip && (
                  <div className="mb-1.5 ml-9 flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-50 border border-amber-300 text-amber-900 text-[11px] font-mono font-bold shadow-xs animate-in fade-in">
                    <CornerDownRight className="w-3 h-3 text-amber-600" />
                    <span>{probeChip}</span>
                  </div>
                )}

                <div className={`flex items-start gap-2.5 max-w-[85%] ${isAssistant ? 'flex-row' : 'flex-row-reverse'}`}>
                  {/* Avatar */}
                  <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold shadow-2xs ${
                    isAssistant
                      ? 'bg-slate-950 text-white'
                      : 'bg-indigo-600 text-white'
                  }`}>
                    {isAssistant ? 'N' : <User className="w-3.5 h-3.5" />}
                  </div>

                  {/* Message Bubble */}
                  <div className={`px-4 py-3 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    isAssistant
                      ? 'glass-card border-slate-200/80 text-slate-900 shadow-xs'
                      : 'bg-indigo-600 text-white shadow-md'
                  }`}>
                    <p className="whitespace-pre-wrap font-sans">
                      {msg.cleanContent || msg.content}
                    </p>
                  </div>
                </div>

                {/* Timestamp */}
                <span className="text-[10px] font-mono text-slate-400 mt-1 px-1">
                  {msg.timestamp || 'just now'}
                </span>
              </div>
            );
          })
        )}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-start gap-2.5 max-w-[80%] animate-in fade-in">
            <div className="w-7 h-7 rounded-xl bg-slate-950 text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-2xs">
              N
            </div>
            <div className="px-4 py-3 rounded-2xl glass-card border-slate-200/80 text-slate-600 flex items-center gap-2 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-900 animate-pulse" />
              <span className="w-1.5 h-1.5 rounded-full bg-slate-900 animate-pulse delay-150" />
              <span className="w-1.5 h-1.5 rounded-full bg-slate-900 animate-pulse delay-300" />
              <span className="text-xs text-slate-500 font-mono ml-1">Analyzing candidate response...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Discrete Quick-Test Bar */}
      {isCallActive && (
        <div className="px-4 py-2 border-t border-slate-200/70 bg-white/80 backdrop-blur-md flex items-center gap-1.5 overflow-x-auto text-[11px]">
          <span className="text-slate-400 font-mono shrink-0 mr-1 text-[10px] uppercase font-semibold">Demo presets:</span>
          
          <button
            onClick={() => handleQuickPrompt('Yes, now works and I am happy to proceed.')}
            disabled={isLoading}
            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200/80 whitespace-nowrap transition-colors font-medium shadow-2xs"
          >
            ✓ Consent: &quot;Yes, ready&quot;
          </button>

          <button
            onClick={() => handleQuickPrompt('We improved the pipeline performance and made it much faster for the team.')}
            disabled={isLoading}
            className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 whitespace-nowrap transition-colors font-semibold shadow-2xs"
          >
            ⚠️ Vague: &quot;We improved pipeline&quot;
          </button>

          <button
            onClick={() => handleQuickPrompt('I personally migrated Postgres ingestion to Kafka with Go consumer groups partitioned by tenant ID, cutting p99 latency from 420ms to 65ms.')}
            disabled={isLoading}
            className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 whitespace-nowrap transition-colors font-semibold shadow-2xs"
          >
            ⚡ Concrete: &quot;Go/Kafka p99 65ms&quot;
          </button>

          <button
            onClick={() => handleQuickPrompt('What is the salary band for this role?')}
            disabled={isLoading}
            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200/80 whitespace-nowrap transition-colors shadow-2xs"
          >
            💰 &quot;Salary range?&quot;
          </button>

          <button
            onClick={() => handleQuickPrompt('Who will be my direct engineering manager?')}
            disabled={isLoading}
            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200/80 whitespace-nowrap transition-colors shadow-2xs"
          >
            👤 &quot;Who is the manager?&quot;
          </button>
        </div>
      )}

      {/* Input Area with Speech Mic */}
      <form onSubmit={handleSubmit} className="p-3.5 border-t border-slate-200/80 bg-white/90 backdrop-blur-md">
        <div className="relative flex items-center gap-2">
          {/* Mic Button */}
          <button
            type="button"
            onClick={toggleSpeechRecognition}
            className={`p-2.5 rounded-xl border transition-all ${
              isRecordingMic
                ? 'bg-rose-50 border-rose-300 text-rose-600 shadow-md animate-pulse'
                : 'glass-card border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
            title={isRecordingMic ? 'Listening... click to stop' : 'Speak your answer (Speech to Text)'}
          >
            {isRecordingMic ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isLoading}
            placeholder={isCallActive ? 'Type or speak candidate response... (or click a preset above)' : 'Click "Start Screen" to begin call...'}
            className="flex-1 glass-card bg-slate-50/80 border border-slate-200/90 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-slate-950 focus:border-transparent transition-all disabled:opacity-50"
          />

          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white disabled:opacity-40 disabled:hover:bg-slate-950 transition-all shadow-md"
            title="Send response"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
