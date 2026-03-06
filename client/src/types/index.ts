// ============================================================
// Client-side type definitions — mirrors server/src/types
// ============================================================

// --- API Response ---

export interface APIResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  errorCode?: string;
  suggestion?: string;
  timestamp: string;
}

// --- Rules Lookup ---

export interface RulesSearchRequest {
  query: string;
  version?: '5e' | '2014';
  maxTokens?: number;
}

export interface RulesSearchResponse {
  query: string;
  answer: string;
  source: string;
  followUpQuestions: string[];
}

// --- Creature Types ---

export interface CreaturePreview {
  name: string;
  cr: number;
  ac: number;
  hp: number;
  sizeType: string;
  summary: string;
}

export interface CreatureSearchResponse {
  creatures: CreaturePreview[];
}

export interface CreatureStats {
  str: number;
  dex: number;
  con: number;
  int: number;
  wis: number;
  cha: number;
}

export interface Creature {
  name: string;
  cr: number;
  ac: number;
  hp: number;
  hpFormula?: string;
  speed: string;
  stats: CreatureStats;
  sizeType: string;
  savingThrows?: string[];
  skills?: string[];
  damageResistances?: string[];
  damageImmunities?: string[];
  conditionImmunities?: string[];
  senses?: string[];
  languages?: string[];
  abilities?: string[];
  actions?: string[];
  legendaryActions?: string[];
}

// --- NPC Types ---

export interface NPC {
  name: string;
  race: string;
  appearance: string;
  personality: string;
  goal: string;
  secret: string;
  quirk: string;
  voice: string;
  hooks: string[];
}

export interface NPCGenerateResponse {
  npc: NPC;
}

// --- Magic Item Types ---

export interface ItemPreview {
  name: string;
  rarity: string;
  type: string;
  attunement: boolean;
  summary: string;
}

export interface ItemSearchResponse {
  items: ItemPreview[];
}

export interface MagicItem {
  name: string;
  rarity: string;
  type: string;
  attunement: boolean;
  flavor: string;
  mechanics: string[];
  suggestedPlacement: string;
}

export interface ItemGenerateResponse {
  item: MagicItem;
}

// --- Session History ---

export interface SearchHistoryEntry {
  id: string;
  type: 'rules' | 'creature' | 'npc' | 'item';
  query: string;
  timestamp: string;
  result: unknown;
}
