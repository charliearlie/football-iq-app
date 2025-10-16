/**
 * Scoring utility tests
 */

import {
  calculateCareerPathScore,
  calculateCareerPathFullScore,
  calculateTransferScore,
  calculateAccuracyRate,
  calculateStreak,
} from '../scoring';

describe('calculateCareerPathScore', () => {
  describe('base points calculation', () => {
    it('should award 3 points for first 20% with no wrong guesses', () => {
      const result = calculateCareerPathScore(10, 2, 0);
      expect(result.finalScore).toBe(3);
      expect(result.basePoints).toBe(3);
      expect(result.penalties).toBe(0);
      expect(result.breakdown).toContain('3 base points');
    });

    it('should award 3 points at exactly 20%', () => {
      const result = calculateCareerPathScore(5, 1, 0);
      expect(result.finalScore).toBe(3);
      expect(result.basePoints).toBe(3);
    });

    it('should award 2 points for first 50%', () => {
      const result = calculateCareerPathScore(10, 5, 0);
      expect(result.finalScore).toBe(2);
      expect(result.basePoints).toBe(2);
      expect(result.breakdown).toContain('2 base points');
    });

    it('should award 2 points at exactly 50%', () => {
      const result = calculateCareerPathScore(4, 2, 0);
      expect(result.finalScore).toBe(2);
      expect(result.basePoints).toBe(2);
    });

    it('should award 1 point after 50%', () => {
      const result = calculateCareerPathScore(10, 6, 0);
      expect(result.finalScore).toBe(1);
      expect(result.basePoints).toBe(1);
      expect(result.breakdown).toContain('1 base point');
    });

    it('should award 1 point at last club', () => {
      const result = calculateCareerPathScore(10, 10, 0);
      expect(result.finalScore).toBe(1);
      expect(result.basePoints).toBe(1);
    });
  });

  describe('penalty calculation', () => {
    it('should subtract wrong guess penalties', () => {
      const result = calculateCareerPathScore(10, 2, 2);
      expect(result.finalScore).toBe(1); // 3 - 2 = 1
      expect(result.penalties).toBe(-2);
      expect(result.breakdown).toContain('2 wrong guess');
    });

    it('should handle multiple wrong guesses', () => {
      const result = calculateCareerPathScore(10, 5, 1);
      expect(result.finalScore).toBe(1); // 2 - 1 = 1
      expect(result.penalties).toBe(-1);
    });

    it('should handle zero wrong guesses', () => {
      const result = calculateCareerPathScore(10, 2, 0);
      expect(result.penalties).toBe(0);
      expect(result.breakdown).toContain('0 penalties');
    });
  });

  describe('minimum score enforcement', () => {
    it('should never go below 1 point for correct answer', () => {
      const result = calculateCareerPathScore(10, 2, 5);
      expect(result.finalScore).toBe(1); // 3 - 5 would be -2, but min is 1
      expect(result.basePoints).toBe(3);
      expect(result.penalties).toBe(-5);
    });

    it('should enforce minimum at exactly basePoints + 1 penalties', () => {
      const result = calculateCareerPathScore(10, 2, 3);
      expect(result.finalScore).toBe(1); // 3 - 3 would be 0, but min is 1
    });

    it('should enforce minimum when penalties exceed base points', () => {
      const result = calculateCareerPathScore(10, 6, 10);
      expect(result.finalScore).toBe(1); // 1 - 10 would be -9, but min is 1
    });
  });

  describe('edge cases', () => {
    it('should handle 1 club career correctly', () => {
      const result = calculateCareerPathScore(1, 1, 0);
      expect(result.finalScore).toBe(3); // 100% is within first 20%
      expect(result.basePoints).toBe(3);
    });

    it('should handle 2 club career at 50%', () => {
      const result = calculateCareerPathScore(2, 1, 0);
      expect(result.finalScore).toBe(2); // 50% exactly
      expect(result.basePoints).toBe(2);
    });

    it('should handle 2 club career at 100%', () => {
      const result = calculateCareerPathScore(2, 2, 0);
      expect(result.finalScore).toBe(1); // 100% is after 50%
      expect(result.basePoints).toBe(1);
    });

    it('should handle long career (10+ clubs)', () => {
      const result = calculateCareerPathScore(15, 3, 0);
      expect(result.finalScore).toBe(3); // 20% of 15 is 3
      expect(result.basePoints).toBe(3);
    });

    it('should handle first club of long career', () => {
      const result = calculateCareerPathScore(20, 1, 0);
      expect(result.finalScore).toBe(3); // First club is always ≤20%
      expect(result.basePoints).toBe(3);
    });
  });

  describe('breakdown string', () => {
    it('should include base points and penalties', () => {
      const result = calculateCareerPathScore(10, 2, 1);
      expect(result.breakdown).toContain('3 base points');
      expect(result.breakdown).toContain('1 wrong guess');
      expect(result.breakdown).toContain('2 points');
    });

    it('should use singular for 1 wrong guess', () => {
      const result = calculateCareerPathScore(10, 2, 1);
      expect(result.breakdown).toContain('1 wrong guess');
    });

    it('should use plural for multiple wrong guesses', () => {
      const result = calculateCareerPathScore(10, 2, 3);
      expect(result.breakdown).toContain('3 wrong guesses');
    });

    it('should mention minimum when enforced', () => {
      const result = calculateCareerPathScore(10, 2, 5);
      expect(result.breakdown).toContain('minimum');
    });
  });
});

