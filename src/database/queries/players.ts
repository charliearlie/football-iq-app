/**
 * Player query functions
 *
 * This module provides all database query functions related to players.
 * All functions use parameterized queries to prevent SQL injection.
 */

import { getDatabase } from '../connection';
import { Player, PlayerWithCareer, CareerWithClub, Club } from '../../types/database';

/**
 * Get a player by their ID
 *
 * @param id - Player ID
 * @returns Player if found, null otherwise
 */
export async function getPlayerById(id: number): Promise<Player | null> {
  try {
    const db = await getDatabase();
    const query = 'SELECT * FROM players WHERE id = ?';
    const result = await db.getFirstAsync<Player>(query, [id]);
    return result;
  } catch (error) {
    console.error('Error in getPlayerById:', error);
    throw new Error(
      `Failed to fetch player: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Get a player by their name (searches both name and aliases)
 *
 * @param name - Player name or alias to search for
 * @returns Player if found, null otherwise
 */
export async function getPlayerByName(name: string): Promise<Player | null> {
  try {
    const db = await getDatabase();

    // First try exact match on name
    const exactQuery = 'SELECT * FROM players WHERE name = ? COLLATE NOCASE';
    let result = await db.getFirstAsync<Player>(exactQuery, [name]);

    if (result) {
      return result;
    }

    // If not found, search in aliases
    // We need to check if the aliases JSON array contains the name
    const aliasQuery = `
      SELECT * FROM players
      WHERE aliases IS NOT NULL
      AND aliases LIKE ? COLLATE NOCASE
    `;

    // Search for the name in the JSON array
    // This is a simple approach - for production you might want to parse JSON
    result = await db.getFirstAsync<Player>(aliasQuery, [`%"${name}"%`]);

    return result;
  } catch (error) {
    console.error('Error in getPlayerByName:', error);
    throw new Error(
      `Failed to fetch player by name: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Get a player with their full career history
 *
 * Returns the player along with all their career entries, each containing
 * full club details. Careers are ordered by display_order.
 *
 * @param id - Player ID
 * @returns Player with careers if found, null otherwise
 */
export async function getPlayerWithFullCareer(
  id: number
): Promise<PlayerWithCareer | null> {
  try {
    const db = await getDatabase();

    // Get the player first
    const player = await getPlayerById(id);

    if (!player) {
      return null;
    }

    // Get all career entries with club details
    const query = `
      SELECT
        pc.id,
        pc.player_id,
        pc.club_id,
        pc.start_year,
        pc.end_year,
        pc.display_order,
        pc.server_updated_at,
        pc.local_updated_at,
        pc.is_synced,
        c.id as club_id,
        c.name as club_name,
        c.country as club_country,
        c.league as club_league,
        c.badge_url as club_badge_url,
        c.server_updated_at as club_server_updated_at,
        c.local_updated_at as club_local_updated_at,
        c.is_synced as club_is_synced
      FROM player_careers pc
      INNER JOIN clubs c ON pc.club_id = c.id
      WHERE pc.player_id = ?
      ORDER BY pc.display_order
    `;

    const rows = await db.getAllAsync<any>(query, [id]);

    // Transform the flat rows into nested structure
    const careers: CareerWithClub[] = rows.map((row) => ({
      id: row.id,
      player_id: row.player_id,
      club_id: row.club_id,
      start_year: row.start_year,
      end_year: row.end_year,
      display_order: row.display_order,
      server_updated_at: row.server_updated_at,
      local_updated_at: row.local_updated_at,
      is_synced: row.is_synced,
      club: {
        id: row.club_id,
        name: row.club_name,
        country: row.club_country,
        league: row.club_league,
        badge_url: row.club_badge_url,
        server_updated_at: row.club_server_updated_at,
        local_updated_at: row.club_local_updated_at,
        is_synced: row.club_is_synced,
      },
    }));

    return {
      ...player,
      careers,
    };
  } catch (error) {
    console.error('Error in getPlayerWithFullCareer:', error);
    throw new Error(
      `Failed to fetch player with career: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Get all players
 *
 * @returns Array of all players ordered by name
 */
export async function getAllPlayers(): Promise<Player[]> {
  try {
    const db = await getDatabase();
    const query = 'SELECT * FROM players ORDER BY name';
    const results = await db.getAllAsync<Player>(query);
    return results;
  } catch (error) {
    console.error('Error in getAllPlayers:', error);
    throw new Error(
      `Failed to fetch all players: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}
