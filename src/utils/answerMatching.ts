/**
 * Answer matching utilities
 *
 * This module provides functions for validating player name guesses with fuzzy
 * matching, accent normalization, and support for aliases and last names.
 *
 * Key features:
 * - Case-insensitive matching
 * - Accent normalization (é → e, ü → u, etc.)
 * - Support for aliases (e.g., "CR7" for Cristiano Ronaldo)
 * - Last name matching (minimum 4 characters)
 * - Full name matching
 */

import { Player } from '../types/database';
import { AnswerValidation } from '../types/game';

/**
 * Normalize a player name for comparison
 *
 * Performs the following transformations:
 * - Convert to lowercase
 * - Trim whitespace
 * - Normalize accents (é → e, ü → u, ñ → n, etc.)
 * - Remove special characters except spaces and hyphens
 * - Collapse multiple spaces into single spaces
 *
 * @param name - The name to normalize
 * @returns Normalized name suitable for comparison
 *
 * @example
 * normalizePlayerName('Mesut Özil') // => 'mesut ozil'
 * normalizePlayerName("O'Neil") // => 'oneil'
 * normalizePlayerName('  CR7  ') // => 'cr7'
 */
export function normalizePlayerName(name: string): string {
  return (
    name
      // Normalize accents using Unicode normalization
      .normalize('NFD')
      // Remove combining diacritical marks (accents)
      .replace(/[\u0300-\u036f]/g, '')
      // Convert to lowercase
      .toLowerCase()
      // Remove special characters except spaces and hyphens
      .replace(/[^a-z0-9\s-]/g, '')
      // Collapse multiple spaces into single space
      .replace(/\s+/g, ' ')
      // Trim whitespace
      .trim()
  );
}

/**
 * Extract last name from full name
 *
 * Takes the last word from a full name string.
 * If the name contains multiple words, returns the last one.
 * If the name is a single word, returns that word.
 *
 * @param fullName - The full name to extract from
 * @returns The last name
 *
 * @example
 * extractLastName('Cristiano Ronaldo') // => 'Ronaldo'
 * extractLastName('Lionel Andres Messi') // => 'Messi'
 * extractLastName('Ronaldinho') // => 'Ronaldinho'
 */
export function extractLastName(fullName: string): string {
  const trimmed = fullName.trim();
  if (!trimmed) return '';

  const parts = trimmed.split(/\s+/);
  return parts[parts.length - 1];
}

/**
 * Check if last name only is a valid match
 *
 * Last names must be longer than 3 characters to be considered valid.
 * This prevents ambiguity with very short last names.
 *
 * @param lastName - The last name to validate
 * @returns True if the last name is valid for matching (>3 chars)
 *
 * @example
 * isValidLastNameMatch('Ronaldo') // => true
 * isValidLastNameMatch('Li') // => false
 */
export function isValidLastNameMatch(lastName: string): boolean {
  return lastName.trim().length > 3;
}

/**
 * Validate a player name guess
 *
 * Checks if a guess matches a player using the following priority:
 * 1. Exact match (normalized name)
 * 2. Full name match (normalized full_name)
 * 3. Alias match (any alias in the aliases array)
 * 4. Last name match (if >3 characters)
 *
 * All comparisons are case-insensitive and accent-normalized.
 *
 * @param guess - The player name guess to validate
 * @param player - The player to match against
 * @returns Validation result with match type and accepted answer
 *
 * @example
 * validatePlayerGuess('CR7', ronaldoPlayer)
 * // => { isCorrect: true, matchType: 'alias', acceptedAnswer: 'CR7' }
 *
 * validatePlayerGuess('Ronaldo', ronaldoPlayer)
 * // => { isCorrect: true, matchType: 'alias', acceptedAnswer: 'Ronaldo' }
 *
 * validatePlayerGuess('Messi', ronaldoPlayer)
 * // => { isCorrect: false }
 */
export function validatePlayerGuess(
  guess: string,
  player: Player
): AnswerValidation {
  // Normalize the guess
  const normalizedGuess = normalizePlayerName(guess);

  // Early return for empty guesses
  if (!normalizedGuess) {
    return { isCorrect: false };
  }

  // 1. Check exact name match
  const normalizedName = normalizePlayerName(player.name);
  if (normalizedGuess === normalizedName) {
    return {
      isCorrect: true,
      matchType: 'exact',
      acceptedAnswer: player.name,
    };
  }

  // 2. Check full name match
  if (player.full_name) {
    const normalizedFullName = normalizePlayerName(player.full_name);
    if (normalizedGuess === normalizedFullName) {
      return {
        isCorrect: true,
        matchType: 'full_name',
        acceptedAnswer: player.full_name,
      };
    }
  }

  // 3. Check alias matches
  if (player.aliases) {
    try {
      const aliases: string[] = JSON.parse(player.aliases);
      for (const alias of aliases) {
        const normalizedAlias = normalizePlayerName(alias);
        if (normalizedGuess === normalizedAlias) {
          return {
            isCorrect: true,
            matchType: 'alias',
            acceptedAnswer: alias,
          };
        }
      }
    } catch (error) {
      // If aliases can't be parsed, continue to last name matching
    }
  }

  // 4. Check last name match (only if >3 characters)
  const lastName = extractLastName(player.name);
  const normalizedLastName = normalizePlayerName(lastName);
  if (
    isValidLastNameMatch(lastName) &&
    normalizedGuess === normalizedLastName
  ) {
    return {
      isCorrect: true,
      matchType: 'last_name',
      acceptedAnswer: lastName,
    };
  }

  // No match found
  return { isCorrect: false };
}
