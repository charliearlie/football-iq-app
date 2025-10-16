/**
 * Question and question pack query functions
 *
 * This module provides database query functions for questions and question packs.
 * All functions use parameterized queries to prevent SQL injection.
 */

import { getDatabase } from '../connection';
import { QuestionPack, Question, Platform } from '../../types/database';

/**
 * Get all question packs
 *
 * @returns Array of all question packs ordered by name
 */
export async function getQuestionPacks(): Promise<QuestionPack[]> {
  try {
    const db = await getDatabase();
    const query = 'SELECT * FROM question_packs ORDER BY name';
    const results = await db.getAllAsync<QuestionPack>(query);
    return results;
  } catch (error) {
    console.error('Error in getQuestionPacks:', error);
    throw new Error(
      `Failed to fetch question packs: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Get all purchased question packs
 *
 * Returns packs that have been purchased by the user.
 *
 * @returns Array of purchased question packs
 */
export async function getPurchasedPacks(): Promise<QuestionPack[]> {
  try {
    const db = await getDatabase();

    const query = `
      SELECT DISTINCT qp.*
      FROM question_packs qp
      INNER JOIN user_purchased_packs upp ON qp.id = upp.pack_id
      ORDER BY qp.name
    `;

    const results = await db.getAllAsync<QuestionPack>(query);
    return results;
  } catch (error) {
    console.error('Error in getPurchasedPacks:', error);
    throw new Error(
      `Failed to fetch purchased packs: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Get all free question packs
 *
 * @returns Array of free question packs
 */
export async function getFreePacks(): Promise<QuestionPack[]> {
  try {
    const db = await getDatabase();
    const query = 'SELECT * FROM question_packs WHERE is_free = 1 ORDER BY name';
    const results = await db.getAllAsync<QuestionPack>(query);
    return results;
  } catch (error) {
    console.error('Error in getFreePacks:', error);
    throw new Error(
      `Failed to fetch free packs: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Get a question pack by its ID
 *
 * @param packId - Question pack ID
 * @returns Question pack if found, null otherwise
 */
export async function getPackById(packId: string): Promise<QuestionPack | null> {
  try {
    const db = await getDatabase();
    const query = 'SELECT * FROM question_packs WHERE id = ?';
    const result = await db.getFirstAsync<QuestionPack>(query, [packId]);
    return result;
  } catch (error) {
    console.error('Error in getPackById:', error);
    throw new Error(
      `Failed to fetch pack: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Get all questions for a specific pack
 *
 * @param packId - Question pack ID
 * @returns Array of questions in the pack
 */
export async function getPackQuestions(packId: string): Promise<Question[]> {
  try {
    const db = await getDatabase();
    const query = 'SELECT * FROM questions WHERE pack_id = ?';
    const results = await db.getAllAsync<Question>(query, [packId]);
    return results;
  } catch (error) {
    console.error('Error in getPackQuestions:', error);
    throw new Error(
      `Failed to fetch pack questions: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Get a random question for a game mode
 *
 * Optionally filter by pack. Uses SQLite's RANDOM() function.
 *
 * @param gameMode - Game mode to filter by
 * @param packId - Optional pack ID to filter by
 * @returns Random question if found, null otherwise
 */
export async function getRandomQuestion(
  gameMode: string,
  packId?: string
): Promise<Question | null> {
  try {
    const db = await getDatabase();

    let query: string;
    let params: any[];

    if (packId) {
      query = `
        SELECT * FROM questions
        WHERE game_mode = ? AND pack_id = ?
        ORDER BY RANDOM()
        LIMIT 1
      `;
      params = [gameMode, packId];
    } else {
      // Get from purchased packs only
      query = `
        SELECT q.* FROM questions q
        INNER JOIN user_purchased_packs upp ON q.pack_id = upp.pack_id
        WHERE q.game_mode = ?
        ORDER BY RANDOM()
        LIMIT 1
      `;
      params = [gameMode];
    }

    const result = await db.getFirstAsync<Question>(query, params);
    return result;
  } catch (error) {
    console.error('Error in getRandomQuestion:', error);
    throw new Error(
      `Failed to fetch random question: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Get a random unanswered question for a game mode
 *
 * Returns a question that the user hasn't answered correctly yet.
 * Optionally filter by pack.
 *
 * @param gameMode - Game mode to filter by
 * @param packId - Optional pack ID to filter by
 * @returns Random unanswered question if found, null otherwise
 */
export async function getUnansweredQuestion(
  gameMode: string,
  packId?: string
): Promise<Question | null> {
  try {
    const db = await getDatabase();

    let query: string;
    let params: any[];

    if (packId) {
      query = `
        SELECT q.* FROM questions q
        WHERE q.game_mode = ? AND q.pack_id = ?
        AND q.id NOT IN (
          SELECT question_id FROM user_progress
          WHERE answered_correctly = 1
        )
        ORDER BY RANDOM()
        LIMIT 1
      `;
      params = [gameMode, packId];
    } else {
      // Get from purchased packs only
      query = `
        SELECT q.* FROM questions q
        INNER JOIN user_purchased_packs upp ON q.pack_id = upp.pack_id
        WHERE q.game_mode = ?
        AND q.id NOT IN (
          SELECT question_id FROM user_progress
          WHERE answered_correctly = 1
        )
        ORDER BY RANDOM()
        LIMIT 1
      `;
      params = [gameMode];
    }

    const result = await db.getFirstAsync<Question>(query, params);
    return result;
  } catch (error) {
    console.error('Error in getUnansweredQuestion:', error);
    throw new Error(
      `Failed to fetch unanswered question: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Mark a question pack as purchased
 *
 * Records the purchase in the user_purchased_packs table.
 *
 * @param packId - Question pack ID
 * @param transactionId - In-app purchase transaction ID
 * @param platform - Platform where purchase was made ('ios' or 'android')
 */
export async function markPackAsPurchased(
  packId: string,
  transactionId: string,
  platform: Platform
): Promise<void> {
  try {
    const db = await getDatabase();

    // Check if pack exists
    const pack = await getPackById(packId);
    if (!pack) {
      throw new Error(`Pack with ID ${packId} does not exist`);
    }

    // Check if already purchased
    const existing = await db.getFirstAsync<{ id: number }>(
      'SELECT id FROM user_purchased_packs WHERE pack_id = ?',
      [packId]
    );

    if (existing) {
      console.log(`Pack ${packId} is already purchased`);
      return;
    }

    const now = new Date().toISOString();

    await db.runAsync(
      `INSERT INTO user_purchased_packs (pack_id, platform, transaction_id, purchased_at, is_synced)
       VALUES (?, ?, ?, ?, ?)`,
      [packId, platform, transactionId, now, 0]
    );

    console.log(`Pack ${packId} marked as purchased`);
  } catch (error) {
    console.error('Error in markPackAsPurchased:', error);
    throw new Error(
      `Failed to mark pack as purchased: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}
