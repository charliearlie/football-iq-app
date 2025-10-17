Football Trivia App - Executive Summary & Project State
Last Updated: Current Session
Project Status: MVP Complete, Bug Fixes In Progress
Timeline: 3-Month Solo Development (on track)

Project Overview
A mobile football trivia application featuring multiple quiz game modes focused on player careers, transfers, and match history. Built with React Native (Expo), designed for offline-first gameplay with future server synchronization capability.
Core Value Proposition

Multiple engaging game modes with strategic hint systems
Progressive difficulty that rewards deep football knowledge
Offline-first with 500 free starter questions
Monetization via question pack purchases (IAP)

Current Project State
✅ Completed (Weeks 1-4)
Phase 1: Database Foundation (Prompt 01)
Status: 100% Complete | 16 Tests Passing
Delivered:

Sync-ready SQLite schema (10 tables)
Complete TypeScript type system
Database connection singleton
Foreign key constraints with CASCADE
Performance indexes on all query patterns
Idempotent initialization

Key Architecture Decisions:

Every table has server_updated_at, local_updated_at, is_synced for future sync
ISO 8601 timestamps throughout
Server = source of truth for content
Client = source of truth for user data until synced

Tables Created:

clubs - Football clubs
players - Players with aliases support
player_careers - Career history
transfers - Transfer records
question_packs - Content bundles
questions - Game questions
user_purchased_packs - Purchase tracking
user_progress - Answer history
user_stats - Aggregate statistics (singleton)
sync_metadata - Sync state tracking

Phase 2: Data Access Layer (Prompt 02)
Status: 100% Complete | 99 Tests Passing
Delivered:

27+ query functions across 6 domain modules
Complex JOIN queries returning nested objects
Transaction support for atomic operations
Comprehensive seed data

Query Modules:

clubs.ts - 4 functions
players.ts - 4 functions (including getPlayerWithFullCareer)
careers.ts - 2 functions
transfers.ts - 3 functions (triple JOINs)
questions.ts - 9 functions (including getUnansweredQuestion)
userProgress.ts - 7 functions (recordQuestionAnswer with transaction)

Seed Data:

20 clubs (major European + others)
5 legendary players: Ronaldo, Messi, Zlatan, Beckham, Henry
24 complete career histories
12 realistic transfer records with fees
Starter pack with 27 questions (15 career path + 12 transfer)
Marked as purchased and free

Key Features:

Idempotent seeding (safe to run multiple times)
Parameterized queries (SQL injection prevention)
Proper error handling throughout
Streak calculation and accuracy tracking

Phase 3: Business Logic Layer (Prompt 03)
Status: 100% Complete | 113 Tests Passing | 98% Coverage
Delivered:

Pure utility functions (no side effects)
Complete game mechanics implementation
Test-Driven Development approach

Utilities Created:
Answer Matching (answerMatching.ts):

Fuzzy name matching with normalization
Accent normalization (Özil → Ozil, Müller → Muller)
Alias support (CR7, Leo Messi)
Last name matching (>3 characters)
Priority: exact → full name → alias → last name
40 tests covering edge cases

Scoring Calculations (scoring.ts):

Career Path Progressive: 3/2/1 points by % revealed, minus penalties
Career Path Full: 1/0 binary scoring
Transfer: 3/2/1 by hints revealed
Accuracy rate calculation (0-100%)
Streak tracking with reset
47 tests with all edge cases

Game State Helpers (gameState.ts):

Game over detection
Potential score calculation
Display formatting functions
Difficulty color mapping
26 tests

Constants:

Max wrong guesses: 5
All scoring thresholds defined
Difficulty colors
All typed with as const

Phase 4: UI Layer (Prompt 04)
Status: 100% Complete | Zero TypeScript Errors
Delivered:
Design System:

Comprehensive design document (939 lines)
Inspired by ESPN, OneFootball, Sky Sports
Dark theme throughout
Complete theme implementation in code

14 Components Built:
Core UI (6):

Button - 3 variants, 3 sizes, all states
Card - Elevated surface with optional accent
Input - Focus/error states, clear button
ProgressBar - Animated fill with Reanimated
Badge - Difficulty indicators
Modal - Overlay with animations

