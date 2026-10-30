import { DIGIMON_FAMILIES } from '@/data/digimon-catalog';
import type { ClassroomSession, Team } from '@/types';

const STORAGE_KEY = 'gamescore:v3';
const CHANNEL_NAME = 'gamescore-realtime-channel';

let broadcastChannel: BroadcastChannel | null = null;
const CLIENT_SOURCE_ID = `client-${Math.random().toString(36).slice(2, 9)}`;

function getChannel(): BroadcastChannel | null {
  if (typeof window === 'undefined' || typeof BroadcastChannel === 'undefined') {
    return null;
  }
  if (!broadcastChannel) {
    try {
      broadcastChannel = new BroadcastChannel(CHANNEL_NAME);
    } catch {
      return null;
    }
  }
  return broadcastChannel;
}

export function createDefaultSession(): ClassroomSession {
  const defaultTeams: Team[] = [
    {
      id: 'team-1',
      name: 'Đội Sao Băng',
      family: DIGIMON_FAMILIES[0], // Agumon
      score: 0,
      unlockedLevel: 1,
      megaActive: false,
    },
    {
      id: 'team-2',
      name: 'Đội Turbo',
      family: DIGIMON_FAMILIES[1], // Gabumon
      score: 0,
      unlockedLevel: 1,
      megaActive: false,
    },
    {
      id: 'team-3',
      name: 'Đội Sấm Sét',
      family: DIGIMON_FAMILIES[2], // Guilmon
      score: 0,
      unlockedLevel: 1,
      megaActive: false,
    },
  ];

  return {
    sessionId: `session-${Date.now()}`,
    teams: defaultTeams,
    questions: [
      { id: 'q-1', prompt: 'Lắp ráp xong khung robot bánh xích', winnerTeamId: null, awardedAt: null },
      { id: 'q-2', prompt: 'Lập trình cảm biến siêu âm tránh vật cản', winnerTeamId: null, awardedAt: null },
    ],
    audioEnabled: true,
    lastUpdatedAt: Date.now(),
  };
}

export function loadSession(): ClassroomSession {
  if (typeof window === 'undefined') {
    return createDefaultSession();
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = createDefaultSession();
      saveSession(initial);
      return initial;
    }

    const parsed = JSON.parse(raw) as ClassroomSession;
    if (!parsed || !Array.isArray(parsed.teams) || parsed.teams.length === 0) {
      const initial = createDefaultSession();
      saveSession(initial);
      return initial;
    }

    // Sanitize teams to ensure all have valid Digimon families without legacy annotations
    const sanitizedTeams = parsed.teams.map((t, idx) => {
      const matched = DIGIMON_FAMILIES.find((f) => f.id === t.family?.id) || DIGIMON_FAMILIES[idx % DIGIMON_FAMILIES.length];
      const cleanFamily = {
        ...matched,
        name: matched.name.replace(/\s*\([^)]*\)/g, '').trim(),
      };
      return {
        ...t,
        family: cleanFamily,
        score: Number.isFinite(t.score) ? t.score : 0,
        unlockedLevel: Math.max(0, Math.min(3, t.unlockedLevel ?? (t.score && t.score <= 0 ? 0 : 1))),
        megaActive: Boolean(t.megaActive),
      };
    });

    return {
      ...parsed,
      teams: sanitizedTeams,
      questions: Array.isArray(parsed.questions) ? parsed.questions : [],
      audioEnabled: parsed.audioEnabled ?? true,
    };
  } catch (err) {
    console.warn('Failed to parse saved session, creating new default:', err);
    const initial = createDefaultSession();
    saveSession(initial);
    return initial;
  }
}

export function saveSession(session: ClassroomSession) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    broadcastSession(session);
  } catch (err) {
    console.warn('Failed to save session:', err);
  }
}

export function broadcastSession(session: ClassroomSession) {
  const channel = getChannel();
  if (channel) {
    try {
      channel.postMessage({
        sourceId: CLIENT_SOURCE_ID,
        payload: session,
      });
    } catch {
      // Ignore broadcast error
    }
  }
}

export function subscribeToSessionSync(onUpdate: (session: ClassroomSession) => void): () => void {
  const channel = getChannel();
  if (!channel) return () => {};

  const handler = (event: MessageEvent) => {
    if (event.data && typeof event.data === 'object' && 'sourceId' in event.data) {
      if (event.data.sourceId === CLIENT_SOURCE_ID) {
        return; // Ignore own broadcast
      }
      if (event.data.payload) {
        onUpdate(event.data.payload as ClassroomSession);
      }
    }
  };

  channel.addEventListener('message', handler);
  return () => {
    channel.removeEventListener('message', handler);
  };
}
