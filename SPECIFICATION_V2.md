# AI Dungeon Master Assistant - V2 Product Specification

**Version:** 2.0  
**Status:** Planning  
**Last Updated:** March 3, 2026  
**Target Release:** Q4 2026 / Q1 2027

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Product Vision](#product-vision)
3. [New V2 Features](#new-v2-features)
4. [Core V1 Features (Retained)](#core-v1-features-retained)
5. [Architecture & Technology Stack](#architecture--technology-stack)
6. [Database Schema](#database-schema)
7. [Authentication & Authorization](#authentication--authorization)
8. [User Interface & Flows](#user-interface--flows)
9. [API Specifications](#api-specifications)
10. [Advanced Features](#advanced-features)
11. [Technical Requirements](#technical-requirements)
12. [Acceptance Criteria](#acceptance-criteria)
13. [Out of Scope](#out-of-scope)

---

## Executive Summary

The AI Dungeon Master Assistant V2 evolves from a stateless session tool into a powerful campaign management platform. With user accounts, persistent data storage, and advanced features like combat tracking and campaign-specific customization, V2 enables DMs to manage entire campaigns while maintaining the speed and ease-of-use of V1.

**Core Value Proposition:** A complete D&D assistant that learns player preferences, stores campaign data, tracks combat on the fly, and generates contextually appropriate content for each unique campaign.

**Key Improvements:**
- User accounts and persistent data
- Campaign and party management
- Saved characters, creatures, and loot
- Combat/initiative tracking
- Campaign-specific content generation
- Settings and preferences persistence
- Advanced tavern/location generation

---

## Product Vision

### Evolution from V1 to V2

**V1:** Fast, stateless tool for immediate game needs
**V2:** Persistent, personalized campaign assistant that grows with your game

### New Problem Statements Addressed

1. **Campaign Management:** DMs juggle multiple worlds, parties, NPCs, and story arcs across sessions
2. **Combat Flow:** Real-time combat tracking needed during intense encounters
3. **Consistency:** Generated NPCs/locations should be memorable and referenceable across sessions
4. **Personalization:** Generic content doesn't match specific campaign tones/worlds
5. **Quick Recall:** Finding that NPC from 3 months ago should take seconds, not min

### Target Users

- **Primary:** Experienced DMs managing ongoing campaigns (weekly+)
- **Secondary:** D&D content creators, streaming DMs
- **Tertiary:** Story enthusiasts who want to explore D&D worlds

---

## New V2 Features

### Feature 1: User Accounts & Campaign Management

**Purpose:** Enable persistent data storage and multi-campaign support.

**Capabilities:**
- Email/password signup (with OAuth alternatives: Google, GitHub)
- Create multiple campaigns (different worlds, tones, player groups)
- Invite players to view party roster and session notes
- Campaign-specific settings (house rules, preferred content)
- Session notes and timeline generation
- Soft delete campaigns (archive rather than delete)

**Data Associated with Campaign:**
```
Campaign
├── Name, description, campaign tone
├── D&D version & ruleset
├── Invited players & roles
├── Session notes & timeline
├── Lists of:
│   ├── PCs (player characters)
│   ├── Saved NPCs
│   ├── Saved creatures (stat blocks)
│   ├── Loot treasury
│   └── Locations & taverns
└── House rules and custom rules
```

**Example Campaign Setup:**
```
Campaign: "Curse of Strahd - Waterdeep Epilogue"
Tone: Darkness, mystery, gothic horror
D&D Version: 5e
Players: alice@example.com (Wizard), bob@example.com (Rogue)
Sessions: 27
Custom Rules: "Critical hits on 19-20"
```

---

### Feature 2: PC (Player Character) & NPC Management

**Purpose:** Build a searchable roster of characters with personality continuity.

**Capabilities:**
- Create detailed PC profiles (class, race, backstory, bonds, flaws)
- Link NPCs to specific campaigns
- Tag NPCs (ally, enemy, romance option, merchant, quest-giver, etc.)
- Advanced search by tags, location, goals
- NPC relationship mapper (who knows whom)
- Generate NPC variants for future sessions
- Export character sheets for players

**PC/NPC Data Model:**
```
Character
├── Name, race, class
├── Appearance, personality, voice
├── Goals, secrets, quirks
├── Relationships (linked to other characters)
├── Tags (merchant, ally, enemy, etc.)
├── Backstory notes
├── Session appearances (when introduced)
├── Updated by user (last modified date)
├── Campaign association
├── Mechanical stats (optional - full char sheet)
└── Notes (free-form DM notes about personality)
```

**Example Use Case:**

> *Session 27: DM needs NPC bartender "Marta" who was introduced in Session 3*
>
> *Search: "Marta" → Instant access to full profile*
> - Gruff dwarf woman, loves trading stories over ale
> - Goal: Expand her tavern empire
> - Secret: Secretly funding a kobold settlement (unknown to party)
> - Relationships: Sister to Ironfoot Traders, knows Ranger PC's backstory
> - Recent notes: "Player tipped her heavily - now quite fond of party"

---

### Feature 3: Creature Library & Custom Stat Blocks

**Purpose:** Personal library of creatures scaled and adjusted for your campaigns.

**Capabilities:**
- Save scaled creatures to campaign library
- Create custom variants with modified abilities
- Tag creatures (undead, humanoid, boss-worthy, minion, etc.)
- Quick re-randomize stats with one click
- Version history of creature edits
- Share creatures between campaigns
- Difficulty rating relative to your party

**Saved Creature Data:**
```
SavedCreature
├── Base creature name (reference)
├── Custom name (e.g., "Goblin Boss - Redthorn Clan")
├── Full stat block (editable)
├── CR (Challenge Rating)
├── Tags (undead, fire_themed, boss, minion)
├── Campaign association
├── Notes (tactical tips, lore)
├── Created date, last used date
└── Edit history (undo capability)
```

---

### Feature 4: Loot Treasury & Magic Item Management

**Purpose:** Manage discovered/planned treasure across long campaigns.

**Capabilities:**
- Add items to treasury (found or planned)
- Mark items as distributed/claimed by PCs
- Link magic items to specific NPCs or locations
- Generate treasure hoards for different encounter types
- Track who owns what magic item
- Legacy items spanning multiple campaigns
- Random treasure vault generation

**Loot Entry Data:**
```
TreasuryItem
├── Item name, rarity
├── Flavor text
├── Mechanics
├── Status (in_inventory, on_npc, in_location, legendary, etc.)
├── Claimed by PC (if applicable)
├── Location found (dungeon, treasure hoard, NPC, etc.)
├── Campaign association
├── Notes (curses, special conditions)
└── Date acquired/planned
```

---

### Feature 5: Initiative Tracking & Combat Flow Assistant

**Purpose:** Speed up combat by automating initiative roll tracking and turn order.

**Capabilities:**
- Add party members and enemies to initiative tracker
- Manual roll entry or "roll initiative for all" button
- Auto-order by initiative (toggle ascending/descending)
- Highlight whose turn it is
- Quick damage entry (subtract from HP)
- Track conditions (concentration, prone, invisible, etc.)
- Undo damage/actions (critical for D&D)
- Export combat summary after encounter
- Round timer (optional)

**Combat Tracker UI:**
```
┌────────────────────────────────────┐
│  Initiative Tracker - Red Dragon   │
├────────────────────────────────────┤
│                                    │
│  Round 3 │ [Start Next Round]      │
│                                    │
│  [Highlighted] Initiative 18       │
│  PC: Wizard (HP: 32/45)            │
│  [Quick Action Buttons]            │
│  [-5 dmg] [-10 dmg] [Custom] [End] │
│                                    │
│  Initiative 16                     │
│  Enemy: Red Dragon (HP: 184/220)   │
│  [Bloodied] [Damaged]              │
│                                    │
│  Initiative 10                     │
│  PC: Fighter (HP: 52/58)           │
│  [Condition: Concentration]        │
│                                    │
│  ... more participants ...         │
│                                    │
└────────────────────────────────────┘
```

**Combat Data Model:**
```
CombatSession
├── Campaign association
├── Encounter name
├── Participants [
│   ├── id, name, type (PC/enemy)
│   ├── Initiative roll (editable)
│   ├── Current HP, max HP
│   ├── AC (if needed)
│   ├── Active conditions (stunned, invisible, etc.)
│   └── Notes
│ ]
├── Current round
├── Current active participant
├── Turn history (for undo)
├── Created date, ended date
└── Combat summary
```

---

### Feature 6: Location & Tavern Generator

**Purpose:** Quickly generate memorable places with thematic consistency to campaigns.

**Capabilities:**
- Generate taverns, inns, shops, dungeons with full descriptions
- Link locations to specific campaign
- Remember generated locations for future sessions
- "Populate" location with NPCs, hooks, encounters
- Generate location variants (damaged version, different era, etc.)
- Map connections (which taverns/shops in same town)
- Store patron lists for taverns

**Generated Location Data:**
```
Location
├── Type (tavern, inn, shop, dungeon, fortress)
├── Name (generated or custom)
├── Appearance description
├── Proprietor(s) (NPC links)
├── Notable patrons/encounters
├── Specialties (what's available here)
├── Secrets/hooks for players
├── Campaign association
├── Campaign-specific tone/flavor
├── Session introduced
├── Edit history
└── Player notes (if shared with party)
```

**Example Tavern Generation:**

> **The Gleaming Tankard**
> 
> Appearance: A half-timbered building with a faded gold signboard. Warm torchlight spills from diamond-paned windows.
>
> Proprietor: Marta Ironfoot (linked NPC)
>
> Specialties:
> - Rare elven wines (expensive)
> - Information brokering (Marta knows everyone)
> - Safe meeting place for discreet conversations
>
> Notable Regulars:
> - Scarred mercenary (table in corner, watches everyone)
> - Young scholar studying ancient texts
> - Merchant prince (Thursday evenings only)
>
> Hooks:
> - Bounty notices on the board
> - Someone is framing Marta for theft
> - Underground fighting ring in the basement

---

### Feature 7: Campaign-Specific Content Generation

**Purpose:** Generate content that matches campaign tone, house rules, and player preferences.

**Capabilities:**
- Learn and apply campaign tone (dark, comedic, heroic, etc.)
- Use saved house rules in generated content
- Reference existing NPCs/creatures in new generation
- Generate encounters tuned to party composition
- Content respects campaign timeline and lore
- Holiday/seasonal content awareness

**Campaign Context for Content Generation:**
```
When user asks to "Generate an NPC":
- System checks campaign tone
- System checks party composition
- System scans existing NPCs for relationship opportunities
- System applies house rules (e.g., "include kobold-friendly NPCs")
- LLM receives full context for coherent generation
```

---

## Core V1 Features (Retained)

All V1 features remain fully functional in V2:
- Natural language rules lookup (now with campaign-specific house rules)
- Stat block access & smart adjustments (now searchable across saved creatures)
- Instant NPC generator (now with autosave to campaign)
- Magic item generator (now with loot tracking)

In V2, these features are enhanced with:
- Auto-save to appropriate campaign location
- Quick search through saved results
- Context awareness (using campaign tone, party, house rules)

---

## Architecture & Technology Stack

### V2 Architecture Differences from V1

| Component | V1 | V2 | Notes |
|-----------|----|----|-------|
| **Database** | None | PostgreSQL | Persistent storage of users, campaigns, characters |
| **Auth** | None | JWT + OAuth | User authentication and session management |
| **Caching** | Browser only | Redis | Cache frequently accessed data |
| **Frontend State** | Zustand (session) | Redux + React Query | Complex state with server sync |
| **File Storage** | None | S3 / Cloud Storage | Character exports, combat logs |
| **Analytics** | None | Posthog / Mixpanel | Track feature usage and campaign metrics |

### Full Tech Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Frontend** | React 18 + TypeScript | Same as V1, add Redux for complex state |
| **Backend** | Node.js + Express | Same as V1, add authentication middleware |
| **Database** | PostgreSQL with Sequelize/TypeORM | Relational data (users, campaigns, characters) |
| **Cache** | Redis | Store auth tokens, campaign sessions |
| **File Storage** | AWS S3 or Google Cloud Storage | Store exports, uploaded images |
| **Authentication** | JWT + Passport.js (OAuth2) | Email/password + Google/GitHub login |
| **Real-time** | Socket.io (optional) | Real-time multiplayer initiative tracking |
| **Hosting** | Docker containers on Kubernetes or AWS ECS | Scale with user base |
| **CDN** | CloudFront / Cloudflare | Serve frontend globally |
| **Email** | SendGrid or Mailgun | Password resets, campaign invites |
| **Monitoring** | Sentry + DataDog | Error tracking and performance monitoring |

### V2 Architecture Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                    Web Browser (React App)                   │
│  ┌──────────────────────────────────────────────────────────┐│
│  │ Redux Store + React Query                                ││
│  │ ┌────────────────────────────────────────────────────┐  ││
│  │ │ User State | Campaign State | Character State     │  ││
│  │ │ Initiative Tracker | Loot Treasury | NPC Roster   │  ││
│  │ └────────────────────────────────────────────────────┘  ││
│  │                           ↕                               ││
│  │ ┌────────────────────────────────────────────────────┐  ││
│  │ │ React Components (Mobile Responsive)              │  ││
│  │ │ Campaign Dashboard | Character Manager | Combat   │  ││
│  │ │ Tracker | Content Generators | Settings          │  ││
│  │ └────────────────────────────────────────────────────┘  ││
│  └──────────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────────┘
                         │ (HTTPS + JWT)
                         ▼
┌──────────────────────────────────────────────────────────────┐
│              Node.js/Express Backend API Server              │
│  ┌──────────────────────────────────────────────────────────┐│
│  │ Authentication Middleware (JWT + Passport)               ││
│  │ ┌────────────────────────────────────────────────────┐  ││
│  │ │ Routes:                                            │  ││
│  │ │ Auth: /auth/register, /auth/login, /auth/refresh  │  ││
│  │ │ Campaigns: /campaigns (CRUD)                       │  ││
│  │ │ Characters: /campaigns/:id/characters              │  ││
│  │ │ Combat: /campaigns/:id/combat                      │  ││
│  │ │ Content: /rules, /creatures, /npcs, /items, /locs  │  ││
│  │ │ Settings: /user/settings                           │  ││
│  │ └────────────────────────────────────────────────────┘  ││
│  │                                                          ││
│  │ ┌────────────────────────────────────────────────────┐  ││
│  │ │ Service Layer                                      │  ││
│  │ │ - Campaign Service                                 │  ││
│  │ │ - Character Service                                │  ││
│  │ │ - Combat Tracking Service                          │  ││
│  │ │ - LLM Integration & Prompt Engineering             │  ││
│  │ │ - Auth Service                                     │  ││
│  │ │ - File Upload Service (exports)                    │  ││
│  │ └────────────────────────────────────────────────────┘  ││
│  └──────────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────────┘
         ↓              ↓              ↓              ↓
┌──────────────┐ ┌──────────────┐ ┌────────────┐ ┌──────────────┐
│  PostgreSQL  │ │    Redis     │ │  AWS S3    │ │  OpenAI API  │
│  Database    │ │  (Session    │ │  (Exports) │ │  (LLM)       │
│  (Persistent │ │   & Auth)    │ │            │ │              │
│   Data)      │ │              │ │            │ │              │
└──────────────┘ └──────────────┘ └────────────┘ └──────────────┘
```

---

## Database Schema

### Core Tables

```sql
-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  password_hash VARCHAR NOT NULL,
  display_name VARCHAR,
  avatar_url VARCHAR,
  oauth_providers JSONB, -- Google, GitHub, etc.
  email_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  deleted_at TIMESTAMP -- Soft delete
);

-- Campaigns
CREATE TABLE campaigns (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  name VARCHAR NOT NULL,
  description TEXT,
  setting VARCHAR, -- "Forgotten Realms", "Homebrew", etc.
  tone VARCHAR, -- "dark", "comedic", "heroic", etc.
  dnd_version VARCHAR DEFAULT "5e", -- "5e", "2014"
  house_rules TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  deleted_at TIMESTAMP
);

-- Campaign Members (inviting players)
CREATE TABLE campaign_members (
  id UUID PRIMARY KEY,
  campaign_id UUID REFERENCES campaigns(id),
  user_id UUID REFERENCES users(id),
  role VARCHAR, -- "dm", "player", "viewer"
  invited_at TIMESTAMP,
  joined_at TIMESTAMP
);

-- Characters (PCs + NPCs)
CREATE TABLE characters (
  id UUID PRIMARY KEY,
  campaign_id UUID REFERENCES campaigns(id),
  name VARCHAR NOT NULL,
  race VARCHAR,
  class VARCHAR,
  appearance TEXT,
  personality TEXT,
  goals TEXT,
  secrets TEXT,
  quirks TEXT,
  voice_notes TEXT,
  tags JSONB, -- ["merchant", "ally", "questGiver", etc.]
  relationships JSONB, -- Links to other character IDs
  backstory TEXT,
  character_type VARCHAR, -- "pc" or "npc"
  mechanical_stats JSONB, -- Optional full character sheet
  created_by_user_id UUID REFERENCES users(id),
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  deleted_at TIMESTAMP
);

-- Creatures (Stat Blocks)
CREATE TABLE creatures (
  id UUID PRIMARY KEY,
  campaign_id UUID REFERENCES campaigns(id),
  base_creature_name VARCHAR,
  custom_name VARCHAR,
  cr FLOAT,
  armor_class INT,
  hit_points INT,
  stats JSONB, -- {str, dex, con, int, wis, cha}
  skills JSONB, -- Array of skill proficiencies
  abilities TEXT,
  actions TEXT,
  legendary_actions TEXT,
  lair_actions TEXT,
  tags JSONB,
  notes TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  edit_history JSONB
);

-- Magic Items (Loot Treasury)
CREATE TABLE loot_items (
  id UUID PRIMARY KEY,
  campaign_id UUID REFERENCES campaigns(id),
  item_name VARCHAR NOT NULL,
  rarity VARCHAR, -- "common", "uncommon", "rare", etc.
  type VARCHAR, -- "wondrous_item", "weapon", "armor", etc.
  flavor_text TEXT,
  mechanics TEXT,
  status VARCHAR, -- "in_inventory", "on_npc", "in_location", "distributed"
  claimed_by_character_id UUID REFERENCES characters(id),
  location_found VARCHAR,
  notes TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Locations
CREATE TABLE locations (
  id UUID PRIMARY KEY,
  campaign_id UUID REFERENCES campaigns(id),
  name VARCHAR NOT NULL,
  location_type VARCHAR, -- "tavern", "shop", "dungeon", etc.
  description TEXT,
  proprietor_character_id UUID REFERENCES characters(id),
  patrons JSONB, -- Array of character IDs
  specialties TEXT,
  secrets_and_hooks TEXT,
  campaign_specific_flavor TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Combat Sessions
CREATE TABLE combat_sessions (
  id UUID PRIMARY KEY,
  campaign_id UUID REFERENCES campaigns(id),
  encounter_name VARCHAR,
  participants JSONB, -- Array of{id, name, type, init_roll, hp, max_hp, conditions}
  current_round INT,
  current_participant_id UUID,
  turn_history JSONB,
  combat_summary TEXT,
  created_at TIMESTAMP,
  ended_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Session Notes & Timeline
CREATE TABLE session_notes (
  id UUID PRIMARY KEY,
  campaign_id UUID REFERENCES campaigns(id),
  session_number INT,
  date_played DATE,
  content TEXT, -- Session recap
  key_events JSONB,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- User Settings
CREATE TABLE user_settings (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  theme VARCHAR DEFAULT "light", -- "light", "dark"
  default_dnd_version VARCHAR DEFAULT "5e",
  preferred_rule_books JSONB,
  notifications_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### Indexes for Performance

```sql
CREATE INDEX idx_campaigns_user_id ON campaigns(user_id);
CREATE INDEX idx_characters_campaign_id ON characters(campaign_id);
CREATE INDEX idx_creatures_campaign_id ON creatures(campaign_id);
CREATE INDEX idx_loot_campaign_id ON loot_items(campaign_id);
CREATE INDEX idx_locations_campaign_id ON locations(campaign_id);
CREATE INDEX idx_combat_campaign_id ON combat_sessions(campaign_id);
CREATE INDEX idx_campaign_members_campaign_id ON campaign_members(campaign_id);
CREATE INDEX idx_users_email ON users(email);
```

---

## Authentication & Authorization

### Authentication Methods

**Primary:** Email/Password (with bcrypt)
**Social:** Google OAuth 2.0, GitHub OAuth 2.0

### JWT Token Structure

```json
{
  "sub": "user_id_uuid",
  "email": "dm@example.com",
  "displayName": "Kristof",
  "iat": 1678440000,
  "exp": 1678526400,
  "aud": "dungeonmaster-assistant",
  "iss": "dungeonmaster-assistant"
}
```

### Authorization Levels

| Resource | Owner | Collaborators | Viewers | Others |
|----------|-------|---------------|---------|--------|
| Campaign | Full access | Edit campaign, content | Read-only | No access |
| Characters | Full access | Add/edit characters | Read-only | No access |
| Creatures | Full access | View/use | Read-only | No access |
| Loot | Full access | Edit | Read-only | No access |
| Combat Tracker | Full access | Live participation | View-only (read) | No access |
| Settings | Full access | None | None | None |

### API Authentication Flow

```
1. User registers with email password
2. Password hashed with bcrypt, stored in DB
3. User logs in → receives JWT token
4. Token stored in browser localStorage/cookie
5. Every request includes Authorization header: Bearer <token>
6. Backend verifies token signature
7. User can refresh token before expiry
8. Token expires after 24 hours
```

---

## User Interface & Flows

### Main Dashboard (After Login)

```
┌─────────────────────────────────────────────┐
│  AI Dungeon Master Assistant          👤   │
├─────────────────────────────────────────────┤
│                                             │
│  [+ New Campaign]  [Settings] [My Library] │
│                                             │
│  Active Campaigns:                          │
│  ┌───────────────────────────────────────┐  │
│  │ Curse of Strahd - Waterdeep E.       │  │
│  │ 27 sessions • Last session: 2 days ago│  │
│  │ Players: Alice (Wizard), Bob (Rogue)  │  │
│  │ [Open]                                │  │
│  └───────────────────────────────────────┘  │
│                                             │
│  ┌───────────────────────────────────────┐  │
│  │ Dragon of Icespire Peak (Homebrew)   │  │
│  │ 5 sessions • Last session: 2 weeks ago│  │
│  │ Players: Carol (Paladin), Dave (Bard)│  │
│  │ [Open]                                │  │
│  └───────────────────────────────────────┘  │
│                                             │
│  [Archive] [Duplicate] [Delete]            │
│                                             │
└─────────────────────────────────────────────┘
```

### Campaign View (Core Interface)

```
┌─────────────────────────────────────────────────────┐
│  ◄  Curse of Strahd - Waterdeep Epilogue     [⚙️]  │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Tabs: [Overview] [Characters] [Creatures]         │
│        [Locations] [Loot] [Combat] [Tools]         │
│                                                     │
│  ─────────────────────────────────────────────     │
│  Overview Tab:                                      │
│  ┌─────────────────────────────────────────────┐   │
│  │ Campaign Details                            │   │
│  │ Tone: Dark & Political Intrigue             │   │
│  │ Version: D&D 5e                             │   │
│  │ Sessions: 27                                │   │
│  │ Last Played: 2 days ago                     │   │
│  │                                             │   │
│  │ Players (Invite link)                       │   │
│  │ • alice@example.com - Wizard (PC Created)   │   │
│  │ • bob@example.com - Rogue (PC Created)      │   │
│  │                                             │   │
│  │ Quick Stats:                                │   │
│  │ 47 NPCs | 12 Creatures | $45,000 Loot      │   │
│  │ 3 Locations | 45 Session Notes              │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  Key Upcoming Events (from session notes):         │
│  • Meeting with Strahd at midnight                 │
│  • Artifact needed by next full moon              │
│  • Tavern patron secretly a vampire               │
│                                                     │
│  [Edit Campaign] [Export Campaign] [Archive]       │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Characters Tab (NPC & PC Management)

```
┌──────────────────────────────────────────────┐
│  ◄  CHARACTERS                               │
├──────────────────────────────────────────────┤
│  [+ Add Character] [Filter] [Search]        │
│  Filter: All | PCs | NPCs                   │
│          By Tag | By Status                 │
│                                             │
│  PC: Theron (Wizard - Alice)               │
│  Tags: player_character, trustworthy       │
│  Last session: 3 days ago                   │
│  [View Profile] [Edit] [Notes]             │
│                                             │
│  NPC: Marta Ironfoot (Dwarf)               │
│  Tags: merchant, ally, romantic_interest   │
│  Status: Fond of party                      │
│  Last appearance: Session 27                │
│  [View Profile] [Edit] [Generate Variant]  │
│                                             │
│  NPC: Count Strahd (Vampire)               │
│  Tags: villain, boss, recurring             │
│  Status: Enemy, seeking revenge             │
│  Last appearance: Session 26                │
│  [View Profile] [Edit] [Add to Combat]     │
│                                             │
│  ... more characters ...                    │
│                                             │
│  [Generate Random NPC] [Import From Library]│
└──────────────────────────────────────────────┘
```

### Character Detail View

```
┌────────────────────────────────────────────────────┐
│  ◄  Marta Ironfoot                        [Edit]  │
├────────────────────────────────────────────────────┤
│                                                    │
│  Type: NPC | Created: Session 3 | Last Modified:  │
│                                                    │
│  PROFILE                                           │
│  Race/Class: Dwarf, Merchant                       │
│                                                    │
│  Appearance:                                       │
│  Weathered dwarf woman, braided beard with iron  │
│  bands, calloused hands, wears fine merchant     │
│  clothes despite her rough demeanor.             │
│                                                    │
│  Personality & Voice:                             │
│  Gruff but fair, speaks rarely but always with    │
│  purpose. Deep voice with Highland accent.        │
│  Laughs unexpectedly but genuinely.              │
│                                                    │
│  Goals:                                            │
│  Establish secure trade route to mountain hold.   │
│  Expand tavern empire to 5 locations (currently   │
│  has 2).                                          │
│                                                    │
│  Secrets:                                          │
│  Secretly funding a kobold settlement near the    │
│  mountains (unknown to party).                    │
│                                                    │
│  Quirks & Bonds:                                   │
│  Collects interesting buttons (has 2000+).        │
│  Surprisingly sentimental about her late husband. │
│  Sister Ironfoot (NPC) - business partner         │
│                                                    │
│  RELATIONSHIPS                                     │
│  Knows Of: Theron (wizard) - respects his         │
│            magical knowledge                      │
│  Allies: Sister Ironfoot, City Guard Captain      │
│  Enemies: Thieves' Guild (stolen from her)       │
│                                                    │
│  SESSION HISTORY                                   │
│  Session 3: First meeting at The Gleaming Tankard │
│  Session 7: Party helped her fend off bandits    │
│  Session 27: Party tipped her heavily             │
│                                                    │
│  DM NOTES                                          │
│  [Free-form notes field]                          │
│  Player tipped her generously - she's now highly  │
│  favorable to the party. Use this for future      │
│  quests or connections.                          │
│                                                    │
│  [Duplicate NPC] [Generate Variant] [Delete]      │
└────────────────────────────────────────────────────┘
```

### Combat Tracker View

```
┌────────────────────────────────────────────────────┐
│  Combat: Red Dragon vs. Party        Round 3       │
├────────────────────────────────────────────────────┤
│                                                    │
│  [End Combat] [Add Participant] [Settings]        │
│                                                    │
│  ┌─────────────────────────────────────────────┐  │
│  │ 🔵 CURRENT TURN: PC Theron (Wizard)         │  │
│  │ Initiative: 18 | HP: 32/45                  │  │
│  │ AC: 14 | Conditions: None                   │  │
│  │                                             │  │
│  │ [Quick Damage: -5 | -10 | -15 | Custom]    │  │
│  │ [Add Condition]  [Undo Last]  [End Turn]   │  │
│  └─────────────────────────────────────────────┘  │
│                                                    │
│  Initiative Order:                                 │
│  ─────────────────────────────────────────────    │
│  Initiative 16                                     │
│  PC: Bob (Rogue) - HP: 28/35 - No Conditions     │  │
│                                                    │
│  Initiative 14                                     │
│  Enemy: Red Dragon - HP: 184/220 - Bloodied      │  │
│  [CR: 10] [AC: 17]                               │  │
│                                                    │
│  Initiative 10                                     │
│  PC: Carol (Paladin) - HP: 52/58 - Concentration│  │
│                                                    │
│  Initiative 8                                      │
│  PC: Dave (Bard) - HP: 38/40 - None              │  │
│                                                    │
│  [Reorder Manually] [Import from Party] [Clear]   │  │
│                                                    │
│  Combat Log:                                       │
│  ─────────────────────────────────────────────    │
│  Round 3: Theron (Wizard) 32/45                  │  │
│  Round 2: Dragon used Flame Breath               │  │
│  Round 2: Party took 28 total damage              │  │
│  Round 1: Initiative rolled                       │  │
│                                                    │
│  [Export Combat Summary] [Save Combat Report]     │  │
└────────────────────────────────────────────────────┘
```

### Tools Tab (Content Generators)

```
┌────────────────────────────────────────────────────┐
│  ◄  TOOLS & GENERATORS                            │
├────────────────────────────────────────────────────┤
│                                                    │
│  Generators with Campaign Context:                 │
│  ┌──────────────────────────────────────────────┐  │
│  │ 🔍 Rules Lookup                             │  │
│  │ (Campaign house rules applied)               │  │
│  └──────────────────────────────────────────────┘  │
│                                                    │
│  ┌──────────────────────────────────────────────┐  │
│  │ 👥 NPC Generator                            │  │
│  │ (Saves to Character Library)                 │  │
│  │ [One-Click Random] [Guided Custom]           │  │
│  │ [Generate Tavern Patron] [Generate Boss NPC] │  │
│  └──────────────────────────────────────────────┘  │
│                                                    │
│  ┌──────────────────────────────────────────────┐  │
│  │ ⚔️ Creature Generator / Search               │  │
│  │ (Saves to Creature Library)                  │  │
│  │ [Search Existing] [Generate Encounter]       │  │
│  │ [Scale for Party] [Create Boss Variant]      │  │
│  └──────────────────────────────────────────────┘  │
│                                                    │
│  ┌──────────────────────────────────────────────┐  │
│  │ ✨ Magic Item Generator                     │  │
│  │ (Tracks to Loot Treasury)                    │  │
│  │ [Random Magical Item] [Flavor Item]          │  │
│  │ [Treasure Hoard Generator]                   │  │
│  └──────────────────────────────────────────────┘  │
│                                                    │
│  ┌──────────────────────────────────────────────┐  │
│  │ 🏛️ Location Generator                       │  │
│  │ (Saves to Locations)                         │  │
│  │ [Tavern] [Shop] [Dungeon] [Random]           │  │
│  └──────────────────────────────────────────────┘  │
│                                                    │
│  ┌──────────────────────────────────────────────┐  │
│  │ 🗺️ Encounter Generator                      │  │
│  │ (Tuned to party level)                       │  │
│  │ [Easy] [Medium] [Hard] [Deadly]              │  │
│  │ [Random Encounter] [Themed Encounter]        │  │
│  └──────────────────────────────────────────────┘  │
│                                                    │
└────────────────────────────────────────────────────┘
```

### Settings Tab

```
┌────────────────────────────────────────────────────┐
│  ◄  CAMPAIGN SETTINGS                             │
├────────────────────────────────────────────────────┤
│                                                    │
│  Campaign Details:                                 │
│  [Campaign Name] [Tone: Dark/Comedic/etc]        │
│  [Setting: Forgotten Realms/Homebrew/Custom]    │
│  [D&D Version: 5e / 2014 / 3.5e]                 │
│                                                    │
│  House Rules:                                      │
│  [Text Area - Define custom rules]               │
│  Example: "Critical hits on 19-20"               │
│  Example: "Flanking grants advantage"            │
│                                                    │
│  Shared with Players:                             │
│  [players-campaign-link.com/invite/KEY]          │
│  [✓] Allow players to see character list        │
│  [✗] Allow players to edit characters           │
│  [✓] Allow players to view session notes        │
│                                                    │
│  Campaign Notifications:                          │
│  [✓] Email when new players join                 │
│  [✓] Email session reminders                     │
│  [✗] Push notifications                          │
│                                                    │
│  Archive / Delete:                                │
│  [Archive Campaign] [Delete Campaign]            │
│                                                    │
└────────────────────────────────────────────────────┘
```

---

## API Specifications

### Authentication Endpoints

#### POST `/auth/register`

**Request:**
```json
{
  "email": "dm@example.com",
  "password": "secure_password",
  "displayName": "Kristof"
}
```

**Response (201):**
```json
{
  "success": true,
  "user": {
    "id": "user_uuid",
    "email": "dm@example.com",
    "displayName": "Kristof"
  },
  "token": "jwt_token_here",
  "expiresIn": 86400
}
```

#### POST `/auth/login`

**Request:**
```json
{
  "email": "dm@example.com",
  "password": "secure_password"
}
```

**Response (200):**
```json
{
  "success": true,
  "user": { "id", "email", "displayName" },
  "token": "jwt_token",
  "expiresIn": 86400
}
```

#### POST `/auth/refresh`

**Request:** (Authorization header with expired token)

**Response (200):**
```json
{
  "success": true,
  "token": "new_jwt_token",
  "expiresIn": 86400
}
```

---

### Campaign Endpoints

#### POST `/campaigns` (Create)

**Request:**
```json
{
  "name": "Curse of Strahd",
  "setting": "Forgotten Realms",
  "tone": "dark",
  "dndVersion": "5e",
  "houseRules": "Critical hits on 19-20"
}
```

**Response (201):**
```json
{
  "success": true,
  "campaign": {
    "id": "campaign_uuid",
    "name": "Curse of Strahd",
    "createdAt": "2026-03-03T14:23:45Z"
  }
}
```

#### GET `/campaigns` (List User's Campaigns)

**Response (200):**
```json
{
  "success": true,
  "campaigns": [
    {
      "id": "uuid",
      "name": "Curse of Strahd",
      "sessions": 27,
      "playerCount": 2,
      "lastUpdate": "2026-03-01T12:00:00Z"
    }
  ]
}
```

#### GET `/campaigns/:campaignId`

**Response (200):**
```json
{
  "success": true,
  "campaign": {
    "id": "uuid",
    "name": "Curse of Strahd",
    "tone": "dark",
    "dndVersion": "5e",
    "characterCount": 47,
    "creatureCount": 12,
    "lootValue": 45000,
    "locationCount": 3,
    "sessionNotesCount": 45
  }
}
```

#### PUT `/campaigns/:campaignId`

**Request:**
```json
{
  "name": "Curse of Strahd - Extended",
  "tone": "gothic_horror"
}
```

**Response (200):** Updated campaign object

#### DELETE `/campaigns/:campaignId`

**Response (200):**
```json
{
  "success": true,
  "message": "Campaign archived"
}
```

---

### Character Endpoints

#### POST `/campaigns/:campaignId/characters`

**Request:**
```json
{
  "name": "Marta Ironfoot",
  "race": "Dwarf",
  "personality": "Gruff but fair",
  "appearance": "Braided beard, weathered hands",
  "goals": "Expand tavern empire",
  "secrets": "Funding kobold settlement",
  "quirks": "Collects buttons",
  "voiceNotes": "Deep, slow speech",
  "tags": ["merchant", "ally"],
  "characterType": "npc"
}
```

**Response (201):** Created character object

#### GET `/campaigns/:campaignId/characters`

**Query Params:** `?tags=merchant&type=npc&search=marta`

**Response (200):**
```json
{
  "success": true,
  "characters": [
    {
      "id": "char_uuid",
      "name": "Marta Ironfoot",
      "tags": ["merchant", "ally"],
      "lastAppearance": "Session 27"
    }
  ]
}
```

#### GET `/campaigns/:campaignId/characters/:characterId`

**Response (200):** Full character details

#### PUT `/campaigns/:campaignId/characters/:characterId`

**Request:** Same as POST request

#### DELETE `/campaigns/:campaignId/characters/:characterId`

**Response (200):** Success message

#### POST `/campaigns/:campaignId/characters/:characterId/generate-variant`

**Request:**
```json
{
  "flavor": "Make her a secret villain",
  "template": "variant"
}
```

**Response (201):** New variant NPC with same base but different alignment/personality

---

### Creature Endpoints

#### POST `/campaigns/:campaignId/creatures` (Save custom creature)

**Request:**
```json
{
  "baseName": "Goblin",
  "customName": "Goblin Boss - Redthorn Clan",
  "cr": 1,
  "ac": 15,
  "hp": 28,
  "stats": { "str": 10, "dex": 14, "con": 10, "int": 10, "wis": 8, "cha": 8 },
  "abilities": ["Nimble Escape"],
  "tags": ["boss", "humanoid"],
  "notes": "Fights to the death, tactical leader"
}
```

**Response (201):** Created creature object

#### GET `/campaigns/:campaignId/creatures`

**Query Params:** `?tags=boss&search=goblin&crMin=0.5&crMax=5`

**Response (200):** List of creatures matching filters

#### GET `/campaigns/:campaignId/creatures/:creatureId`

**Response (200):** Full creature stat block

#### PUT `/campaigns/:campaignId/creatures/:creatureId`

**Request:** Modified stats/abilities

**Response (200):** Updated creature

#### POST `/campaigns/:campaignId/creatures/:creatureId/scale`

**Request:**
```json
{
  "partySize": 5,
  "partyLevel": 4,
  "adjustment": "increase_difficulty"
}
```

**Response (200):**
```json
{
  "success": true,
  "original": { "name": "Goblin", "cr": 0.25, "hp": 7 },
  "scaled": { "name": "Goblin (Adjusted)", "cr": 1, "hp": 28 },
  "suggestion": "Add 2-3 goblins to match party difficulty"
}
```

---

### Loot Endpoints

#### POST `/campaigns/:campaignId/loot` (Add item to treasury)

**Request:**
```json
{
  "itemName": "Ring of Protection",
  "rarity": "uncommon",
  "mechanics": "+1 AC and saving throws",
  "status": "in_inventory",
  "claimedByCharacterId": "char_uuid",
  "locationFound": "Dragon's hoard"
}
```

**Response (201):** Created loot entry

#### GET `/campaigns/:campaignId/loot`

**Query Params:** `?status=distributed&rarity=rare`

**Response (200):** List of loot items

#### PUT `/campaigns/:campaignId/loot/:lootId`

**Request:** Update status (distribute to character, move location, etc.)

#### DELETE `/campaigns/:campaignId/loot/:lootId`

**Response (200):** Deleted

#### POST `/campaigns/:campaignId/loot/generate-hoard`

**Request:**
```json
{
  "crLevel": 10,
  "gold": true,
  "itemCount": 5
}
```

**Response (201):**
```json
{
  "success": true,
  "hoard": [
    { "itemName": "Potion of Healing", "rarity": "common" },
    { "itemName": "Ring of Mind Shielding", "rarity": "rare" },
    ...
  ],
  "totalValue": 8500
}
```

---

### Location Endpoints

#### POST `/campaigns/:campaignId/locations`

**Request:**
```json
{
  "name": "The Gleaming Tankard",
  "type": "tavern",
  "description": "A half-timbered building with warm torchlight",
  "proprietorCharacterId": "char_uuid",
  "specialties": ["rare wines", "information brokering"],
  "secrets": "Underground fighting ring in basement",
  "patrons": ["char_uuid_1", "char_uuid_2"]
}
```

**Response (201):** Created location

#### GET `/campaigns/:campaignId/locations`

**Query Params:** `?type=tavern&search=gleaming`

**Response (200):** List of locations

#### POST `/campaigns/:campaignId/locations/generate`

**Request:**
```json
{
  "type": "tavern",
  "tone": "dark",
  "populateWithNPCs": true
}
```

**Response (201):** Fully generated location (name, description, proprietor NPC, patrons, hooks)

---

### Combat Endpoints

#### POST `/campaigns/:campaignId/combat`

**Request:**
```json
{
  "encounterName": "Red Dragon vs. Party",
  "participants": [
    { "id": "unique_id", "name": "Theron", "type": "pc", "initiativeRoll": 18 },
    { "id": "unique_id", "name": "Red Dragon", "type": "enemy", "initiativeRoll": 16, "maxHp": 220 }
  ]
}
```

**Response (201):** Created combat session

#### GET `/campaigns/:campaignId/combat/:combatId`

**Response (200):**
```json
{
  "success": true,
  "combat": {
    "id": "uuid",
    "encounterName": "Red Dragon vs. Party",
    "participants": [
      { "id": "id", "name": "Theron", "hp": 32, "maxHp": 45, "conditions": [] },
      { "id": "id", "name": "Red Dragon", "hp": 184, "maxHp": 220, "conditions": ["Bloodied"] }
    ],
    "currentRound": 3,
    "currentTurn": "char_id",
    "turnHistory": [...]
  }
}
```

#### PUT `/campaigns/:campaignId/combat/:combatId/damage`

**Request:**
```json
{
  "participantId": "char_id",
  "damageAmount": 15,
  "damageType": "fire",
  "notes": "Dragon's breath attack"
}
```

**Response (200):** Updated participant HP and conditions

#### PUT `/campaigns/:campaignId/combat/:combatId/condition`

**Request:**
```json
{
  "participantId": "char_id",
  "condition": "stunned",
  "action": "add" // or "remove"
}
```

**Response (200):** Updated participant conditions

#### PUT `/campaigns/:campaignId/combat/:combatId/next-turn`

**Response (200):** Advances to next participant in initiative order

#### DELETE `/campaigns/:campaignId/combat/:combatId`

**Response (200):** Ends combat, generates summary

---

### Content Generator Endpoints (Enhanced)

#### POST `/rules/search` (Campaign-Aware)

**Request:**
```json
{
  "query": "How does grappling work?",
  "campaignId": "campaign_uuid",
  "includeHouseRules": true
}
```

**Response (200):**
```json
{
  "answer": "How grappling works according to D&D 5e...",
  "appliedHouseRules": ["Critical on 19+"],
  "timestamp": "2026-03-03T14:23:45Z"
}
```

#### POST `/campaigns/:campaignId/npcs/generate` (Auto-saves)

**Request:**
```json
{
  "generationType": "guided",
  "prompt": "Tavern owner with secret",
  "autoSaveToLibrary": true,
  "applyTone": true
}
```

**Response (201):**
```json
{
  "success": true,
  "npc": { ... full NPC object ... },
  "savedToCharacterId": "char_uuid"
}
```

---

## Advanced Features

### Real-Time Multiplayer (Optional for V2.1)

If implementing concurrent editing:

```javascript
// WebSocket events for live combat updates
socket.on('damage-taken', (data) => {
  // Update HP for all users watching combat
});

socket.on('turn-changed', (data) => {
  // Highlight new active participant
});

socket.on('condition-added', (data) => {
  // Update visual state
});
```

### Analytics & Insights (Dashboard)

Track DM behavior to improve product:
- Most-used features
- Average session duration
- Favorite generators
- Time between sessions
- Content reuse patterns (how often NPCs reappear)

### Backup & Export

- Export full campaign as JSON
- Export character list as PDF
- Backup to Google Drive / Dropbox
- Share campaign read-link with non-users

---

## Technical Requirements

### V2-Specific Requirements

**Database:**
- PostgreSQL 13+ or Cloud SQL
- Automated daily backups
- Connection pooling (pgBouncer)
- Row-level security for multi-tenancy

**Authentication:**
- Rate limiting 10 failed logins per 15 min
- BCRYPT cost factor 12+
- Session timeout after 24 hours idle

**Real-Time (if WebSocket):**
- Socket.io with Redis adapter
- Connection limits per user (5 max)
- Heartbeat every 30 seconds

**File Storage:**
- Max file size: 50MB (for exports)
- Supported formats: JSON, PDF, CSV
- Retention: 90 days for exports

**Performance:**
- API response < 500ms (p95)
- Database query < 200ms (p95)
- WebSocket latency < 100ms
- Concurrent users: Support 10,000

**Security:**
- Rate limiting: 1000 req/min per user
- CSRF tokens on state-changing requests
- SQL injection protection (parameterized queries)
- XSS protection (content sanitization)
- HTTPS + HSTS headers

---

## Acceptance Criteria

### User Accounts & Campaigns
- [ ] Users can register with email/password
- [ ] OAuth signin works (Google, GitHub)
- [ ] Users can create multiple campaigns
- [ ] Campaign settings are editable
- [ ] Campaigns can be archived/deleted
- [ ] Invite link allows sharing with players

### Characters
- [ ] DM can create detailed NPCs and PCs
- [ ] Characters auto-save to library
- [ ] Search by name/tag works
- [ ] Character variants can be generated
- [ ] Relationships between characters trackable
- [ ] Session appearances recorded

### Creatures
- [ ] Save custom creatures to library
- [ ] Edit creature stats
- [ ] Scale creatures for party
- [ ] Version history available
- [ ] Tags enable filtering
- [ ] Crisis scaling suggestions provided

### Loot
- [ ] Add items to treasury
- [ ] Assign items to characters
- [ ] Generate treasure hoards
- [ ] Track distribution status
- [ ] Value calculations work

### Locations
- [ ] Generate locations with full details
- [ ] Link NPCs as proprietors/patrons
- [ ] Search and retrieve locations
- [ ] Generate location variants

### Combat Tracker
- [ ] Add participants and initiative
- [ ] Track HP and apply damage
- [ ] Add/remove conditions
- [ ] Navigate turn order
- [ ] Undo damage actions
- [ ] Export combat summary

### All V1 Features
- [ ] Work within campaign context
- [ ] Auto-save results to library
- [ ] Apply campaign tone/rules
- [ ] Mobile-responsive interface

### Authentication & Data
- [ ] Users cannot access others' campaigns
- [ ] Session management works (login/logout)
- [ ] Token refresh works
- [ ] Password reset functional
- [ ] Account deletion removes all data

---

## Out of Scope (V2)

- Virtual tabletop integration (Roll20, Foundry) - possible future
- Dice rolling integrated into combat (use external dice roller)
- Mobile native apps (web-responsive only)
- In-game map creation/editing (use external tools like Inkarnate)
- Voice chat (use Discord/similar)
- AI image generation for NPCs/locations
- Campaign collaborative editing (read-only sharing for V2)
- Email notifications for campaign events
- Print-friendly character sheets (export to PDF)

---

## Roadmap

**V2.0 (Q4 2026 - Q1 2027):**
- User accounts and authentication
- Campaign management
- Character/NPC library
- Creature stat block library
- Loot tracking
- Basic combat tracker
- Location generator

**V2.1 (Q1 2027):**
- Real-time WebSocket multiplayer
- Player invites and live party viewing
- Advanced analytics dashboard
- Combat action timers
- Auto-save to cloud backup

**V2.2 (Q2 2027):**
- AI-powered NPC relationship mapper
- Encounter difficulty calculator
- Campaign timeline visualization
- Dice integration
- Mobile native app (React Native)

---

## Success Metrics (V2)

- Monthly Active Users: 5,000+
- Average campaigns per user: 2.3
- Feature adoption: All core features > 70% usage
- Combat tracker usage: 60% of DMs
- Retention: 70% retention after 30 days
- API performance: p95 < 500ms
- Uptime: 99.95%

---

## Appendix: Glossary

[Same as V1, plus:]

| Term | Definition |
|------|-----------|
| **Campaign** | Complete D&D world/story with sessions, NPCs, creatures |
| **Proprietary** | The person who owns/runs an inn/shop/location |
| **Patron** | Regular customer at a tavern/shop |
| **Attunement** | Magic item requirement for use |
| **Initiative** | Turn order in combat, determined by d20 + DEX |
| **Condition** | Status affecting a creature (stunned, invisible, prone, etc.) |
| **Session** | Single play session (usually 3-4 hours) |
| **Party** | Group of player characters |
| **Treasury** | Collected loot/magic items |

---

**Document Version:** 2.0  
**Last Modified:** March 3, 2026
