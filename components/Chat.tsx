'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, RoleType } from '@/lib/types';
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
  Sparkles
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

  return (
    <div className="flex-1 flex flex-col bg-white h-full overflow-hidden relative">
      {/* Call Status Bar */}
      <div className="px-6 py-3.5 border-b border-slate-100 bg-white flex items-center justify-between z-10 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className={`w-9 h-9 rounded-2xl flex items-center justify-center font-bold text-xs shadow-xs ${
              roleType === 'ENGINEERING' ? 'bg-slate-900 text-white' : 'bg-amber-600 text-white'
            }`}>
              <Bot className="w-5 h-5" />
            </div>
            {isCallActive && (
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold text-slate-950">
                Nova AI Recruiter
              </h3>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium">
                {roleType === 'ENGINEERING' ? 'Candidate: Alex' : 'Candidate: Priya'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              {isCallActive ? 'Live Audio Phone Screen Active' : 'Standby • Ready to start'}
            </p>
          </div>
        </div>

        {/* Spoken Voice Pulse */}
        <div className="flex items-center gap-2">
          {isSpeaking && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold animate-pulse">
              <Volume2 className="w-3.5 h-3.5" />
              <span>Nova Speaking...</span>
            </div>
          )}
        </div>
      </div>

      {/* Message Feed */}
      <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-slate-50/40">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 max-w-sm mx-auto">
            <div className="w-14 h-14 rounded-3xl bg-slate-100 flex items-center justify-center text-slate-700 mb-4 shadow-xs">
              <Phone className="w-6 h-6 text-slate-900" />
            </div>
            <h4 className="text-sm font-bold text-slate-950 mb-1.5">
              Ready to Start Phone Screen
            </h4>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              Nova introduces herself, discloses AI identity upfront, frames the conversation, and dynamically asks adaptive questions.
            </p>
            <button
              onClick={onStartScreen}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all"
            >
              <span>Begin Phone Call</span>
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
                className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'} space-y-1.5`}
              >
                {/* Follow-up / Probe Tag */}
                {isAssistant && probeChip && (
                  <div className="ml-10 flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-[11px] font-semibold">
                    <Sparkles className="w-3 h-3 text-amber-600" />
                    <span>Follow-up: {probeChip.replace('↳ probed: ', '')}</span>
                  </div>
                )}

                <div className={`flex items-start gap-3 max-w-[85%] ${isAssistant ? 'flex-row' : 'flex-row-reverse'}`}>
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-2xl flex items-center justify-center shrink-0 text-xs font-bold shadow-2xs ${
                    isAssistant
                      ? 'bg-slate-950 text-white'
                      : 'bg-indigo-600 text-white'
                  }`}>
                    {isAssistant ? 'N' : <User className="w-4 h-4" />}
                  </div>

                  {/* Speech Bubble */}
                  <div className={`px-5 py-3.5 rounded-3xl text-xs sm:text-sm leading-relaxed shadow-2xs ${
                    isAssistant
                      ? 'bg-white border border-slate-200/90 text-slate-900 font-normal'
                      : 'bg-indigo-600 text-white font-medium shadow-sm'
                  }`}>
                    <p className="whitespace-pre-wrap">
                      {msg.cleanContent || msg.content}
                    </p>
                  </div>
                </div>

                <span className="text-[10px] text-slate-400 px-3">
                  {msg.timestamp || 'just now'}
                </span>
              </div>
            );
          })
        )}

        {/* Loading Bubble */}
        {isLoading && (
          <div className="flex items-start gap-3 max-w-[80%] animate-in fade-in">
            <div className="w-8 h-8 rounded-2xl bg-slate-950 text-white flex items-center justify-center text-xs font-bold shrink-0">
              N
            </div>
            <div className="px-5 py-3.5 rounded-3xl bg-white border border-slate-200 text-slate-500 text-xs flex items-center gap-2 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-900 animate-pulse" />
              <span className="w-1.5 h-1.5 rounded-full bg-slate-900 animate-pulse delay-150" />
              <span className="w-1.5 h-1.5 rounded-full bg-slate-900 animate-pulse delay-300" />
              <span className="text-slate-600 font-medium">Listening...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Replies */}
      {isCallActive && (
        <div className="px-5 py-2 border-t border-slate-100 bg-white flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-slate-400 font-medium shrink-0 text-[11px]">Quick prompts:</span>
          
          <button
            onClick={() => handleQuickPrompt('Yes, I am happy to proceed.')}
            disabled={isLoading}
            className="px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium whitespace-nowrap transition-colors"
          >
            &quot;Yes, ready to proceed&quot;
          </button>

          <button
            onClick={() => handleQuickPrompt('We improved pipeline latency and scaled it up.')}
            disabled={isLoading}
            className="px-3 py-1 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-medium whitespace-nowrap transition-colors"
          >
            &quot;We improved latency&quot;
          </button>

          <button
            onClick={() => handleQuickPrompt('I personally migrated Postgres ingestion to Kafka with Go consumer groups, cutting p99 latency from 420ms to 65ms.')}
            disabled={isLoading}
            className="px-3 py-1 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 font-semibold whitespace-nowrap transition-colors"
          >
            &quot;Go & Kafka (p99 65ms)&quot;
          </button>

          <button
            onClick={() => handleQuickPrompt('What is the salary band for this position?')}
            disabled={isLoading}
            className="px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium whitespace-nowrap transition-colors"
          >
            &quot;What is the salary band?&quot;
          </button>
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-slate-100 bg-white">
        <div className="relative flex items-center gap-2 max-w-4xl mx-auto">
          {/* Mic Button */}
          <button
            type="button"
            onClick={toggleSpeechRecognition}
            className={`p-3 rounded-2xl border transition-all ${
              isRecordingMic
                ? 'bg-rose-50 border-rose-300 text-rose-600 animate-pulse'
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
            placeholder={isCallActive ? 'Type candidate answer or click a quick prompt above...' : 'Click "Begin Phone Call" above...'}
            className="flex-1 bg-slate-100/80 border border-slate-200 rounded-2xl px-5 py-3 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-slate-950 focus:bg-white transition-all disabled:opacity-50"
          />

          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="p-3 rounded-2xl bg-slate-950 hover:bg-slate-800 text-white disabled:opacity-30 transition-all shadow-md"
            title="Send"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
