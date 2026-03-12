# Phase 1: MVP (Week 1-2)

**Goal:** Deliver a working prototype with Rules Lookup, one-click NPC generation, and basic creature search.

**Duration:** 2 weeks (10 business days)  
**Team Size:** 1-2 developers  
**Target Launch:** End of Week 2

---

## Summary

This phase focuses on getting a minimum viable product in users' hands quickly. We'll implement the three core features with text input only (no voice), basic error handling, and session-based memory. The app should be functional enough to demonstrate value and gather initial feedback.

**Definition of Done:**
- App deployed and accessible at public URL
- All three features working with text input
- Session history functional
- Mobile responsive
- Error handling for API failures
- Basic monitoring/logging in place

---

## Architecture Setup

### Backend Infrastructure

#### Task 1.1: Project Setup & Scaffolding
**Effort:** 2 hours  
**Priority:** P0 (blocking)

**Tasks:**
- [x] Initialize Node.js project with Express/Fastify
- [x] Set up environment configuration (.env, config files)
- [x] Install core dependencies (openai, helmet, cors, morgan, dotenv)
- [x] Create folder structure:
  ```
  src/
  ├── routes/
  │   ├── rules.ts
  │   ├── creatures.ts
  │   ├── npcs.ts
  │   └── items.ts
  ├── services/
  │   ├── llmService.ts
  │   └── rateLimiter.ts
  ├── middleware/
  │   ├── errorHandler.ts
  │   └── corsConfig.ts
  ├── types/
  │   └── index.ts
  ├── app.ts
  └── server.ts
  ```
- [x] Create basic HTTP server with health check endpoint
- [x] Set up logging (Morgan)
- [x] Configure CORS and helmet security headers

**Deliverable:** Running server on localhost:3000, `/health` returns 200 OK

---

#### Task 1.2: OpenAI API Integration & LLM Service
**Effort:** 3 hours  
**Priority:** P0 (blocking)

**Tasks:**
- [x] Create LLM service wrapper around OpenAI API
- [x] Implement error handling for API timeouts/failures
- [x] Create prompt templates for each feature:
  - Rules lookup prompt template
  - Creature stat block prompt template
  - NPC generation prompt template
  - Magic item prompt template
- [x] Implement response parsing/formatting functions
- [x] Add retry logic (exponential backoff) for API failures
- [x] Set up cost tracking/logging for API calls

**Code Template:**
```typescript
// services/llmService.ts
interface LLMRequest {
  systemPrompt: string;
  userPrompt: string;
  maxTokens: number;
}

interface LLMResponse {
  content: string;
  tokensUsed: number;
  costEstimate: number;
}

async function callLLM(request: LLMRequest): Promise<LLMResponse> {
  // Implementation with error handling and retries
}

export { callLLM };
```

**Deliverable:** LLM service can successfully call OpenAI API and return formatted responses

---

#### Task 1.3: Rate Limiting & Basic Security
**Effort:** 1.5 hours  
**Priority:** P0 (blocking)

**Tasks:**
- [x] Implement rate limiting middleware (100 requests/5 minutes per IP)
- [x] Add input validation for all endpoints
- [x] Implement HTTPS redirect (even in dev)
- [x] Add request logging with timestamps
- [x] Set up error response standardization (all errors follow same format)

**Deliverable:** Rate limiter returns 429 when limit exceeded, all endpoints validate input

---

### Frontend Infrastructure

#### Task 1.4: React Project Setup
**Effort:** 2 hours  
**Priority:** P0 (blocking)

**Tasks:**
- [x] Initialize React 18+ project (via Vite or Create React App)
- [x] Install core dependencies (tailwind, shadcn/ui, axios, zustand, react-router)
- [x] Set up folder structure:
  ```
  src/
  ├── components/
  │   ├── Dashboard.tsx
  │   ├── RulesLookup.tsx
  │   ├── CreatureSearch.tsx
  │   ├── NPCGenerator.tsx
  │   ├── MagicItemGenerator.tsx
  │   ├── ResultCard.tsx
  │   └── SessionHistory.tsx
  ├── stores/
  │   └── sessionStore.ts
  ├── lib/
  │   └── api.ts
  ├── types/
  │   └── index.ts
  ├── App.tsx
  └── main.tsx
  ```
