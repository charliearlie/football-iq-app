/**
 * Game state and utility types
 *
 * This module defines TypeScript interfaces for game states, validation results,
 * and scoring breakdowns used throughout the application.
 */

import {
  Player,
  CareerWithClub,
  TransferWithDetails,
} from './database';

// =============================================================================
// Answer Validation
// =============================================================================

/**
 * Result of validating a player name guess
 */
export interface AnswerValidation {
  /** Whether the guess was correct */
  isCorrect: boolean;
  /** The accepted answer variant that matched (if correct) */
  acceptedAnswer?: string;
  /** The type of match that was successful */
  matchType?: 'exact' | 'full_name' | 'alias' | 'last_name';
}

// =============================================================================
// Scoring
// =============================================================================

/**
 * Detailed breakdown of score calculation
 */
export interface ScoreBreakdown {
  /** Base points before penalties */
  basePoints: number;
  /** Penalty points (negative number) */
  penalties: number;
  /** Final score after applying penalties */
  finalScore: number;
  /** Human-readable explanation of scoring */
  breakdown: string;
}

// =============================================================================
// Game States
// =============================================================================

/**
 * Game state for Career Path Progressive mode
 *
 * In this mode, clubs are revealed one at a time.
 * Score decreases as more clubs are shown and with each wrong guess.
 */
export interface CareerPathProgressiveState {
  /** Game mode identifier */
  mode: 'progressive';
  /** Question ID being answered */
  questionId: string;
  /** The player to guess */
  player: Player;
  /** Full career history with club details */
  careers: CareerWithClub[];
  /** Total number of clubs in career */
  totalClubs: number;
  /** Current club index being shown (0-based) */
  currentClubIndex: number;
  /** Number of wrong guesses made */
  wrongGuesses: number;
  /** Maximum wrong guesses allowed */
  maxWrongGuesses: number;
  /** Whether the question has been completed */
  isComplete: boolean;
  /** Final score earned (null if not complete) */
  finalScore: number | null;
}

/**
 * Game state for Career Path Full mode
 *
 * In this mode, all clubs are shown at once.
 * Score is simply 1 for correct, 0 for incorrect.
 */
export interface CareerPathFullState {
  /** Game mode identifier */
  mode: 'full';
  /** Question ID being answered */
  questionId: string;
  /** The player to guess */
  player: Player;
  /** Full career history with club details */
  careers: CareerWithClub[];
  /** Whether the question has been completed */
  isComplete: boolean;
  /** Final score earned (null if not complete) */
  finalScore: number | null;
}

/**
 * Game state for Transfer mode
 *
 * Player guesses who made a specific transfer.
 * Hints (position, nationality) can be revealed for fewer points.
 */
export interface TransferGameState {
  /** Question ID being answered */
  questionId: string;
  /** Transfer details with player and club info */
  transfer: TransferWithDetails;
  /** Which hints have been revealed */
  hintsRevealed: {
    /** Whether player's position has been shown */
    position: boolean;
    /** Whether player's nationality has been shown */
    nationality: boolean;
  };
  /** Number of wrong guesses made */
  wrongGuesses: number;
  /** Maximum wrong guesses allowed */
  maxWrongGuesses: number;
  /** Whether the question has been completed */
  isComplete: boolean;
  /** Final score earned (null if not complete) */
  finalScore: number | null;
}

/**
 * Union type of all game states
 */
export type GameState =
  | CareerPathProgressiveState
  | CareerPathFullState
  | TransferGameState;
