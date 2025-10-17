/**
 * Game utilities
 *
 * Pure functions for game mechanics, answer validation, scoring, and state management.
 * All functions are fully tested and free of side effects.
 */

// Answer matching utilities
export {
  normalizePlayerName,
  extractLastName,
  isValidLastNameMatch,
  validatePlayerGuess,
} from './answerMatching';

// Scoring utilities
export {
  calculateCareerPathScore,
  calculateCareerPathFullScore,
  calculateTransferScore,
  calculateAccuracyRate,
  calculateStreak,
} from './scoring';

// Game state utilities
export {
  isGameOver,
  getPotentialScore,
  formatClubDisplay,
  formatTransferDisplay,
  getDifficultyColor,
} from './gameState';

// Display utilities
export { getPositionAcronym, hasPositionAcronym } from './positionAcronyms';
export { getCountryFlag, hasCountryFlag } from './countryFlags';
