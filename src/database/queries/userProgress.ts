/**
 * User progress query functions
 *
 * This module provides database query functions for user progress and statistics.
 * All functions use parameterized queries to prevent SQL injection.
 */

import { getDatabase } from '../connection';
import { UserStats, UserProgress } from '../../types/database';

/**
 * Get user statistics (singleton)
 *
 * @returns User statistics
 */
export async function getUserStats(): Promise<UserStats> {
  try {
    const db = await getDatabase();
    const query = 'SELECT * FROM user_stats WHERE id = 1';
    const result = await db.getFirstAsync<UserStats>(query);

    if (!result) {
      throw new Error('User stats not initialized');
    }

    return result;
  } catch (error) {
    console.error('Error in getUserStats:', error);
    throw new Error(
      `Failed to fetch user stats: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Record a question answer and update user statistics
 *
 * This function performs multiple operations in a transaction:
 * 1. Inserts a new progress record
 * 2. Updates user stats (totals, streak, accuracy)
 *
 * Streak logic:
 * - If correct and previous answer was correct: increment streak
 * - If correct and previous was wrong (or no previous): streak = 1
 * - If wrong: streak = 0
 * - Update best_streak if current_streak exceeds it
 *
 * @param questionId - Question ID
 * @param correct - Whether the answer was correct
 * @param score - Score earned for this question
 * @param attempts - Number of attempts made
 */
export async function recordQuestionAnswer(
  questionId: string,
  correct: boolean,
  score: number,
  attempts: number
): Promise<void> {
  try {
    const db = await getDatabase();
    const now = new Date().toISOString();

    await db.withTransactionAsync(async () => {
      // 1. Insert progress record
      await db.runAsync(
        `INSERT INTO user_progress (question_id, answered_correctly, score_earned, attempts, completed_at, is_synced)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [questionId, correct ? 1 : 0, score, attempts, now, 0]
      );

      // 2. Get current stats
      const stats = await db.getFirstAsync<UserStats>(
        'SELECT * FROM user_stats WHERE id = 1'
      );

      if (!stats) {
        throw new Error('User stats not initialized');
      }

      // 3. Calculate new streak
      let newStreak = 0;
      let newBestStreak = stats.best_streak;

      if (correct) {
        // Get the ID of the record we just inserted
        const currentRecord = await db.getFirstAsync<{ max_id: number }>(
          'SELECT MAX(id) as max_id FROM user_progress'
        );

        // Get the most recent answer before this one (using ID instead of timestamp)
        const previousAnswer = await db.getFirstAsync<{
          answered_correctly: number;
        }>(
          `SELECT answered_correctly FROM user_progress
           WHERE id < ?
           ORDER BY id DESC
           LIMIT 1`,
          [currentRecord?.max_id || 0]
        );

        if (previousAnswer && previousAnswer.answered_correctly === 1) {
          // Previous was correct, increment streak
          newStreak = stats.current_streak + 1;
        } else {
          // Previous was wrong or no previous answer, start new streak
          newStreak = 1;
        }

        // Update best streak if needed
        if (newStreak > stats.best_streak) {
          newBestStreak = newStreak;
        }
      } else {
        // Wrong answer, reset streak
        newStreak = 0;
      }

      // 4. Calculate new accuracy
      // Count total correct answers
      const correctCount = await db.getFirstAsync<{ count: number }>(
        'SELECT COUNT(*) as count FROM user_progress WHERE answered_correctly = 1'
      );

      const totalCorrect = (correctCount?.count || 0);
      const totalAnswered = stats.total_questions_answered + 1;
      const newAccuracy = totalAnswered > 0 ? totalCorrect / totalAnswered : 0;

      // 5. Update user stats
      await db.runAsync(
        `UPDATE user_stats
         SET total_questions_answered = ?,
             total_score = ?,
             current_streak = ?,
             best_streak = ?,
             accuracy_rate = ?,
             last_played = ?,
             is_synced = 0
         WHERE id = 1`,
        [
          totalAnswered,
          stats.total_score + score,
          newStreak,
          newBestStreak,
          newAccuracy,
          now,
        ]
      );
    });

    console.log(`Recorded answer for question ${questionId}`);
  } catch (error) {
    console.error('Error in recordQuestionAnswer:', error);
    throw new Error(
      `Failed to record question answer: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Get IDs of all answered questions
 *
 * Optionally filter by game mode.
 *
 * @param gameMode - Optional game mode to filter by
 * @returns Array of question IDs that have been answered correctly
 */
export async function getAnsweredQuestionIds(
  gameMode?: string
): Promise<string[]> {
  try {
    const db = await getDatabase();

    let query: string;
    let params: any[];

    if (gameMode) {
      query = `
        SELECT DISTINCT up.question_id
        FROM user_progress up
        INNER JOIN questions q ON up.question_id = q.id
        WHERE up.answered_correctly = 1 AND q.game_mode = ?
      `;
      params = [gameMode];
    } else {
      query = `
        SELECT DISTINCT question_id
        FROM user_progress
        WHERE answered_correctly = 1
      `;
      params = [];
    }

    const results = await db.getAllAsync<{ question_id: string }>(query, params);
    return results.map((r) => r.question_id);
  } catch (error) {
    console.error('Error in getAnsweredQuestionIds:', error);
    throw new Error(
      `Failed to fetch answered question IDs: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Get question history
 *
 * Returns recent progress entries ordered by completion date.
 *
 * @param limit - Maximum number of records to return (default: 50)
 * @returns Array of user progress entries
 */
export async function getQuestionHistory(limit = 50): Promise<UserProgress[]> {
  try {
    const db = await getDatabase();

    const query = `
      SELECT * FROM user_progress
      ORDER BY completed_at DESC
      LIMIT ?
    `;

    const results = await db.getAllAsync<UserProgress>(query, [limit]);
    return results;
  } catch (error) {
    console.error('Error in getQuestionHistory:', error);
    throw new Error(
      `Failed to fetch question history: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Calculate accuracy rate from user progress
 *
 * @returns Accuracy rate (0.0 to 1.0)
 */
export async function calculateAccuracyRate(): Promise<number> {
  try {
    const db = await getDatabase();

    const totalResult = await db.getFirstAsync<{ count: number }>(
      'SELECT COUNT(*) as count FROM user_progress'
    );

    const correctResult = await db.getFirstAsync<{ count: number }>(
      'SELECT COUNT(*) as count FROM user_progress WHERE answered_correctly = 1'
    );

    const total = totalResult?.count || 0;
    const correct = correctResult?.count || 0;

    return total > 0 ? correct / total : 0;
  } catch (error) {
    console.error('Error in calculateAccuracyRate:', error);
    throw new Error(
      `Failed to calculate accuracy rate: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Update user statistics
 *
 * Allows partial updates to the user_stats singleton.
 *
 * @param updates - Partial user stats to update
 */
export async function updateUserStats(
  updates: Partial<Omit<UserStats, 'id'>>
): Promise<void> {
  try {
    const db = await getDatabase();

    // Build dynamic UPDATE query based on provided fields
    const fields = Object.keys(updates);
    const values = Object.values(updates);

    if (fields.length === 0) {
      return; // Nothing to update
    }

    const setClause = fields.map((field) => `${field} = ?`).join(', ');
    const query = `UPDATE user_stats SET ${setClause}, is_synced = 0 WHERE id = 1`;

    await db.runAsync(query, values);

    console.log('User stats updated');
  } catch (error) {
    console.error('Error in updateUserStats:', error);
    throw new Error(
      `Failed to update user stats: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}
