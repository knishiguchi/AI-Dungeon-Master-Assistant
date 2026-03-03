# AI Dungeon Master Assistant - V1 Product Specification

**Version:** 1.0  
**Status:** Planning  
**Last Updated:** March 3, 2026  
**Target Release:** Q2 2026

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Product Vision](#product-vision)
3. [V1 Features](#v1-features)
4. [Architecture & Technology Stack](#architecture--technology-stack)
5. [User Interface & Flows](#user-interface--flows)
6. [API Specifications](#api-specifications)
7. [Data Models](#data-models)
8. [Technical Requirements](#technical-requirements)
9. [Acceptance Criteria](#acceptance-criteria)
10. [Out of Scope](#out-of-scope)

---

## Executive Summary

The AI Dungeon Master Assistant V1 is a mobile-friendly web application designed to help Dungeon Masters quickly access information and generate game content during D&D sessions. V1 focuses on speed and ease of use without requiring user authentication or data persistence. All content is generated on-demand via LLM API calls and is session-based.

**Core Value Proposition:** DMs can pause mid-game for only seconds to find rules, generate NPCs, fetch monster stat blocks, or create magic items—all via voice or text input.

---

## Product Vision

### Problem Statement
Dungeon Masters face critical time constraints during gameplay:
- Rules lookups interrupt game flow (currently 2-5 minutes per search)
- Stat blocks require manual searching and often tweaking
- NPC generation on the fly is time-consuming
- Magic item rewards need rapid generation with thematic customization

### Solution
A voice-enabled AI assistant that provides instant answers and generates high-quality game content within seconds.

### User Segments
- **Primary:** Active D&D Dungeon Masters (experienced and new)
- **Secondary:** Players who want to help the DM by looking things up

---

## V1 Features

### Feature 1: Natural Language Rules Lookup

**Purpose:** DMs can ask game rules questions in natural language and receive accurate, quick answers.

**Capabilities:**
- Voice or text input (voice-to-text)
- Fuzzy search across D&D 5e rules (default) and D&D 2014 rules
- Synonym handling (e.g., "grapple" = "grappling")
- Searchable answer history (within current session)
- Response in under 3 seconds

**Example Interactions:**
- "How does grappling work?"
- "What is the frightened condition?"
- "Opportunity attack rules"
- "Can you use a bonus action and action in the same turn?"

**Scope Constraints:**
- Rules lookup only; does not generate custom content
- No local rules database; relies on LLM knowledge
- Responses may generalize complex rules (users can ask follow-ups)

---

### Feature 2: Stat Block Access & Smart Adjustments

**Purpose:** DMs can quickly find creature stat blocks and dynamically adjust them for their party.

**Capabilities:**
- Fast creature search by name or type
- Voice search capability
- Display stats in clean, readable card format
- Scale encounters for party size/level
- Add/modify creature abilities thematically
- Generate variants (e.g., undead version, fire-themed variant)
- Suggested CR adjustments based on modifications

**Example Interactions:**
- "Find the goblin stat block"
- "Scale this monster for 5 level-4 players"
- "Make this creature more undead-themed"
- "Give this goblin a fire ability"
- "Create a legendary action for this monster"

**Output Format:**
```
[Creature Name] - CR [X]
Armor Class: X
Hit Points: X (Xd8 + X)
Speed: X ft.
STR | DEX | CON | INT | WIS | CHA
X(±X) | X(±X) | X(±X) | X(±X) | X(±X) | X(±X)
[Skills, Saves, Resistances, etc.]
[Abilities]
[Actions]
[Legendary Actions (if any)]
```

---

### Feature 3: Instant NPC Generator

**Purpose:** Generate diverse, memorable NPCs seconds instead of minutes.

**Capabilities:**
- One-click random NPC generation
- Prompted NPC generation (guided by user description)
- Include personality, goals, secrets, quirks, appearance
- Voice input for on-the-fly generation
- Store NPC in session history for quick reference

**One-Click Output Example:**
```
Name: Marta Ironfoot
Race/Appearance: Dwarf woman, braided beard, weathered hands
Personality: Gruff but fair, speaks rarely but meaningfully
Goal: Establish trade route to mountain hold
Secret: Secretly funding a kobold settlement
Quirk: Collects interesting buttons
Voice: Deep, slow speech with dramatic pauses
```

**Live Prompt Example:**
- "Shopkeeper in desert city with a secret"
- "Suspicious guard who has been bribed"
- "Elderly wizard mentor figure"

---

### Feature 4: Magic Item Generator

**Purpose:** Quickly generate or flavor magic items for treasure rewards.

**Capabilities:**
- Search existing D&D magic items by name
- Voice search capability
- Generate custom magic items based on prompts
- Flavor existing items with custom themes/properties
- Display in clean card format with mechanics clearly explained
- Suggest rarity/attunement requirements

**Example Interactions:**
- "Give me an uncommon magic item for a human wizard that likes practical jokes"
- "Make a magic sword themed around storms"
- "Find a magic item good for stealth clerics"
- "Common magic items for a level-3 party"

**Output Format:**
```
[Item Name]
Rarity: [Common/Uncommon/Rare/Very Rare/Legendary]
Attunement: [Yes/No] (requires [class/ability])
Type: [Wondrous Item/Weapon/Armor/Ring/etc.]

Description: [2-3 sentence flavor text]

Mechanics:
- [Mechanical benefit 1]
- [Mechanical benefit 2]
- [Limitations or drawbacks]

Suggestions for Use: [When/how DMs might deploy this]
```

---

## Architecture & Technology Stack

### Technology Choices

| Component | Technology | Rationale |
|-----------|-----------|-----------|
| **Frontend** | React 18+ | Component-based, mobile-friendly frameworks available |
| **Backend** | Node.js (Express/Fastify) | JavaScript full-stack, fast startup, great for AI integrations |
| **UI Framework** | Tailwind CSS + shadcn/ui | Mobile-first, rapid development, accessible components |
| **Voice Input** | Web Speech API | Native browser support, no external dependencies |
| **LLM** | OpenAI API (GPT-4) | High quality, reliable, supports system prompts well |
| **Hosting** | Vercel or railway.app | Easy Node.js deployment, global CDN for mobile users |
| **State Management** | React Context or Zustand | Simple for V1 (no persistence needed) |

### Architecture Diagram

```
┌─────────────────────────────────────────────────────┐
│           Mobile Browser (DM's Device)              │
│  ┌───────────────────────────────────────────────┐  │
│  │  React UI (Voice + Text Input)                │  │
│  │  - Rules Search Interface                     │  │
│  │  - Creature Stat Block Display                │  │
│  │  - NPC Generator                              │  │
│  │  - Magic Item Generator                       │  │
│  └───────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
                         │ (HTTPS)
                         ▼
┌─────────────────────────────────────────────────────┐
│         Node.js Backend (Hosted)                    │
│  ┌───────────────────────────────────────────────┐  │
│  │  Express/Fastify API Server                   │  │
│  │  ┌─────────────────────────────────────────┐  │  │
│  │  │ Routes:                                 │  │  │
│  │  │ - POST /api/rules/search                │  │  │
│  │  │ - POST /api/creatures/search            │  │  │
│  │  │ - POST /api/creatures/scale             │  │  │
│  │  │ - POST /api/npcs/generate               │  │  │
│  │  │ - POST /api/items/search                │  │  │
│  │  │ - POST /api/items/generate              │  │  │
│  │  └─────────────────────────────────────────┘  │  │
│  │                    │                           │  │
│  │  ┌─────────────────────────────────────────┐  │  │
│  │  │ Prompt Engineering & Service Layer      │  │  │
│  │  │ - Format requests for LLM               │  │  │
│  │  │ - Parse LLM responses                   │  │  │
│  │  │ - Handle errors gracefully              │  │  │
│  │  └─────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────┐
│         OpenAI API (GPT-4)                          │
│  - Rule interpretation                             │
│  - Content generation                              │
│  - Math/scaling calculations                       │
└─────────────────────────────────────────────────────┘
```

### Session Flow

```
1. User loads web app in browser
2. React app initializes with empty session state
3. User interacts with UI (voice or text)
4. Browser sends request to Node.js backend
5. Backend crafts specific prompt for LLM
6. LLM returns generated content
7. Backend parses response and formats for frontend
8. Frontend displays result
9. Result stored in browser memory (session history)
10. Session ends when user closes browser (all data lost)
```

---

## User Interface & Flows

### Wireframe: Main Dashboard

```
┌──────────────────────────────────────────┐
│  AI Dungeon Master Assistant             │
├──────────────────────────────────────────┤
│                                          │
│  Four Feature Buttons (Mobile Stack)     │
│  ┌────────────────────────────────────┐  │
│  │  🔍 Rules Lookup                   │  │
│  └────────────────────────────────────┘  │
│  ┌────────────────────────────────────┐  │
│  │  ⚔️ Stat Blocks & Creatures        │  │
│  └────────────────────────────────────┘  │
│  ┌────────────────────────────────────┐  │
│  │  👥 NPC Generator                  │  │
│  └────────────────────────────────────┘  │
│  ┌────────────────────────────────────┐  │
│  │  ✨ Magic Items                    │  │
│  └────────────────────────────────────┘  │
│                                          │
│  [Session History (collapsible)]         │
│                                          │
└──────────────────────────────────────────┘
```

### Wireframe: Feature Input (Rules Lookup)

```
┌──────────────────────────────────────────┐
│  ◄                                       │
│  RULES LOOKUP                            │
├──────────────────────────────────────────┤
│                                          │
│  [🎤 Voice Input] [⌨️ Type Your Q]     │
│                                          │
│  [D&D Version Selector: 5e / 2014 ▼]    │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │ Sample questions:                  │  │
│  │ • Grappling rules                  │  │
│  │ • Frightened condition             │  │
│  │ • Opportunity attacks              │  │
│  └────────────────────────────────────┘  │
│                                          │
│  [Search Button]                        │
│                                          │
│  ─────────────────────────────────────  │
│  Results appear here...                 │
│                                          │
└──────────────────────────────────────────┘
```

### Wireframe: Results Display (Generic Card)

```
┌──────────────────────────────────────────┐
│  ◄  [Home]                               │
│  RESULT                                  │
├──────────────────────────────────────────┤
│                                          │
│  [Content Card - Scrollable]             │
│  ┌────────────────────────────────────┐  │
│  │ Title/Name                         │  │
│  │                                    │  │
│  │ Formatted content (rules, stats,   │  │
│  │ NPC details, item mechanics, etc)  │  │
│  │                                    │  │
│  │ [Copy to Clipboard] 📋            │  │
│  └────────────────────────────────────┘  │
│                                          │
│  [New Search] [Save to Session History]  │
│                                          │
└──────────────────────────────────────────┘
```

### User Flow: Rules Lookup

```
User Opens App
     ↓
Clicks "Rules Lookup"
     ↓
Chooses Input Method (Voice 🎤 or Text ⌨️)
     ↓
User Asks Question
     ↓
Optional: Select D&D Version (5e / 2014)
     ↓
Submit Question
     ↓
Backend → LLM → Response
     ↓
Display Result in Card Format
     ↓
User Can: Copy Result | Ask Follow-Up | Return Home
```

### User Flow: Stat Block Generation

```
User Clicks "Stat Blocks & Creatures"
     ↓
User Inputs (Voice or Text):
  - Creature name OR
  - "Scale [creature] for X level-Y players" OR
  - "Make [creature] more [theme]"
     ↓
Backend Retrieves/Generates Stat Block
     ↓
Display Formatted Stat Block Card
     ↓
User Can:
  - Modify CR/Add Abilities
  - Export/Print
  - Generate Variant
  - Return Home
```

### User Flow: NPC Generation

```
User Clicks "NPC Generator"
     ↓
Choose: One-Click Random OR Guided Generation
     ↓
If One-Click:
  Random button → Instant NPC
     ↓
If Guided:
  Voice/Text input: "Shopkeeper in desert city..."
     ↓
Backend → LLM → Full NPC Details
     ↓
Display NPC Card with:
  Name | Appearance | Personality | Goal | Secret | Quirk | Voice
     ↓
User Can: Copy | Regenerate | Return Home
```

---

## API Specifications

### Base URL
```
https://api.dungeonmaster-assistant.dev/v1
```

### Authentication
V1 has no authentication. Rate limiting via IP address (100 requests/5 minutes).

---

### Endpoint 1: Rules Search

**POST** `/rules/search`

**Request:**
```json
{
  "query": "How does grappling work?",
  "version": "5e",
  "maxTokens": 500
}
```

**Parameters:**
| Name | Type | Required | Notes |
|------|------|----------|-------|
| query | string | Yes | Natural language question |
| version | string | No | "5e" (default) or "2014" |
| maxTokens | number | No | Response length limit (default: 500) |

**Response (Success 200):**
```json
{
  "success": true,
  "query": "How does grappling work?",
  "answer": "Grappling is an attack option...",
  "source": "D&D 5e Player's Handbook (estimated)",
  "followUpQuestions": [
    "What happens if I win a grapple check?",
    "Can you grapple a creature larger than you?"
  ],
  "timestamp": "2026-03-03T14:23:45Z"
}
```

**Response (Error 500):**
```json
{
  "success": false,
  "error": "Failed to reach LLM service",
  "suggestion": "Please try again in a moment"
}
```

---

### Endpoint 2: Creature Search & Generation

**POST** `/creatures/search`

**Request:**
```json
{
  "query": "Find the goblin stat block",
  "searchType": "name",
  "maxResults": 5
}
```

**Response (Success 200):**
```json
{
  "success": true,
  "creatures": [
    {
      "id": "goblin_standard",
      "name": "Goblin",
      "cr": 0.25,
      "ac": 15,
      "hp": 7,
      "preview": "Small humanoid (goblinoid), Neutral Evil"
    }
  ],
  "timestamp": "2026-03-03T14:23:45Z"
}
```

---

### Endpoint 3: Creature Scaling

**POST** `/creatures/scale`

**Request:**
```json
{
  "creatureName": "Goblin",
  "partySize": 5,
  "partyLevel": 4,
  "adjustment": "increase_difficulty"
}
```

**Response (Success 200):**
```json
{
  "success": true,
  "original": {
    "name": "Goblin",
    "cr": 0.25,
    "hp": 7
  },
  "scaled": {
    "name": "Goblin (Adjusted)",
    "cr": 1,
    "hp": 28,
    "suggestions": "Added 2-3 goblins or increased stats\n\nOriginal CR 0.25 × 5 party members = CR 1.25 encounter (Hard)"
  },
  "timestamp": "2026-03-03T14:23:45Z"
}
```

---

### Endpoint 4: NPC Generation

**POST** `/npcs/generate`

**Request:**
```json
{
  "generationType": "guided",
  "prompt": "Shopkeeper in desert city with a secret",
  "includeVoiceNotes": true
}
```

**Response (Success 200):**
```json
{
  "success": true,
  "npc": {
    "name": "Rashida Al-Qahir",
    "race": "Half-Elf",
    "appearance": "Olive skin, hennaed hands, traditional desert robes",
    "personality": "Charming and shrewd; speaks three languages",
    "goal": "Expand spice trade route",
    "secret": "Her brother is a thieves' guild member",
    "quirk": "Collects rare perfumes",
    "voice": "Melodic, rolls her Rs, laughs often but unexpectedly",
    "hooks": [
      "Potential patron for adventurers",
      "Could need help retrieving stolen goods",
      "Romantic subplot possibility"
    ]
  },
  "timestamp": "2026-03-03T14:23:45Z"
}
```

---

### Endpoint 5: Magic Item Search

**POST** `/items/search`

**Request:**
```json
{
  "query": "uncommon wondrous item for wizard",
  "rarity": "uncommon",
  "itemType": "wondrous_item",
  "requiresAttunement": false
}
```

**Response (Success 200):**
```json
{
  "success": true,
  "items": [
    {
      "id": "item_12345",
      "name": "Bag of Tricks",
      "rarity": "Uncommon",
      "type": "Wondrous Item",
      "attunement": false,
      "matchScore": 0.92
    }
  ],
  "timestamp": "2026-03-03T14:23:45Z"
}
```

---

### Endpoint 6: Magic Item Generation/Flavoring

**POST** `/items/generate`

**Request:**
```json
{
  "generationType": "flavored",
  "baseItem": "Bag of Holding",
  "flavor": "Make it themed around storms and electricity",
  "targetClass": "wizard",
  "targetRarity": "uncommon"
}
```

**Response (Success 200):**
```json
{
  "success": true,
  "item": {
    "name": "Tempest Satchel",
    "rarity": "Uncommon",
    "type": "Wondrous Item",
    "attunement": false,
    "flavor": "A leather satchel stitched with silver lightning patterns...",
    "mechanics": [
      "Functions as a Bag of Holding",
      "Inside always feels pleasantly cool",
      "Upon command, release stored items with a thunder crack (1d4 thunder damage in 5ft radius if you wish)"
    ],
    "suggestedPlacement": "Reward for defeating storm elemental or obtaining from storm-themed location"
  },
  "timestamp": "2026-03-03T14:23:45Z"
}
```

---

### Error Handling

All endpoints follow this error structure:

```json
{
  "success": false,
  "error": "Descriptive error message",
  "errorCode": "SPECIFIC_CODE",
  "suggestion": "What the user can try next"
}
```

**Common Error Codes:**
- `RATE_LIMIT_EXCEEDED` - Too many requests from this IP
- `LLM_TIMEOUT` - OpenAI API took too long
- `INVALID_INPUT` - Malformed request
- `SERVICE_UNAVAILABLE` - Backend issue
- `LLM_REFUSED` - OpenAI refused to generate content

---

## Data Models

### Session State (Browser Memory Only)

```typescript
interface Session {
  sessionId: string; // Random UUID
  startTime: Date;
  searchHistory: SearchHistoryEntry[];
  generatedNPCs: NPC[];
  generatedItems: MagicItem[];
  preferences: {
    dndVersion: "5e" | "2014";
    theme: "dark" | "light";
  };
}

interface SearchHistoryEntry {
  id: string;
  type: "rules" | "creature" | "npc" | "item";
  query: string;
  result: any; // Varies by type
  timestamp: Date;
}

interface NPC {
  name: string;
  race: string;
  appearance: string;
  personality: string;
  goal: string;
  secret: string;
  quirk: string;
  voice: string;
  hooks: string[];
  generatedAt: Date;
}

interface MagicItem {
  name: string;
  rarity: "Common" | "Uncommon" | "Rare" | "Very Rare" | "Legendary";
  type: string;
  attunement: boolean;
  flavor: string;
  mechanics: string[];
  generatedAt: Date;
  baseItem?: string; // If flavored from existing
}

interface Creature {
  name: string;
  cr: number;
  ac: number;
  hp: number;
  stats: {
    str: number;
    dex: number;
    con: number;
    int: number;
    wis: number;
    cha: number;
  };
  skills?: string[];
  abilities?: string[];
  actions?: string[];
  legendaryActions?: string[];
}
```

### Request/Response Models

```typescript
interface SearchRequest {
  query: string;
  version?: "5e" | "2014";
  maxTokens?: number;
}

interface GenerateRequest {
  generationType: "random" | "guided";
  prompt?: string; // For guided generation
  includeVoiceNotes?: boolean;
}

interface ScaleCreatureRequest {
  creatureName: string;
  partySize: number;
  partyLevel: number;
  adjustment?: "increase_difficulty" | "decrease_difficulty" | "same";
}

interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  errorCode?: string;
  suggestion?: string;
  timestamp: Date;
}
```

---

## Technical Requirements

### Frontend Requirements

**Browser Support:**
- Chrome/Edge 90+
- Safari 14+
- Firefox 88+
- Mobile browsers (iOS Safari, Chrome Android)

**Performance Requirements:**
- Page load < 3 seconds
- API response displayed within 5 seconds of request
- Voice input to text < 2 seconds
- Mobile-optimized (responsive design, touch-friendly)

**Dependencies:**
- React 18.x
- React Router 6.x
- Tailwind CSS 3.x
- shadcn/ui components
- Zustand for state management
- Axios for HTTP requests
- React Query (for caching/request management)

### Backend Requirements

**Server Specs:**
- Node.js 18+
- Express or Fastify
- Rate limiting middleware
- CORS for mobile/web access

**Dependencies:**
- openai (GPT-4 API client)
- Express/Fastify
- dotenv for secrets
- Morgan for logging
- Helmet for security headers

**Hosting Requirements:**
- Node.js friendly hosting (Vercel, Railway, Heroku)
- Environment variables for API keys
- HTTPS only
- ~512MB RAM minimum

### Security Requirements

- HTTPS only (no HTTP)
- API key stored server-side only (never exposed to frontend)
- Rate limiting to prevent abuse
- Input validation on all endpoints
- CORS configured for production domain
- No personal data stored
- Age verification for D&D content (recommend 13+)

### Performance Targets

| Metric | Target | Rationale |
|--------|--------|-----------|
| Time to First Byte (TTFB) | < 500ms | Server response time |
| API Response | < 5 seconds | LLM turnaround |
| Voice Input Latency | < 2 seconds | Web Speech API + processing |
| Mobile Load | < 3 seconds | Critical for table use |
| Lighthouse Score | 90+ | Overall performance |

---

## Acceptance Criteria

### Feature 1: Rules Lookup
- [ ] User can input questions via text
- [ ] User can input questions via voice
- [ ] Responses returned within 5 seconds
- [ ] User can select D&D version (5e / 2014)
- [ ] Results displayed in readable card format
- [ ] Users can ask follow-up questions
- [ ] Result can be copied to clipboard
- [ ] Error messages are helpful when API fails
- [ ] Works on mobile and desktop

### Feature 2: Stat Blocks & Creatures
- [ ] User can search creatures by name
- [ ] Stat blocks display in standard D&D format
- [ ] User can scale encounters for party size/level
- [ ] Stat block modifications save to session history
- [ ] Results include CR, AC, HP, stats, and abilities
- [ ] Works with voice input for creature names

### Feature 3: NPC Generator
- [ ] One-click random NPC generation works
- [ ] Guided generation accepts voice/text prompts
- [ ] Generated NPCs include all 8 fields
- [ ] Voice pronunciation guidance included
- [ ] Session history stores all generated NPCs
- [ ] User can regenerate NPCs

### Feature 4: Magic Items
- [ ] Magic item search finds results by name
- [ ] Items can be flavored with custom themes
- [ ] Results display in clear card format with mechanics
- [ ] Voice search works for item queries
- [ ] Suggested rarity/attunement requirements provided

### General Requirements
- [ ] App is mobile-friendly/responsive
- [ ] Works on any modern browser
- [ ] Speed prioritized over visual polish
- [ ] All input methods (voice + text) work equally
- [ ] Prebuilt buttons minimize typing
- [ ] Session history is accessible
- [ ] Error recovery is graceful
- [ ] No authentication or sign-up required

---

## Out of Scope (V1)

- User accounts / authentication
- Data persistence (saving data across sessions)
- Integration with official D&D Beyond API
- Local rules database
- Local rule editing or customization
- Multi-user collaboration
- Combat tracking / initiative tracking
- Location/tavern generation
- Integration with virtual tabletops (Roll20, Foundry)
- Mobile app (web-based only)
- Offline functionality
- User settings that persist
- NPC/creature saving across sessions
- Campaign-specific content

---

## Deployment & Release Plan

### Phase 1: MVP (Week 1-2)
- Rules lookup (basic text input only)
- One-click NPC generator
- Basic creature search

### Phase 2: Enhanced (Week 3-4)
- Voice input for all features
- Creature scaling
- Magic item search

### Phase 3: Polish (Week 5)
- Session history
- Error handling refinement
- Performance optimization
- Mobile testing

### Phase 4: Launch
- Deploy to production
- Monitor performance and error rates
- Gather user feedback

---

## Success Metrics (V1)

- Average response time < 4 seconds
- 95%+ successful API requests
- Mobile usability score > 90
- User retention > 80% (session to session)
- Error rate < 2%

---

## Appendix: Glossary

| Term | Definition |
|------|-----------|
| **CR (Challenge Rating)** | D&D metric for creature difficulty |
| **DM** | Dungeon Master |
| **NPC** | Non-Player Character |
| **Attunement** | Magic item requirement for use |
| **Rarity** | Magic item power level |
| **Statblock** | Formatted creature statistics |
| **LLM** | Large Language Model (GPT-4) |

---

**Document Version:** 1.0  
**Last Modified:** March 3, 2026
