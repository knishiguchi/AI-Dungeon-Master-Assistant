// ============================================================
// AI Dungeon Master Assistant - Shared Type Definitions
// ============================================================

// --- API Response Types ---

export interface APIResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  errorCode?: string;
  suggestion?: string;
  timestamp: string;
}

// --- Rules Lookup Types ---

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

export interface CreatureSearchRequest {
  query: string;
  searchType?: 'name' | 'type';
  maxResults?: number;
}

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

export interface ScaleCreatureRequest {
  creatureName: string;
  partySize: number;
  partyLevel: number;
  adjustment: 'increase_difficulty' | 'decrease_difficulty' | 'same';
}

export interface ScaleCreatureResponse {
  original: {
    name: string;
    cr: number;
    hp: number;
    ac: number;
  };
  scaled: {
    name: string;
    cr: number;
    hp: number;
    ac: number;
    adjustment: string;
  };
  suggestion: string;
  difficultyAnalysis: {
    partySize: number;
    partyLevel: number;
    xpBudgetMedium: number;
    estimatedDifficulty: string;
    explanation: string;
  };
}

// --- NPC Types ---

export interface NPCGenerateRequest {
  generationType: 'random' | 'guided';
  prompt?: string;
  includeVoiceNotes?: boolean;
}

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

export interface ItemSearchRequest {
  query: string;
  rarity?: 'common' | 'uncommon' | 'rare' | 'very_rare' | 'legendary';
  itemType?: string;
  requiresAttunement?: boolean;
}

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

export interface ItemGenerateRequest {
  generationType: 'flavored' | 'custom';
  baseItem?: string;
  flavor?: string;
  targetClass?: string;
  targetRarity?: string;
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

// --- LLM Service Types ---

export interface LLMRequest {
  systemPrompt: string;
  userPrompt: string;
  maxTokens: number;
}

export interface LLMResponse {
  content: string;
  tokensUsed: number;
}
