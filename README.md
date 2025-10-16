# Football Trivia App ⚽

A React Native mobile trivia game testing your football knowledge through player careers and transfers.

## Features

✅ **Three Game Modes:**
- **Career Path Progressive**: Clubs revealed one by one - guess the player with fewer clubs for more points
- **Career Path Full**: All clubs shown at once - one guess to identify the player
- **Transfer Game**: Identify the player from a famous transfer - reveal hints for fewer points

✅ **Complete Game Engine:**
- SQLite database with 10 tables
- 27+ query functions for data management
- Pure utility functions for scoring and validation
- Comprehensive stats tracking (questions answered, score, streaks, accuracy)

✅ **Polished UI:**
- Dark theme with vibrant accents
- Comprehensive design system
- 14 reusable components (6 core UI + 8 game-specific)
- Smooth animations with react-native-reanimated
- Full accessibility support (WCAG AA compliant)

## Tech Stack

- **Framework**: React Native (Expo SDK 54)
- **Routing**: Expo Router (file-based routing)
- **Database**: Expo SQLite
- **Animation**: React Native Reanimated 4
- **Language**: TypeScript
- **Testing**: Jest + React Native Testing Library (227 tests passing)

## Project Structure

```
football-trivia-app/
├── app/                          # Screens (Expo Router)
│   ├── index.tsx                # Home screen with game mode selection
│   ├── _layout.tsx              # Root layout with database initialization
│   └── games/                   # Game mode screens
│       ├── career-path-progressive.tsx
│       ├── career-path-full.tsx
│       └── transfer.tsx
├── src/
│   ├── components/
│   │   ├── ui/                  # Core reusable components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── ProgressBar.tsx
│   │   │   ├── Badge.tsx
│   │   │   └── Modal.tsx
│   │   └── game/                # Game-specific components
│   │       ├── GameHeader.tsx
│   │       ├── ClubDisplay.tsx
│   │       ├── TransferDisplay.tsx
│   │       ├── ScoreCard.tsx
│   │       ├── HintButton.tsx
│   │       └── ResultModal.tsx
│   ├── constants/
│   │   ├── theme.ts             # Design system tokens
│   │   ├── database.ts          # Database constants
│   │   └── game.ts              # Game constants (scoring rules)
│   ├── database/
│   │   ├── connection.ts        # Database singleton
│   │   ├── schema.ts            # Table definitions
│   │   ├── seed.ts              # Seed data (clubs, players, questions)
│   │   └── queries/             # Query functions (27+)
│   ├── types/
│   │   ├── database.ts          # Database model types
│   │   └── game.ts              # Game state types
│   └── utils/
│       ├── answerMatching.ts    # Name validation logic
│       ├── scoring.ts           # Score calculation
│       └── gameState.ts         # Game state utilities
├── docs/
│   └── DESIGN_SYSTEM.md         # Comprehensive design documentation
└── __tests__/                   # 227 passing tests
```

## Getting Started

### Prerequisites

- Node.js 18+ installed
- iOS Simulator (Mac only) or Android Emulator
- Expo Go app (for testing on physical device)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd football-trivia-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npx expo start
   ```

4. **Run on device/simulator**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app for physical device

### First Run

On first launch, the app will:
1. Initialize the SQLite database
2. Seed with sample data (15 clubs, 5 players, 25+ questions)
3. Initialize user stats

This happens automatically and takes ~2 seconds.

## Development

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Type Checking

```bash
# Check TypeScript types
npx tsc --noEmit
```

### Code Structure Guidelines

- **Components**: Keep under 200 lines, focused on single responsibility
- **Styling**: Use `StyleSheet.create`, reference theme constants, no inline styles
- **State**: Local state with `useState`, lift only when necessary
- **Database**: All queries in `src/database/queries/`, use transactions for writes
- **Utils**: Pure functions only, fully tested

## Game Modes Explained

### Career Path Progressive
- Clubs revealed sequentially (first club → last club)
- Skip to next club or guess at any point
- **Scoring**:
  - First 20% of clubs: 3 points
  - First 50% of clubs: 2 points
  - After 50%: 1 point
  - -1 point per wrong guess (minimum 1 point if correct)

### Career Path Full
- All clubs shown at once
- One guess only
- **Scoring**: 1 point for correct, 0 for incorrect

### Transfer Game
- See a transfer (Club A → Club B, Year)
- Reveal hints (position, nationality) for fewer points
- Up to 5 wrong guesses allowed
- **Scoring**:
  - No hints: 3 points
  - One hint: 2 points
  - Both hints: 1 point

## Design System

See [docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md) for comprehensive design documentation including:
- Color palette (dark theme with vibrant accents)
- Typography scale (8 levels)
- Spacing system (4px grid)
- Component patterns
- Interaction patterns
- Accessibility guidelines
- Animation specifications

## Database Schema

**10 Tables:**
- `clubs` - Football clubs/teams
- `players` - Player information
- `player_careers` - Player career history
- `transfers` - Transfer records
- `question_packs` - Content packs (free/paid)
- `questions` - Trivia questions
- `user_purchased_packs` - User's purchases
- `user_progress` - Question completion records
- `user_stats` - Aggregate statistics (singleton)
- `sync_metadata` - Sync status tracking

## Contributing

1. Follow the existing code style
2. Add tests for new features
3. Update documentation
4. Ensure `npm test` and `npx tsc --noEmit` pass
5. Follow accessibility guidelines (WCAG AA)

## License

MIT

## Acknowledgments

- Built with [Expo](https://expo.dev)
- Routing by [Expo Router](https://docs.expo.dev/router/introduction/)
- Database by [Expo SQLite](https://docs.expo.dev/versions/latest/sdk/sqlite/)
- Animations by [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)
