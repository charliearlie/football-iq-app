/**
 * User progress query tests
 */

jest.mock('expo-sqlite');

import * as SQLite from 'expo-sqlite';
import { initializeDatabase } from '../../schema';
import { seedDatabase } from '../../seed';
import { closeDatabaseAsync } from '../../connection';
import { getPackQuestions } from '../questions';
import {
  getUserStats,
  recordQuestionAnswer,
  getAnsweredQuestionIds,
  getQuestionHistory,
  calculateAccuracyRate,
  updateUserStats,
} from '../userProgress';
import { GAME_MODES } from '../../../constants/database';

describe('User Progress Queries', () => {
  let db: SQLite.SQLiteDatabase;

  beforeEach(async () => {
    db = await SQLite.openDatabaseAsync(':memory:');
    await initializeDatabase(db);
    await seedDatabase();
  });

  afterEach(async () => {
    // Close the cached connection from getDatabase()
    await closeDatabaseAsync();

    if (db) {
      await db.closeAsync();
    }
  });

  describe('getUserStats', () => {
    it('should return initialized user stats', async () => {
      const stats = await getUserStats();

      expect(stats).toBeDefined();
      expect(stats.id).toBe(1);
      expect(stats.total_questions_answered).toBe(0);
      expect(stats.total_score).toBe(0);
      expect(stats.current_streak).toBe(0);
      expect(stats.best_streak).toBe(0);
      expect(stats.accuracy_rate).toBe(0);
    });
  });

  describe('recordQuestionAnswer', () => {
    it('should record a correct answer', async () => {
      const questions = await getPackQuestions('starter-pack');
      const question = questions[0];

      await recordQuestionAnswer(question.id, true, 100, 1);

      const stats = await getUserStats();
      expect(stats.total_questions_answered).toBe(1);
      expect(stats.total_score).toBe(100);
    });

    it('should record an incorrect answer', async () => {
      const questions = await getPackQuestions('starter-pack');
      const question = questions[0];

      await recordQuestionAnswer(question.id, false, 0, 2);

      const stats = await getUserStats();
      expect(stats.total_questions_answered).toBe(1);
      expect(stats.total_score).toBe(0);
    });

    it('should update streak on consecutive correct answers', async () => {
      const questions = await getPackQuestions('starter-pack');

      // Answer 3 questions correctly
      await recordQuestionAnswer(questions[0].id, true, 100, 1);
      let stats = await getUserStats();
      expect(stats.current_streak).toBe(1);

      await recordQuestionAnswer(questions[1].id, true, 100, 1);
      stats = await getUserStats();
      expect(stats.current_streak).toBe(2);

      await recordQuestionAnswer(questions[2].id, true, 100, 1);
      stats = await getUserStats();
      expect(stats.current_streak).toBe(3);
    });

    it('should reset streak on wrong answer', async () => {
      const questions = await getPackQuestions('starter-pack');

      // Answer 2 correctly, then 1 wrong
      await recordQuestionAnswer(questions[0].id, true, 100, 1);
      await recordQuestionAnswer(questions[1].id, true, 100, 1);

      let stats = await getUserStats();
      expect(stats.current_streak).toBe(2);

      await recordQuestionAnswer(questions[2].id, false, 0, 1);

      stats = await getUserStats();
      expect(stats.current_streak).toBe(0);
    });

    it('should update best_streak when exceeded', async () => {
      const questions = await getPackQuestions('starter-pack');

      // Answer 5 questions correctly to set best streak
      for (let i = 0; i < 5; i++) {
        await recordQuestionAnswer(questions[i].id, true, 100, 1);
      }

      let stats = await getUserStats();
      expect(stats.current_streak).toBe(5);
      expect(stats.best_streak).toBe(5);

      // Wrong answer resets current streak
      await recordQuestionAnswer(questions[5].id, false, 0, 1);

      stats = await getUserStats();
      expect(stats.current_streak).toBe(0);
      expect(stats.best_streak).toBe(5); // Best streak remains

      // Answer 3 more correctly (doesn't exceed best)
      await recordQuestionAnswer(questions[6].id, true, 100, 1);
      await recordQuestionAnswer(questions[7].id, true, 100, 1);
      await recordQuestionAnswer(questions[8].id, true, 100, 1);

      stats = await getUserStats();
      expect(stats.current_streak).toBe(3);
      expect(stats.best_streak).toBe(5); // Best streak unchanged
    });

    it('should calculate accuracy correctly', async () => {
      const questions = await getPackQuestions('starter-pack');

      // Answer 7 correct, 3 wrong (70% accuracy)
      await recordQuestionAnswer(questions[0].id, true, 100, 1);
      await recordQuestionAnswer(questions[1].id, true, 100, 1);
      await recordQuestionAnswer(questions[2].id, false, 0, 1);
      await recordQuestionAnswer(questions[3].id, true, 100, 1);
      await recordQuestionAnswer(questions[4].id, true, 100, 1);
      await recordQuestionAnswer(questions[5].id, false, 0, 1);
      await recordQuestionAnswer(questions[6].id, true, 100, 1);
      await recordQuestionAnswer(questions[7].id, true, 100, 1);
      await recordQuestionAnswer(questions[8].id, false, 0, 1);
      await recordQuestionAnswer(questions[9].id, true, 100, 1);

      const stats = await getUserStats();
      expect(stats.total_questions_answered).toBe(10);
      expect(stats.accuracy_rate).toBeCloseTo(0.7, 2);
    });

    it('should update last_played timestamp', async () => {
      const questions = await getPackQuestions('starter-pack');
      const before = new Date().toISOString();

      await recordQuestionAnswer(questions[0].id, true, 100, 1);

      const stats = await getUserStats();
      expect(stats.last_played).toBeTruthy();
      expect(stats.last_played! >= before).toBe(true);
    });

    it('should mark stats as not synced', async () => {
      const questions = await getPackQuestions('starter-pack');

      await recordQuestionAnswer(questions[0].id, true, 100, 1);

      const stats = await getUserStats();
      expect(stats.is_synced).toBe(0);
    });
  });

  describe('getAnsweredQuestionIds', () => {
    it('should return empty array when no questions answered', async () => {
      const ids = await getAnsweredQuestionIds();
      expect(ids).toEqual([]);
    });

    it('should return IDs of correctly answered questions', async () => {
      const questions = await getPackQuestions('starter-pack');

      await recordQuestionAnswer(questions[0].id, true, 100, 1);
      await recordQuestionAnswer(questions[1].id, false, 0, 1);
      await recordQuestionAnswer(questions[2].id, true, 100, 1);

      const ids = await getAnsweredQuestionIds();

      expect(ids.length).toBe(2);
      expect(ids).toContain(questions[0].id);
      expect(ids).toContain(questions[2].id);
      expect(ids).not.toContain(questions[1].id);
    });

    it('should filter by game mode', async () => {
      const allQuestions = await getPackQuestions('starter-pack');
      const careerQuestions = allQuestions.filter(
        (q) => q.game_mode === GAME_MODES.CAREER_PATH
      );
      const transferQuestions = allQuestions.filter(
        (q) => q.game_mode === GAME_MODES.TRANSFER
      );

      // Answer some from each mode
      await recordQuestionAnswer(careerQuestions[0].id, true, 100, 1);
      await recordQuestionAnswer(transferQuestions[0].id, true, 100, 1);

      const careerIds = await getAnsweredQuestionIds(GAME_MODES.CAREER_PATH);
      const transferIds = await getAnsweredQuestionIds(GAME_MODES.TRANSFER);

      expect(careerIds).toContain(careerQuestions[0].id);
      expect(careerIds).not.toContain(transferQuestions[0].id);

      expect(transferIds).toContain(transferQuestions[0].id);
      expect(transferIds).not.toContain(careerQuestions[0].id);
    });

    it('should not return duplicates', async () => {
      const questions = await getPackQuestions('starter-pack');

      // Answer same question multiple times (different attempts)
      await recordQuestionAnswer(questions[0].id, false, 0, 1);
      await recordQuestionAnswer(questions[0].id, true, 100, 2);

      const ids = await getAnsweredQuestionIds();

      // Should only appear once
      const questionIdCount = ids.filter((id) => id === questions[0].id).length;
      expect(questionIdCount).toBe(1);
    });
  });

  describe('getQuestionHistory', () => {
    it('should return empty array when no history', async () => {
      const history = await getQuestionHistory();
      expect(history).toEqual([]);
    });

    it('should return history ordered by most recent first', async () => {
      const questions = await getPackQuestions('starter-pack');

      // Answer 3 questions with small delays to ensure different timestamps
      await recordQuestionAnswer(questions[0].id, true, 100, 1);
      await new Promise((resolve) => setTimeout(resolve, 10));

      await recordQuestionAnswer(questions[1].id, false, 0, 1);
      await new Promise((resolve) => setTimeout(resolve, 10));

      await recordQuestionAnswer(questions[2].id, true, 100, 1);

      const history = await getQuestionHistory();

      expect(history.length).toBe(3);

      // Most recent should be first
      expect(history[0].question_id).toBe(questions[2].id);
      expect(history[1].question_id).toBe(questions[1].id);
      expect(history[2].question_id).toBe(questions[0].id);
    });

    it('should respect limit parameter', async () => {
      const questions = await getPackQuestions('starter-pack');

      // Answer 5 questions
      for (let i = 0; i < 5; i++) {
        await recordQuestionAnswer(questions[i].id, true, 100, 1);
      }

      const history = await getQuestionHistory(3);

      expect(history.length).toBe(3);
    });

    it('should include all progress fields', async () => {
      const questions = await getPackQuestions('starter-pack');

      await recordQuestionAnswer(questions[0].id, true, 100, 2);

      const history = await getQuestionHistory();

      expect(history.length).toBe(1);
      expect(history[0].question_id).toBe(questions[0].id);
      expect(history[0].answered_correctly).toBe(1);
      expect(history[0].score_earned).toBe(100);
      expect(history[0].attempts).toBe(2);
      expect(history[0].completed_at).toBeTruthy();
    });
  });

  describe('calculateAccuracyRate', () => {
    it('should return 0 when no questions answered', async () => {
      const accuracy = await calculateAccuracyRate();
      expect(accuracy).toBe(0);
    });

    it('should calculate 100% accuracy', async () => {
      const questions = await getPackQuestions('starter-pack');

      await recordQuestionAnswer(questions[0].id, true, 100, 1);
      await recordQuestionAnswer(questions[1].id, true, 100, 1);
      await recordQuestionAnswer(questions[2].id, true, 100, 1);

      const accuracy = await calculateAccuracyRate();
      expect(accuracy).toBe(1.0);
    });

    it('should calculate 0% accuracy', async () => {
      const questions = await getPackQuestions('starter-pack');

      await recordQuestionAnswer(questions[0].id, false, 0, 1);
      await recordQuestionAnswer(questions[1].id, false, 0, 1);
      await recordQuestionAnswer(questions[2].id, false, 0, 1);

      const accuracy = await calculateAccuracyRate();
      expect(accuracy).toBe(0);
    });

    it('should calculate 50% accuracy', async () => {
      const questions = await getPackQuestions('starter-pack');

      await recordQuestionAnswer(questions[0].id, true, 100, 1);
      await recordQuestionAnswer(questions[1].id, false, 0, 1);

      const accuracy = await calculateAccuracyRate();
      expect(accuracy).toBe(0.5);
    });
  });

  describe('updateUserStats', () => {
    it('should update specific fields', async () => {
      await updateUserStats({
        total_questions_answered: 10,
        total_score: 500,
      });

      const stats = await getUserStats();
      expect(stats.total_questions_answered).toBe(10);
      expect(stats.total_score).toBe(500);

      // Other fields should remain unchanged
      expect(stats.current_streak).toBe(0);
      expect(stats.best_streak).toBe(0);
    });

    it('should mark stats as not synced', async () => {
      await updateUserStats({ total_score: 100 });

      const stats = await getUserStats();
      expect(stats.is_synced).toBe(0);
    });

    it('should handle empty updates', async () => {
      const statsBefore = await getUserStats();

      await updateUserStats({});

      const statsAfter = await getUserStats();

      expect(statsAfter.total_questions_answered).toBe(
        statsBefore.total_questions_answered
      );
      expect(statsAfter.total_score).toBe(statsBefore.total_score);
    });
  });
});