- [x] Configure Tailwind CSS
- [x] Set up shadcn/ui with Button, Card, Input components
- [x] Configure API client (axios instance with error handling)
- [x] Set up Zustand store for session state

**Deliverable:** React app runs on localhost:5173, renders empty dashboard

---

#### Task 1.5: Routing & Navigation
**Effort:** 1.5 hours  
**Priority:** P1

**Tasks:**
- [x] Set up React Router v6
- [x] Create routes:
  - `/` - Dashboard
  - `/rules` - Rules Lookup
  - `/creatures` - Creature Search
  - `/npcs` - NPC Generator
  - `/items` - Magic Item Generator
- [x] Implement back button navigation
- [ ] Create mobile-friendly navigation menu

**Deliverable:** Can navigate between all feature pages, back button works

---

## Feature 1: Natural Language Rules Lookup (Week 1)

### Backend Implementation

#### Task 1.6: Rules Lookup Endpoint
**Effort:** 4 hours  
**Priority:** P0 (core feature)

**Tasks:**
- [x] Create POST `/api/rules/search` endpoint
- [x] Implement request validation:
  - `query` (string, required, max 500 chars)
  - `version` (enum: "5e" | "2014", default "5e")
  - `maxTokens` (number, default 500, max 1000)
- [x] Create system prompt for GPT-4 focused on D&D rules
- [x] Implement response parsing (extract answer, generate follow-up questions)
- [x] Add request logging
- [x] Test with sample queries

**System Prompt Template:**
```
You are a D&D 5e rules expert. A Dungeon Master is asking a question during gameplay.
Provide a clear, concise answer within 2-3 paragraphs.
Focus on: practical application, not flavor text.
Reference source: e.g., "Player's Handbook, Chapter X"

If question is ambiguous, clarify what you're answering.
Always end with 2 follow-up questions the DM might ask.
```

**Endpoint Response:**
```json
{
  "success": true,
  "query": "How does grappling work?",
  "answer": "[Full answer text]",
  "source": "D&D 5e Player's Handbook",
  "followUpQuestions": ["Q1", "Q2"],
  "timestamp": "2026-03-03T14:23:45Z"
}
```

**Deliverable:** Endpoint tested with curl, returns well-formatted responses in < 5 sec

---

### Frontend Implementation

#### Task 1.7: Rules Lookup UI Component
**Effort:** 3 hours  
**Priority:** P0 (core feature)

**Tasks:**
- [x] Create RulesLookup component with:
  - Text input field for query
  - D&D version selector (5e / 2014)
  - Search button (disabled while loading)
  - Loading state with spinner
  - Error state with retry button
- [x] Implement API call and response handling
- [x] Display result in ResultCard component (reusable)
- [x] Implement copy-to-clipboard button
- [x] Add "Ask Follow-Up" button that refills input with follow-up question

**UI Layout:**
```
┌─ Rules Lookup ─────────────────┐
│ [◄ Back]                       │
├────────────────────────────────┤
│ [Enter your question......]    │
│ Version: [5e ▼]                │
│ [Search]                       │
│                                │
│ Result Card (if results exist) │
│ [Copy] [Follow-up Q1] [New Q]  │
└────────────────────────────────┘
```

**Deliverable:** Component integrates with backend, displays rules correctly

---

#### Task 1.8: Results Display Component
**Effort:** 2 hours  
**Priority:** P1

**Tasks:**
- [x] Create reusable ResultCard component
- [x] Format results with proper spacing and typography
- [x] Implement copy-to-clipboard functionality
- [x] Add timestamp and source attribution
- [x] Show follow-up questions as clickable buttons
- [x] Implement mobile scroll handling

**Deliverable:** ResultCard displays cleanly on mobile and desktop

---

## Feature 2: NPC Generator - One Click (Week 1)

### Backend Implementation

#### Task 1.9: NPC Generation Endpoint
**Effort:** 4 hours  
**Priority:** P0 (core feature)

**Tasks:**
- [ ] Create POST `/api/npcs/generate` endpoint
- [ ] Implement request validation:
  - `generationType`: "random" (for Phase 1)
  - `includeVoiceNotes`: boolean (default true)
