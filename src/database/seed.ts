/**
 * Database seeding functions
 *
 * This module provides functions to seed the database with initial data for
 * development and testing purposes. The seed function is idempotent and can
 * be safely run multiple times.
 */

import { getDatabase } from './connection';
import { GAME_MODES, DIFFICULTY_LEVELS } from '../constants/database';

/**
 * Seeds the database with initial data
 *
 * This function is idempotent - it checks if data has already been seeded
 * and will not duplicate data on subsequent calls.
 *
 * The seed includes:
 * - 15 major football clubs
 * - 5 legendary players with complete career histories
 * - 10+ transfer records
 * - 1 free starter pack with 25+ questions
 * - User stats initialization
 */
export async function seedDatabase(): Promise<void> {
  const db = await getDatabase();

  try {
    // Check if already seeded
    const seeded = await db.getFirstAsync<{ value: string }>(
      'SELECT value FROM sync_metadata WHERE key = ?',
      ['seed_completed']
    );

    if (seeded && seeded.value === 'true') {
      console.log('✅ Database already seeded');
      return;
    }

    console.log('🌱 Starting database seed...');

    await db.withTransactionAsync(async () => {
      const now = new Date().toISOString();

      // =======================================================================
      // 1. INSERT CLUBS
      // =======================================================================
      console.log('  📋 Inserting clubs...');

      const clubs = [
        {
          id: 1,
          name: 'Manchester United',
          country: 'England',
          league: 'Premier League',
        },
        { id: 2, name: 'Real Madrid', country: 'Spain', league: 'La Liga' },
        { id: 3, name: 'Barcelona', country: 'Spain', league: 'La Liga' },
        { id: 4, name: 'Bayern Munich', country: 'Germany', league: 'Bundesliga' },
        { id: 5, name: 'Juventus', country: 'Italy', league: 'Serie A' },
        {
          id: 6,
          name: 'Paris Saint-Germain',
          country: 'France',
          league: 'Ligue 1',
        },
        { id: 7, name: 'Liverpool', country: 'England', league: 'Premier League' },
        {
          id: 8,
          name: 'Manchester City',
          country: 'England',
          league: 'Premier League',
        },
        { id: 9, name: 'Chelsea', country: 'England', league: 'Premier League' },
        { id: 10, name: 'Arsenal', country: 'England', league: 'Premier League' },
        { id: 11, name: 'AC Milan', country: 'Italy', league: 'Serie A' },
        { id: 12, name: 'Inter Milan', country: 'Italy', league: 'Serie A' },
        {
          id: 13,
          name: 'Atletico Madrid',
          country: 'Spain',
          league: 'La Liga',
        },
        {
          id: 14,
          name: 'Borussia Dortmund',
          country: 'Germany',
          league: 'Bundesliga',
        },
        { id: 15, name: 'Ajax', country: 'Netherlands', league: 'Eredivisie' },
        { id: 16, name: 'Sporting CP', country: 'Portugal', league: 'Primeira Liga' },
        { id: 17, name: 'Al Nassr', country: 'Saudi Arabia', league: 'Saudi Pro League' },
        { id: 18, name: 'Inter Miami', country: 'USA', league: 'MLS' },
        { id: 19, name: 'LA Galaxy', country: 'USA', league: 'MLS' },
        { id: 20, name: 'Monaco', country: 'France', league: 'Ligue 1' },
      ];

      for (const club of clubs) {
        await db.runAsync(
          `INSERT OR IGNORE INTO clubs (id, name, country, league, badge_url, server_updated_at, local_updated_at, is_synced)
           VALUES (?, ?, ?, ?, NULL, ?, ?, 1)`,
          [club.id, club.name, club.country, club.league, now, now]
        );
      }

      // =======================================================================
      // 2. INSERT PLAYERS
      // =======================================================================
      console.log('  ⚽ Inserting players...');

      const players = [
        {
          id: 1,
          name: 'Cristiano Ronaldo',
          full_name: 'Cristiano Ronaldo dos Santos Aveiro',
          nationality: 'Portugal',
          position: 'Forward',
          date_of_birth: '1985-02-05',
          aliases: JSON.stringify(['CR7', 'Ronaldo', 'Cristiano']),
        },
        {
          id: 2,
          name: 'Lionel Messi',
          full_name: 'Lionel Andrés Messi',
          nationality: 'Argentina',
          position: 'Forward',
          date_of_birth: '1987-06-24',
          aliases: JSON.stringify(['Leo Messi', 'Messi', 'Leo']),
        },
        {
          id: 3,
          name: 'Zlatan Ibrahimovic',
          full_name: 'Zlatan Ibrahimović',
          nationality: 'Sweden',
          position: 'Forward',
          date_of_birth: '1981-10-03',
          aliases: JSON.stringify(['Zlatan', 'Ibra']),
        },
        {
          id: 4,
          name: 'David Beckham',
          full_name: 'David Robert Joseph Beckham',
          nationality: 'England',
          position: 'Midfielder',
          date_of_birth: '1975-05-02',
          aliases: JSON.stringify(['Becks', 'Beckham']),
        },
        {
          id: 5,
          name: 'Thierry Henry',
          full_name: 'Thierry Daniel Henry',
          nationality: 'France',
          position: 'Forward',
          date_of_birth: '1977-08-17',
          aliases: JSON.stringify(['Titi', 'Henry']),
        },
      ];

      for (const player of players) {
        await db.runAsync(
          `INSERT OR IGNORE INTO players (id, name, full_name, nationality, position, date_of_birth, aliases, server_updated_at, local_updated_at, is_synced)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
          [
            player.id,
            player.name,
            player.full_name,
            player.nationality,
            player.position,
            player.date_of_birth,
            player.aliases,
            now,
            now,
          ]
        );
      }

      // =======================================================================
      // 3. INSERT PLAYER CAREERS
      // =======================================================================
      console.log('  📊 Inserting player careers...');

      const careers = [
        // Cristiano Ronaldo (id: 1)
        {
          id: 1,
          player_id: 1,
          club_id: 16,
          start_year: 2002,
          end_year: 2003,
          display_order: 1,
          appearances: 31,
          goals: 5,
        },
        {
          id: 2,
          player_id: 1,
          club_id: 1,
          start_year: 2003,
          end_year: 2009,
          display_order: 2,
          appearances: 292,
          goals: 118,
        },
        {
          id: 3,
          player_id: 1,
          club_id: 2,
          start_year: 2009,
          end_year: 2018,
          display_order: 3,
          appearances: 438,
          goals: 450,
        },
        {
          id: 4,
          player_id: 1,
          club_id: 5,
          start_year: 2018,
          end_year: 2021,
          display_order: 4,
          appearances: 134,
          goals: 101,
        },
        {
          id: 5,
          player_id: 1,
          club_id: 1,
          start_year: 2021,
          end_year: 2022,
          display_order: 5,
          appearances: 54,
          goals: 24,
        },
        {
          id: 6,
          player_id: 1,
          club_id: 17,
          start_year: 2023,
          end_year: null,
          display_order: 6,
          appearances: 75,
          goals: 68,
        },

        // Lionel Messi (id: 2)
        {
          id: 7,
          player_id: 2,
          club_id: 3,
          start_year: 2004,
          end_year: 2021,
          display_order: 1,
          appearances: 778,
          goals: 672,
        },
        {
          id: 8,
          player_id: 2,
          club_id: 6,
          start_year: 2021,
          end_year: 2023,
          display_order: 2,
          appearances: 75,
          goals: 32,
        },
        {
          id: 9,
          player_id: 2,
          club_id: 18,
          start_year: 2023,
          end_year: null,
          display_order: 3,
          appearances: 40,
          goals: 30,
        },

        // Zlatan Ibrahimovic (id: 3)
        {
          id: 10,
          player_id: 3,
          club_id: 15,
          start_year: 2001,
          end_year: 2004,
          display_order: 1,
          appearances: 110,
          goals: 48,
        },
        {
          id: 11,
          player_id: 3,
          club_id: 5,
          start_year: 2004,
          end_year: 2006,
          display_order: 2,
          appearances: 92,
          goals: 26,
        },
        {
          id: 12,
          player_id: 3,
          club_id: 12,
          start_year: 2006,
          end_year: 2009,
          display_order: 3,
          appearances: 117,
          goals: 66,
        },
        {
          id: 13,
          player_id: 3,
          club_id: 3,
          start_year: 2009,
          end_year: 2011,
          display_order: 4,
          appearances: 46,
          goals: 22,
        },
        {
          id: 14,
          player_id: 3,
          club_id: 11,
          start_year: 2010,
          end_year: 2012,
          display_order: 5,
          appearances: 85,
          goals: 56,
        },
        {
          id: 15,
          player_id: 3,
          club_id: 6,
          start_year: 2012,
          end_year: 2016,
          display_order: 6,
          appearances: 180,
          goals: 156,
        },
        {
          id: 16,
          player_id: 3,
          club_id: 1,
          start_year: 2016,
          end_year: 2018,
          display_order: 7,
          appearances: 53,
          goals: 29,
        },

        // David Beckham (id: 4)
        {
          id: 17,
          player_id: 4,
          club_id: 1,
          start_year: 1992,
          end_year: 2003,
          display_order: 1,
          appearances: 394,
          goals: 85,
        },
        {
          id: 18,
          player_id: 4,
          club_id: 2,
          start_year: 2003,
          end_year: 2007,
          display_order: 2,
          appearances: 159,
          goals: 20,
        },
        {
          id: 19,
          player_id: 4,
          club_id: 19,
          start_year: 2007,
          end_year: 2012,
          display_order: 3,
          appearances: 124,
          goals: 20,
        },
        {
          id: 20,
          player_id: 4,
          club_id: 6,
          start_year: 2013,
          end_year: 2013,
          display_order: 4,
          appearances: 14,
          goals: 0,
        },

        // Thierry Henry (id: 5)
        {
          id: 21,
          player_id: 5,
          club_id: 20,
          start_year: 1994,
          end_year: 1999,
          display_order: 1,
          appearances: 141,
          goals: 28,
        },
        {
          id: 22,
          player_id: 5,
          club_id: 5,
          start_year: 1999,
          end_year: 1999,
          display_order: 2,
          appearances: 20,
          goals: 3,
        },
        {
          id: 23,
          player_id: 5,
          club_id: 10,
          start_year: 1999,
          end_year: 2007,
          display_order: 3,
          appearances: 377,
          goals: 228,
        },
        {
          id: 24,
          player_id: 5,
          club_id: 3,
          start_year: 2007,
          end_year: 2010,
          display_order: 4,
          appearances: 121,
          goals: 49,
        },
      ];

      for (const career of careers) {
        await db.runAsync(
          `INSERT OR IGNORE INTO player_careers (id, player_id, club_id, start_year, end_year, display_order, appearances, goals, server_updated_at, local_updated_at, is_synced)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
          [
            career.id,
            career.player_id,
            career.club_id,
            career.start_year,
            career.end_year,
            career.display_order,
            career.appearances,
            career.goals,
            now,
            now,
          ]
        );
      }

      // =======================================================================
      // 4. INSERT TRANSFERS
      // =======================================================================
      console.log('  💰 Inserting transfers...');

      const transfers = [
        // Ronaldo: Man United -> Real Madrid
        {
          id: 1,
          player_id: 1,
          from_club_id: 1,
          to_club_id: 2,
          transfer_year: 2009,
          transfer_fee: 94.0,
        },
        // Ronaldo: Real Madrid -> Juventus
        {
          id: 2,
          player_id: 1,
          from_club_id: 2,
          to_club_id: 5,
          transfer_year: 2018,
          transfer_fee: 100.0,
        },
        // Ronaldo: Juventus -> Man United
        {
          id: 3,
          player_id: 1,
          from_club_id: 5,
          to_club_id: 1,
          transfer_year: 2021,
          transfer_fee: 15.0,
        },
        // Messi: Barcelona -> PSG
        {
          id: 4,
          player_id: 2,
          from_club_id: 3,
          to_club_id: 6,
          transfer_year: 2021,
          transfer_fee: null,
        },
        // Messi: PSG -> Inter Miami
        {
          id: 5,
          player_id: 2,
          from_club_id: 6,
          to_club_id: 18,
          transfer_year: 2023,
          transfer_fee: null,
        },
        // Zlatan: Juventus -> Inter Milan
        {
          id: 6,
          player_id: 3,
          from_club_id: 5,
          to_club_id: 12,
          transfer_year: 2006,
          transfer_fee: 24.8,
        },
        // Zlatan: Inter -> Barcelona
        {
          id: 7,
          player_id: 3,
          from_club_id: 12,
          to_club_id: 3,
          transfer_year: 2009,
          transfer_fee: 69.5,
        },
        // Zlatan: Barcelona -> AC Milan
        {
          id: 8,
          player_id: 3,
          from_club_id: 3,
          to_club_id: 11,
          transfer_year: 2010,
          transfer_fee: 24.0,
        },
        // Beckham: Man United -> Real Madrid
        {
          id: 9,
          player_id: 4,
          from_club_id: 1,
          to_club_id: 2,
          transfer_year: 2003,
          transfer_fee: 35.0,
        },
        // Beckham: Real Madrid -> LA Galaxy
        {
          id: 10,
          player_id: 4,
          from_club_id: 2,
          to_club_id: 19,
          transfer_year: 2007,
          transfer_fee: null,
        },
        // Henry: Monaco -> Juventus
        {
          id: 11,
          player_id: 5,
          from_club_id: 20,
          to_club_id: 5,
          transfer_year: 1999,
          transfer_fee: 10.5,
        },
        // Henry: Arsenal -> Barcelona
        {
          id: 12,
          player_id: 5,
          from_club_id: 10,
          to_club_id: 3,
          transfer_year: 2007,
          transfer_fee: 24.0,
        },
      ];

      for (const transfer of transfers) {
        await db.runAsync(
          `INSERT OR IGNORE INTO transfers (id, player_id, from_club_id, to_club_id, transfer_year, transfer_fee, server_updated_at, local_updated_at, is_synced)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)`,
          [
            transfer.id,
            transfer.player_id,
            transfer.from_club_id,
            transfer.to_club_id,
            transfer.transfer_year,
            transfer.transfer_fee,
            now,
            now,
          ]
        );
      }

      // =======================================================================
      // 5. INSERT QUESTION PACK
      // =======================================================================
      console.log('  📦 Inserting question pack...');

      await db.runAsync(
        `INSERT OR IGNORE INTO question_packs (id, name, description, price, question_count, is_free, version, server_updated_at, local_updated_at, is_synced)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
        [
          'starter-pack',
          'Starter Pack',
          'A collection of questions to get you started with legendary football players',
          0,
          27,
          1,
          '1.0.0',
          now,
          now,
        ]
      );

      // =======================================================================
      // 6. INSERT QUESTIONS
      // =======================================================================
      console.log('  ❓ Inserting questions...');

      const questions = [
        // Career path questions for Ronaldo
        {
          id: 'q-career-ronaldo-1',
          game_mode: GAME_MODES.CAREER_PATH,
          difficulty: DIFFICULTY_LEVELS.EASY,
          entity_id: 1,
          metadata: JSON.stringify({ type: 'progressive' }),
        },
        {
          id: 'q-career-ronaldo-2',
          game_mode: GAME_MODES.CAREER_PATH,
          difficulty: DIFFICULTY_LEVELS.MEDIUM,
          entity_id: 1,
          metadata: JSON.stringify({ type: 'progressive' }),
        },
        {
          id: 'q-career-ronaldo-3',
          game_mode: GAME_MODES.CAREER_PATH,
          difficulty: DIFFICULTY_LEVELS.HARD,
          entity_id: 1,
          metadata: JSON.stringify({ type: 'full' }),
        },

        // Career path questions for Messi
        {
          id: 'q-career-messi-1',
          game_mode: GAME_MODES.CAREER_PATH,
          difficulty: DIFFICULTY_LEVELS.EASY,
          entity_id: 2,
          metadata: JSON.stringify({ type: 'progressive' }),
        },
        {
          id: 'q-career-messi-2',
          game_mode: GAME_MODES.CAREER_PATH,
          difficulty: DIFFICULTY_LEVELS.MEDIUM,
          entity_id: 2,
          metadata: JSON.stringify({ type: 'progressive' }),
        },
        {
          id: 'q-career-messi-3',
          game_mode: GAME_MODES.CAREER_PATH,
          difficulty: DIFFICULTY_LEVELS.EASY,
          entity_id: 2,
          metadata: JSON.stringify({ type: 'full' }),
        },

        // Career path questions for Zlatan
        {
          id: 'q-career-zlatan-1',
          game_mode: GAME_MODES.CAREER_PATH,
          difficulty: DIFFICULTY_LEVELS.MEDIUM,
          entity_id: 3,
          metadata: JSON.stringify({ type: 'progressive' }),
        },
        {
          id: 'q-career-zlatan-2',
          game_mode: GAME_MODES.CAREER_PATH,
          difficulty: DIFFICULTY_LEVELS.HARD,
          entity_id: 3,
          metadata: JSON.stringify({ type: 'progressive' }),
        },
        {
          id: 'q-career-zlatan-3',
          game_mode: GAME_MODES.CAREER_PATH,
          difficulty: DIFFICULTY_LEVELS.HARD,
          entity_id: 3,
          metadata: JSON.stringify({ type: 'full' }),
        },

        // Career path questions for Beckham
        {
          id: 'q-career-beckham-1',
          game_mode: GAME_MODES.CAREER_PATH,
          difficulty: DIFFICULTY_LEVELS.EASY,
          entity_id: 4,
          metadata: JSON.stringify({ type: 'progressive' }),
        },
        {
          id: 'q-career-beckham-2',
          game_mode: GAME_MODES.CAREER_PATH,
          difficulty: DIFFICULTY_LEVELS.MEDIUM,
          entity_id: 4,
          metadata: JSON.stringify({ type: 'progressive' }),
        },
        {
          id: 'q-career-beckham-3',
          game_mode: GAME_MODES.CAREER_PATH,
          difficulty: DIFFICULTY_LEVELS.MEDIUM,
          entity_id: 4,
          metadata: JSON.stringify({ type: 'full' }),
        },

        // Career path questions for Henry
        {
          id: 'q-career-henry-1',
          game_mode: GAME_MODES.CAREER_PATH,
          difficulty: DIFFICULTY_LEVELS.EASY,
          entity_id: 5,
          metadata: JSON.stringify({ type: 'progressive' }),
        },
        {
          id: 'q-career-henry-2',
          game_mode: GAME_MODES.CAREER_PATH,
          difficulty: DIFFICULTY_LEVELS.MEDIUM,
          entity_id: 5,
          metadata: JSON.stringify({ type: 'progressive' }),
        },
        {
          id: 'q-career-henry-3',
          game_mode: GAME_MODES.CAREER_PATH,
          difficulty: DIFFICULTY_LEVELS.MEDIUM,
          entity_id: 5,
          metadata: JSON.stringify({ type: 'full' }),
        },

        // Transfer questions
        {
          id: 'q-transfer-1',
          game_mode: GAME_MODES.TRANSFER,
          difficulty: DIFFICULTY_LEVELS.EASY,
          entity_id: 1,
          metadata: JSON.stringify({}),
        },
        {
          id: 'q-transfer-2',
          game_mode: GAME_MODES.TRANSFER,
          difficulty: DIFFICULTY_LEVELS.MEDIUM,
          entity_id: 2,
          metadata: JSON.stringify({}),
        },
        {
          id: 'q-transfer-3',
          game_mode: GAME_MODES.TRANSFER,
          difficulty: DIFFICULTY_LEVELS.MEDIUM,
          entity_id: 3,
          metadata: JSON.stringify({}),
        },
        {
          id: 'q-transfer-4',
          game_mode: GAME_MODES.TRANSFER,
          difficulty: DIFFICULTY_LEVELS.EASY,
          entity_id: 4,
          metadata: JSON.stringify({}),
        },
        {
          id: 'q-transfer-5',
          game_mode: GAME_MODES.TRANSFER,
          difficulty: DIFFICULTY_LEVELS.EASY,
          entity_id: 5,
          metadata: JSON.stringify({}),
        },
        {
          id: 'q-transfer-6',
          game_mode: GAME_MODES.TRANSFER,
          difficulty: DIFFICULTY_LEVELS.HARD,
          entity_id: 6,
          metadata: JSON.stringify({}),
        },
        {
          id: 'q-transfer-7',
          game_mode: GAME_MODES.TRANSFER,
          difficulty: DIFFICULTY_LEVELS.HARD,
          entity_id: 7,
          metadata: JSON.stringify({}),
        },
        {
          id: 'q-transfer-8',
          game_mode: GAME_MODES.TRANSFER,
          difficulty: DIFFICULTY_LEVELS.MEDIUM,
          entity_id: 8,
          metadata: JSON.stringify({}),
        },
        {
          id: 'q-transfer-9',
          game_mode: GAME_MODES.TRANSFER,
          difficulty: DIFFICULTY_LEVELS.EASY,
          entity_id: 9,
          metadata: JSON.stringify({}),
        },
        {
          id: 'q-transfer-10',
          game_mode: GAME_MODES.TRANSFER,
          difficulty: DIFFICULTY_LEVELS.MEDIUM,
          entity_id: 10,
          metadata: JSON.stringify({}),
        },
        {
          id: 'q-transfer-11',
          game_mode: GAME_MODES.TRANSFER,
          difficulty: DIFFICULTY_LEVELS.MEDIUM,
          entity_id: 11,
          metadata: JSON.stringify({}),
        },
        {
          id: 'q-transfer-12',
          game_mode: GAME_MODES.TRANSFER,
          difficulty: DIFFICULTY_LEVELS.HARD,
          entity_id: 12,
          metadata: JSON.stringify({}),
        },
      ];

      for (const question of questions) {
        await db.runAsync(
          `INSERT OR IGNORE INTO questions (id, pack_id, game_mode, difficulty, entity_id, metadata, server_updated_at, local_updated_at, is_synced)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)`,
          [
            question.id,
            'starter-pack',
            question.game_mode,
            question.difficulty,
            question.entity_id,
            question.metadata,
            now,
            now,
          ]
        );
      }

      // =======================================================================
      // 7. MARK STARTER PACK AS PURCHASED
      // =======================================================================
      console.log('  ✅ Marking starter pack as purchased...');

      await db.runAsync(
        `INSERT OR IGNORE INTO user_purchased_packs (pack_id, platform, transaction_id, purchased_at, is_synced)
         VALUES (?, ?, ?, ?, 1)`,
        ['starter-pack', 'ios', 'free-pack', now]
      );

      // =======================================================================
      // 8. MARK AS SEEDED
      // =======================================================================
      await db.runAsync(
        `INSERT OR REPLACE INTO sync_metadata (key, value, updated_at)
         VALUES (?, ?, ?)`,
        ['seed_completed', 'true', now]
      );
    });

    console.log('✅ Database seeded successfully');
    console.log('   - 20 clubs');
    console.log('   - 5 players');
    console.log('   - 24 career entries');
    console.log('   - 12 transfers');
    console.log('   - 1 question pack');
    console.log('   - 27 questions');
  } catch (error) {
    console.error('❌ Failed to seed database:', error);
    throw new Error(
      `Database seeding failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}
