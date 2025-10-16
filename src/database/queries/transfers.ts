/**
 * Transfer query functions
 *
 * This module provides database query functions for player transfers.
 * All functions use parameterized queries to prevent SQL injection.
 */

import { getDatabase } from '../connection';
import { Transfer, TransferWithDetails, Player, Club } from '../../types/database';

/**
 * Get a transfer by its ID
 *
 * @param id - Transfer ID
 * @returns Transfer if found, null otherwise
 */
export async function getTransferById(id: number): Promise<Transfer | null> {
  try {
    const db = await getDatabase();
    const query = 'SELECT * FROM transfers WHERE id = ?';
    const result = await db.getFirstAsync<Transfer>(query, [id]);
    return result;
  } catch (error) {
    console.error('Error in getTransferById:', error);
    throw new Error(
      `Failed to fetch transfer: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Get a transfer with full details (player, from club, to club)
 *
 * Performs a triple JOIN to get all related information.
 *
 * @param id - Transfer ID
 * @returns Transfer with details if found, null otherwise
 */
export async function getTransferWithDetails(
  id: number
): Promise<TransferWithDetails | null> {
  try {
    const db = await getDatabase();

    const query = `
      SELECT
        t.*,
        p.id as player_id,
        p.name as player_name,
        p.full_name as player_full_name,
        p.nationality as player_nationality,
        p.position as player_position,
        p.date_of_birth as player_date_of_birth,
        p.aliases as player_aliases,
        p.server_updated_at as player_server_updated_at,
        p.local_updated_at as player_local_updated_at,
        p.is_synced as player_is_synced,
        fc.id as from_club_id,
        fc.name as from_club_name,
        fc.country as from_club_country,
        fc.league as from_club_league,
        fc.badge_url as from_club_badge_url,
        fc.server_updated_at as from_club_server_updated_at,
        fc.local_updated_at as from_club_local_updated_at,
        fc.is_synced as from_club_is_synced,
        tc.id as to_club_id,
        tc.name as to_club_name,
        tc.country as to_club_country,
        tc.league as to_club_league,
        tc.badge_url as to_club_badge_url,
        tc.server_updated_at as to_club_server_updated_at,
        tc.local_updated_at as to_club_local_updated_at,
        tc.is_synced as to_club_is_synced
      FROM transfers t
      INNER JOIN players p ON t.player_id = p.id
      INNER JOIN clubs fc ON t.from_club_id = fc.id
      INNER JOIN clubs tc ON t.to_club_id = tc.id
      WHERE t.id = ?
    `;

    const row = await db.getFirstAsync<any>(query, [id]);

    if (!row) {
      return null;
    }

    // Transform flat row into nested structure
    const transfer: TransferWithDetails = {
      id: row.id,
      player_id: row.player_id,
      from_club_id: row.from_club_id,
      to_club_id: row.to_club_id,
      transfer_year: row.transfer_year,
      transfer_fee: row.transfer_fee,
      server_updated_at: row.server_updated_at,
      local_updated_at: row.local_updated_at,
      is_synced: row.is_synced,
      player: {
        id: row.player_id,
        name: row.player_name,
        full_name: row.player_full_name,
        nationality: row.player_nationality,
        position: row.player_position,
        date_of_birth: row.player_date_of_birth,
        aliases: row.player_aliases,
        server_updated_at: row.player_server_updated_at,
        local_updated_at: row.player_local_updated_at,
        is_synced: row.player_is_synced,
      },
      fromClub: {
        id: row.from_club_id,
        name: row.from_club_name,
        country: row.from_club_country,
        league: row.from_club_league,
        badge_url: row.from_club_badge_url,
        server_updated_at: row.from_club_server_updated_at,
        local_updated_at: row.from_club_local_updated_at,
        is_synced: row.from_club_is_synced,
      },
      toClub: {
        id: row.to_club_id,
        name: row.to_club_name,
        country: row.to_club_country,
        league: row.to_club_league,
        badge_url: row.to_club_badge_url,
        server_updated_at: row.to_club_server_updated_at,
        local_updated_at: row.to_club_local_updated_at,
        is_synced: row.to_club_is_synced,
      },
    };

    return transfer;
  } catch (error) {
    console.error('Error in getTransferWithDetails:', error);
    throw new Error(
      `Failed to fetch transfer with details: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Get all transfers for a player
 *
 * Returns transfers with full details (from club and to club).
 *
 * @param playerId - Player ID
 * @returns Array of transfers with details
 */
export async function getPlayerTransfers(
  playerId: number
): Promise<TransferWithDetails[]> {
  try {
    const db = await getDatabase();

    const query = `
      SELECT
        t.*,
        p.id as player_id,
        p.name as player_name,
        p.full_name as player_full_name,
        p.nationality as player_nationality,
        p.position as player_position,
        p.date_of_birth as player_date_of_birth,
        p.aliases as player_aliases,
        p.server_updated_at as player_server_updated_at,
        p.local_updated_at as player_local_updated_at,
        p.is_synced as player_is_synced,
        fc.id as from_club_id,
        fc.name as from_club_name,
        fc.country as from_club_country,
        fc.league as from_club_league,
        fc.badge_url as from_club_badge_url,
        fc.server_updated_at as from_club_server_updated_at,
        fc.local_updated_at as from_club_local_updated_at,
        fc.is_synced as from_club_is_synced,
        tc.id as to_club_id,
        tc.name as to_club_name,
        tc.country as to_club_country,
        tc.league as to_club_league,
        tc.badge_url as to_club_badge_url,
        tc.server_updated_at as to_club_server_updated_at,
        tc.local_updated_at as to_club_local_updated_at,
        tc.is_synced as to_club_is_synced
      FROM transfers t
      INNER JOIN players p ON t.player_id = p.id
      INNER JOIN clubs fc ON t.from_club_id = fc.id
      INNER JOIN clubs tc ON t.to_club_id = tc.id
      WHERE t.player_id = ?
      ORDER BY t.transfer_year DESC
    `;

    const rows = await db.getAllAsync<any>(query, [playerId]);

    // Transform flat rows into nested structure
    const transfers: TransferWithDetails[] = rows.map((row) => ({
      id: row.id,
      player_id: row.player_id,
      from_club_id: row.from_club_id,
      to_club_id: row.to_club_id,
      transfer_year: row.transfer_year,
      transfer_fee: row.transfer_fee,
      server_updated_at: row.server_updated_at,
      local_updated_at: row.local_updated_at,
      is_synced: row.is_synced,
      player: {
        id: row.player_id,
        name: row.player_name,
        full_name: row.player_full_name,
        nationality: row.player_nationality,
        position: row.player_position,
        date_of_birth: row.player_date_of_birth,
        aliases: row.player_aliases,
        server_updated_at: row.player_server_updated_at,
        local_updated_at: row.player_local_updated_at,
        is_synced: row.player_is_synced,
      },
      fromClub: {
        id: row.from_club_id,
        name: row.from_club_name,
        country: row.from_club_country,
        league: row.from_club_league,
        badge_url: row.from_club_badge_url,
        server_updated_at: row.from_club_server_updated_at,
        local_updated_at: row.from_club_local_updated_at,
        is_synced: row.from_club_is_synced,
      },
      toClub: {
        id: row.to_club_id,
        name: row.to_club_name,
        country: row.to_club_country,
        league: row.to_club_league,
        badge_url: row.to_club_badge_url,
        server_updated_at: row.to_club_server_updated_at,
        local_updated_at: row.to_club_local_updated_at,
        is_synced: row.to_club_is_synced,
      },
    }));

    return transfers;
  } catch (error) {
    console.error('Error in getPlayerTransfers:', error);
    throw new Error(
      `Failed to fetch player transfers: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}
