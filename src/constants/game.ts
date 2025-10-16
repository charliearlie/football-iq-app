/**
 * Game configuration constants
 *
 * These constants define the core game mechanics including:
 * - Scoring rules for different game modes
 * - Maximum attempts and penalties
 * - Difficulty colors for UI
 *
 * All constants use 'as const' for type safety and immutability.
 */

export const GAME_CONSTANTS = {
  /** Maximum number of wrong guesses before game over */
  MAX_WRONG_GUESSES: 5,

  /** Scoring rules for Career Path Progressive mode */
  CAREER_PATH_POINTS: {
    /** Points awarded when guessed in first 20% of clubs shown */
    FIRST_20_PERCENT: 3,
    /** Points awarded when guessed in first 50% of clubs shown */
    FIRST_50_PERCENT: 2,
    /** Points awarded when guessed after 50% of clubs shown */
    AFTER_50_PERCENT: 1,
    /** Minimum score for a correct answer (never goes below this) */
    MINIMUM_SCORE: 1,
  },

  /** Scoring rules for Transfer mode based on hints revealed */
  TRANSFER_POINTS: {
    /** Points when no hints revealed */
    NO_HINTS: 3,
    /** Points when position revealed */
    POSITION_REVEALED: 2,
    /** Points when both position and nationality revealed */
    NATIONALITY_REVEALED: 1,
  },

  /** Scoring rules for Career Path Full mode */
  CAREER_PATH_FULL_POINTS: {
    /** Points for correct answer */
    CORRECT: 1,
    /** Points for incorrect answer */
    INCORRECT: 0,
  },

  /** Difficulty colors for UI display */
  DIFFICULTY_COLORS: {
    easy: '#10b981',
    medium: '#f59e0b',
    hard: '#ef4444',
  },
} as const;
