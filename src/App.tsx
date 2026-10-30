import React, { useEffect, useState } from 'react';
import type { ClassroomSession, DigimonAction, EvolutionEvent, Team, ViewMode } from '@/types';
import { loadSession, saveSession, subscribeToSessionSync } from '@/services/storage';
import { playEggDevolveSound, playEggHatchSound, playEvolutionMusic, playMegaMusic, playScoreDing } from '@/services/sound';
import { DIGITAMA_STAGE, getFullEvolutionChain, getEvolutionMilestones } from '@/data/digimon-catalog';
import { TeacherView } from '@/components/TeacherView';
import { ProjectorView } from '@/components/ProjectorView';
import { SetupView } from '@/components/SetupView';
import { EvolutionModal } from '@/components/EvolutionModal';
import { SessionSummaryModal } from '@/components/SessionSummaryModal';

export const App: React.FC = () => {
  const [session, setSession] = useState<ClassroomSession>(() => loadSession());
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    // Check URL query param or hash: e.g. #projector or ?mode=projector
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('mode') === 'projector' || window.location.hash === '#projector') {
        return 'projector';
      }
    }
    return 'teacher';
  });

  const [history, setHistory] = useState<ClassroomSession[]>([]);
  const [activeEvolution, setActiveEvolution] = useState<EvolutionEvent | null>(null);
  const [isSummaryOpen, setIsSummaryOpen] = useState<boolean>(false);

  // Subscribe to real-time BroadcastChannel sync across tabs/windows
  useEffect(() => {
    const unsubscribe = subscribeToSessionSync((remoteSession) => {
      setSession(remoteSession);
    });
    return unsubscribe;
  }, []);

  // Update URL hash when viewMode changes for easy dual-monitor bookmarking
  useEffect(() => {
    if (viewMode === 'projector') {
      window.location.hash = '#projector';
    } else if (viewMode === 'teacher') {
      window.location.hash = '#teacher';
    }
  }, [viewMode]);

  // Scoring Handler with automatic evolution trigger and dynamic action animations
  const handleScore = (teamId: string, delta: number) => {
    const targetTeam = session.teams.find((t) => t.id === teamId);
    if (!targetTeam) return;

    // Snapshot history for undo
    setHistory((prev) => [...prev.slice(-9), session]);

    const oldScore = targetTeam.score;
    // Allow negative points (e.g. down to -99) to remind students to focus
    const newScore = Math.max(-99, oldScore + delta);

    // Egg condition:
    // If penalized and score becomes <= 0, or score drops below 0, or was already egg and still <= 0
    const wasEgg = Boolean(targetTeam.isEgg || targetTeam.unlockedLevel === 0 || oldScore < 0);
    const isPenalizedToZeroOrBelow = delta < 0 && newScore <= 0;
    const isEgg = newScore < 0 || isPenalizedToZeroOrBelow || (wasEgg && newScore <= 0);

    // Full evolution chain for the team's family:
    const stages = getFullEvolutionChain(targetTeam.family);
    const milestones = getEvolutionMilestones(stages.length, 20);

    // Calculate level based on score dynamically:
    // 0: Egg (when score <= 0 due to penalty)
    // 1: Stage 0 (lowest stage: Baby or Rookie)
    // ...
    // N: Stage N-1 (final stage: Mega / Ultra)
    let newLevel = 1;
    if (isEgg) {
      newLevel = 0;
    } else {
      for (let i = 0; i < milestones.length; i++) {
        if (newScore >= milestones[i]) {
          newLevel = i + 1;
        } else {
          break;
        }
      }
    }

    const oldLevel = targetTeam.unlockedLevel;
    const didBecomeEgg = !wasEgg && isEgg;
    const didHatch = wasEgg && !isEgg && newScore > 0;
    const didEvolve = !didHatch && newLevel > oldLevel;
    const didDevolve = !didBecomeEgg && newLevel < oldLevel;

    // Determine mascot animation action based on point change
    let nextAction: DigimonAction = 'happy';
    if (delta >= 5) {
      nextAction = 'attack';
    } else if (delta < 0) {
      nextAction = 'sleep';
    } else if (delta > 0) {
      nextAction = 'happy';
    }

    const updatedTeams: Team[] = session.teams.map((t) => {
      if (t.id === teamId) {
        return {
          ...t,
          score: newScore,
          unlockedLevel: newLevel,
          isEgg,
          megaActive: isEgg ? false : t.megaActive,
          lastDelta: delta,
          lastAction: nextAction,
          lastActionTimestamp: Date.now(),
        };
      }
      return t;
    });

    const nextSession: ClassroomSession = {
      ...session,
      teams: updatedTeams,
      lastUpdatedAt: Date.now(),
    };

    setSession(nextSession);
    saveSession(nextSession);

    // Handle audio and evolution modal
    if (didBecomeEgg) {
      // Degraded to Egg Digitama due to penalty
      playEggDevolveSound(session.audioEnabled);
    } else if (didHatch) {
      // Egg hatched back into lowest stage!
      playEggHatchSound(session.audioEnabled);
      const toStage = stages[0];
      setActiveEvolution({
        id: `hatch-${Date.now()}`,
        teamId,
        teamName: targetTeam.name,
        family: targetTeam.family,
        fromStage: DIGITAMA_STAGE,
        toStage,
        isMega: false,
        isDevolution: false,
        createdAt: Date.now(),
      });
    } else if (didEvolve) {
      const fromStage = stages[Math.max(0, oldLevel - 1)] || stages[0];
      const toStage = stages[newLevel - 1];
      const isFinal = newLevel === stages.length;

      if (isFinal) {
        playMegaMusic(session.audioEnabled);
      } else {
        playEvolutionMusic(session.audioEnabled);
      }

      setActiveEvolution({
        id: `evo-${Date.now()}`,
        teamId,
        teamName: targetTeam.name,
        family: targetTeam.family,
        fromStage,
        toStage,
        isMega: isFinal,
        isDevolution: false,
        createdAt: Date.now(),
      });
    } else if (didDevolve) {
      playScoreDing(delta, session.audioEnabled);
    } else {
      playScoreDing(delta, session.audioEnabled);
    }
  };

  // Mega Evolution trigger
  const handleMegaEvolve = (teamId: string) => {
    const targetTeam = session.teams.find((t) => t.id === teamId);
    if (!targetTeam) return;

    const stages = getFullEvolutionChain(targetTeam.family);
    const finalStage = stages[stages.length - 1];
    if (!finalStage) return;

    // Snapshot history
    setHistory((prev) => [...prev.slice(-9), session]);

    const currentStage = stages[Math.max(0, targetTeam.unlockedLevel - 1)] || stages[0];

    const updatedTeams: Team[] = session.teams.map((t) => {
      if (t.id === teamId) {
        return {
          ...t,
          score: Math.max(t.score, 20),
          unlockedLevel: stages.length,
          megaActive: true,
          isEgg: false,
          lastAction: 'attack',
          lastActionTimestamp: Date.now(),
        };
      }
      return t;
    });

    const nextSession: ClassroomSession = {
      ...session,
      teams: updatedTeams,
      lastUpdatedAt: Date.now(),
    };

    setSession(nextSession);
    saveSession(nextSession);

    playMegaMusic(session.audioEnabled);
    setActiveEvolution({
      id: `mega-${Date.now()}`,
      teamId,
      teamName: targetTeam.name,
      family: targetTeam.family,
      fromStage: currentStage,
      toStage: finalStage,
      isMega: true,
      isDevolution: false,
      createdAt: Date.now(),
    });
  };

  // Action trigger handler (e.g. attack, happy, sleep, walk, idle)
  const handleTriggerAction = (teamId: string, action: DigimonAction) => {
    const updatedTeams: Team[] = session.teams.map((t) => {
      if (t.id === teamId) {
        return {
          ...t,
          lastAction: action,
          lastActionTimestamp: Date.now(),
        };
      }
      return t;
    });

    const nextSession: ClassroomSession = {
      ...session,
      teams: updatedTeams,
      lastUpdatedAt: Date.now(),
    };

    setSession(nextSession);
    saveSession(nextSession);
  };

  // Replay latest evolution sequence
  const handleReplayEvolution = (teamId: string) => {
    const targetTeam = session.teams.find((t) => t.id === teamId);
    if (!targetTeam) return;

    const stages = getFullEvolutionChain(targetTeam.family);
    const level = targetTeam.unlockedLevel;

    if (level === 0 || targetTeam.isEgg) {
      // Replay hatch
      const toStage = stages[0];
      playEvolutionMusic(session.audioEnabled);
      setActiveEvolution({
        id: `replay-${Date.now()}`,
        teamId,
        teamName: targetTeam.name,
        family: targetTeam.family,
        fromStage: DIGITAMA_STAGE,
        toStage,
        isMega: false,
        isDevolution: false,
        createdAt: Date.now(),
      });
      return;
    }

    const fromLevel = level === 1 ? 1 : level - 1;
    const toLevel = level === 1 && stages.length > 1 ? 2 : level;
    const fromStage = stages[fromLevel - 1] || stages[0];
    const toStage = stages[toLevel - 1] || fromStage;
    const isFinal = toLevel === stages.length;

    if (isFinal) {
      playMegaMusic(session.audioEnabled);
    } else {
      playEvolutionMusic(session.audioEnabled);
    }
    setActiveEvolution({
      id: `replay-${Date.now()}`,
      teamId,
      teamName: targetTeam.name,
      family: targetTeam.family,
      fromStage,
      toStage,
      isMega: isFinal,
      isDevolution: false,
      createdAt: Date.now(),
    });
  };

  // Award bonus Mega question
  const handleAwardQuestion = (questionId: string, teamId: string | null) => {
    setHistory((prev) => [...prev.slice(-9), session]);

    const updatedQuestions = session.questions.map((q) => {
      if (q.id === questionId) {
        return {
          ...q,
          winnerTeamId: teamId,
          awardedAt: teamId ? Date.now() : null,
        };
      }
      return q;
    });

    const nextSession = {
      ...session,
      questions: updatedQuestions,
      lastUpdatedAt: Date.now(),
    };

    setSession(nextSession);
    saveSession(nextSession);

    if (teamId) {
      playScoreDing(3, session.audioEnabled);
    }
  };

  // Undo
  const handleUndo = () => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    setHistory((prev) => prev.slice(0, -1));
    setSession(previous);
    saveSession(previous);
  };

  // Toggle audio
  const handleToggleAudio = () => {
    const nextSession = {
      ...session,
      audioEnabled: !session.audioEnabled,
      lastUpdatedAt: Date.now(),
    };
    setSession(nextSession);
    saveSession(nextSession);
  };

  // Reset session
  const handleResetSession = () => {
    const resetTeams = session.teams.map((t) => ({
      ...t,
      score: 0,
      unlockedLevel: 1,
      isEgg: false,
      megaActive: false,
      lastDelta: 0,
      lastAction: 'idle' as DigimonAction,
      lastActionTimestamp: Date.now(),
    }));
    const resetQuestions = session.questions.map((q) => ({
      ...q,
      winnerTeamId: null,
      awardedAt: null,
    }));

    const nextSession = {
      ...session,
      teams: resetTeams,
      questions: resetQuestions,
      lastUpdatedAt: Date.now(),
    };
    setSession(nextSession);
    saveSession(nextSession);
  };

  // Start freshly configured session
  const handleStartSession = (newTeams: Team[], newQuestions: string[]) => {
    const formattedQuestions = newQuestions.map((prompt, idx) => ({
      id: `q-${Date.now()}-${idx + 1}`,
      prompt,
      winnerTeamId: null,
      awardedAt: null,
    }));

    const newSession: ClassroomSession = {
      sessionId: `session-${Date.now()}`,
      teams: newTeams,
      questions: formattedQuestions,
      audioEnabled: session.audioEnabled,
      lastUpdatedAt: Date.now(),
    };

    setSession(newSession);
    saveSession(newSession);
    setHistory([]);
    setViewMode('teacher');
  };

  // Start new session from summary modal: reset points, clear history and open SetupView
  const handleStartNewSessionFromSummary = () => {
    handleResetSession();
    setHistory([]);
    setIsSummaryOpen(false);
    setViewMode('setup');
  };

  return (
    <div className="app-container">
      {viewMode === 'setup' && (
        <SetupView
          initialTeams={session.teams}
          onStartSession={handleStartSession}
          onCancel={() => setViewMode('teacher')}
        />
      )}

      {viewMode === 'teacher' && (
        <TeacherView
          session={session}
          onScore={handleScore}
          onMegaEvolve={handleMegaEvolve}
          onReplayEvolution={handleReplayEvolution}
          onAwardQuestion={handleAwardQuestion}
          onTriggerAction={handleTriggerAction}
          onUndo={handleUndo}
          canUndo={history.length > 0}
          onToggleAudio={handleToggleAudio}
          onOpenSummary={() => setIsSummaryOpen(true)}
          onOpenSetup={() => setViewMode('setup')}
          onSwitchToProjector={() => setViewMode('projector')}
        />
      )}

      {viewMode === 'projector' && (
        <ProjectorView
          session={session}
          onExitProjector={() => setViewMode('teacher')}
        />
      )}

      {/* Evolution Animation Modal */}
      <EvolutionModal
        key={activeEvolution?.id}
        event={activeEvolution}
        onClose={() => setActiveEvolution(null)}
      />

      {/* Session Summary Modal */}
      <SessionSummaryModal
        isOpen={isSummaryOpen}
        teams={session.teams}
        onClose={() => setIsSummaryOpen(false)}
        onResetSession={handleResetSession}
        onStartNewSession={handleStartNewSessionFromSummary}
      />
    </div>
  );
};

export default App;
