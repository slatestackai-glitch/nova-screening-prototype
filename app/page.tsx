'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { RoleType, NovaState, ChatMessage } from '@/lib/types';
import { parseNovaState, getProbeChipLabel, INITIAL_NOVA_STATE } from '@/lib/parseState';
import { playAssistantVoice, stopAllVoice } from '@/lib/voiceEngine';
import { SCRIPTED_TOUR_STEPS } from '@/lib/autoDemoScript';
import { LandingPage } from '@/components/LandingPage';
import { TopBar } from '@/components/TopBar';
import { Chat } from '@/components/Chat';
import { RecruiterConsole } from '@/components/RecruiterConsole';
import { PromptDrawer } from '@/components/PromptDrawer';
import { SubmissionDocModal } from '@/components/SubmissionDocModal';
import { SettingsModal } from '@/components/SettingsModal';
import { AutoDemoTour } from '@/components/AutoDemoTour';

export default function Home() {
  const [view, setView] = useState<'landing' | 'workspace'>('landing');
  const [roleType, setRoleType] = useState<RoleType>('ENGINEERING');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentState, setCurrentState] = useState<NovaState>(INITIAL_NOVA_STATE);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPromptDrawerOpen, setIsPromptDrawerOpen] = useState<boolean>(false);
  const [isSubmissionDocOpen, setIsSubmissionDocOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState<boolean>(false);
  const [confirmRoleSwitch, setConfirmRoleSwitch] = useState<RoleType | null>(null);

  // Voice State
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(true);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // 60s Guided Demo State
  const [isAutoDemoActive, setIsAutoDemoActive] = useState<boolean>(false);
  const [autoDemoStep, setAutoDemoStep] = useState<number>(0);
  const [isAutoDemoPlaying, setIsAutoDemoPlaying] = useState<boolean>(false);
  const [autoDemoSpeed, setAutoDemoSpeed] = useState<number>(1);
  const autoDemoTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Reset conversation and state
  const handleReset = useCallback(() => {
    if (autoDemoTimerRef.current) clearTimeout(autoDemoTimerRef.current);
    stopAllVoice();
    setIsSpeaking(false);
    setIsAutoDemoActive(false);
    setIsAutoDemoPlaying(false);
    setAutoDemoStep(0);
    setMessages([]);
    setCurrentState(INITIAL_NOVA_STATE);
    setIsLoading(false);
  }, []);

  // Handle Role Change with confirmation if screen is active
  const handleRoleChangeRequest = (newRole: RoleType) => {
    if (newRole === roleType) return;
    if (messages.length > 0) {
      setConfirmRoleSwitch(newRole);
    } else {
      setRoleType(newRole);
    }
  };

  const confirmSwitchRole = () => {
    if (confirmRoleSwitch) {
      setRoleType(confirmRoleSwitch);
      handleReset();
      setConfirmRoleSwitch(null);
    }
  };

  // Dispatch message to screening API
  const handleSendMessage = async (text: string, overrideRole?: RoleType) => {
    const activeRole = overrideRole || roleType;
    const userMsgId = `user-${Date.now()}`;
    const newTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newUserMessage: ChatMessage = {
      id: userMsgId,
      role: 'user',
      content: text,
      cleanContent: text,
      timestamp: newTimestamp
    };

    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
    setIsLoading(true);

    const clientGeminiKey = typeof window !== 'undefined' ? localStorage.getItem('nova_gemini_key') || undefined : undefined;

    try {
      const response = await fetch('/api/screen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map(m => ({
            role: m.role,
            content: m.content
          })),
          roleType: activeRole,
          clientGeminiKey
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const data = await response.json();
      const rawAssistantContent = data.content || '';

      const { cleanText, state: parsedState } = parseNovaState(rawAssistantContent, currentState);
      const probeChip = getProbeChipLabel(parsedState.last_answer_class);

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: rawAssistantContent,
        cleanContent: cleanText,
        state: parsedState,
        probeChip: probeChip,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      const finalMessages = [...updatedMessages, assistantMsg];
      setMessages(finalMessages);
      setCurrentState(parsedState);

      if (voiceEnabled) {
        playAssistantVoice(cleanText, {
          onStart: () => setIsSpeaking(true),
          onEnd: () => setIsSpeaking(false)
        });
      }
    } catch (err: any) {
      console.error('[Nova Client Error]', err);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: 'Error communicating with screening engine. Operating in local safe mode.',
        cleanContent: 'Error communicating with screening engine. Operating in local safe mode.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Start Screen turn 1
  const handleStartScreen = async (targetRole?: RoleType) => {
    const roleToUse = targetRole || roleType;
    handleReset();
    setIsLoading(true);

    const clientGeminiKey = typeof window !== 'undefined' ? localStorage.getItem('nova_gemini_key') || undefined : undefined;

    try {
      const response = await fetch('/api/screen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [],
          roleType: roleToUse,
          clientGeminiKey
        })
      });

      const data = await response.json();
      const rawContent = data.content || '';
      const { cleanText, state: parsedState } = parseNovaState(rawContent, INITIAL_NOVA_STATE);

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: rawContent,
        cleanContent: cleanText,
        state: parsedState,
        probeChip: null,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages([assistantMsg]);
      setCurrentState(parsedState);

      if (voiceEnabled) {
        playAssistantVoice(cleanText, {
          onStart: () => setIsSpeaking(true),
          onEnd: () => setIsSpeaking(false)
        });
      }
    } catch (err) {
      console.error('Failed to start screen', err);
    } finally {
      setIsLoading(false);
    }
  };

  // --- 60s GUIDED DEMO STATE ENGINE ---
  const startAutoDemo = () => {
    handleReset();
    setView('workspace');
    setRoleType('ENGINEERING');
    setIsAutoDemoActive(true);
    setAutoDemoStep(0);
    setIsAutoDemoPlaying(true);
  };

  // Execute Step in Scripted Tour
  const renderTourStep = useCallback((stepIdx: number) => {
    const step = SCRIPTED_TOUR_STEPS[stepIdx];
    if (!step) return;

    setRoleType(step.roleType);
    setCurrentState(step.state);

    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newHistory: ChatMessage[] = [];

    for (let i = 0; i < stepIdx; i++) {
      const prev = SCRIPTED_TOUR_STEPS[i];
      if (prev.roleType === step.roleType) {
        if (prev.candidateInput) {
          newHistory.push({
            id: `tour-user-${i}`,
            role: 'user',
            content: prev.candidateInput,
            cleanContent: prev.candidateInput,
            timestamp: nowTime
          });
        }
        newHistory.push({
          id: `tour-assistant-${i}`,
          role: 'assistant',
          content: prev.novaResponse,
          cleanContent: prev.novaResponse,
          probeChip: prev.probeChip,
          state: prev.state,
          timestamp: nowTime
        });
      }
    }

    if (step.candidateInput) {
      newHistory.push({
        id: `tour-user-${stepIdx}`,
        role: 'user',
        content: step.candidateInput,
        cleanContent: step.candidateInput,
        timestamp: nowTime
      });
    }

    newHistory.push({
      id: `tour-assistant-${stepIdx}`,
      role: 'assistant',
      content: step.novaResponse,
      cleanContent: step.novaResponse,
      probeChip: step.probeChip,
      state: step.state,
      timestamp: nowTime
    });

    setMessages(newHistory);

    if (voiceEnabled) {
      playAssistantVoice(step.novaResponse, {
        onStart: () => setIsSpeaking(true),
        onEnd: () => setIsSpeaking(false)
      });
    }
  }, [voiceEnabled]);

  useEffect(() => {
    if (!isAutoDemoActive || !isAutoDemoPlaying) {
      if (autoDemoTimerRef.current) clearTimeout(autoDemoTimerRef.current);
      return;
    }

    const currentStep = SCRIPTED_TOUR_STEPS[autoDemoStep];
    if (!currentStep) {
      setIsAutoDemoPlaying(false);
      return;
    }

    renderTourStep(autoDemoStep);

    const duration = currentStep.durationMs / autoDemoSpeed;
    autoDemoTimerRef.current = setTimeout(() => {
      if (autoDemoStep < SCRIPTED_TOUR_STEPS.length - 1) {
        setAutoDemoStep(prev => prev + 1);
      } else {
        setIsAutoDemoPlaying(false);
      }
    }, duration);

    return () => {
      if (autoDemoTimerRef.current) clearTimeout(autoDemoTimerRef.current);
    };
  }, [isAutoDemoActive, isAutoDemoPlaying, autoDemoStep, autoDemoSpeed, renderTourStep]);

  const handleNextStep = () => {
    if (autoDemoStep < SCRIPTED_TOUR_STEPS.length - 1) {
      setAutoDemoStep(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (autoDemoStep > 0) {
      setAutoDemoStep(prev => prev - 1);
    }
  };

  // Render Landing Page View
  if (view === 'landing') {
    return (
      <>
        <LandingPage
          selectedRole={roleType}
          onSelectRole={(r) => setRoleType(r)}
          onStartInteractive={() => {
            setView('workspace');
            handleStartScreen(roleType);
          }}
          onStartAutoTour={startAutoDemo}
          onOpenPrompt={() => setIsPromptDrawerOpen(true)}
          onOpenSubmissionDoc={() => setIsSubmissionDocOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />

        <PromptDrawer
          isOpen={isPromptDrawerOpen}
          onClose={() => setIsPromptDrawerOpen(false)}
          roleType={roleType}
        />

        <SubmissionDocModal
          isOpen={isSubmissionDocOpen}
          onClose={() => setIsSubmissionDocOpen(false)}
        />

        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
        />
      </>
    );
  }

  // Render Workspace Full-Screen View
  return (
    <main className="h-screen w-screen flex flex-col bg-slate-50 mesh-gradient-bg overflow-hidden">
      {/* TopBar */}
      <TopBar
        roleType={roleType}
        onRoleChange={handleRoleChangeRequest}
        onStartScreen={() => handleStartScreen()}
        onReset={handleReset}
        onOpenPrompt={() => setIsPromptDrawerOpen(true)}
        onOpenSubmissionDoc={() => setIsSubmissionDocOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onStartAutoDemo={startAutoDemo}
        isAutoDemoActive={isAutoDemoActive}
        isCallActive={messages.length > 0}
        screenPhase={currentState.phase}
        messageCount={messages.length}
        onBackToLanding={() => setView('landing')}
        voiceEnabled={voiceEnabled}
        onToggleVoice={() => {
          if (voiceEnabled) stopAllVoice();
          setVoiceEnabled(!voiceEnabled);
        }}
      />

      {/* Main Full-Width Conversation Canvas */}
      <div className="flex-1 flex overflow-hidden relative">
        <Chat
          messages={messages}
          isLoading={isLoading}
          onSendMessage={(txt) => handleSendMessage(txt)}
          roleType={roleType}
          onStartScreen={() => handleStartScreen()}
          isCallActive={messages.length > 0}
          isSpeaking={isSpeaking}
          currentState={currentState}
          onOpenAnalytics={() => setIsAnalyticsOpen(true)}
        />
      </div>

      {/* Slide-Up Candidate Evaluation & Insights Drawer */}
      <RecruiterConsole
        state={currentState}
        roleType={roleType}
        isOpen={isAnalyticsOpen}
        onClose={() => setIsAnalyticsOpen(false)}
      />

      {/* 60s Guided Demo Controller HUD */}
      <AutoDemoTour
        isActive={isAutoDemoActive}
        currentStepIndex={autoDemoStep}
        isPlaying={isAutoDemoPlaying}
        speed={autoDemoSpeed}
        onPlay={() => setIsAutoDemoPlaying(true)}
        onPause={() => setIsAutoDemoPlaying(false)}
        onNext={handleNextStep}
        onPrev={handlePrevStep}
        onClose={() => {
          setIsAutoDemoActive(false);
          setIsAutoDemoPlaying(false);
        }}
        onSpeedChange={setAutoDemoSpeed}
      />

      {/* Prompt Invariants Drawer */}
      <PromptDrawer
        isOpen={isPromptDrawerOpen}
        onClose={() => setIsPromptDrawerOpen(false)}
        roleType={roleType}
      />

      {/* Complete Submission Document Modal */}
      <SubmissionDocModal
        isOpen={isSubmissionDocOpen}
        onClose={() => setIsSubmissionDocOpen(false)}
      />

      {/* In-App API Key & Voice Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* Role Switch Confirmation Modal */}
      {confirmRoleSwitch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-slate-950">Switch Role Type?</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Switching to <strong className="text-slate-950">{confirmRoleSwitch}</strong> mid-screen will reset the active call transcript and evaluation state.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setConfirmRoleSwitch(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={confirmSwitchRole}
                className="px-4.5 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold shadow-xs"
              >
                Switch & Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
