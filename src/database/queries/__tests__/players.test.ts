/**
 * Player query tests
 */

jest.mock('expo-sqlite');

import * as SQLite from 'expo-sqlite';
import { initializeDatabase } from '../../schema';
import { seedDatabase } from '../../seed';
import { closeDatabaseAsync } from '../../connection';
import {
  getPlayerById,
  getPlayerByName,
  getPlayerWithFullCareer,
  getAllPlayers,
} from '../players';

describe('Player Queries', () => {
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

  describe('getPlayerById', () => {
    it('should return player when ID exists', async () => {
      const player = await getPlayerById(1);

      expect(player).not.toBeNull();
      expect(player?.id).toBe(1);
      expect(player?.name).toBe('Cristiano Ronaldo');
      expect(player?.nationality).toBe('Portugal');
      expect(player?.position).toBe('Forward');
    });

    it('should return null when ID does not exist', async () => {
      const player = await getPlayerById(99999);
      expect(player).toBeNull();
    });

    it('should include aliases as JSON string', async () => {
      const player = await getPlayerById(1);

      expect(player?.aliases).toBeTruthy();
      const aliases = JSON.parse(player!.aliases!);
      expect(aliases).toContain('CR7');
      expect(aliases).toContain('Ronaldo');
    });
  });

  describe('getPlayerByName', () => {
    it('should find player by exact name', async () => {
      const player = await getPlayerByName('Cristiano Ronaldo');

      expect(player).not.toBeNull();
      expect(player?.id).toBe(1);
      expect(player?.name).toBe('Cristiano Ronaldo');
    });

    it('should be case-insensitive', async () => {
      const player1 = await getPlayerByName('cristiano ronaldo');
      const player2 = await getPlayerByName('CRISTIANO RONALDO');
      const player3 = await getPlayerByName('CrIsTiAnO RoNaLdO');

      expect(player1).not.toBeNull();
      expect(player2).not.toBeNull();
      expect(player3).not.toBeNull();

      expect(player1?.id).toBe(1);
      expect(player2?.id).toBe(1);
      expect(player3?.id).toBe(1);
    });

    it('should find player by alias', async () => {
      const player = await getPlayerByName('CR7');

      expect(player).not.toBeNull();
      expect(player?.id).toBe(1);
      expect(player?.name).toBe('Cristiano Ronaldo');
    });

    it('should find Messi by alias "Leo"', async () => {
      const player = await getPlayerByName('Leo');

      expect(player).not.toBeNull();
      expect(player?.name).toBe('Lionel Messi');
    });

    it('should return null when name does not exist', async () => {
      const player = await getPlayerByName('NonExistent Player');
      expect(player).toBeNull();
    });
  });

  describe('getPlayerWithFullCareer', () => {
    it('should return player with career history', async () => {
      const player = await getPlayerWithFullCareer(1);

      expect(player).not.toBeNull();
      expect(player?.id).toBe(1);
      expect(player?.name).toBe('Cristiano Ronaldo');
      expect(player?.careers).toBeDefined();
      expect(player?.careers.length).toBeGreaterThan(0);
    });

    it('should include club details in each career entry', async () => {
      const player = await getPlayerWithFullCareer(1);

      expect(player?.careers).toBeDefined();
      expect(player!.careers.length).toBeGreaterThan(0);

      const firstCareer = player!.careers[0];
      expect(firstCareer.club).toBeDefined();
      expect(firstCareer.club.name).toBeDefined();
      expect(firstCareer.club.country).toBeDefined();
      expect(firstCareer.start_year).toBeDefined();
    });

    it('should order careers by display_order', async () => {
      const player = await getPlayerWithFullCareer(1);

      expect(player?.careers).toBeDefined();

      const orders = player!.careers.map((c) => c.display_order);

      // Should be in ascending order
      for (let i = 1; i < orders.length; i++) {
        expect(orders[i - 1]).toBeLessThanOrEqual(orders[i]);
      }
    });

    it('should have correct career path for Ronaldo', async () => {
      const player = await getPlayerWithFullCareer(1);

      expect(player).not.toBeNull();
      expect(player!.careers.length).toBe(6);

      const clubNames = player!.careers.map((c) => c.club.name);
      expect(clubNames[0]).toBe('Sporting CP');
      expect(clubNames[1]).toBe('Manchester United');
      expect(clubNames[2]).toBe('Real Madrid');
      expect(clubNames[3]).toBe('Juventus');
      expect(clubNames[4]).toBe('Manchester United');
      expect(clubNames[5]).toBe('Al Nassr');
    });

    it('should have correct career path for Messi', async () => {
      const player = await getPlayerWithFullCareer(2);

      expect(player).not.toBeNull();
      expect(player!.careers.length).toBe(3);

      const clubNames = player!.careers.map((c) => c.club.name);
      expect(clubNames[0]).toBe('Barcelona');
      expect(clubNames[1]).toBe('Paris Saint-Germain');
      expect(clubNames[2]).toBe('Inter Miami');
    });

    it('should handle null end_year for current clubs', async () => {
      const player = await getPlayerWithFullCareer(1);

      // Last career should have null end_year (Al Nassr - current club)
      const lastCareer = player!.careers[player!.careers.length - 1];
      expect(lastCareer.end_year).toBeNull();
      expect(lastCareer.club.name).toBe('Al Nassr');
    });

    it('should return null when player does not exist', async () => {
      const player = await getPlayerWithFullCareer(99999);
      expect(player).toBeNull();
    });
  });

  describe('getAllPlayers', () => {
    it('should return all players', async () => {
      const players = await getAllPlayers();

      // We seeded 5 players
      expect(players.length).toBe(5);
    });

    it('should return players sorted by name', async () => {
      const players = await getAllPlayers();

      // Should be alphabetically sorted
      for (let i = 1; i < players.length; i++) {
        expect(
          players[i - 1].name.localeCompare(players[i].name)
        ).toBeLessThanOrEqual(0);
      }
    });

    it('should include expected players', async () => {
      const players = await getAllPlayers();
      const playerNames = players.map((p) => p.name);

      expect(playerNames).toContain('Cristiano Ronaldo');
      expect(playerNames).toContain('Lionel Messi');
      expect(playerNames).toContain('Zlatan Ibrahimovic');
      expect(playerNames).toContain('David Beckham');
      expect(playerNames).toContain('Thierry Henry');
    });
  });
});
