import { useState, useCallback } from 'react';
import { GameState, Region, Action } from '@/types/game';

const INITIAL_REGIONS: Region[] = [
  { id: 'base', name: 'Hero Base', isUnlocked: true, storyProgress: 100, villainDefeated: true },
  { id: 'town', name: 'Small Town', isUnlocked: true, storyProgress: 0, villainDefeated: false },
  { id: 'forest', name: 'Forest', isUnlocked: true, storyProgress: 0, villainDefeated: false },
  { id: 'mountain', name: 'Mountain', isUnlocked: true, storyProgress: 0, villainDefeated: false },
  { id: 'crystal_forest', name: 'Crystal Forest', isUnlocked: false, storyProgress: 0, villainDefeated: false },
  { id: 'robot_city', name: 'Robot City', isUnlocked: false, storyProgress: 0, villainDefeated: false },
  { id: 'volcano', name: 'Volcano Island', isUnlocked: false, storyProgress: 0, villainDefeated: false },
];

const INITIAL_STATE: GameState = {
  heroes: [],
  resources: { metal: 0, energy: 0, crystals: 0 },
  regions: INITIAL_REGIONS,
  buildings: [],
  currentAct: 1,
  activeHeroId: null,
};

export function useGameState() {
  const [state, setState] = useState<GameState>(INITIAL_STATE);

  const dispatch = useCallback((action: Action) => {
    setState((prev) => {
      switch (action.type) {
        case 'CREATE_HERO':
          return {
            ...prev,
            heroes: [...prev.heroes, action.payload],
            activeHeroId: action.payload.id,
            currentAct: Math.max(prev.currentAct, 2), // Move to act 2 if first hero
          };
        case 'ADD_RESOURCES':
          return {
            ...prev,
            resources: {
              metal: prev.resources.metal + (action.payload.metal || 0),
              energy: prev.resources.energy + (action.payload.energy || 0),
              crystals: prev.resources.crystals + (action.payload.crystals || 0),
            },
          };
        case 'SPEND_RESOURCES':
          return {
            ...prev,
            resources: {
              metal: prev.resources.metal - (action.payload.metal || 0),
              energy: prev.resources.energy - (action.payload.energy || 0),
              crystals: prev.resources.crystals - (action.payload.crystals || 0),
            },
          };
        case 'UNLOCK_REGION':
          return {
            ...prev,
            regions: prev.regions.map((r) =>
              r.id === action.payload ? { ...r, isUnlocked: true } : r
            ),
          };
        case 'PROGRESS_STORY':
          return {
            ...prev,
            regions: prev.regions.map((r) =>
              r.id === action.payload.regionId
                ? { ...r, storyProgress: Math.min(100, r.storyProgress + action.payload.progress) }
                : r
            ),
          };
        case 'BUILD':
          return {
            ...prev,
            buildings: [...prev.buildings, action.payload],
          };
        case 'UPGRADE_BUILDING':
          return {
            ...prev,
            buildings: prev.buildings.map((b) =>
              b.id === action.payload ? { ...b, level: b.level + 1 } : b
            ),
          };
        case 'GAIN_XP':
          return {
            ...prev,
            heroes: prev.heroes.map((h) => {
              if (h.id === action.payload.heroId) {
                const newXp = h.xp + action.payload.xp;
                const newLevel = Math.floor(newXp / 100) + 1; // Simple leveling: 100xp per level

                // Add abilities based on level (Act 5 progression)
                const abilities = [...h.abilities];

                // Add specific skills based on class
                if (h.heroClass === 'Tech Builder') {
                    if (newLevel >= 10 && !abilities.includes('Drone Swarm')) abilities.push('Drone Swarm');
                    if (newLevel >= 25 && !abilities.includes('Orbital Strike')) abilities.push('Orbital Strike');
                    if (newLevel >= 50 && !abilities.includes('Quantum Armor')) abilities.push('Quantum Armor');
                } else if (h.heroClass === 'Guardian') {
                    if (newLevel >= 10 && !abilities.includes('Shield Bash')) abilities.push('Shield Bash');
                    if (newLevel >= 25 && !abilities.includes('Aegis Field')) abilities.push('Aegis Field');
                    if (newLevel >= 50 && !abilities.includes('Titan Form')) abilities.push('Titan Form');
                } else {
                    if (newLevel >= 10 && !abilities.includes('Shadow Step')) abilities.push('Shadow Step');
                    if (newLevel >= 25 && !abilities.includes('Sonic Dash')) abilities.push('Sonic Dash');
                    if (newLevel >= 50 && !abilities.includes('Astral Projection')) abilities.push('Astral Projection');
                }

                return { ...h, xp: newXp, level: newLevel, abilities };
              }
              return h;
            }),
          };
        case 'SET_ACT':
          return { ...prev, currentAct: action.payload };
        case 'SET_ACTIVE_HERO':
          return { ...prev, activeHeroId: action.payload };
        default:
          return prev;
      }
    });
  }, []);

  return { state, dispatch };
}
