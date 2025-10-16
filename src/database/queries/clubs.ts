/**
 * Club query functions
 *
 * This module provides all database query functions related to clubs.
 * All functions use parameterized queries to prevent SQL injection.
 */

import { getDatabase } from '../connection';
import { Club } from '../../types/database';

/**
 * Get a club by its ID
 *
 * @param id - Club ID
 * @returns Club if found, null otherwise
 */
export async function getClubById(id: number): Promise<Club | null> {
  try {
    const db = await getDatabase();
    const query = 'SELECT * FROM clubs WHERE id = ?';
    const result = await db.getFirstAsync<Club>(query, [id]);
    return result;
  } catch (error) {
    console.error('Error in getClubById:', error);
    throw new Error(
      `Failed to fetch club: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Get all clubs from a specific country
 *
 * @param country - Country name (e.g., "England", "Spain")
 * @returns Array of clubs from the specified country
 */
export async function getClubsByCountry(country: string): Promise<Club[]> {
  try {
    const db = await getDatabase();
    const query = 'SELECT * FROM clubs WHERE country = ? ORDER BY name';
    const results = await db.getAllAsync<Club>(query, [country]);
    return results;
  } catch (error) {
    console.error('Error in getClubsByCountry:', error);
    throw new Error(
      `Failed to fetch clubs by country: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Get all clubs
 *
 * @returns Array of all clubs ordered by name
 */
export async function getAllClubs(): Promise<Club[]> {
  try {
    const db = await getDatabase();
    const query = 'SELECT * FROM clubs ORDER BY name';
    const results = await db.getAllAsync<Club>(query);
    return results;
  } catch (error) {
    console.error('Error in getAllClubs:', error);
    throw new Error(
      `Failed to fetch all clubs: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Search clubs by name (partial match, case-insensitive)
 *
 * @param query - Search query string
 * @returns Array of clubs matching the search query
 */
export async function searchClubsByName(query: string): Promise<Club[]> {
  try {
    const db = await getDatabase();
    const sql =
      "SELECT * FROM clubs WHERE name LIKE ? COLLATE NOCASE ORDER BY name";
    const results = await db.getAllAsync<Club>(sql, [`%${query}%`]);
    return results;
  } catch (error) {
    console.error('Error in searchClubsByName:', error);
    throw new Error(
      `Failed to search clubs: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}
