/**
 * Database schema initialization
 *
 * This module defines the complete SQLite schema for the football trivia app.
 * The schema is designed with sync-first principles to support future
 * client-server synchronization.
 *
 * Key design decisions:
 * - All content entities (clubs, players, questions) sync FROM server
 * - All user data (progress, purchases) syncs TO server
 * - server_updated_at tracks server-side changes
 * - local_updated_at tracks client-side changes
 * - is_synced flag indicates if local changes need server push
 * - ISO 8601 timestamps for all dates
 * - INTEGER for server-assigned IDs (SQLite optimizes INTEGER PRIMARY KEY)
 * - TEXT/UUID for question packs and questions
 * - Foreign key constraints with CASCADE DELETE for data integrity
 */

import type * as SQLite from 'expo-sqlite';
import { DATABASE_CONFIG } from '../constants/database';

/**
 * Initializes the database schema
 *
 * This function is idempotent - it can be safely called multiple times.
 * It uses CREATE TABLE IF NOT EXISTS and CREATE INDEX IF NOT EXISTS.
 *
 * @param db - SQLite database instance
 */
export async function initializeDatabase(
  db: SQLite.SQLiteDatabase
): Promise<void> {
  try {
    // Enable foreign key constraints
    // Must be done for each connection in SQLite
    await db.execAsync('PRAGMA foreign_keys = ON;');

    // Enable WAL (Write-Ahead Logging) mode for better concurrency
    // This allows reads and writes to not block each other
    await db.execAsync('PRAGMA journal_mode = WAL;');

    // Create all tables
    await createTables(db);

    // Create all indexes
    await createIndexes(db);

    // Initialize user_stats singleton row
    await initializeUserStats(db);

    console.log(
      `Database initialized successfully (version ${DATABASE_CONFIG.VERSION})`
    );
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw new Error(
      `Database initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Creates all database tables
 */
async function createTables(db: SQLite.SQLiteDatabase): Promise<void> {
  // ==========================================================================
  // Core Entities (sync FROM server)
  // ==========================================================================

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS clubs (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      country TEXT NOT NULL,
      league TEXT,
      badge_url TEXT,
      server_updated_at TEXT,
      local_updated_at TEXT,
      is_synced INTEGER DEFAULT 1
    );
  `);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS players (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      full_name TEXT,
      nationality TEXT,
      position TEXT,
      date_of_birth TEXT,
      aliases TEXT,
      server_updated_at TEXT,
      local_updated_at TEXT,
      is_synced INTEGER DEFAULT 1
    );
  `);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS player_careers (
      id INTEGER PRIMARY KEY,
      player_id INTEGER NOT NULL,
      club_id INTEGER NOT NULL,
      start_year INTEGER NOT NULL,
      end_year INTEGER,
      display_order INTEGER NOT NULL,
      server_updated_at TEXT,
      local_updated_at TEXT,
      is_synced INTEGER DEFAULT 1,
      FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE,
      FOREIGN KEY (club_id) REFERENCES clubs(id) ON DELETE CASCADE
    );
  `);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS transfers (
      id INTEGER PRIMARY KEY,
      player_id INTEGER NOT NULL,
      from_club_id INTEGER NOT NULL,
      to_club_id INTEGER NOT NULL,
      transfer_year INTEGER NOT NULL,
      transfer_fee REAL,
      server_updated_at TEXT,
      local_updated_at TEXT,
      is_synced INTEGER DEFAULT 1,
      FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE,
      FOREIGN KEY (from_club_id) REFERENCES clubs(id) ON DELETE CASCADE,
      FOREIGN KEY (to_club_id) REFERENCES clubs(id) ON DELETE CASCADE
    );
  `);

  // ==========================================================================
  // Content Management (sync FROM server)
  // ==========================================================================

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS question_packs (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      price REAL DEFAULT 0,
      question_count INTEGER DEFAULT 0,
      is_free INTEGER DEFAULT 0,
      version TEXT DEFAULT '1.0.0',
      server_updated_at TEXT,
      local_updated_at TEXT,
      is_synced INTEGER DEFAULT 1
    );
  `);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS questions (
      id TEXT PRIMARY KEY,
      pack_id TEXT NOT NULL,
      game_mode TEXT NOT NULL,
      difficulty TEXT,
      entity_id INTEGER NOT NULL,
      metadata TEXT,
      server_updated_at TEXT,
      local_updated_at TEXT,
      is_synced INTEGER DEFAULT 1,
      FOREIGN KEY (pack_id) REFERENCES question_packs(id) ON DELETE CASCADE
    );
  `);

  // ==========================================================================
  // User Data (local-only, will sync TO server)
  // ==========================================================================

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS user_purchased_packs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      pack_id TEXT NOT NULL,
      platform TEXT NOT NULL,
      transaction_id TEXT,
      purchased_at TEXT NOT NULL,
      server_updated_at TEXT,
      is_synced INTEGER DEFAULT 0,
      FOREIGN KEY (pack_id) REFERENCES question_packs(id)
    );
  `);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS user_progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      question_id TEXT NOT NULL,
      answered_correctly INTEGER NOT NULL,
      score_earned INTEGER NOT NULL,
      attempts INTEGER DEFAULT 1,
      completed_at TEXT NOT NULL,
      server_updated_at TEXT,
      is_synced INTEGER DEFAULT 0,
      FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
    );
  `);

  // Singleton table for user stats - only one row allowed (id = 1)
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS user_stats (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      total_questions_answered INTEGER DEFAULT 0,
      total_score INTEGER DEFAULT 0,
      current_streak INTEGER DEFAULT 0,
      best_streak INTEGER DEFAULT 0,
      accuracy_rate REAL DEFAULT 0,
      last_played TEXT,
      server_updated_at TEXT,
      is_synced INTEGER DEFAULT 0
    );
  `);

  // ==========================================================================
  // Sync Metadata
  // ==========================================================================

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS sync_metadata (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);
}

