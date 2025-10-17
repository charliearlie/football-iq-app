/**
 * Game state utility tests
 */

import {
  isGameOver,
  getPotentialScore,
  formatClubDisplay,
  formatTransferDisplay,
  getDifficultyColor,
} from '../gameState';
import {
  CareerWithClub,
  TransferWithDetails,
  Club,
  Player,
} from '../../types/database';

describe('isGameOver', () => {
  it('should return false when wrong guesses below max', () => {
    expect(isGameOver(0, 5)).toBe(false);
    expect(isGameOver(3, 5)).toBe(false);
    expect(isGameOver(4, 5)).toBe(false);
  });

  it('should return true when wrong guesses equal max', () => {
    expect(isGameOver(5, 5)).toBe(true);
  });

  it('should return true when wrong guesses exceed max', () => {
    expect(isGameOver(6, 5)).toBe(true);
    expect(isGameOver(10, 5)).toBe(true);
  });

  it('should handle edge case of 0 max guesses', () => {
    expect(isGameOver(0, 0)).toBe(true);
    expect(isGameOver(1, 0)).toBe(true);
  });

  it('should handle edge case of very high max', () => {
    expect(isGameOver(99, 100)).toBe(false);
    expect(isGameOver(100, 100)).toBe(true);
  });
});

describe('getPotentialScore', () => {
  describe('career_path_progressive mode', () => {
    it('should calculate potential score at 20% with no wrong guesses', () => {
      const score = getPotentialScore('career_path_progressive', {
        totalClubs: 10,
        clubsRevealed: 2,
        wrongGuesses: 0,
      });
      expect(score).toBe(3);
    });

    it('should calculate potential score at 50% with wrong guesses', () => {
      const score = getPotentialScore('career_path_progressive', {
        totalClubs: 10,
        clubsRevealed: 5,
        wrongGuesses: 1,
      });
      expect(score).toBe(1); // 2 base - 1 penalty = 1
    });

    it('should return minimum score when penalties exceed base', () => {
      const score = getPotentialScore('career_path_progressive', {
        totalClubs: 10,
        clubsRevealed: 6,
        wrongGuesses: 5,
      });
      expect(score).toBe(1); // 1 base - 5 penalties = 1 (minimum)
    });

    it('should handle 1 club career', () => {
      const score = getPotentialScore('career_path_progressive', {
        totalClubs: 1,
        clubsRevealed: 1,
        wrongGuesses: 0,
      });
      expect(score).toBe(3);
    });
  });

  describe('career_path_full mode', () => {
    it('should always return 1 point', () => {
      const score = getPotentialScore('career_path_full', {});
      expect(score).toBe(1);
    });
  });

  describe('transfer mode', () => {
    it('should return 3 points with no hints', () => {
      const score = getPotentialScore('transfer', {
        hintsRevealed: { position: false, nationality: false },
      });
      expect(score).toBe(3);
    });

    it('should return 2 points with position revealed', () => {
      const score = getPotentialScore('transfer', {
        hintsRevealed: { position: true, nationality: false },
      });
      expect(score).toBe(2);
    });

    it('should return 1 point with both hints revealed', () => {
      const score = getPotentialScore('transfer', {
        hintsRevealed: { position: true, nationality: true },
      });
      expect(score).toBe(1);
    });
  });
});

describe('formatClubDisplay', () => {
  const mockClub: Club = {
    id: 1,
    name: 'Manchester United',
    country: 'England',
    league: 'Premier League',
    badge_url: null,
    server_updated_at: null,
    local_updated_at: null,
    is_synced: 1,
  };

  it('should format club with start and end year', () => {
    const career: CareerWithClub = {
      id: 1,
      player_id: 1,
      club_id: 1,
      start_year: 2003,
      end_year: 2009,
      display_order: 1,
      appearances: null,
      goals: null,
      club: mockClub,
      server_updated_at: null,
      local_updated_at: null,
      is_synced: 1,
    };

    expect(formatClubDisplay(career)).toBe('Manchester United (2003-2009)');
  });

  it('should format club with null end_year as Present', () => {
    const career: CareerWithClub = {
      id: 1,
      player_id: 1,
      club_id: 1,
      start_year: 2023,
      end_year: null,
      display_order: 1,
      appearances: null,
      goals: null,
      club: mockClub,
      server_updated_at: null,
      local_updated_at: null,
      is_synced: 1,
    };

    expect(formatClubDisplay(career)).toBe('Manchester United (2023-Present)');
  });

  it('should handle single year stint', () => {
    const career: CareerWithClub = {
      id: 1,
      player_id: 1,
      club_id: 1,
      start_year: 2020,
      end_year: 2020,
      display_order: 1,
      appearances: null,
      goals: null,
      club: mockClub,
      server_updated_at: null,
      local_updated_at: null,
      is_synced: 1,
    };

    expect(formatClubDisplay(career)).toBe('Manchester United (2020-2020)');
  });

  it('should handle long club names', () => {
    const career: CareerWithClub = {
      id: 1,
      player_id: 1,
      club_id: 1,
      start_year: 2010,
      end_year: 2015,
      display_order: 1,
      appearances: null,
      goals: null,
      club: {
        ...mockClub,
        name: 'Borussia Mönchengladbach',
      },
      server_updated_at: null,
      local_updated_at: null,
      is_synced: 1,
    };

    expect(formatClubDisplay(career)).toBe(
      'Borussia Mönchengladbach (2010-2015)'
    );
  });
});