Game-Specific (8): 7. GameHeader - Progress + wrong guess counter 8. ClubDisplay - Large club card with stats 9. TransferDisplay - Two clubs with arrow 10. ScoreCard - Potential points (animated) 11. HintButton - Reveal hint functionality 12. ResultModal - Success/failure screen
13-14. Supporting components and exports
4 Screens Implemented:

Home Screen - Stats display + game mode selection
Career Path Progressive - Reveal clubs one by one
Career Path Full - Show all clubs, single guess
Transfer Game - Reveal hints, guess player

Integration:

All query functions connected
All utilities integrated
Stats tracking working
Navigation flow complete

Quality Metrics:

Zero TypeScript errors (strict mode)
No any types used anywhere
Zero console warnings
WCAG AA accessibility compliant
Consistent design system usage

🔧 In Progress (Current)
Phase 5: Bug Fixes & UX Improvements (Prompt 05)
Status: In Progress
Issues Being Fixed:

Career Path Progressive Auto-Reveal

Problem: Wrong guess doesn't reveal next club automatically
Solution: Auto-show next club after wrong guess for better UX
Impact: Better game flow, more intuitive

Career Path Full Compact Layout

Problem: Cards too tall (~120px), can't see full career
Solution: Compact mode (~60px), see 6-8 clubs at once
Impact: Users can make more informed guesses

Player Statistics Addition

Problem: Missing appearances and goals data
Solution: Add columns to database, update seed data, display in UI
Impact: More authentic, engaging experience

Game Modes Specification

1. Career Path - Progressive Reveal Mode
   How It Works:

Player's clubs revealed one at a time
User can Skip (see next club) or Guess
Max 5 wrong guesses allowed

Scoring:

First 20% of clubs revealed: 3 points base
First 50% of clubs revealed: 2 points base
After 50% revealed: 1 point base
Subtract 1 point per wrong guess
Minimum 1 point if correct

Example:

Player has 10 clubs
Show club 2 (20% revealed): 3 points potential
User guesses wrong: 3 - 1 = 2 points potential, show club 3
User guesses correct: Earn 2 points

2. Career Path - Full Reveal Mode
   How It Works:

All clubs shown at once in a list
User makes one guess only

Scoring:

Correct: 1 point
Incorrect: 0 points

Purpose: Faster gameplay, tests breadth of knowledge 3. Transfer Game
How It Works:

Show transfer: Year, From Club → To Club
User can reveal hints: Position (2pts), Nationality (1pt)
Max 5 wrong guesses allowed

Scoring:

No hints revealed: 3 points
Position revealed: 2 points
Nationality revealed: 1 point

Example:

Show: 2009, Man United → Real Madrid
User reveals Position: Forward (now 2 points max)
User guesses "Ronaldo": Earn 2 points

Technical Architecture
Tech Stack

Frontend: React Native (Expo)
Database: SQLite (expo-sqlite)
State Management: Local state (useState), Zustand ready for global needs
Navigation: Expo Router (file-based)
Styling: StyleSheet with comprehensive theme system
Type Safety: TypeScript (strict mode, no any types)

Architecture Layers
┌─────────────────────────────────┐
│ UI Layer (React) │
│ - Screens (4) │
│ - Components (14) │
└───────────┬─────────────────────┘
│
┌───────────▼─────────────────────┐
│ Business Logic (Utils) │
│ - Answer Matching │
│ - Scoring Calculations │
│ - Game State Helpers │
└───────────┬─────────────────────┘
│
┌───────────▼─────────────────────┐
│ Data Access Layer (Queries) │
│ - 27+ Query Functions │
│ - Domain-Organized Modules │
└───────────┬─────────────────────┘
│
┌───────────▼─────────────────────┐
│ Database Layer (SQLite) │
│ - 10 Tables │
│ - Sync-Ready Schema │
│ - Foreign Keys & Indexes │
└─────────────────────────────────┘
Key Design Principles

Offline-First: All gameplay works without internet
Sync-Ready: Schema designed for future server sync
Pure Functions: Business logic has no side effects
Type Safety: Strict TypeScript, no any types
Component Composition: Small, reusable components
Design System: All styling from theme constants

