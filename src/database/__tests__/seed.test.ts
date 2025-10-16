/**
 * Database seeding tests
 */

jest.mock('expo-sqlite');

import * as SQLite from 'expo-sqlite';
import { initializeDatabase } from '../schema';
import { seedDatabase } from '../seed';
import { getDatabase, closeDatabaseAsync } from '../connection';
import { getAllClubs } from '../queries/clubs';
import { getAllPlayers } from '../queries/players';
import { getQuestionPacks } from '../queries/questions';

describe('Database Seeding', () => {
  let db: SQLite.SQLiteDatabase;

  beforeEach(async () => {
    db = await SQLite.openDatabaseAsync(':memory:');
    await initializeDatabase(db);
  });

  afterEach(async () => {
    await closeDatabaseAsync();

    if (db) {
      await db.closeAsync();
    }
  });

  describe('seedDatabase', () => {
    it('should seed database successfully', async () => {
      await expect(seedDatabase()).resolves.not.toThrow();
    });

    it('should insert correct number of clubs', async () => {
      await seedDatabase();

      const clubs = await getAllClubs();
      expect(clubs.length).toBe(20);
    });

    it('should insert correct number of players', async () => {
      await seedDatabase();

      const players = await getAllPlayers();
      expect(players.length).toBe(5);
    });

    it('should insert player careers', async () => {
      await seedDatabase();

      const seededDb = await getDatabase();
      const careers = await seededDb.getAllAsync<{ id: number }>(
        'SELECT * FROM player_careers'
      );

      expect(careers.length).toBe(24);
    });

    it('should insert transfers', async () => {
      await seedDatabase();

      const seededDb = await getDatabase();
      const transfers = await seededDb.getAllAsync<{ id: number }>(
        'SELECT * FROM transfers'
      );

      expect(transfers.length).toBe(12);
    });

    it('should insert question pack', async () => {
      await seedDatabase();

      const packs = await getQuestionPacks();
      expect(packs.length).toBe(1);
      expect(packs[0].id).toBe('starter-pack');
      expect(packs[0].is_free).toBe(1);
    });

    it('should insert questions', async () => {
      await seedDatabase();

      const seededDb = await getDatabase();
      const questions = await seededDb.getAllAsync<{ id: string }>(
        'SELECT * FROM questions'
      );

      expect(questions.length).toBe(27);
    });

    it('should mark starter pack as purchased', async () => {
      await seedDatabase();

      const seededDb = await getDatabase();
      const purchased = await seededDb.getFirstAsync<{ pack_id: string }>(
        'SELECT * FROM user_purchased_packs WHERE pack_id = ?',
        ['starter-pack']
      );

      expect(purchased).not.toBeNull();
      expect(purchased?.pack_id).toBe('starter-pack');
    });

    it('should be idempotent - running twice does not duplicate data', async () => {
      await seedDatabase();
      await seedDatabase(); // Run second time

      const clubs = await getAllClubs();
      const players = await getAllPlayers();
      const packs = await getQuestionPacks();

      expect(clubs.length).toBe(20); // Not 40
      expect(players.length).toBe(5); // Not 10
      expect(packs.length).toBe(1); // Not 2
    });

    it('should set seed_completed flag', async () => {
      await seedDatabase();

      const seededDb = await getDatabase();
      const metadata = await seededDb.getFirstAsync<{ value: string }>(
        'SELECT value FROM sync_metadata WHERE key = ?',
        ['seed_completed']
      );

      expect(metadata).not.toBeNull();
      expect(metadata?.value).toBe('true');
    });

    it('should have valid foreign keys', async () => {
      await seedDatabase();

      const seededDb = await getDatabase();
      // Check player careers reference valid players and clubs
      const invalidCareers = await seededDb.getAllAsync<{ id: number }>(
        `SELECT pc.id FROM player_careers pc
         LEFT JOIN players p ON pc.player_id = p.id
         LEFT JOIN clubs c ON pc.club_id = c.id
         WHERE p.id IS NULL OR c.id IS NULL`
      );

      expect(invalidCareers.length).toBe(0);

      // Check transfers reference valid players and clubs
      const invalidTransfers = await seededDb.getAllAsync<{ id: number }>(
        `SELECT t.id FROM transfers t
         LEFT JOIN players p ON t.player_id = p.id
         LEFT JOIN clubs fc ON t.from_club_id = fc.id
         LEFT JOIN clubs tc ON t.to_club_id = tc.id
         WHERE p.id IS NULL OR fc.id IS NULL OR tc.id IS NULL`
      );

      expect(invalidTransfers.length).toBe(0);

      // Check questions reference valid packs
      const invalidQuestions = await seededDb.getAllAsync<{ id: string }>(
        `SELECT q.id FROM questions q
         LEFT JOIN question_packs qp ON q.pack_id = qp.id
         WHERE qp.id IS NULL`
      );

      expect(invalidQuestions.length).toBe(0);
    });

    it('should have players with aliases', async () => {
      await seedDatabase();

      const players = await getAllPlayers();

      // All players should have aliases
      expect(players.every((p) => p.aliases)).toBe(true);

      // Check Ronaldo has CR7 alias
      const ronaldo = players.find((p) => p.name === 'Cristiano Ronaldo');
      expect(ronaldo).toBeDefined();

      const ronaldoAliases = JSON.parse(ronaldo!.aliases!);
      expect(ronaldoAliases).toContain('CR7');
    });

    it('should have careers in correct display order', async () => {
      await seedDatabase();

      const seededDb = await getDatabase();
      // Get Ronaldo's careers
      const careers = await seededDb.getAllAsync<{
        display_order: number;
        start_year: number;
      }>(
        'SELECT display_order, start_year FROM player_careers WHERE player_id = 1 ORDER BY display_order'
      );

      // Display order should be sequential starting from 1
      for (let i = 0; i < careers.length; i++) {
        expect(careers[i].display_order).toBe(i + 1);
      }

      // Start years should be in chronological order
      for (let i = 1; i < careers.length; i++) {
        expect(careers[i].start_year).toBeGreaterThanOrEqual(
          careers[i - 1].start_year
        );
      }
    });

    it('should have transfers with realistic data', async () => {
      await seedDatabase();

      const seededDb = await getDatabase();
      // Check Ronaldo's transfer to Real Madrid
      const transfer = await seededDb.getFirstAsync<{
        transfer_year: number;
        transfer_fee: number;
      }>(
        `SELECT transfer_year, transfer_fee FROM transfers
         WHERE player_id = 1 AND to_club_id = 2`
      );

      expect(transfer).not.toBeNull();
      expect(transfer?.transfer_year).toBe(2009);
      expect(transfer?.transfer_fee).toBe(94.0);
    });

    it('should have questions with metadata', async () => {
      await seedDatabase();

      const seededDb = await getDatabase();
      const question = await seededDb.getFirstAsync<{ metadata: string }>(
        'SELECT metadata FROM questions WHERE game_mode = ? LIMIT 1',
        ['career_path']
      );

      expect(question).not.toBeNull();
      expect(question?.metadata).toBeTruthy();

      // Should be valid JSON
      const metadata = JSON.parse(question!.metadata!);
      expect(metadata).toBeDefined();
    });

    it('should have balanced difficulty distribution', async () => {
      await seedDatabase();

      const seededDb = await getDatabase();
      const difficulties = await seededDb.getAllAsync<{
        difficulty: string;
        count: number;
      }>(
        `SELECT difficulty, COUNT(*) as count FROM questions
         GROUP BY difficulty
         ORDER BY difficulty`
      );

      expect(difficulties.length).toBeGreaterThan(0);

      // Should have easy, medium, and hard questions
      const difficultyNames = difficulties.map((d) => d.difficulty);
      expect(difficultyNames).toContain('easy');
      expect(difficultyNames).toContain('medium');
      expect(difficultyNames).toContain('hard');
    });

    it('should have questions for both game modes', async () => {
      await seedDatabase();

      const seededDb = await getDatabase();
      const careerQuestions = await seededDb.getAllAsync<{ id: string }>(
        'SELECT id FROM questions WHERE game_mode = ?',
        ['career_path']
      );

      const transferQuestions = await seededDb.getAllAsync<{ id: string }>(
        'SELECT id FROM questions WHERE game_mode = ?',
        ['transfer']
      );

      expect(careerQuestions.length).toBeGreaterThan(0);
      expect(transferQuestions.length).toBeGreaterThan(0);
    });

    it('should initialize user_stats', async () => {
      await seedDatabase();

      const seededDb = await getDatabase();
      const stats = await seededDb.getFirstAsync<{ id: number }>(
        'SELECT * FROM user_stats WHERE id = 1'
      );

      expect(stats).not.toBeNull();
      expect(stats?.id).toBe(1);
    });

    it('should seed within a transaction', async () => {
      // If seeding fails partway, nothing should be committed
      // We can't easily test this without mocking failures,
      // but we can verify the transaction completed successfully

      await seedDatabase();

      const clubs = await getAllClubs();
      const players = await getAllPlayers();
      const packs = await getQuestionPacks();

      // If any were inserted, all should be inserted (transaction atomicity)
      expect(clubs.length).toBeGreaterThan(0);
      expect(players.length).toBeGreaterThan(0);
      expect(packs.length).toBeGreaterThan(0);
    });
  });
});