/**
 * Creates all indexes for query performance
 *
 * Indexes are created for:
 * - Foreign keys (for JOIN performance)
 * - Common query patterns (game_mode, is_synced)
 */
async function createIndexes(db: SQLite.SQLiteDatabase): Promise<void> {
  // Player careers indexes
  await db.execAsync(`
    CREATE INDEX IF NOT EXISTS idx_player_careers_player
    ON player_careers(player_id);
  `);

  await db.execAsync(`
    CREATE INDEX IF NOT EXISTS idx_player_careers_club
    ON player_careers(club_id);
  `);

  // Transfers indexes
  await db.execAsync(`
    CREATE INDEX IF NOT EXISTS idx_transfers_player
    ON transfers(player_id);
  `);

  // Questions indexes
  await db.execAsync(`
    CREATE INDEX IF NOT EXISTS idx_questions_pack
    ON questions(pack_id);
  `);

  await db.execAsync(`
    CREATE INDEX IF NOT EXISTS idx_questions_mode
    ON questions(game_mode);
  `);

  await db.execAsync(`
    CREATE INDEX IF NOT EXISTS idx_questions_entity
    ON questions(entity_id);
  `);

  // User progress indexes
  await db.execAsync(`
    CREATE INDEX IF NOT EXISTS idx_user_progress_question
    ON user_progress(question_id);
  `);

  await db.execAsync(`
    CREATE INDEX IF NOT EXISTS idx_user_progress_synced
    ON user_progress(is_synced);
  `);

  // User purchased packs index
  await db.execAsync(`
    CREATE INDEX IF NOT EXISTS idx_user_purchased_packs_synced
    ON user_purchased_packs(is_synced);
  `);
}

/**
 * Initializes the user_stats singleton row
 *
 * This ensures there's always one row with id=1 in the user_stats table.
 * Uses INSERT OR IGNORE to be idempotent.
 */
async function initializeUserStats(db: SQLite.SQLiteDatabase): Promise<void> {
  const now = new Date().toISOString();

  await db.execAsync(`
    INSERT OR IGNORE INTO user_stats (
      id,
      total_questions_answered,
      total_score,
      current_streak,
      best_streak,
      accuracy_rate,
      last_played,
      server_updated_at,
      is_synced
    ) VALUES (
      1,
      0,
      0,
      0,
      0,
      0.0,
      NULL,
      NULL,
      0
    );
  `);
}

/**
 * Gets the current database version
 */
export function getDatabaseVersion(): number {
  return DATABASE_CONFIG.VERSION;
}
