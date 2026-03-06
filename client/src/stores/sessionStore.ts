import { create } from 'zustand';
import type { NPC, Creature, SearchHistoryEntry } from '../types';

// ============================================================
// Session Store
// ============================================================

interface SessionState {
  sessionId: string;
  startTime: string;

  // History
  searchHistory: SearchHistoryEntry[];
  generatedNPCs: NPC[];
  searchedCreatures: Creature[];

  // Preferences
  preferences: {
    dndVersion: '5e' | '2014';
    theme: 'light' | 'dark';
  };

  // Actions
  addToSearchHistory: (entry: SearchHistoryEntry) => void;
  addGeneratedNPC: (npc: NPC) => void;
  addSearchedCreature: (creature: Creature) => void;
  setPreference: <K extends keyof SessionState['preferences']>(
    key: K,
    value: SessionState['preferences'][K],
  ) => void;
  clearSessionHistory: () => void;
}

/** Generate a simple session ID (no crypto needed for a browser session). */
function createSessionId(): string {
  const stored = sessionStorage.getItem('dm-session-id');
  if (stored) return stored;
  const id = `session-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  sessionStorage.setItem('dm-session-id', id);
  return id;
}

export const useSessionStore = create<SessionState>((set) => ({
  sessionId: createSessionId(),
  startTime: new Date().toISOString(),

  searchHistory: [],
  generatedNPCs: [],
  searchedCreatures: [],

  preferences: {
    dndVersion: '5e',
    theme: 'light',
  },

  addToSearchHistory: (entry) =>
    set((state) => ({
      searchHistory: [entry, ...state.searchHistory].slice(0, 50), // keep last 50
    })),

  addGeneratedNPC: (npc) =>
    set((state) => ({
      generatedNPCs: [npc, ...state.generatedNPCs].slice(0, 20),
    })),

  addSearchedCreature: (creature) =>
    set((state) => ({
      searchedCreatures: [creature, ...state.searchedCreatures].slice(0, 20),
    })),

  setPreference: (key, value) =>
    set((state) => ({
      preferences: { ...state.preferences, [key]: value },
    })),

  clearSessionHistory: () =>
    set({
      searchHistory: [],
      generatedNPCs: [],
      searchedCreatures: [],
    }),
}));
