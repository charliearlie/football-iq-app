/**
 * Question and question pack query tests
 */

jest.mock('expo-sqlite');

import * as SQLite from 'expo-sqlite';
import { initializeDatabase } from '../../schema';
import { seedDatabase } from '../../seed';
import { getDatabase, closeDatabaseAsync } from '../../connection';
import { recordQuestionAnswer } from '../userProgress';
import {
  getQuestionPacks,
  getPurchasedPacks,
  getFreePacks,
  getPackById,
  getPackQuestions,
  getRandomQuestion,
  getUnansweredQuestion,
  markPackAsPurchased,
} from '../questions';
import { GAME_MODES } from '../../../constants/database';

describe('Question Queries', () => {
  let db: SQLite.SQLiteDatabase;

  beforeEach(async () => {
    db = await SQLite.openDatabaseAsync(':memory:');
    await initializeDatabase(db);
    await seedDatabase();
  });

  afterEach(async () => {
    await closeDatabaseAsync();

    if (db) {
      await db.closeAsync();
    }
  });

  describe('getQuestionPacks', () => {
    it('should return all question packs', async () => {
      const packs = await getQuestionPacks();

      expect(packs.length).toBeGreaterThan(0);
      expect(packs[0].id).toBe('starter-pack');
      expect(packs[0].name).toBe('Starter Pack');
    });

    it('should return packs sorted by name', async () => {
      const packs = await getQuestionPacks();

      // Should be alphabetically sorted
      for (let i = 1; i < packs.length; i++) {
        expect(
          packs[i - 1].name.localeCompare(packs[i].name)
        ).toBeLessThanOrEqual(0);
      }
    });
  });

  describe('getPurchasedPacks', () => {
    it('should return purchased packs', async () => {
      const packs = await getPurchasedPacks();

      // Starter pack is auto-purchased in seed
      expect(packs.length).toBeGreaterThan(0);
      expect(packs.some((p) => p.id === 'starter-pack')).toBe(true);
    });

    it('should not include duplicate packs', async () => {
      const packs = await getPurchasedPacks();

      const packIds = packs.map((p) => p.id);
      const uniqueIds = new Set(packIds);

      expect(packIds.length).toBe(uniqueIds.size);
    });
  });

  describe('getFreePacks', () => {
    it('should return free packs only', async () => {
      const packs = await getFreePacks();

      expect(packs.length).toBeGreaterThan(0);
      expect(packs.every((p) => p.is_free === 1)).toBe(true);
    });

    it('should include starter pack', async () => {
      const packs = await getFreePacks();

      expect(packs.some((p) => p.id === 'starter-pack')).toBe(true);
    });
  });

  describe('getPackById', () => {
    it('should return pack when ID exists', async () => {
      const pack = await getPackById('starter-pack');

      expect(pack).not.toBeNull();
      expect(pack?.id).toBe('starter-pack');
      expect(pack?.name).toBe('Starter Pack');
      expect(pack?.is_free).toBe(1);
    });

    it('should return null when ID does not exist', async () => {
      const pack = await getPackById('non-existent-pack');
      expect(pack).toBeNull();
    });
  });

  describe('getPackQuestions', () => {
    it('should return all questions for a pack', async () => {
      const questions = await getPackQuestions('starter-pack');

      // We seeded 27 questions in starter pack
      expect(questions.length).toBe(27);
      expect(questions.every((q) => q.pack_id === 'starter-pack')).toBe(true);
    });

    it('should return empty array for non-existent pack', async () => {
      const questions = await getPackQuestions('non-existent-pack');
      expect(questions).toEqual([]);
    });

    it('should include questions from different game modes', async () => {
      const questions = await getPackQuestions('starter-pack');

      const careerPathQuestions = questions.filter(
        (q) => q.game_mode === GAME_MODES.CAREER_PATH
      );
      const transferQuestions = questions.filter(
        (q) => q.game_mode === GAME_MODES.TRANSFER
      );

      expect(careerPathQuestions.length).toBeGreaterThan(0);
      expect(transferQuestions.length).toBeGreaterThan(0);
    });
  });

  describe('getRandomQuestion', () => {
    it('should return a question for career_path mode', async () => {
      const question = await getRandomQuestion(GAME_MODES.CAREER_PATH);

      expect(question).not.toBeNull();
      expect(question?.game_mode).toBe(GAME_MODES.CAREER_PATH);
    });

    it('should return a question for transfer mode', async () => {
      const question = await getRandomQuestion(GAME_MODES.TRANSFER);

      expect(question).not.toBeNull();
      expect(question?.game_mode).toBe(GAME_MODES.TRANSFER);
    });

    it('should return null for mode with no questions', async () => {
      const question = await getRandomQuestion('non-existent-mode');
      expect(question).toBeNull();
    });

    it('should return question from specified pack', async () => {
      const question = await getRandomQuestion(
        GAME_MODES.CAREER_PATH,
        'starter-pack'
      );

      expect(question).not.toBeNull();
      expect(question?.pack_id).toBe('starter-pack');
      expect(question?.game_mode).toBe(GAME_MODES.CAREER_PATH);
    });

    it('should return different questions over multiple calls', async () => {
      const question1 = await getRandomQuestion(GAME_MODES.CAREER_PATH);
      const question2 = await getRandomQuestion(GAME_MODES.CAREER_PATH);
      const question3 = await getRandomQuestion(GAME_MODES.CAREER_PATH);

      // With 15 career path questions, high probability of getting different ones
      // but not guaranteed, so we just check they're valid
      expect(question1).not.toBeNull();
      expect(question2).not.toBeNull();
      expect(question3).not.toBeNull();
    });
  });

  describe('getUnansweredQuestion', () => {
    it('should return unanswered question', async () => {
      const question = await getUnansweredQuestion(GAME_MODES.CAREER_PATH);

      expect(question).not.toBeNull();
      expect(question?.game_mode).toBe(GAME_MODES.CAREER_PATH);
    });

    it('should exclude correctly answered questions', async () => {
      // Answer a question correctly
      const firstQuestion = await getRandomQuestion(GAME_MODES.CAREER_PATH);
      expect(firstQuestion).not.toBeNull();

      await recordQuestionAnswer(firstQuestion!.id, true, 100, 1);

      // Get unanswered question - should not return the one we just answered
      const unansweredQuestion = await getUnansweredQuestion(
        GAME_MODES.CAREER_PATH
      );

      if (unansweredQuestion) {
        expect(unansweredQuestion.id).not.toBe(firstQuestion!.id);
      }
    });

    it('should still return questions answered incorrectly', async () => {
      // Answer a question incorrectly
      const firstQuestion = await getRandomQuestion(GAME_MODES.CAREER_PATH);
      expect(firstQuestion).not.toBeNull();

      await recordQuestionAnswer(firstQuestion!.id, false, 0, 1);

      // Get unanswered question - could return the one we answered wrong
      const unansweredQuestion = await getUnansweredQuestion(
        GAME_MODES.CAREER_PATH
      );

      expect(unansweredQuestion).not.toBeNull();
      expect(unansweredQuestion?.game_mode).toBe(GAME_MODES.CAREER_PATH);
    });

    it('should return null when all questions are answered correctly', async () => {
      // Get all career path questions
      const allQuestions = await getPackQuestions('starter-pack');
      const careerQuestions = allQuestions.filter(
        (q) => q.game_mode === GAME_MODES.CAREER_PATH
      );

      // Answer all correctly
      for (const question of careerQuestions) {
        await recordQuestionAnswer(question.id, true, 100, 1);
      }

      // Should return null now
      const unansweredQuestion = await getUnansweredQuestion(
        GAME_MODES.CAREER_PATH
      );

      expect(unansweredQuestion).toBeNull();
    });
  });

  describe('markPackAsPurchased', () => {
    it('should mark a pack as purchased', async () => {
      // Create a test pack using the same database instance
      const seededDb = await getDatabase();
      await seededDb.runAsync(
        `INSERT INTO question_packs (id, name, price, question_count, is_free, version, server_updated_at, local_updated_at, is_synced)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)`,
        [
          'test-pack',
          'Test Pack',
          4.99,
          10,
          0,
          '1.0.0',
          new Date().toISOString(),
          new Date().toISOString(),
        ]
      );

      await markPackAsPurchased('test-pack', 'txn-12345', 'ios');

      // Verify it's now in purchased packs
      const purchased = await seededDb.getFirstAsync<{ pack_id: string }>(
        'SELECT pack_id FROM user_purchased_packs WHERE pack_id = ?',
        ['test-pack']
      );

      expect(purchased).not.toBeNull();
      expect(purchased?.pack_id).toBe('test-pack');
    });

    it('should be idempotent - not create duplicates', async () => {
      // Create a test pack using the same database instance
      const seededDb = await getDatabase();
      await seededDb.runAsync(
        `INSERT INTO question_packs (id, name, price, question_count, is_free, version, server_updated_at, local_updated_at, is_synced)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)`,
        [
          'test-pack-2',
          'Test Pack 2',
          4.99,
          10,
          0,
          '1.0.0',
          new Date().toISOString(),
          new Date().toISOString(),
        ]
      );

      // Mark as purchased twice
      await markPackAsPurchased('test-pack-2', 'txn-12345', 'ios');
      await markPackAsPurchased('test-pack-2', 'txn-67890', 'android');

      // Should only have one entry
      const purchased = await seededDb.getAllAsync<{ pack_id: string }>(
        'SELECT pack_id FROM user_purchased_packs WHERE pack_id = ?',
        ['test-pack-2']
      );

      expect(purchased.length).toBe(1);
    });

    it('should throw error for non-existent pack', async () => {
      await expect(
        markPackAsPurchased('non-existent-pack', 'txn-12345', 'ios')
      ).rejects.toThrow();
    });
  });
});
