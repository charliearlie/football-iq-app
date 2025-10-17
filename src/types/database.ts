/**
 * Database model types
 *
 * This module defines TypeScript interfaces for all database tables.
 * All types match the SQLite schema exactly to ensure type safety.
 *
 * Design principles:
 * - All syncable entities extend SyncableEntity
 * - Use 0 | 1 for boolean flags (SQLite doesn't have boolean type)
 * - Use string for dates (stored as ISO 8601)
 * - Use number for INTEGER columns, string for TEXT columns
 * - Null values allowed where SQL allows NULL
 */

import { SyncableEntity } from './sync';
import {
  GAME_MODES,
  DIFFICULTY_LEVELS,
  PLATFORMS,
} from '../constants/database';

// =============================================================================
// Core Entities (sync FROM server)
// =============================================================================

/**
 * Football club/team
 */
export interface Club extends SyncableEntity {
  /** Server-assigned unique identifier */
  id: number;

  /** Club name (e.g., "Manchester United") */
  name: string;

  /** Country where club is based */
  country: string;

  /** League the club plays in */
  league: string | null;

  /** URL to club badge/logo image */
  badge_url: string | null;
}

/**
 * Football player
 */
export interface Player extends SyncableEntity {
  /** Server-assigned unique identifier */
  id: number;

  /** Player's commonly used name (e.g., "Ronaldo") */
  name: string;

  /** Player's full legal name */
  full_name: string | null;

  /** Player's nationality */
  nationality: string | null;

  /** Player's position (e.g., "Forward", "Midfielder") */
  position: string | null;

  /** Player's date of birth (ISO 8601 format) */
  date_of_birth: string | null;

  /**
   * JSON array of alternative names/nicknames
   * e.g., '["CR7", "Cristiano"]'
   * Parse with JSON.parse() when reading from DB
   */
  aliases: string | null;
}

/**
 * A player's career stint at a specific club
 *
 * Represents a period when a player played for a club.
 * A player can have multiple career entries (different clubs over time).
 */
export interface PlayerCareer extends SyncableEntity {
  /** Server-assigned unique identifier */
  id: number;

  /** Foreign key to players table */
  player_id: number;

  /** Foreign key to clubs table */
  club_id: number;

  /** Year the player joined the club */
  start_year: number;

  /** Year the player left the club (null if currently playing) */
  end_year: number | null;

  /**
   * Order in which to display career entries (chronological)
   * Lower numbers come first
   */
  display_order: number;

  /** Number of appearances for this club (null if not available) */
  appearances: number | null;

  /** Number of goals scored for this club (null if not available) */
  goals: number | null;
}

/**
 * Player transfer between clubs
 */
export interface Transfer extends SyncableEntity {
  /** Server-assigned unique identifier */
  id: number;

  /** Foreign key to players table */
  player_id: number;

  /** Foreign key to clubs table (club player left) */
  from_club_id: number;

  /** Foreign key to clubs table (club player joined) */
  to_club_id: number;

  /** Year the transfer occurred */
  transfer_year: number;

  /** Transfer fee in millions (e.g., 80.5 for €80.5M), null if free */
  transfer_fee: number | null;
}

// =============================================================================
// Content Management (sync FROM server)
// =============================================================================

/**
 * Question pack (content bundle)
 *
 * A pack is a collection of questions that can be purchased or unlocked.
 */
export interface QuestionPack extends SyncableEntity {
  /** UUID from server */
  id: string;

  /** Pack name (e.g., "Premier League Legends") */
  name: string;

  /** Pack description */
  description: string | null;

  /** Price in local currency (0 for free packs) */
  price: number;

  /** Total number of questions in the pack */
  question_count: number;

  /** Whether pack is free (1) or paid (0) */
  is_free: 0 | 1;

  /** Pack version for content updates */
  version: string;
}

/**
 * Game mode type - discriminated union
 */
export type GameMode = (typeof GAME_MODES)[keyof typeof GAME_MODES];

/**
 * Difficulty level type
 */