describe('formatTransferDisplay', () => {
  const mockPlayer: Player = {
    id: 1,
    name: 'Cristiano Ronaldo',
    full_name: null,
    nationality: 'Portugal',
    position: 'Forward',
    aliases: null,
    date_of_birth: null,
    server_updated_at: null,
    local_updated_at: null,
    is_synced: 1,
  };

  const mockFromClub: Club = {
    id: 1,
    name: 'Manchester United',
    country: 'England',
    league: 'Premier League',
    badge_url: null,
    server_updated_at: null,
    local_updated_at: null,
    is_synced: 1,
  };

  const mockToClub: Club = {
    id: 2,
    name: 'Real Madrid',
    country: 'Spain',
    league: 'La Liga',
    badge_url: null,
    server_updated_at: null,
    local_updated_at: null,
    is_synced: 1,
  };

  it('should format transfer with arrow and year', () => {
    const transfer: TransferWithDetails = {
      id: 1,
      player_id: 1,
      from_club_id: 1,
      to_club_id: 2,
      transfer_year: 2009,
      transfer_fee: 80.0,
      player: mockPlayer,
      fromClub: mockFromClub,
      toClub: mockToClub,
      server_updated_at: null,
      local_updated_at: null,
      is_synced: 1,
    };

    expect(formatTransferDisplay(transfer)).toBe(
      'Manchester United → Real Madrid (2009)'
    );
  });

  it('should handle clubs with long names', () => {
    const transfer: TransferWithDetails = {
      id: 1,
      player_id: 1,
      from_club_id: 1,
      to_club_id: 2,
      transfer_year: 2015,
      transfer_fee: null,
      player: mockPlayer,
      fromClub: { ...mockFromClub, name: 'Borussia Dortmund' },
      toClub: { ...mockToClub, name: 'Paris Saint-Germain' },
      server_updated_at: null,
      local_updated_at: null,
      is_synced: 1,
    };

    expect(formatTransferDisplay(transfer)).toBe(
      'Borussia Dortmund → Paris Saint-Germain (2015)'
    );
  });

  it('should format recent transfers', () => {
    const transfer: TransferWithDetails = {
      id: 1,
      player_id: 1,
      from_club_id: 1,
      to_club_id: 2,
      transfer_year: 2024,
      transfer_fee: 100.0,
      player: mockPlayer,
      fromClub: mockFromClub,
      toClub: mockToClub,
      server_updated_at: null,
      local_updated_at: null,
      is_synced: 1,
    };

    expect(formatTransferDisplay(transfer)).toBe(
      'Manchester United → Real Madrid (2024)'
    );
  });
});

describe('getDifficultyColor', () => {
  it('should return green for easy difficulty', () => {
    expect(getDifficultyColor('easy')).toBe('#10b981');
  });

  it('should return orange for medium difficulty', () => {
    expect(getDifficultyColor('medium')).toBe('#f59e0b');
  });

  it('should return red for hard difficulty', () => {
    expect(getDifficultyColor('hard')).toBe('#ef4444');
  });

  it('should be case-insensitive', () => {
    expect(getDifficultyColor('EASY')).toBe('#10b981');
    expect(getDifficultyColor('Medium')).toBe('#f59e0b');
    expect(getDifficultyColor('HARD')).toBe('#ef4444');
  });

  it('should return default color for unknown difficulty', () => {
    expect(getDifficultyColor('unknown')).toBe('#6b7280'); // gray-500
    expect(getDifficultyColor('')).toBe('#6b7280');
  });

  it('should handle null/undefined input', () => {
    expect(getDifficultyColor(null as any)).toBe('#6b7280');
    expect(getDifficultyColor(undefined as any)).toBe('#6b7280');
  });
});
