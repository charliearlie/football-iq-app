/**
 * Answer matching utility tests
 */

import {
  normalizePlayerName,
  extractLastName,
  isValidLastNameMatch,
  validatePlayerGuess,
} from '../answerMatching';
import { Player } from '../../types/database';

describe('normalizePlayerName', () => {
  it('should convert to lowercase', () => {
    expect(normalizePlayerName('RONALDO')).toBe('ronaldo');
    expect(normalizePlayerName('MESSI')).toBe('messi');
  });

  it('should trim whitespace', () => {
    expect(normalizePlayerName('  Ronaldo  ')).toBe('ronaldo');
    expect(normalizePlayerName('\tMessi\n')).toBe('messi');
  });

  it('should remove special characters except spaces and hyphens', () => {
    expect(normalizePlayerName("O'Neil")).toBe('oneil');
    expect(normalizePlayerName('Müller.')).toBe('muller');
    expect(normalizePlayerName('São Paulo')).toBe('sao paulo');
  });

  it('should preserve hyphens', () => {
    expect(normalizePlayerName('Jean-Pierre')).toBe('jean-pierre');
    expect(normalizePlayerName('Dieng-Diop')).toBe('dieng-diop');
  });

  it('should normalize accents', () => {
    expect(normalizePlayerName('Müller')).toBe('muller');
    expect(normalizePlayerName('Özil')).toBe('ozil');
    expect(normalizePlayerName('Sánchez')).toBe('sanchez');
    expect(normalizePlayerName('José')).toBe('jose');
    expect(normalizePlayerName('Ñíguez')).toBe('niguez');
    expect(normalizePlayerName('Çağlar')).toBe('caglar');
  });

  it('should preserve spaces between names', () => {
    expect(normalizePlayerName('Cristiano Ronaldo')).toBe('cristiano ronaldo');
    expect(normalizePlayerName('Lionel Andres Messi')).toBe(
      'lionel andres messi'
    );
  });

  it('should handle empty strings', () => {
    expect(normalizePlayerName('')).toBe('');
    expect(normalizePlayerName('   ')).toBe('');
  });

  it('should handle multiple consecutive spaces', () => {
    expect(normalizePlayerName('Cristiano    Ronaldo')).toBe(
      'cristiano ronaldo'
    );
  });
});

describe('extractLastName', () => {
  it('should extract last name from two-word name', () => {
    expect(extractLastName('Cristiano Ronaldo')).toBe('Ronaldo');
    expect(extractLastName('Lionel Messi')).toBe('Messi');
  });

  it('should extract last name from multi-word name', () => {
    expect(extractLastName('Lionel Andres Messi')).toBe('Messi');
    expect(extractLastName('Cristiano Ronaldo dos Santos')).toBe('Santos');
  });

  it('should handle single name', () => {
    expect(extractLastName('Ronaldinho')).toBe('Ronaldinho');
    expect(extractLastName('Pelé')).toBe('Pelé');
  });

  it('should handle names with hyphens', () => {
    expect(extractLastName('Jean-Claude Van Damme')).toBe('Damme');
  });

  it('should handle empty strings', () => {
    expect(extractLastName('')).toBe('');
  });

  it('should trim whitespace before extracting', () => {
    expect(extractLastName('  Cristiano Ronaldo  ')).toBe('Ronaldo');
  });
});

describe('isValidLastNameMatch', () => {
  it('should accept last names with more than 3 characters', () => {
    expect(isValidLastNameMatch('Ronaldo')).toBe(true);
    expect(isValidLastNameMatch('Messi')).toBe(true);
    expect(isValidLastNameMatch('Beckham')).toBe(true);
  });

  it('should reject last names with 3 or fewer characters', () => {
    expect(isValidLastNameMatch('Li')).toBe(false);
    expect(isValidLastNameMatch('Na')).toBe(false);
    expect(isValidLastNameMatch('Eto')).toBe(false);
  });

  it('should handle empty strings', () => {
    expect(isValidLastNameMatch('')).toBe(false);
  });

  it('should trim whitespace before checking length', () => {
    expect(isValidLastNameMatch('  Li  ')).toBe(false);
    expect(isValidLastNameMatch('  Messi  ')).toBe(true);
  });
});

