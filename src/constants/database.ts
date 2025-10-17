/**
 * Database configuration constants
 *
 * These constants define the core configuration for the SQLite database.
 * Version should be incremented when schema changes require migration.
 */

export const DATABASE_CONFIG = {
  /** Name of the SQLite database file */
  NAME: 'football_trivia.db',

  /** Current database schema version */
  VERSION: 2,
} as const;

/**
 * Table names - centralized for consistency
 * Useful for dynamic queries and avoiding typos
 */
export const TABLE_NAMES = {
  // Core entities (sync FROM server)
  CLUBS: 'clubs',
  PLAYERS: 'players',
  PLAYER_CAREERS: 'player_careers',
  TRANSFERS: 'transfers',

  // Content management (sync FROM server)
  QUESTION_PACKS: 'question_packs',
  QUESTIONS: 'questions',

  // User data (sync TO server)
  USER_PURCHASED_PACKS: 'user_purchased_packs',
  USER_PROGRESS: 'user_progress',
  USER_STATS: 'user_stats',

  // Sync metadata
  SYNC_METADATA: 'sync_metadata',
} as const;

/**
 * Sync configuration constants
 */
export const SYNC_CONFIG = {
  /** Indicates entity is synced with server */
  SYNCED: 1,

  /** Indicates entity needs to be synced to server */
  NOT_SYNCED: 0,
} as const;

/**
 * Game mode types - discriminated union values
 */
export const GAME_MODES = {
  CAREER_PATH: 'career_path',
  TRANSFER: 'transfer',
  // Add more game modes as they're developed
} as const;

/**
 * Difficulty levels for questions
 */
export const DIFFICULTY_LEVELS = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard',
} as const;

/**
 * Platform types for in-app purchases
 */
export const PLATFORMS = {
  IOS: 'ios',
  ANDROID: 'android',
} as const;
