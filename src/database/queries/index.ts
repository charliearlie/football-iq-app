/**
 * Database queries index
 *
 * This module re-exports all query functions for convenient importing.
 *
 * Usage:
 *   import { getPlayerById, getAllClubs } from '@/src/database/queries';
 */

// Club queries
export {
  getClubById,
  getClubsByCountry,
  getAllClubs,
  searchClubsByName,
} from './clubs';

// Player queries
export {
  getPlayerById,
  getPlayerByName,
  getPlayerWithFullCareer,
  getAllPlayers,
} from './players';

// Career queries
export { getPlayerCareers, getClubPlayers } from './careers';

// Transfer queries
export {
  getTransferById,
  getTransferWithDetails,
  getPlayerTransfers,
} from './transfers';

// Question queries
export {
  getQuestionPacks,
  getPurchasedPacks,
  getFreePacks,
  getPackById,
  getPackQuestions,
  getRandomQuestion,
  getUnansweredQuestion,
  markPackAsPurchased,
} from './questions';

// User progress queries
export {
  getUserStats,
  recordQuestionAnswer,
  getAnsweredQuestionIds,
  getQuestionHistory,
  calculateAccuracyRate,
  updateUserStats,
} from './userProgress';
