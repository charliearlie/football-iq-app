/**
 * Database schema tests
 *
 * These tests verify that the database schema is created correctly,
 * all tables and indexes exist, and foreign key constraints work as expected.
 */

// Mock expo-sqlite with better-sqlite3 for testing
jest.mock('expo-sqlite');

import * as SQLite from 'expo-sqlite';
import { initializeDatabase } from '../schema';
import { TABLE_NAMES } from '../../constants/database';

describe('Database Schema', () => {
  let db: SQLite.SQLiteDatabase;

  // Create a fresh in-memory database before each test
  beforeEach(async () => {
    // Use in-memory database for testing (faster, isolated)
    db = await SQLite.openDatabaseAsync(':memory:');
  });

  // Clean up after each test
  afterEach(async () => {
    if (db) {
      await db.closeAsync();
    }
  });

  describe('Initialization', () => {
    it('should initialize database successfully', async () => {
      await expect(initializeDatabase(db)).resolves.not.toThrow();
    });

    it('should be idempotent (run init twice without errors)', async () => {
      await initializeDatabase(db);
      await expect(initializeDatabase(db)).resolves.not.toThrow();
    });

    it('should enable foreign keys', async () => {
      await initializeDatabase(db);

      const result = await db.getFirstAsync<{ foreign_keys: number }>(
        'PRAGMA foreign_keys;'
      );

      expect(result?.foreign_keys).toBe(1);
    });

    it('should enable WAL mode', async () => {
      await initializeDatabase(db);

      const result = await db.getFirstAsync<{ journal_mode: string }>(
        'PRAGMA journal_mode;'
      );

      // In-memory databases (used in tests) return 'memory' instead of 'wal'
      // Real databases will use 'wal'
      const mode = result?.journal_mode.toLowerCase();
      expect(['wal', 'memory']).toContain(mode);
    });
  });

  describe('Table Creation', () => {
    beforeEach(async () => {
      await initializeDatabase(db);
    });

    it('should create all tables', async () => {
      const tables = await db.getAllAsync<{ name: string }>(
        "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name;"
      );

      const tableNames = tables.map((t) => t.name);

      // Verify all expected tables exist
      expect(tableNames).toContain(TABLE_NAMES.CLUBS);
      expect(tableNames).toContain(TABLE_NAMES.PLAYERS);
      expect(tableNames).toContain(TABLE_NAMES.PLAYER_CAREERS);
      expect(tableNames).toContain(TABLE_NAMES.TRANSFERS);
      expect(tableNames).toContain(TABLE_NAMES.QUESTION_PACKS);
      expect(tableNames).toContain(TABLE_NAMES.QUESTIONS);
      expect(tableNames).toContain(TABLE_NAMES.USER_PURCHASED_PACKS);
      expect(tableNames).toContain(TABLE_NAMES.USER_PROGRESS);
      expect(tableNames).toContain(TABLE_NAMES.USER_STATS);
      expect(tableNames).toContain(TABLE_NAMES.SYNC_METADATA);

      // Should have exactly 10 tables
      expect(tableNames).toHaveLength(10);
    });

    it('should create clubs table with correct schema', async () => {
      const columns = await db.getAllAsync<{ name: string; type: string }>(
        `PRAGMA table_info(${TABLE_NAMES.CLUBS});`
      );

      const columnNames = columns.map((c) => c.name);

      expect(columnNames).toContain('id');
      expect(columnNames).toContain('name');
      expect(columnNames).toContain('country');
      expect(columnNames).toContain('league');
      expect(columnNames).toContain('badge_url');
      expect(columnNames).toContain('server_updated_at');
      expect(columnNames).toContain('local_updated_at');
      expect(columnNames).toContain('is_synced');
    });

    it('should create players table with correct schema', async () => {
      const columns = await db.getAllAsync<{ name: string }>(
        `PRAGMA table_info(${TABLE_NAMES.PLAYERS});`
      );

      const columnNames = columns.map((c) => c.name);

      expect(columnNames).toContain('id');
      expect(columnNames).toContain('name');
      expect(columnNames).toContain('full_name');
      expect(columnNames).toContain('nationality');
      expect(columnNames).toContain('position');
      expect(columnNames).toContain('date_of_birth');
      expect(columnNames).toContain('aliases');
    });

    it('should initialize user_stats singleton', async () => {
      const stats = await db.getFirstAsync<{ id: number }>(
        `SELECT * FROM ${TABLE_NAMES.USER_STATS} WHERE id = 1;`
      );

      expect(stats).toBeDefined();
      expect(stats?.id).toBe(1);
    });
  });

  describe('Index Creation', () => {
    beforeEach(async () => {
      await initializeDatabase(db);
    });

    it('should create all indexes', async () => {
      const indexes = await db.getAllAsync<{ name: string }>(
        "SELECT name FROM sqlite_master WHERE type='index' AND name NOT LIKE 'sqlite_%' ORDER BY name;"
      );

      const indexNames = indexes.map((i) => i.name);

      // Verify critical indexes exist
      expect(indexNames).toContain('idx_player_careers_player');
      expect(indexNames).toContain('idx_player_careers_club');
      expect(indexNames).toContain('idx_transfers_player');
      expect(indexNames).toContain('idx_questions_pack');
      expect(indexNames).toContain('idx_questions_mode');
      expect(indexNames).toContain('idx_questions_entity');
      expect(indexNames).toContain('idx_user_progress_question');
      expect(indexNames).toContain('idx_user_progress_synced');
      expect(indexNames).toContain('idx_user_purchased_packs_synced');
    });
  });

  describe('Data Insertion', () => {
    beforeEach(async () => {
      await initializeDatabase(db);
    });

    it('should insert and retrieve club data', async () => {
      const now = new Date().toISOString();

      await db.runAsync(
        `INSERT INTO ${TABLE_NAMES.CLUBS} (id, name, country, league, badge_url, server_updated_at, local_updated_at, is_synced)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
        [
          1,
          'Manchester United',
          'England',
          'Premier League',
          'https://example.com/badge.png',
          now,
          now,
          1,
        ]
      );

      const club = await db.getFirstAsync<{
        id: number;
        name: string;
        country: string;
      }>(
        `SELECT * FROM ${TABLE_NAMES.CLUBS} WHERE id = 1;`
      );

      expect(club).toBeDefined();
      expect(club?.name).toBe('Manchester United');
      expect(club?.country).toBe('England');
    });

    it('should insert and retrieve player data with aliases', async () => {
      const now = new Date().toISOString();
      const aliases = JSON.stringify(['CR7', 'Ronaldo']);

      await db.runAsync(
        `INSERT INTO ${TABLE_NAMES.PLAYERS} (id, name, full_name, nationality, position, date_of_birth, aliases, server_updated_at, local_updated_at, is_synced)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
        [
          1,
          'Cristiano Ronaldo',
          'Cristiano Ronaldo dos Santos Aveiro',
          'Portugal',
          'Forward',
          '1985-02-05',
          aliases,
          now,
          now,
          1,
        ]
      );

      const player = await db.getFirstAsync<{
        id: number;
        name: string;
        aliases: string;
      }>(
        `SELECT * FROM ${TABLE_NAMES.PLAYERS} WHERE id = 1;`
      );

      expect(player).toBeDefined();
      expect(player?.name).toBe('Cristiano Ronaldo');

      // Verify aliases can be parsed
      const parsedAliases = JSON.parse(player!.aliases);
      expect(parsedAliases).toEqual(['CR7', 'Ronaldo']);
    });
  });

  describe('Foreign Key Constraints', () => {
    beforeEach(async () => {
      await initializeDatabase(db);
    });

    it('should cascade delete player careers when player deleted', async () => {
      const now = new Date().toISOString();

      // Insert club
      await db.runAsync(
        `INSERT INTO ${TABLE_NAMES.CLUBS} (id, name, country, server_updated_at, local_updated_at, is_synced)
         VALUES (?, ?, ?, ?, ?, ?);`,
        [1, 'Real Madrid', 'Spain', now, now, 1]
      );

      // Insert player
      await db.runAsync(
        `INSERT INTO ${TABLE_NAMES.PLAYERS} (id, name, server_updated_at, local_updated_at, is_synced)
         VALUES (?, ?, ?, ?, ?);`,
        [1, 'Test Player', now, now, 1]
      );

      // Insert player career
      await db.runAsync(
        `INSERT INTO ${TABLE_NAMES.PLAYER_CAREERS} (id, player_id, club_id, start_year, display_order, server_updated_at, local_updated_at, is_synced)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
        [1, 1, 1, 2020, 1, now, now, 1]
      );

      // Verify career exists
      let career = await db.getFirstAsync<{ id: number }>(
        `SELECT * FROM ${TABLE_NAMES.PLAYER_CAREERS} WHERE id = 1;`
      );
      expect(career).toBeDefined();

      // Delete player
      await db.runAsync(
        `DELETE FROM ${TABLE_NAMES.PLAYERS} WHERE id = 1;`
      );

      // Verify career was cascade deleted
      career = await db.getFirstAsync<{ id: number }>(
        `SELECT * FROM ${TABLE_NAMES.PLAYER_CAREERS} WHERE id = 1;`
      );
      expect(career).toBeNull();
    });

    it('should cascade delete questions when pack deleted', async () => {
      const now = new Date().toISOString();

      // Insert question pack
      await db.runAsync(
        `INSERT INTO ${TABLE_NAMES.QUESTION_PACKS} (id, name, price, question_count, is_free, version, server_updated_at, local_updated_at, is_synced)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
        [
          'pack-uuid-1',
          'Test Pack',
          0,
          10,
          1,
          '1.0.0',
          now,
          now,
          1,
        ]
      );

      // Insert question
      await db.runAsync(
        `INSERT INTO ${TABLE_NAMES.QUESTIONS} (id, pack_id, game_mode, difficulty, entity_id, server_updated_at, local_updated_at, is_synced)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
        [
          'question-uuid-1',
          'pack-uuid-1',
          'career_path',
          'easy',
          1,
          now,
          now,
          1,
        ]
      );

      // Verify question exists
      let question = await db.getFirstAsync<{ id: string }>(
        `SELECT * FROM ${TABLE_NAMES.QUESTIONS} WHERE id = 'question-uuid-1';`
      );
      expect(question).toBeDefined();

      // Delete pack
      await db.runAsync(
        `DELETE FROM ${TABLE_NAMES.QUESTION_PACKS} WHERE id = 'pack-uuid-1';`
      );

      // Verify question was cascade deleted
      question = await db.getFirstAsync<{ id: string }>(
        `SELECT * FROM ${TABLE_NAMES.QUESTIONS} WHERE id = 'question-uuid-1';`
      );
      expect(question).toBeNull();
    });

    it('should cascade delete user progress when question deleted', async () => {
      const now = new Date().toISOString();

      // Insert question pack
      await db.runAsync(
        `INSERT INTO ${TABLE_NAMES.QUESTION_PACKS} (id, name, price, question_count, is_free, version, server_updated_at, local_updated_at, is_synced)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
        [
          'pack-uuid-1',
          'Test Pack',
          0,
          10,
          1,
          '1.0.0',
          now,
          now,
          1,
        ]
      );

      // Insert question
      await db.runAsync(
        `INSERT INTO ${TABLE_NAMES.QUESTIONS} (id, pack_id, game_mode, difficulty, entity_id, server_updated_at, local_updated_at, is_synced)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
        [
          'question-uuid-1',
          'pack-uuid-1',
          'career_path',
          'easy',
          1,
          now,
          now,
          1,
        ]
      );

      // Insert user progress
      await db.runAsync(
        `INSERT INTO ${TABLE_NAMES.USER_PROGRESS} (question_id, answered_correctly, score_earned, attempts, completed_at, is_synced)
         VALUES (?, ?, ?, ?, ?, ?);`,
        ['question-uuid-1', 1, 100, 1, now, 0]
      );

      // Verify progress exists
      let progress = await db.getAllAsync<{ id: number }>(
        `SELECT * FROM ${TABLE_NAMES.USER_PROGRESS} WHERE question_id = 'question-uuid-1';`
      );
      expect(progress.length).toBe(1);

      // Delete question
      await db.runAsync(
        `DELETE FROM ${TABLE_NAMES.QUESTIONS} WHERE id = 'question-uuid-1';`
      );

      // Verify progress was cascade deleted
      progress = await db.getAllAsync<{ id: number }>(
        `SELECT * FROM ${TABLE_NAMES.USER_PROGRESS} WHERE question_id = 'question-uuid-1';`
      );
      expect(progress.length).toBe(0);
    });
  });

  describe('User Stats Singleton', () => {
    beforeEach(async () => {
      await initializeDatabase(db);
    });

    it('should only allow one row in user_stats', async () => {
      // First row (id=1) should already exist from initialization
      const firstRow = await db.getFirstAsync<{ id: number }>(
        `SELECT * FROM ${TABLE_NAMES.USER_STATS} WHERE id = 1;`
      );
      expect(firstRow).toBeDefined();

      // Try to insert another row with id=2 (should fail due to CHECK constraint)
      await expect(
        db.runAsync(
          `INSERT INTO ${TABLE_NAMES.USER_STATS} (id, total_questions_answered, total_score, current_streak, best_streak, accuracy_rate, is_synced)
           VALUES (?, ?, ?, ?, ?, ?, ?);`,
          [2, 0, 0, 0, 0, 0, 0]
        )
      ).rejects.toThrow();
    });

    it('should allow updating the singleton row', async () => {
      await db.runAsync(
        `UPDATE ${TABLE_NAMES.USER_STATS}
         SET total_questions_answered = 10, total_score = 500, current_streak = 5
         WHERE id = 1;`
      );

      const stats = await db.getFirstAsync<{
        total_questions_answered: number;
        total_score: number;
        current_streak: number;
      }>(
        `SELECT * FROM ${TABLE_NAMES.USER_STATS} WHERE id = 1;`
      );

      expect(stats?.total_questions_answered).toBe(10);
      expect(stats?.total_score).toBe(500);
      expect(stats?.current_streak).toBe(5);
    });
  });
});
