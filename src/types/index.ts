export type DigimonElement =
  | 'fire'
  | 'ice'
  | 'machine'
  | 'electric'
  | 'holy'
  | 'nature'
  | 'warrior'
  | 'dark';

export interface EvolutionStage {
  id: number;
  name: string;
  stageName: 'Egg' | 'Baby' | 'Rookie' | 'Champion' | 'Ultimate' | 'Mega' | 'Ultra';
  artworkPath: string;
  animatedPath: string;
  summary: string;
  variant?: 'x' | 'y' | null;
}

export interface MascotFamily {
  id: string;
  name: string;
  element: DigimonElement;
  elementLabel: string;
  accent: string;
  secondary: string;
  description: string;
  babyStage?: EvolutionStage;
  evolutionChain: EvolutionStage[];
  megaForms?: EvolutionStage[];
  ultraStage?: EvolutionStage;
}

export type DigimonAction = 'idle' | 'attack' | 'happy' | 'walk' | 'sleep';

export interface Team {
  id: string;
  name: string;
  family: MascotFamily;
  score: number;
  unlockedLevel: number; // 0: Egg, 1: Rookie, 2: Champion, 3: Ultimate
  isEgg?: boolean;
  megaActive: boolean;
  megaVariant?: string | null;
  lastDelta?: number;
  lastAction?: DigimonAction;
  lastActionTimestamp?: number;
}

export interface MegaQuestion {
  id: string;
  prompt: string;
  winnerTeamId: string | null;
  awardedAt: number | null;
}

export interface EvolutionEvent {
  id: string;
  teamId: string;
  teamName: string;
  family: MascotFamily;
  fromStage: EvolutionStage;
  toStage: EvolutionStage;
  isMega: boolean;
  isDevolution: boolean;
  createdAt: number;
}

export interface ClassroomSession {
  sessionId: string;
  teams: Team[];
  questions: MegaQuestion[];
  audioEnabled: boolean;
  lastUpdatedAt: number;
}

export type ViewMode = 'teacher' | 'projector' | 'setup';