- [ ] Create detailed NPC generation prompt:
  - Name (should be memorable and fantasy-appropriate)
  - Race/appearance (2-3 sentences, visual details)
  - Personality (2-3 defining traits)
  - Goal (what they're trying to accomplish)
  - Secret (hidden agenda or background)
  - Quirk (memorable mannerism)
  - Voice notes (how to roleplay them)
  - Profession/role (implied by appearance/goals)
  
- [ ] Implement response parsing to extract all 8 fields
- [ ] Validate output structure before returning
- [ ] Add retry logic if parsing fails

**System Prompt:**
```
You are a D&D NPC creator. Generate a memorable, unique NPC suitable for any campaign.
Create a fresh character with interesting depth.

Return EXACTLY this JSON structure:
{
  "name": "Character Name",
  "race": "Race, brief appearance",
  "appearance": "2-3 sentence vivid description",
  "personality": "Key personality traits",
  "goal": "What they're working toward",
  "secret": "Hidden aspect of their identity/background",
  "quirk": "Memorable mannerism",
  "voice": "How to roleplay their speech"
}

Be creative. Make characters that will stick with players.
```

**Deliverable:** Endpoint generates 5+ unique NPCs in a row, all well-formed

---

### Frontend Implementation

#### Task 1.10: NPC Generator UI
**Effort:** 3 hours  
**Priority:** P0 (core feature)

**Tasks:**
- [ ] Create NPCGenerator component
- [ ] Implement big red "Generate NPC" button (one-click)
- [ ] Show loading state while generating
- [ ] Display NPC in formatted card with all 8 fields
- [ ] Implement "Generate Another" button
- [ ] Add copy-to-clipboard for full NPC
- [ ] Add individual field copy buttons

**UI Layout:**
```
┌─ NPC Generator ────────────────┐
│ [◄ Back]                       │
├────────────────────────────────┤
│                                │
│      [Generate NPC]            │
│                                │
│ ┌─ NPC Card ─────────────────┐ │
│ │ NAME: Marta Ironfoot       │ │
│ │ RACE: Dwarf woman...       │ │
│ │ PERSONALITY: Gruff but...  │ │
│ │ GOAL: Establish trade...   │ │
│ │ SECRET: Secretly funding... │ │
│ │ QUIRK: Collects buttons     │ │
│ │ VOICE: Deep, slow speech... │ │
│ │                            │ │
│ │ [Copy] [Another] [History] │ │
│ └─────────────────────────────┘ │
└────────────────────────────────┘
```

**Deliverable:** One-click NPC generation works, displays all fields

---

## Feature 3: Creature Search (Week 2)

### Backend Implementation

#### Task 1.11: Creature Search Endpoint
**Effort:** 5 hours  
**Priority:** P0 (core feature)

**Tasks:**
- [ ] Create POST `/api/creatures/search` endpoint
- [ ] Implement request validation:
  - `query` (string, required)
  - `searchType` (enum: "name" | "type", default "name")
  - `maxResults` (number, default 5, max 10)
  
- [ ] Create creature search prompt that:
  - Searches for D&D 5e creature by name/type
  - Returns up to maxResults matches
  - Includes CR, AC, HP, alignment (quick preview)
  
- [ ] Implement parsing to extract creature list
- [ ] Return structured array of creatures with links to full stats

**System Prompt:**
```
You are a D&D 5e monster manual expert.
The user is searching for a creature to use in their encounter.

Search for: [USER_QUERY]

Return up to [MAX_RESULTS] matching creatures in this JSON format:
{
  "creatures": [
    {
      "name": "Creature Name",
      "cr": 0.25,
      "ac": 15,
      "hp": 7,
      "size_type": "Small humanoid (goblinoid), Neutral Evil",
      "summary": "Brief one-line description"
    }
  ]
}
```

**Deliverable:** Search for "goblin", "dragon", "zombie" returns correct results

---

#### Task 1.12: Creature Stat Block Endpoint
**Effort:** 5 hours  
**Priority:** P0 (core feature)

**Tasks:**
- [ ] Create GET `/api/creatures/:creatureName` endpoint (retrieve full stat block)
- [ ] Implement creature stat block generation prompt
- [ ] Parse response to extract all stat block fields:
  - AC, HP formula, Speed
  - Ability scores (STR, DEX, CON, INT, WIS, CHA)
  - Skills, saves, resistances, immunities
  - Senses, languages, challenge
  - Abilities (passive features)
  - Actions (melee/ranged attacks, special actions)
  - Legendary actions (if applicable)
  
- [ ] Format stat block in standard D&D layout
- [ ] Add parsing validation

**System Prompt:**
```
Generate the complete D&D 5e stat block for: [CREATURE_NAME]

Use the standard stat block format:
- Size/type, alignment
- AC with source
- HP with formula
- Speed (all movement types)
- Ability scores (standard format)
- Saving throws (if proficient)
- Skills (if proficient)
- Damage resistances, immunities, conditions
- Senses, languages
- Challenge X (X XP)
- Abilities (special traits)
- Actions (attacks and options)
- Legendary actions (if applicable)

Be accurate and complete. This is for actual D&D play.
```

**Deliverable:** Retrieve and display full stat blocks for 3+ creatures

---

### Frontend Implementation

#### Task 1.13: Creature Search UI
**Effort:** 3 hours  
**Priority:** P0 (core feature)

**Tasks:**
- [ ] Create CreatureSearch component
- [ ] Implement search interface:
  - Text input for creature name/type
  - Search button
  - Search type toggle (by name / by type)
  
- [ ] Display search results as clickable list
- [ ] Show creature preview card on selection
- [ ] Implement loading states

**UI Layout:**
```
┌─ Creature Search ──────────────┐
│ [◄ Back]                       │
├────────────────────────────────┤
│ [Search for creature...]   [🔍]│
│ By: [Name ▼]                   │
│                                │
│ Results:                        │
│ ─ Goblin (CR 1/8)              │
│ ─ Goblin Boss (CR 1)           │
│ ─ Bugbear (CR 3)               │
│                                │
│ ┌─ Selected: Goblin ──────────┐│
│ │ CR: 1/8, AC: 15, HP: 7      ││
│ │ Small humanoid, Neutral Evil││
│ │ [View Full Stat Block]       ││
│ └─────────────────────────────┘│
└────────────────────────────────┘
```

**Deliverable:** Search works, displays creature previews

---

#### Task 1.14: Creature Stat Block Display
**Effort:** 3 hours  
**Priority:** P1

**Tasks:**
- [ ] Create StatBlockCard component
- [ ] Display stat block in standard format with proper spacing
- [ ] Implement mobile-friendly table rendering (stack abilities/actions vertically)
- [ ] Add copy-to-clipboard for full stat block
- [ ] Add formatting for common stat block elements (bold headers, ability scores in boxes)

**Deliverable:** Stat blocks display correctly on mobile and desktop

---

## Session History & State Management (Week 2)

### Task 1.15: Session State Store (Zustand)
**Effort:** 2 hours  
**Priority:** P1

**Tasks:**
- [ ] Create Zustand store for session state
- [ ] Implement state structure:
  ```typescript
  interface SessionStore {
    sessionId: string;
    startTime: Date;
    searchHistory: SearchHistoryEntry[];
    generatedNPCs: NPC[];
    searchedCreatures: Creature[];
    preferences: {
      dndVersion: "5e" | "2014";
      theme: "light" | "dark";
    };
    
    // Actions
    addToSearchHistory(entry: SearchHistoryEntry): void;
    addGeneratedNPC(npc: NPC): void;
    addSearchedCreature(creature: Creature): void;
    setPreference(key: string, value: any): void;
    clearSessionHistory(): void;
  }
  ```
  
- [ ] Persist session ID to sessionStorage
- [ ] Make search history accessible from all components

**Deliverable:** Session history stores and displays all generated content

---

### Task 1.16: Session History UI
**Effort:** 2 hours  
**Priority:** P1

**Tasks:**
- [ ] Create SessionHistory component
- [ ] Display collapsible history sections:
  - Recent searches
  - Generated NPCs
  - Searched creatures
  
- [ ] Make history items clickable to re-display results
- [ ] Add clear history button
- [ ] Show timestamps for all items

**Deliverable:** Session history accessible and functional

---

## Testing & Quality Assurance (Week 2)

### Task 1.17: API Testing
**Effort:** 3 hours  
**Priority:** P1

**Tasks:**
- [ ] Write integration tests for all endpoints:
  - Rules search (test multiple queries, different versions)
  - NPC generation (test consistency, field presence)
  - Creature search (test different query types)
  - Creature stat block retrieval
  
- [ ] Test error scenarios:
  - Invalid input
  - Rate limiting
  - API timeouts
  - Malformed responses
  
- [ ] Use Jest + Supertest or similar
- [ ] Aim for 80%+ endpoint coverage

**Deliverable:** Test suite passes, all endpoints tested

---

### Task 1.18: Frontend Testing
**Effort:** 2 hours  
**Priority:** P1

**Tasks:**
- [ ] Write component tests using React Testing Library
- [ ] Test all major components:
  - RulesLookup (input, display, copy)
  - NPCGenerator (generation, display)
  - CreatureSearch
  
- [ ] Test state management (Zustand)
- [ ] Test error handling and loading states
- [ ] Aim for 70%+ coverage

**Deliverable:** Component tests pass

---

### Task 1.19: Mobile Responsiveness Testing
**Effort:** 2 hours  
**Priority:** P1

**Tasks:**
- [ ] Test on multiple mobile devices/screen sizes:
  - iPhone SE (375px)
  - iPhone 12 (390px)
  - iPad (768px)
  - Desktop (1920px)
  
- [ ] Check touch interactions
- [ ] Verify keyboard input on mobile
- [ ] Test scroll behavior on result cards
- [ ] Use Chrome DevTools responsive mode

**Checklist:**
- [ ] Text readable on all sizes
- [ ] Buttons easily tappable (48px minimum)
- [ ] No horizontal scroll needed
- [ ] Forms fill full width appropriately
- [ ] Stat blocks properly stack on mobile

**Deliverable:** App fully responsive across all tested sizes

---

### Task 1.20: Voice Input Prep (Phase 1 infrastructure only)
**Effort:** 1 hour  
**Priority:** P2

**Tasks:**
- [ ] Add Web Speech API support to input components (button only, no implementation yet)
- [ ] Document plan for Phase 2 voice integration
- [ ] Verify API availability in target browsers
- [ ] Note: Full voice implementation in Phase 2

**Deliverable:** Voice button present but disabled with "Coming in Phase 2" tooltip

---

## Deployment & Monitoring (Week 2)

### Task 1.21: Backend Deployment Setup
**Effort:** 3 hours  
**Priority:** P0

**Tasks:**
- [ ] Choose hosting platform (Vercel, Railway, Heroku, or similar)
- [ ] Set up environment variables in hosting platform
- [ ] Create production-grade config
- [ ] Set up HTTPS (automatic with most platforms)
- [ ] Configure logging (stdout to container logs)
- [ ] Set up basic uptime monitoring (Uptime Robot)
- [ ] Test health check endpoint from production

**Deliverable:** Backend deployed and accessible at public URL, health check works

---

### Task 1.22: Frontend Deployment Setup
**Effort:** 2 hours  
**Priority:** P0

**Tasks:**
- [ ] Deploy React app to Vercel or similar
- [ ] Configure API endpoint for production backend
- [ ] Set up build process (npm run build)
- [ ] Enable CORS for production domain
- [ ] Test API calls from production frontend

**Deliverable:** Frontend deployed, can call backend API successfully

---

### Task 1.23: Error Tracking & Logging
**Effort:** 2 hours  
**Priority:** P1

**Tasks:**
- [ ] Set up Sentry (free tier) for error tracking
- [ ] Install Sentry SDK in frontend and backend
- [ ] Configure error capture for API failures
- [ ] Set up JavaScript error logging
- [ ] Create error dashboard to monitor issues
- [ ] Set up alerts for critical errors

**Deliverable:** Errors logged and viewable in Sentry dashboard

---

### Task 1.24: Performance Monitoring
**Effort:** 1.5 hours  
**Priority:** P2

**Tasks:**
- [ ] Enable Vercel analytics (if using Vercel)
- [ ] Add basic performance logging:
  - API response time
  - Component render time
  - LLM API call duration
  
- [ ] Create dashboard/spreadsheet to track metrics
- [ ] Establish baseline metrics to compare against

**Deliverable:** Can track response times and performance metrics

---

## Documentation (Week 2)

### Task 1.25: API Documentation
**Effort:** 1 hour  
**Priority:** P1

**Tasks:**
- [ ] Create README.md in backend folder
- [ ] Document all endpoints:
  - Method, path, parameters
  - Sample request and response
  - Error codes
  
- [ ] Include setup instructions for local development
- [ ] Document environment variables needed

**Deliverable:** API documentation complete and clear

---

### Task 1.26: Frontend Documentation
**Effort:** 1 hour  
**Priority:** P1

**Tasks:**
- [ ] Create README.md in frontend folder
- [ ] Document component structure
- [ ] Include setup instructions
- [ ] Document state management (Zustand)
- [ ] Add screenshots of main screens

**Deliverable:** Frontend documentation complete

---

### Task 1.27: Setup Instructions & Deployment Guide
**Effort:** 1.5 hours  
**Priority:** P1

**Tasks:**
- [ ] Create SETUP.md with:
  - Local development setup (both frontend and backend)
  - Environment variables required
  - Running tests
  - Deploying to production
  
- [ ] Create DEPLOYMENT.md with step-by-step instructions

**Deliverable:** New developers can set up project in 30 minutes

---

## Bug Fixes & Polish (End of Week 2)

### Task 1.28: Bug Fixes & Edge Cases
**Effort:** 2 hours  
**Priority:** P1

**Tasks:**
- [ ] Fix any failing tests
- [ ] Handle edge cases:
  - Very long queries
  - Special characters in input
  - API timeout recovery
  - Network errors
  
- [ ] Test rapid API calls (user mashing button)
- [ ] Verify rate limiting doesn't block legitimate users
- [ ] Test with slow network (throttle in DevTools)

**Deliverable:** App handles edge cases gracefully

---

### Task 1.29: UI Polish
**Effort:** 2 hours  
**Priority:** P1

**Tasks:**
- [ ] Review all screens for:
  - Consistent spacing
  - Readable typography
  - Clear button labels
  - Proper loading states
  - Error message clarity
  
- [ ] Add transitions/animations for better UX
- [ ] Ensure all text is visible (no cut-off)
- [ ] Test with actual D&D players if possible

**Deliverable:** App looks polished and professional

---

## Phase 1 Checklist

### Backend Delivery
- [ ] All 3 API endpoints working and deployed
- [ ] Rate limiting functional
- [ ] Error handling comprehensive
- [ ] Logging/monitoring set up
- [ ] Tests passing (80%+ coverage)
- [ ] API documentation complete
- [ ] Backend accessible via HTTPS

### Frontend Delivery
- [ ] All 3 features working (text input only)
- [ ] Session history functional
- [ ] Mobile responsive
- [ ] Component tests passing
- [ ] Error UI informative
- [ ] Frontend deployed to production
- [ ] React Query/API calls working

### Operations
- [ ] Error tracking active (Sentry)
- [ ] Performance baselines established
- [ ] Uptime monitoring active
- [ ] Deployment process documented
- [ ] Code deployed to production

### Testing Complete
- [ ] Manual testing on 3+ mobile devices
- [ ] Tested rules lookup, NPC gen, creature search
- [ ] All edge cases handled
- [ ] Error scenarios tested
- [ ] API endpoints tested

---

## Success Criteria (Phase 1)

✅ **Functional Requirements:**
- Rules lookup returns D&D accurate answers < 5 sec
- NPC generator creates diverse, usable NPCs
- Creature search finds creatures accurately
- Creature stat blocks display correctly
- Session history works and persists within session

✅ **Technical Requirements:**
- API response time < 500ms (excluding LLM)
- Frontend page load < 3 seconds
- Zero console errors on any mobile device
- Rate limiting prevents abuse
- Error messages are helpful

✅ **User Experience:**
- Mobile UX smooth and responsive
- All text readable on 375px screens
- Touch interactions work properly
- Error recovery intuitive
- Speed prioritized (fast feedback)

✅ **Deployment:**
- App accessible at public URL
- Health check passes
- Error monitoring active
- Logs viewable
- Can deploy changes within 5 minutes

---

## Blockers & Dependencies

**External Dependencies:**
- OpenAI API key and credits (must have before starting)
- Hosting platform account (Vercel/Railway/etc)
- Domain name (optional for MVP, can use default subdomain)

**Internal Dependencies:**
- Backend must be deployed before frontend can be tested
- LLM service working before any feature can be tested
- Rate limiter needs to be in place before public access

---

## Notes

- Keep features simple in Phase 1 - no fancy animations or complex UI
- Focus on speed and reliability, not beauty
- Collect user feedback aggressively for Phase 2
- Log all API calls and user behavior for analytics
- Be prepared to scale OpenAI API rate limits if popular
- Have a rollback plan in case of critical bugs in production

---

**Phase Completion Date:** End of Week 2 (Target: March 17, 2026)
