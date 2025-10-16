/**
 * Scoring utilities
 *
 * This module provides pure functions for calculating scores across different
 * game modes, managing accuracy rates, and tracking streaks.
 *
 * Key features:
 * - Career Path Progressive: Points decrease as more clubs are revealed
 * - Career Path Full: Simple correct/incorrect scoring
 * - Transfer: Points decrease as hints are revealed
 * - Accuracy rate: Percentage of correct answers
 * - Streak tracking: Consecutive correct answers
 */

import { ScoreBreakdown } from '../types/game';
import { GAME_CONSTANTS } from '../constants/game';

/**
 * Calculate score for Career Path Progressive mode
 *
 * Scoring rules:
 * - First 20% of clubs revealed: 3 base points
 * - First 50% of clubs revealed: 2 base points
 * - After 50% of clubs revealed: 1 base point
 * - Subtract 1 point per wrong guess
 * - Minimum score if correct: 1 point (never 0 or negative)
 *
 * @param totalClubs - Total number of clubs in player's career
 * @param clubsRevealed - Number of clubs shown so far (1-indexed, e.g., 1 = first club)
 * @param wrongGuesses - Number of incorrect guesses made
 * @returns Score breakdown with base points, penalties, and final score
 *
 * @example
 * // Guessed after 2 of 10 clubs shown (20%), no wrong guesses
 * calculateCareerPathScore(10, 2, 0)
 * // => { basePoints: 3, penalties: 0, finalScore: 3, breakdown: "..." }
 *
 * @example
 * // Guessed after 5 of 10 clubs (50%), 1 wrong guess
 * calculateCareerPathScore(10, 5, 1)
 * // => { basePoints: 2, penalties: -1, finalScore: 1, breakdown: "..." }
 */
export function calculateCareerPathScore(
  totalClubs: number,
  clubsRevealed: number,
  wrongGuesses: number
): ScoreBreakdown {
  // Calculate percentage of career revealed
  const percentageRevealed = clubsRevealed / totalClubs;

  // Determine base points based on percentage
  // For 1 club careers, 100% is considered within first 20%
  let basePoints: number;
  if (totalClubs === 1 || percentageRevealed <= 0.2) {
    basePoints = GAME_CONSTANTS.CAREER_PATH_POINTS.FIRST_20_PERCENT;
  } else if (percentageRevealed <= 0.5) {
    basePoints = GAME_CONSTANTS.CAREER_PATH_POINTS.FIRST_50_PERCENT;
  } else {
    basePoints = GAME_CONSTANTS.CAREER_PATH_POINTS.AFTER_50_PERCENT;
  }

  // Calculate penalties (ensure we return 0, not -0)
  const penalties = wrongGuesses === 0 ? 0 : -wrongGuesses;

  // Calculate raw score
  const rawScore = basePoints + penalties;

  // Enforce minimum score for correct answers
  const finalScore = Math.max(
    rawScore,
    GAME_CONSTANTS.CAREER_PATH_POINTS.MINIMUM_SCORE
  );

  // Generate human-readable breakdown
  const guessWord = wrongGuesses === 1 ? 'guess' : 'guesses';
  const isMinimumEnforced = rawScore < GAME_CONSTANTS.CAREER_PATH_POINTS.MINIMUM_SCORE;

  let breakdown: string;
  if (wrongGuesses === 0) {
    breakdown = `${basePoints} base points - 0 penalties = ${finalScore} ${
      finalScore === 1 ? 'point' : 'points'
    }`;
  } else if (isMinimumEnforced) {
    breakdown = `${basePoints} base points - ${wrongGuesses} wrong ${guessWord} = ${finalScore} ${
      finalScore === 1 ? 'point' : 'points'
    } (minimum enforced)`;
  } else {
    breakdown = `${basePoints} base points - ${wrongGuesses} wrong ${guessWord} = ${finalScore} ${
      finalScore === 1 ? 'point' : 'points'
    }`;
  }

  return {
    basePoints,
    penalties,
    finalScore,
    breakdown,
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
