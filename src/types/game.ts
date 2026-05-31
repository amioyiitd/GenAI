export type HeroClass = 'Tech Builder' | 'Guardian' | 'Explorer';

export interface Hero {
  id: string;
  name: string;
  heroClass: HeroClass;
  appearance: string; // Emoji or visual identifier
  personality: string;
  level: number;
  xp: number;
  abilities: string[];
}

export interface Resources {
  metal: number;
  energy: number;
  crystals: number;
}

export interface Region {
  id: string;
  name: string;
  isUnlocked: boolean;
  storyProgress: number;
  villainDefeated: boolean;
}

export interface Building {
  id: string;
  name: string;
  level: number;
  cost: Resources;
}

export interface GameState {
  heroes: Hero[];
  resources: Resources;
  regions: Region[];
  buildings: Building[];
  currentAct: number;
  activeHeroId: string | null;
}

export type Action =
  | { type: 'CREATE_HERO'; payload: Hero }
  | { type: 'ADD_RESOURCES'; payload: Partial<Resources> }
  | { type: 'SPEND_RESOURCES'; payload: Partial<Resources> }
  | { type: 'UNLOCK_REGION'; payload: string }
  | { type: 'PROGRESS_STORY'; payload: { regionId: string; progress: number } }
  | { type: 'BUILD'; payload: Building }
  | { type: 'UPGRADE_BUILDING'; payload: string }
  | { type: 'GAIN_XP'; payload: { heroId: string; xp: number } }
  | { type: 'SET_ACT'; payload: number }
  | { type: 'SET_ACTIVE_HERO'; payload: string };
