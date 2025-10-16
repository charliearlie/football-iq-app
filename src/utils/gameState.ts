/**
 * Game state utilities
 *
 * This module provides helper functions for managing game state and formatting
 * game-related displays for the UI.
 *
 * Key features:
 * - Game over detection
 * - Potential score calculation
 * - Club and transfer display formatting
 * - Difficulty color mapping
 */

import { CareerWithClub, TransferWithDetails } from '../types/database';
import { GAME_CONSTANTS } from '../constants/game';
import { calculateCareerPathScore, calculateTransferScore } from './scoring';

/**
 * Check if game is over based on wrong guesses
 *
 * Game is over when the number of wrong guesses reaches or exceeds
 * the maximum allowed.
 *
 * @param wrongGuesses - Current number of wrong guesses
 * @param maxWrongGuesses - Maximum allowed wrong guesses
 * @returns True if game is over
 *
 * @example
 * isGameOver(5, 5) // => true
 * isGameOver(4, 5) // => false
 */
export function isGameOver(
  wrongGuesses: number,
  maxWrongGuesses: number
): boolean {
  return wrongGuesses >= maxWrongGuesses;
}

/**
 * Get current potential score based on game state
 *
 * Calculates what the player would earn if they guess correctly now,
 * given the current game state (clubs revealed, hints shown, wrong guesses).
 *
 * @param gameMode - The game mode being played
 * @param state - Current game state with relevant fields for the mode
 * @returns Potential score (points that would be earned)
 *
 * @example
 * getPotentialScore('career_path_progressive', {
 *   totalClubs: 10,
 *   clubsRevealed: 2,
 *   wrongGuesses: 1
 * })
 * // => 2 (3 base points - 1 penalty)
 *
 * @example
 * getPotentialScore('transfer', {
 *   hintsRevealed: { position: true, nationality: false }
 * })
 * // => 2
 */
export function getPotentialScore(
  gameMode: 'career_path_progressive' | 'career_path_full' | 'transfer',
  state: {
    totalClubs?: number;
    clubsRevealed?: number;
    wrongGuesses?: number;
    hintsRevealed?: { position: boolean; nationality: boolean };
  }
): number {
  if (gameMode === 'career_path_progressive') {
    const { totalClubs = 0, clubsRevealed = 0, wrongGuesses = 0 } = state;
    const scoreBreakdown = calculateCareerPathScore(
      totalClubs,
      clubsRevealed,
      wrongGuesses
    );
    return scoreBreakdown.finalScore;
  }

  if (gameMode === 'career_path_full') {
    return GAME_CONSTANTS.CAREER_PATH_FULL_POINTS.CORRECT;
  }

  if (gameMode === 'transfer') {
    const hintsRevealed = state.hintsRevealed || {
      position: false,
      nationality: false,
    };
    const scoreBreakdown = calculateTransferScore(hintsRevealed);
    return scoreBreakdown.finalScore;
  }

  return 0;
}

/**
 * Format club display for Career Path
 *
 * Formats a career entry as "Club Name (StartYear-EndYear)"
 * If end_year is null, displays "Present" instead.
 *
 * @param career - Career entry with club details
 * @returns Formatted string
 *
 * @example
 * formatClubDisplay(career)
 * // => "Manchester United (2003-2009)"
 *
 * @example
 * // Current club (end_year is null)
 * formatClubDisplay(currentCareer)
 * // => "Inter Miami (2023-Present)"
 */
export function formatClubDisplay(career: CareerWithClub): string {
  const endYear = career.end_year === null ? 'Present' : career.end_year;
  return `${career.club.name} (${career.start_year}-${endYear})`;
}

/**
 * Format transfer display
 *
 * Formats a transfer as "From Club → To Club (Year)"
 * Uses an arrow symbol to show the direction of transfer.
 *
 * @param transfer - Transfer with full details
 * @returns Formatted string
 *
 * @example
 * formatTransferDisplay(transfer)
 * // => "Manchester United → Real Madrid (2009)"
 */
export function formatTransferDisplay(transfer: TransferWithDetails): string {
  return `${transfer.fromClub.name} → ${transfer.toClub.name} (${transfer.transfer_year})`;
}

/**
 * Get difficulty color from difficulty string
 *
 * Maps difficulty levels to hex color codes for UI display.
 * Returns gray for unknown difficulties.
 *
 * @param difficulty - Difficulty level string
 * @returns Hex color code
 *
 * @example
 * getDifficultyColor('easy') // => '#10b981' (green)
 * getDifficultyColor('hard') // => '#ef4444' (red)
 */
export function getDifficultyColor(difficulty: string): string {
  if (!difficulty) {
    return '#6b7280'; // gray-500 (default)
  }

  const normalizedDifficulty = difficulty.toLowerCase();

  switch (normalizedDifficulty) {
    case 'easy':
      return GAME_CONSTANTS.DIFFICULTY_COLORS.easy;
    case 'medium':
      return GAME_CONSTANTS.DIFFICULTY_COLORS.medium;
    case 'hard':
      return GAME_CONSTANTS.DIFFICULTY_COLORS.hard;
    default:
      return '#6b7280'; // gray-500 (default)
  }
}