describe('validatePlayerGuess', () => {
  const mockPlayer: Player = {
    id: 1,
    name: 'Cristiano Ronaldo',
    full_name: 'Cristiano Ronaldo dos Santos Aveiro',
    nationality: 'Portugal',
    position: 'Forward',
    aliases: JSON.stringify(['CR7', 'Ronaldo']),
    date_of_birth: '1985-02-05',
    server_updated_at: null,
    local_updated_at: null,
    is_synced: 1,
  };

  describe('exact name matching', () => {
    it('should match exact name', () => {
      const result = validatePlayerGuess('Cristiano Ronaldo', mockPlayer);
      expect(result.isCorrect).toBe(true);
      expect(result.matchType).toBe('exact');
      expect(result.acceptedAnswer).toBe('Cristiano Ronaldo');
    });

    it('should match with different case', () => {
      const result1 = validatePlayerGuess('cristiano ronaldo', mockPlayer);
      const result2 = validatePlayerGuess('CRISTIANO RONALDO', mockPlayer);
      const result3 = validatePlayerGuess('CrIsTiAnO RoNaLdO', mockPlayer);

      expect(result1.isCorrect).toBe(true);
      expect(result2.isCorrect).toBe(true);
      expect(result3.isCorrect).toBe(true);
    });

    it('should match with extra whitespace', () => {
      const result = validatePlayerGuess('  Cristiano Ronaldo  ', mockPlayer);
      expect(result.isCorrect).toBe(true);
      expect(result.matchType).toBe('exact');
    });
  });

  describe('full name matching', () => {
    it('should match full name', () => {
      const result = validatePlayerGuess(
        'Cristiano Ronaldo dos Santos Aveiro',
        mockPlayer
      );
      expect(result.isCorrect).toBe(true);
      expect(result.matchType).toBe('full_name');
      expect(result.acceptedAnswer).toBe(
        'Cristiano Ronaldo dos Santos Aveiro'
      );
    });

    it('should match full name with different case', () => {
      const result = validatePlayerGuess(
        'cristiano ronaldo dos santos aveiro',
        mockPlayer
      );
      expect(result.isCorrect).toBe(true);
      expect(result.matchType).toBe('full_name');
    });
  });

  describe('alias matching', () => {
    it('should match alias', () => {
      const result = validatePlayerGuess('CR7', mockPlayer);
      expect(result.isCorrect).toBe(true);
      expect(result.matchType).toBe('alias');
      expect(result.acceptedAnswer).toBe('CR7');
    });

    it('should match alias with different case', () => {
      const result = validatePlayerGuess('cr7', mockPlayer);
      expect(result.isCorrect).toBe(true);
      expect(result.matchType).toBe('alias');
    });

    it('should match second alias', () => {
      const result = validatePlayerGuess('Ronaldo', mockPlayer);
      expect(result.isCorrect).toBe(true);
      expect(result.matchType).toBe('alias');
    });
  });

  describe('last name matching', () => {
    it('should match valid last name', () => {
      const player: Player = {
        ...mockPlayer,
        name: 'Zlatan Ibrahimovic',
        aliases: null,
      };
      const result = validatePlayerGuess('Ibrahimovic', player);
      expect(result.isCorrect).toBe(true);
      expect(result.matchType).toBe('last_name');
      expect(result.acceptedAnswer).toBe('Ibrahimovic');
    });

    it('should reject short last names', () => {
      const player: Player = {
        ...mockPlayer,
        name: 'Li Na',
        aliases: null,
      };
      const result = validatePlayerGuess('Na', player);
      expect(result.isCorrect).toBe(false);
    });

    it('should match last name with different case', () => {
      const player: Player = {
        ...mockPlayer,
        name: 'Zlatan Ibrahimovic',
        aliases: null,
      };
      const result = validatePlayerGuess('ibrahimovic', player);
      expect(result.isCorrect).toBe(true);
      expect(result.matchType).toBe('last_name');
    });

    it('should not match last name if it matches alias first', () => {
      // Ronaldo is in aliases, so it should match as alias, not last_name
      const result = validatePlayerGuess('Ronaldo', mockPlayer);
      expect(result.isCorrect).toBe(true);
      expect(result.matchType).toBe('alias');
    });
  });

  describe('accent normalization', () => {
    it('should match names with accents', () => {
      const player: Player = {
        ...mockPlayer,
        name: 'Mesut Özil',
        aliases: null,
      };

      const result1 = validatePlayerGuess('Mesut Ozil', player);
      const result2 = validatePlayerGuess('Mesut Özil', player);

      expect(result1.isCorrect).toBe(true);
      expect(result2.isCorrect).toBe(true);
    });

    it('should match accented aliases', () => {
      const player: Player = {
        ...mockPlayer,
        name: 'Jose Gimenez',
        aliases: JSON.stringify(['José', 'Giménez']),
      };

      const result1 = validatePlayerGuess('Jose', player);
      const result2 = validatePlayerGuess('José', player);

      expect(result1.isCorrect).toBe(true);
      expect(result2.isCorrect).toBe(true);
    });
  });

  describe('rejection cases', () => {
    it('should reject incorrect name', () => {
      const result = validatePlayerGuess('Lionel Messi', mockPlayer);
      expect(result.isCorrect).toBe(false);
      expect(result.matchType).toBeUndefined();
      expect(result.acceptedAnswer).toBeUndefined();
    });

    it('should reject partial matches', () => {
      const result = validatePlayerGuess('Cristiano', mockPlayer);
      expect(result.isCorrect).toBe(false);
    });

    it('should reject empty string', () => {
      const result = validatePlayerGuess('', mockPlayer);
      expect(result.isCorrect).toBe(false);
    });

    it('should reject whitespace only', () => {
      const result = validatePlayerGuess('   ', mockPlayer);
      expect(result.isCorrect).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('should handle player with null aliases', () => {
      const player: Player = { ...mockPlayer, aliases: null };
      const result = validatePlayerGuess('Cristiano Ronaldo', player);
      expect(result.isCorrect).toBe(true);
    });

    it('should handle player with empty aliases array', () => {
      const player: Player = { ...mockPlayer, aliases: JSON.stringify([]) };
      const result = validatePlayerGuess('Cristiano Ronaldo', player);
      expect(result.isCorrect).toBe(true);
    });

    it('should handle player with null full_name', () => {
      const player: Player = { ...mockPlayer, full_name: null };
      const result = validatePlayerGuess('Cristiano Ronaldo', player);
      expect(result.isCorrect).toBe(true);
    });

    it('should handle single-word player names', () => {
      const player: Player = {
        ...mockPlayer,
        name: 'Ronaldinho',
        full_name: null,
        aliases: null,
      };
      const result = validatePlayerGuess('Ronaldinho', player);
      expect(result.isCorrect).toBe(true);
      expect(result.matchType).toBe('exact');
    });
  });
});