Monetization Strategy
Free Tier

500 starter questions included with app
Mix of Career Path and Transfer questions
Global coverage (Premier League, La Liga, Serie A, Bundesliga, Ligue 1)
Multiple eras (1990s-present)

Premium Question Packs (Future)
Categories:

League Packs - $2.99 each (200 questions)

Premier League Legends
La Liga Masters
Serie A Icons
Bundesliga Heroes
Ligue 1 Stars

Era Packs - $3.99 each (250 questions)

Golden 90s
2000s Glory Years
Modern Era 2010-2020

Competition Packs

Champions League Legacy - $4.99 (300 questions)
World Cup Moments - $4.99 (300 questions)

Club Packs - $1.99 each (150 questions)

Deep dives into specific clubs

Mega Packs

Ultimate Pack - $14.99 (1000+ questions)
Season Pass - $24.99/year (all content)

Revenue Model:

No ads
No energy systems
No pay-to-win
Pure content purchases

Immediate Next Steps (Week 5-6)
High Priority (Must Complete for MVP)

Complete Prompt 05 Bug Fixes (In Progress)

Auto-reveal in Career Path Progressive
Compact layout for Career Path Full
Add player statistics (appearances & goals)

Additional Game Mode: Match Goalscorers (1-2 days)

Show match details (teams, date, score)
User names all goalscorers
All correct: 1 point, any wrong: 0 points
Update schema for matches table
Create seed data for famous matches
Build UI screen

Polish & Testing (2-3 days)

Test all game modes extensively
Fix any remaining bugs
Optimize performance
Test on real devices (iOS and Android)
Ensure smooth 60fps throughout

App Store Assets (1 day)

App icon design
Splash screen
Screenshots for stores (5-8 per platform)
App store description
Privacy policy
Terms of service

Medium Priority (Post-MVP)

Backend Server Setup (Week 7-8)

Next.js API
PostgreSQL database
Prisma ORM
Authentication (NextAuth.js)
Admin panel for question management
API endpoints for sync

In-App Purchases (Week 9)

React Native IAP integration
Pack store UI
Purchase flow
Receipt validation with backend
Restore purchases functionality

Additional Game Modes (Week 10-12)

The Manager's Path (reuse Career Path mechanics)
Trophy Cabinet (progressive hints)
Formation Forensics (reveal lineup)
The Record Breaker (guess from achievement)
Price Tag Challenge (order by transfer fee)
Derby Day (match rivalries)

Engagement Features (Ongoing)

Daily challenges
Achievement system
Leaderboards (global, friends)
Share results feature
Push notifications

Future Game Modes (Approved)
Based on earlier discussion, these 6 modes are approved for future implementation:

The Manager's Path ✅

Like Career Path but for managers
Show clubs managed with years
Same progressive/full modes

Trophy Cabinet ✅

Show trophies won with years
Progressive hints: Position → Nationality → One club
3/2/1 scoring

Formation Forensics ✅

Show famous match lineup
Reveal players one by one (or formation with names)
Guess team and/or match
Uses Career Path reveal mechanics

The Record Breaker ✅

Show record/achievement
Progressive hints: Year → Club → Nationality
Example: "Most Premier League goals in a single season: 32"

Price Tag Challenge ✅

Show 3-4 transfers
User arranges by transfer fee (highest to lowest)
All correct: 2 points
Different interaction pattern (drag & drop)

Derby Day ✅

Show derby name or two teams
Name the rivalry or the teams
Quick, cultural knowledge test
1 point for correct

Content Requirements
Current Content (Seeded)

20 clubs
5 players with full careers
27 questions (15 career path + 12 transfer)

Target for Launch

500 questions minimum across all modes
Breakdown:

250 Career Path (150 progressive, 100 full)
150 Transfer
100 Match Goalscorers (when implemented)

Content Curation Process

Manual entry (current approach)
Data sources: Wikipedia, Transfermarkt, official club sites
Fact-checking required for all questions
Quality over quantity - ensure accuracy

Future Content Pipeline

Weekly question updates
Seasonal content (transfer windows, tournaments)
Community contributions (curated)
Admin panel for easy entry

Known Issues & Technical Debt
Current Issues (Being Fixed in Prompt 05)

