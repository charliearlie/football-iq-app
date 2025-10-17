/**
 * Scoring utilities
 *
 * This module provides pure functions for calculating scores across different
 * game modes, managing accuracy rates, and tracking streaks.
 *
 * CURRENT IMPLEMENTATION:
 * - Career Path Progressive: Simple 1 point for correct answer
 * - Career Path Full: Simple 1 point for correct answer
 * - Transfer: Points decrease as hints are revealed (3 → 2 → 1)
 * - Accuracy rate: Percentage of correct answers
 * - Streak tracking: Consecutive correct answers
 *
 * FUTURE DESIRED SCORING SYSTEM (Not Implemented):
 * Career Path Progressive should reward based on how quickly the player guesses:
 * - First 25% of clubs revealed: 3 points
 * - Next 25% (26-50% total): 2 points
 * - Last 50% (51-100%): 1 point
 * - Penalties: -1 point per wrong guess (minimum 1 point if correct)
 *
 * Example for 8-club career:
 * - Clubs 1-2 (≤25%): 3 points
 * - Clubs 3-4 (≤50%): 2 points
 * - Clubs 5-8 (>50%): 1 point
 *
 * This system needs careful implementation to ensure percentage calculations
 * work correctly across all career lengths and provide clear feedback to users.
 */

import { ScoreBreakdown } from '../types/game';
import { GAME_CONSTANTS } from '../constants/game';

/**
 * Calculate score for Career Path Progressive mode
 *
 * TEMPORARY SIMPLE SCORING: Always 1 point for correct answer
 *
 * @param totalClubs - Total number of clubs in player's career (unused for now)
 * @param clubsRevealed - Number of clubs shown so far (unused for now)
 * @param wrongGuesses - Number of incorrect guesses made (unused for now)
 * @returns Score breakdown with final score always 1
 */
export function calculateCareerPathScore(
  totalClubs: number,
  clubsRevealed: number,
  wrongGuesses: number
): ScoreBreakdown {
  // Simple scoring: 1 point for correct answer
  const finalScore = 1;

  return {
    basePoints: 1,
    penalties: 0,
    finalScore,
    breakdown: '1 point (correct)',
  };
}

/**
 * Calculate score for Career Path Full mode
 *
 * Simple scoring: 1 point for correct, 0 for incorrect.
 * All clubs are shown at once, no progressive revelation.
 *
 * @param isCorrect - Whether the answer was correct
 * @returns Score breakdown
 *
 * @example
 * calculateCareerPathFullScore(true)
 * // => { basePoints: 1, penalties: 0, finalScore: 1, breakdown: "1 point (correct)" }
 */
export function calculateCareerPathFullScore(
  isCorrect: boolean
): ScoreBreakdown {
  const finalScore = isCorrect
    ? GAME_CONSTANTS.CAREER_PATH_FULL_POINTS.CORRECT
    : GAME_CONSTANTS.CAREER_PATH_FULL_POINTS.INCORRECT;

  const breakdown = isCorrect
    ? '1 point (correct)'
    : '0 points (incorrect)';

  return {
    basePoints: finalScore,
    penalties: 0,
    finalScore,
    breakdown,
  };
}

/**
 * Calculate score for Transfer mode
 *
 * Scoring rules:
 * - No hints revealed: 3 points
 * - Position revealed: 2 points
 * - Nationality revealed (with or without position): 2 points
 * - Both hints revealed: 1 point
 *
 * @param hintsRevealed - Which hints have been shown to the player
 * @returns Score breakdown
 *
 * @example
 * // No hints
 * calculateTransferScore({ position: false, nationality: false })
 * // => { basePoints: 3, penalties: 0, finalScore: 3, breakdown: "3 points (no hints)" }
 *
 * @example
 * // Both hints revealed
 * calculateTransferScore({ position: true, nationality: true })
 * // => { basePoints: 1, penalties: 0, finalScore: 1, breakdown: "1 point (position + nationality revealed)" }
 */
export function calculateTransferScore(hintsRevealed: {
  position: boolean;
  nationality: boolean;
}): ScoreBreakdown {
  let finalScore: number;
  let breakdown: string;

  if (!hintsRevealed.position && !hintsRevealed.nationality) {
    // No hints revealed
    finalScore = GAME_CONSTANTS.TRANSFER_POINTS.NO_HINTS;
    breakdown = '3 points (no hints)';
  } else if (hintsRevealed.position && hintsRevealed.nationality) {
    // Both hints revealed
    finalScore = GAME_CONSTANTS.TRANSFER_POINTS.NATIONALITY_REVEALED;
    breakdown = '1 point (position + nationality revealed)';
  } else {
    // One hint revealed (either position or nationality)
    finalScore = GAME_CONSTANTS.TRANSFER_POINTS.POSITION_REVEALED;
    if (hintsRevealed.position) {
      breakdown = '2 points (position revealed)';
    } else {
      breakdown = '2 points (nationality revealed)';
    }
  }

  return {
    basePoints: finalScore,
    penalties: 0,
    finalScore,
    breakdown,
  };
}

/**
 * Calculate new accuracy rate after answering a question
 *
 * Returns percentage (0-100) rounded to 2 decimal places.
 * Accuracy = (total correct / total answered) * 100
 *
 * @param previousCorrect - Number of correct answers before this question
 * @param previousTotal - Total questions answered before this question
 * @param newlyCorrect - Whether the new question was answered correctly
 * @returns Accuracy percentage (0-100)
 *
 * @example
 * // First question, answered correctly
 * calculateAccuracyRate(0, 0, true) // => 100
 *
 * @example
 * // 5 correct out of 10, now got it wrong
 * calculateAccuracyRate(5, 10, false) // => 45.45
 */
export function calculateAccuracyRate(
  previousCorrect: number,
  previousTotal: number,
  newlyCorrect: boolean
): number {
  const newCorrect = previousCorrect + (newlyCorrect ? 1 : 0);
  const newTotal = previousTotal + 1;

  if (newTotal === 0) {
    return 0;
  }

  const accuracyRate = (newCorrect / newTotal) * 100;
  return Math.round(accuracyRate * 100) / 100; // Round to 2 decimal places
}

/**
 * Calculate new streak after answering a question
 *
 * Increment streak if correct, reset to 0 if wrong.
 *
 * @param currentStreak - Current streak count
 * @param wasCorrect - Whether the answer was correct
 * @returns New streak count
 *
 * @example
 * calculateStreak(5, true) // => 6
 * calculateStreak(5, false) // => 0
 */
export function calculateStreak(
  currentStreak: number,
  wasCorrect: boolean
): number {
  return wasCorrect ? currentStreak + 1 : 0;
}