describe('calculateCareerPathFullScore', () => {
  it('should return 1 point for correct answer', () => {
    const result = calculateCareerPathFullScore(true);
    expect(result.finalScore).toBe(1);
    expect(result.basePoints).toBe(1);
    expect(result.penalties).toBe(0);
  });

  it('should return 0 points for incorrect answer', () => {
    const result = calculateCareerPathFullScore(false);
    expect(result.finalScore).toBe(0);
    expect(result.basePoints).toBe(0);
    expect(result.penalties).toBe(0);
  });

  it('should include breakdown for correct answer', () => {
    const result = calculateCareerPathFullScore(true);
    expect(result.breakdown).toContain('1 point');
    expect(result.breakdown).toContain('correct');
  });

  it('should include breakdown for incorrect answer', () => {
    const result = calculateCareerPathFullScore(false);
    expect(result.breakdown).toContain('0 points');
    expect(result.breakdown).toContain('incorrect');
  });
});

describe('calculateTransferScore', () => {
  it('should award 3 points with no hints', () => {
    const result = calculateTransferScore({
      position: false,
      nationality: false,
    });
    expect(result.finalScore).toBe(3);
    expect(result.basePoints).toBe(3);
    expect(result.penalties).toBe(0);
  });

  it('should award 2 points with position revealed', () => {
    const result = calculateTransferScore({
      position: true,
      nationality: false,
    });
    expect(result.finalScore).toBe(2);
    expect(result.basePoints).toBe(2);
  });

  it('should award 1 point with nationality revealed only', () => {
    const result = calculateTransferScore({
      position: false,
      nationality: true,
    });
    expect(result.finalScore).toBe(2);
    expect(result.basePoints).toBe(2);
  });

  it('should award 1 point with both hints revealed', () => {
    const result = calculateTransferScore({
      position: true,
      nationality: true,
    });
    expect(result.finalScore).toBe(1);
    expect(result.basePoints).toBe(1);
  });

  describe('breakdown string', () => {
    it('should describe no hints scenario', () => {
      const result = calculateTransferScore({
        position: false,
        nationality: false,
      });
      expect(result.breakdown).toContain('3 points');
      expect(result.breakdown).toContain('no hints');
    });

    it('should describe position revealed', () => {
      const result = calculateTransferScore({
        position: true,
        nationality: false,
      });
      expect(result.breakdown).toContain('2 points');
      expect(result.breakdown).toContain('position');
    });

    it('should describe both hints revealed', () => {
      const result = calculateTransferScore({
        position: true,
        nationality: true,
      });
      expect(result.breakdown).toContain('1 point');
      expect(result.breakdown).toContain('position');
      expect(result.breakdown).toContain('nationality');
    });
  });
});

describe('calculateAccuracyRate', () => {
  it('should return 100 for first correct answer', () => {
    expect(calculateAccuracyRate(0, 0, true)).toBe(100);
  });

  it('should return 0 for first incorrect answer', () => {
    expect(calculateAccuracyRate(0, 0, false)).toBe(0);
  });

  it('should calculate 50% for 1 correct out of 2', () => {
    expect(calculateAccuracyRate(1, 1, false)).toBe(50);
  });

  it('should calculate 66.67% for 2 correct out of 3', () => {
    expect(calculateAccuracyRate(1, 2, true)).toBeCloseTo(66.67, 1);
  });

  it('should calculate 75% for 3 correct out of 4', () => {
    expect(calculateAccuracyRate(3, 3, false)).toBe(75);
  });

  it('should maintain 100% accuracy', () => {
    expect(calculateAccuracyRate(5, 5, true)).toBe(100);
  });

  it('should handle zero previous questions with correct answer', () => {
    expect(calculateAccuracyRate(0, 0, true)).toBe(100);
  });

  it('should round to 2 decimal places', () => {
    const result = calculateAccuracyRate(2, 3, true);
    // 3 correct out of 4 total = 75%
    expect(result).toBe(75);
  });

  it('should handle large numbers', () => {
    const result = calculateAccuracyRate(99, 100, true);
    // 100 correct out of 101 total
    expect(result).toBeCloseTo(99.01, 1);
  });
});

describe('calculateStreak', () => {
  it('should increment streak on correct answer', () => {
    expect(calculateStreak(5, true)).toBe(6);
  });

  it('should reset streak to 0 on wrong answer', () => {
    expect(calculateStreak(5, false)).toBe(0);
  });

  it('should start at 1 for first correct answer', () => {
    expect(calculateStreak(0, true)).toBe(1);
  });

  it('should maintain 0 for consecutive wrong answers', () => {
    expect(calculateStreak(0, false)).toBe(0);
  });

  it('should handle long streaks', () => {
    expect(calculateStreak(99, true)).toBe(100);
  });

  it('should always reset to 0 on wrong answer regardless of streak', () => {
    expect(calculateStreak(100, false)).toBe(0);
  });
});