Career Path Progressive doesn't auto-reveal (Fix in progress)
Career Path Full cards too tall (Fix in progress)
Missing player statistics (Fix in progress)

Minor Issues (Post-MVP)

15 test isolation issues (tests pass individually, fail in batch)

Not affecting functionality
Need to add proper test cleanup

No error retry mechanisms yet

Add retry logic for failed database operations

No offline indicator

Add network status indicator (for future sync)

Technical Debt (Acceptable for Now)

No data migration system yet

Will need for schema updates
Implement before first production release

No analytics/crash reporting

Add Firebase/Sentry before launch

No performance monitoring

Add React Native Performance before scale

Success Metrics (Post-Launch)
Key Performance Indicators (KPIs)

DAU (Daily Active Users) - Target: 1,000 in first month
Session Length - Target: 8-12 minutes average
Questions Per Session - Target: 10-15
Retention:

Day 1: 40%+
Day 7: 20%+
Day 30: 10%+

Pack Purchase Conversion - Target: 5% of users
Revenue Per User - Target: $3-5 average

Quality Metrics

App Store Rating - Target: 4.5+ stars
Crash-Free Rate - Target: 99.5%+
Load Time - Target: <2 seconds to gameplay
Answer Accuracy - Track false positives/negatives

Risks & Mitigation
Technical Risks

SQLite Performance at Scale

Mitigation: Proper indexing (done), pagination for large queries
Monitor: Query times, database size growth

React Native Upgrade Challenges

Mitigation: Stay on stable Expo SDK versions
Test: Before any major upgrades

IAP Integration Complexity

Mitigation: Use RevenueCat to simplify
Allocate: Extra time for testing (Week 9)

Business Risks

Content Creation Bottleneck

Mitigation: Build admin tools early, consider contractors
Target: 50+ questions per week production rate

User Acquisition Cost

Mitigation: Focus on organic growth, word of mouth
Strategy: Share results feature, social media

Competition

Mitigation: Unique game mechanics, quality over quantity
Differentiation: Multiple modes, strategic gameplay

Legal Risks

Club Badge Licensing

Mitigation: Use text-only or generic badges initially
Research: Licensing requirements per league

Player Name Rights

Status: Generally OK for factual trivia
Mitigation: Consult lawyer before major launch

Decision Log
Key Architectural Decisions
Decision 1: Expo vs Bare React Native

Chosen: Expo
Rationale: Faster development, managed workflow, perfect for solo dev
Trade-off: Slightly larger app size, dependency on Expo ecosystem
Status: Confirmed, working well

Decision 2: SQLite vs Realm

Chosen: SQLite (expo-sqlite)
Rationale: Simpler, better Expo integration, sufficient for use case
Trade-off: Manual schema management vs Realm's object models
Status: Confirmed, excellent performance

Decision 3: Local State vs Redux/Zustand

Chosen: Local state (useState) for now
Rationale: Simpler, no global state needed yet
Future: Add Zustand when cross-screen state needed
Status: Working well, may add Zustand for pack management

Decision 4: Sync Strategy (Server as Source of Truth)

Chosen: Content syncs FROM server, user data syncs TO server
Rationale: Clear data ownership, easier conflict resolution
Implementation: Schema ready with sync fields
Status: Ready for future implementation

Decision 5: Monetization (Premium Packs vs Ads)

Chosen: Premium packs (no ads)
Rationale: Better UX, sustainable revenue, aligns with premium feel
Trade-off: Higher barrier to revenue vs ad impressions
Status: Validated by market research on similar apps

Resources & References
External Dependencies

Expo SDK (latest stable)
React Native (via Expo)
expo-sqlite
expo-router
zustand (installed, not yet used)
TypeScript (strict mode)

Documentation

/docs/DESIGN_SYSTEM.md - Complete design specification
/README.md - Project setup and overview
This document - Project state and roadmap

