'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { RoleType, NovaState, ChatMessage } from '@/lib/types';
import { parseNovaState, getProbeChipLabel, INITIAL_NOVA_STATE } from '@/lib/parseState';
import { speakText, stopSpeaking } from '@/lib/voiceEngine';
import { SCRIPTED_TOUR_STEPS, ScriptedTourStep } from '@/lib/autoDemoScript';
import { LandingPage } from '@/components/LandingPage';
import { TopBar } from '@/components/TopBar';
import { Chat } from '@/components/Chat';
import { RecruiterConsole } from '@/components/RecruiterConsole';
import { PromptDrawer } from '@/components/PromptDrawer';
import { SubmissionDocModal } from '@/components/SubmissionDocModal';
import { AutoDemoTour } from '@/components/AutoDemoTour';

export default function Home() {
  const [view, setView] = useState<'landing' | 'workspace'>('landing');
  const [roleType, setRoleType] = useState<RoleType>('ENGINEERING');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentState, setCurrentState] = useState<NovaState>(INITIAL_NOVA_STATE);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPromptDrawerOpen, setIsPromptDrawerOpen] = useState<boolean>(false);
  const [isSubmissionDocOpen, setIsSubmissionDocOpen] = useState<boolean>(false);
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
    stopSpeaking();
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

    try {
      const response = await fetch('/api/screen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map(m => ({
            role: m.role,
            content: m.content
          })),
          roleType: activeRole
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

      // Voice synthesis
      if (voiceEnabled) {
        speakText(
          cleanText,
          () => setIsSpeaking(true),
          () => setIsSpeaking(false)
        );
      }
    } catch (err: any) {
      console.error('[Nova Client Error]', err);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: 'Error communicating with screening engine. Please verify server connection.',
        cleanContent: 'Error communicating with screening engine. Please verify server connection.',
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

    try {
      const response = await fetch('/api/screen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [],
          roleType: roleToUse
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

      // Voice synthesis
      if (voiceEnabled) {
        speakText(
          cleanText,
          () => setIsSpeaking(true),
          () => setIsSpeaking(false)
        );
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

    // Build cumulative transcript history for the tour
    const newHistory: ChatMessage[] = [];

    // Include prior turns up to this step
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

    // Add current turn
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

    // Speak Nova's turn
    if (voiceEnabled) {
      speakText(
        step.novaResponse,
        () => setIsSpeaking(true),
        () => setIsSpeaking(false)
      );
    }
  }, [voiceEnabled]);

  // Driven Timer for Auto Tour
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
      </>
    );
  }

  // Render Workspace Split-Screen View
  return (
    <main className="h-screen w-screen flex flex-col bg-slate-50 overflow-hidden">
      {/* Clean Light TopBar */}
      <TopBar
        roleType={roleType}
        onRoleChange={handleRoleChangeRequest}
        onStartScreen={() => handleStartScreen()}
        onReset={handleReset}
        onOpenPrompt={() => setIsPromptDrawerOpen(true)}
        onOpenSubmissionDoc={() => setIsSubmissionDocOpen(true)}
        onStartAutoDemo={startAutoDemo}
        isAutoDemoActive={isAutoDemoActive}
        isCallActive={messages.length > 0}
        screenPhase={currentState.phase}
        messageCount={messages.length}
        onBackToLanding={() => setView('landing')}
        voiceEnabled={voiceEnabled}
        onToggleVoice={() => {
          if (voiceEnabled) stopSpeaking();
          setVoiceEnabled(!voiceEnabled);
        }}
      />

      {/* Main Split-Screen Workspace */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* Left: Chat Transcript & Candidate Call Simulator */}
        <Chat
          messages={messages}
          isLoading={isLoading}
          onSendMessage={(txt) => handleSendMessage(txt)}
          roleType={roleType}
          onStartScreen={() => handleStartScreen()}
          isCallActive={messages.length > 0}
          isSpeaking={isSpeaking}
        />

        {/* Right: Recruiter Telemetry Console */}
        <RecruiterConsole
          state={currentState}
          roleType={roleType}
        />
      </div>

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

      {/* Role Switch Confirmation Modal */}
      {confirmRoleSwitch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Switch Role Type?</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Switching to <strong className="text-slate-900">{confirmRoleSwitch}</strong> mid-screen will reset the active call transcript and recruiter state.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setConfirmRoleSwitch(null)}
                className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmSwitchRole}
                className="px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium"
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
