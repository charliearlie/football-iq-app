/**
 * Career query functions
 *
 * This module provides database query functions for player career histories.
 * All functions use parameterized queries to prevent SQL injection.
 */

import { getDatabase } from '../connection';
import { CareerWithClub, PlayerCareer } from '../../types/database';

/**
 * Get all career entries for a player
 *
 * Returns careers sorted by display_order with full club details joined.
 *
 * @param playerId - Player ID
 * @returns Array of career entries with club details
 */
export async function getPlayerCareers(
  playerId: number
): Promise<CareerWithClub[]> {
  try {
    const db = await getDatabase();

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

    const rows = await db.getAllAsync<any>(query, [playerId]);

    // Transform flat rows into nested structure
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

    return careers;
  } catch (error) {
    console.error('Error in getPlayerCareers:', error);
    throw new Error(
      `Failed to fetch player careers: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Get all players who played for a specific club
 *
 * @param clubId - Club ID
 * @returns Array of player career entries for the club
 */
export async function getClubPlayers(clubId: number): Promise<PlayerCareer[]> {
  try {
    const db = await getDatabase();

    const query = `
      SELECT * FROM player_careers
      WHERE club_id = ?
      ORDER BY start_year DESC, display_order
    `;

    const results = await db.getAllAsync<PlayerCareer>(query, [clubId]);
    return results;
  } catch (error) {
    console.error('Error in getClubPlayers:', error);
    throw new Error(
      `Failed to fetch club players: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}
