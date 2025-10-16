/**
 * Club query tests
 */

jest.mock('expo-sqlite');

import * as SQLite from 'expo-sqlite';
import { initializeDatabase } from '../../schema';
import { seedDatabase } from '../../seed';
import { closeDatabaseAsync } from '../../connection';
import {
  getClubById,
  getClubsByCountry,
  getAllClubs,
  searchClubsByName,
} from '../clubs';

describe('Club Queries', () => {
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

  describe('getClubById', () => {
    it('should return club when ID exists', async () => {
      const club = await getClubById(1);

      expect(club).not.toBeNull();
      expect(club?.id).toBe(1);
      expect(club?.name).toBe('Manchester United');
      expect(club?.country).toBe('England');
      expect(club?.league).toBe('Premier League');
    });

    it('should return null when ID does not exist', async () => {
      const club = await getClubById(99999);
      expect(club).toBeNull();
    });
  });

  describe('getClubsByCountry', () => {
    it('should return clubs from England', async () => {
      const clubs = await getClubsByCountry('England');

      expect(clubs.length).toBeGreaterThan(0);
      expect(clubs.every((c) => c.country === 'England')).toBe(true);
    });

    it('should return clubs from Spain', async () => {
      const clubs = await getClubsByCountry('Spain');

      expect(clubs.length).toBeGreaterThan(0);
      expect(clubs.every((c) => c.country === 'Spain')).toBe(true);

      // Should include Real Madrid, Barcelona, Atletico Madrid
      const clubNames = clubs.map((c) => c.name);
      expect(clubNames).toContain('Real Madrid');
      expect(clubNames).toContain('Barcelona');
    });

    it('should return empty array for country with no clubs', async () => {
      const clubs = await getClubsByCountry('Antarctica');
      expect(clubs).toEqual([]);
    });

    it('should return clubs sorted by name', async () => {
      const clubs = await getClubsByCountry('England');

      // Should be alphabetically sorted
      for (let i = 1; i < clubs.length; i++) {
        expect(clubs[i - 1].name.localeCompare(clubs[i].name)).toBeLessThanOrEqual(
          0
        );
      }
    });
  });

  describe('getAllClubs', () => {
    it('should return all clubs', async () => {
      const clubs = await getAllClubs();

      // We seeded 20 clubs
      expect(clubs.length).toBe(20);
    });

    it('should return clubs sorted by name', async () => {
      const clubs = await getAllClubs();

      // Should be alphabetically sorted
      for (let i = 1; i < clubs.length; i++) {
        expect(clubs[i - 1].name.localeCompare(clubs[i].name)).toBeLessThanOrEqual(
          0
        );
      }
    });

    it('should include expected clubs', async () => {
      const clubs = await getAllClubs();
      const clubNames = clubs.map((c) => c.name);

      expect(clubNames).toContain('Manchester United');
      expect(clubNames).toContain('Real Madrid');
      expect(clubNames).toContain('Barcelona');
      expect(clubNames).toContain('Bayern Munich');
      expect(clubNames).toContain('Juventus');
    });
  });

  describe('searchClubsByName', () => {
    it('should find clubs with partial match', async () => {
      const clubs = await searchClubsByName('Man');

      expect(clubs.length).toBeGreaterThan(0);

      const clubNames = clubs.map((c) => c.name);
      expect(clubNames).toContain('Manchester United');
      expect(clubNames).toContain('Manchester City');
    });

    it('should be case-insensitive', async () => {
      const clubsLower = await searchClubsByName('manchester');
      const clubsUpper = await searchClubsByName('MANCHESTER');
      const clubsMixed = await searchClubsByName('MaNcHeStEr');

      expect(clubsLower.length).toBe(clubsUpper.length);
      expect(clubsLower.length).toBe(clubsMixed.length);
      expect(clubsLower.length).toBeGreaterThan(0);
    });

    it('should find clubs with middle match', async () => {
      const clubs = await searchClubsByName('Milan');

      expect(clubs.length).toBeGreaterThan(0);

      const clubNames = clubs.map((c) => c.name);
      expect(clubNames).toContain('AC Milan');
      expect(clubNames).toContain('Inter Milan');
    });

    it('should return empty array when no matches', async () => {
      const clubs = await searchClubsByName('XYZ123NoMatch');
      expect(clubs).toEqual([]);
    });

    it('should return clubs sorted by name', async () => {
      const clubs = await searchClubsByName('a');

      // Should be alphabetically sorted
      for (let i = 1; i < clubs.length; i++) {
        expect(clubs[i - 1].name.localeCompare(clubs[i].name)).toBeLessThanOrEqual(
          0
        );
      }
    });
  });
});