Key Files Reference
football-trivia-app/
├── src/
│ ├── database/
│ │ ├── schema.ts # Database tables
│ │ ├── connection.ts # DB singleton
│ │ ├── seed.ts # Seed data
│ │ └── queries/ # 6 query modules
│ ├── types/
│ │ ├── database.ts # DB types
│ │ ├── game.ts # Game state types
│ │ └── sync.ts # Sync types
│ ├── utils/
│ │ ├── answerMatching.ts # Fuzzy matching
│ │ ├── scoring.ts # Score calculations
│ │ └── gameState.ts # Helpers
│ ├── components/
│ │ ├── ui/ # 6 core components
│ │ └── game/ # 8 game components
│ └── constants/
│ ├── theme.ts # Design tokens
│ ├── game.ts # Game constants
│ └── database.ts # DB constants
├── app/
│ ├── \_layout.tsx # Root navigation
│ ├── index.tsx # Home screen
│ └── games/ # 3 game screens
└── docs/
└── DESIGN_SYSTEM.md # Design specification

Timeline Summary
Completed: Week 1-4

Week 1: Database foundation (Prompt 01)
Week 2: Query layer + seed data (Prompt 02)
Week 3: Business logic utilities (Prompt 03)
Week 4: UI layer - complete (Prompt 04)

Current: Week 5

Now: Bug fixes & UX improvements (Prompt 05)

Planned: Week 6-12

Week 6: Polish + Match Goalscorers mode + App store prep
Week 7-8: Backend server (Next.js + PostgreSQL)
Week 9: In-app purchases integration
Week 10-12: Additional game modes + engagement features

Target Launch: Week 12-13

Beta testing (Week 11-12)
Soft launch (Week 12)
Full launch (Week 13)

Contact & Collaboration
Development Setup
bash# Clone and install
git clone [repo]
cd football-trivia-app
npm install

# Run on iOS

npx expo start

# Press 'i' for iOS simulator

# Run on Android

npx expo start

# Press 'a' for Android emulator

# Run tests

npm test
Current Development Flow

Consultant (Claude) creates prompts
Coding agent (Claude Code) implements
Summary returned for review
Next prompt created based on results
Iterate

Team

Solo developer
AI assistants (Claude for consulting, Claude Code for implementation)

Appendix: Prompt History
Prompt 01: Database Schema & Core Types ✅

Created sync-ready schema
10 tables with proper relationships
Complete TypeScript types
16 tests passing

Prompt 02: Database Queries & Seed Data ✅

27+ query functions
Idempotent seed data
5 players, 20 clubs, 27 questions
99 tests passing

Prompt 03: Game Utilities & Business Logic ✅

Answer matching with fuzzy logic
Scoring calculations for all modes
Pure utility functions
113 tests passing, 98% coverage

Prompt 04: UI Layer - Design System & Game Screens ✅

Complete design system (939 lines)
14 polished components
4 functional screens
Zero TypeScript errors

Prompt 05: Bug Fixes & UX Improvements 🔄

Auto-reveal in Career Path Progressive
Compact layout for Career Path Full
Player statistics (appearances & goals)
In progress

Version History
v0.1.0 - Foundation Complete (Week 1)

Database schema
Type system
Connection management

v0.2.0 - Data Layer Complete (Week 2)

Query functions
Seed data
Progress tracking

v0.3.0 - Logic Layer Complete (Week 3)

Answer validation
Scoring calculations
Game state helpers

v0.4.0 - UI Layer Complete (Week 4)

Design system
14 components
4 screens
Full gameplay

v0.4.1 - Bug Fixes (Week 5) 🔄

UX improvements
Player statistics
Polish

v0.5.0 - MVP Complete (Target: Week 6)

All bugs fixed
Match Goalscorers mode
App store ready

Summary
Status: MVP 85% complete, on track for 3-month timeline.
What's Working:

Complete database layer with sync-ready architecture
All query functions with seed data
Pure business logic with excellent test coverage
Polished UI with comprehensive design system
Three game modes fully functional

What's Next:

Fix remaining UX issues (Prompt 05 in progress)
Add Match Goalscorers mode
Polish and test extensively
Prepare for app store submission

Key Strengths:

Clean architecture with clear separation of concerns
Type-safe throughout (zero any types)
Comprehensive test coverage
Sync-ready for future server integration
Professional design system

Ready For: Beta testing, additional game modes, monetization features, server integration.

This document serves as the complete project state. Use it to restore context or onboard new team members.