export type DifficultyLevel =
  (typeof DIFFICULTY_LEVELS)[keyof typeof DIFFICULTY_LEVELS];

/**
 * Question/puzzle in the game
 *
 * Questions reference either a player (for career path mode) or a transfer
 * (for transfer mode) via the entity_id field.
 */
export interface Question extends SyncableEntity {
  /** UUID from server */
  id: string;

  /** Foreign key to question_packs table */
  pack_id: string;

  /** Type of game mode this question is for */
  game_mode: GameMode;

  /** Difficulty level */
  difficulty: DifficultyLevel | null;

  /**
   * ID of the entity this question is about
   * - For career_path mode: player_id
   * - For transfer mode: transfer_id
   */
  entity_id: number;

  /**
   * JSON metadata for game-specific configuration
   * e.g., '{"show_hints": true, "time_limit": 60}'
   * Parse with JSON.parse() when reading from DB
   */
  metadata: string | null;
}

// =============================================================================
// User Data (local-only, will sync TO server eventually)
// =============================================================================

/**
 * Platform type for in-app purchases
 */
export type Platform = (typeof PLATFORMS)[keyof typeof PLATFORMS];

/**
 * Record of user's purchased question packs
 */
export interface UserPurchasedPack extends SyncableEntity {
  /** Local auto-increment ID */
  id: number;

  /** Foreign key to question_packs table */
  pack_id: string;

  /** Platform where purchase was made */
  platform: Platform;

  /** In-app purchase transaction/receipt ID */
  transaction_id: string | null;

  /** When the purchase was made (ISO 8601) */
  purchased_at: string;
}

/**
 * User's progress on a specific question
 */
export interface UserProgress extends SyncableEntity {
  /** Local auto-increment ID */
  id: number;

  /** Foreign key to questions table */
  question_id: string;

  /** Whether user answered correctly (1) or not (0) */
  answered_correctly: 0 | 1;

  /** Points/score earned for this question */
  score_earned: number;

  /** Number of attempts made */
  attempts: number;

  /** When the question was completed (ISO 8601) */
  completed_at: string;
}

/**
 * Overall user statistics (singleton)
 *
 * This table has only one row (id = 1) that stores aggregate stats.
 */
export interface UserStats extends SyncableEntity {
  /**
   * Primary key - always 1 (singleton pattern)
   * The CHECK constraint ensures only one row exists
   */
  id: 1;

  /** Total number of questions answered */
  total_questions_answered: number;

  /** Total score accumulated */
  total_score: number;

  /** Current streak of consecutive correct answers */
  current_streak: number;

  /** Best streak ever achieved */
  best_streak: number;

  /** Accuracy rate (0.0 to 1.0, e.g., 0.85 = 85%) */
  accuracy_rate: number;

  /** Last time user played (ISO 8601) */
  last_played: string | null;
}

// =============================================================================
// Sync Metadata
// =============================================================================

/**
 * Key-value store for sync-related metadata
 */
export interface SyncMetadata {
  /** Metadata key (e.g., 'last_sync_timestamp', 'sync_token') */
  key: string;

  /** Metadata value (stored as JSON string if needed) */
  value: string;

  /** When this metadata was last updated (ISO 8601) */
  updated_at: string;
}

// =============================================================================
// Joined/Extended Types (for queries)
// =============================================================================

/**
 * Career entry with club details
 * (Result of joining player_careers + clubs)
 */
export interface CareerWithClub extends PlayerCareer {
  club: Club;
}

/**
 * Player with their career history
 * (Result of joining players + player_careers + clubs)
 */
export interface PlayerWithCareer extends Player {
  careers: CareerWithClub[];
}

/**
 * Transfer with full details
 * (Result of joining transfers + players + clubs)
 */
export interface TransferWithDetails extends Transfer {
  player: Player;
  fromClub: Club;
  toClub: Club;
}

/**
 * Question with pack details
 */
export interface QuestionWithPack extends Question {
  pack_name: string;
  pack_is_free: 0 | 1;
  is_purchased: 0 | 1;
}
