/**
 * Position Acronyms Utility
 *
 * Converts full position names to short acronyms for compact display.
 * Used primarily in the Transfer game mode hint system.
 */

/**
 * Mapping of full position names to their acronyms
 */
const POSITION_ACRONYMS: Record<string, string> = {
  // Forwards
  'Forward': 'FW',
  'Striker': 'ST',
  'Centre Forward': 'CF',
  'Center Forward': 'CF',

  // Wingers
  'Winger': 'W',
  'Left Winger': 'LW',
  'Right Winger': 'RW',
  'Left Wing': 'LW',
  'Right Wing': 'RW',

  // Midfielders
  'Midfielder': 'MF',
  'Central Midfielder': 'CM',
  'Centre Midfielder': 'CM',
  'Center Midfielder': 'CM',
  'Attacking Midfielder': 'AM',
  'Central Attacking Midfielder': 'CAM',
  'Defensive Midfielder': 'DM',
  'Central Defensive Midfielder': 'CDM',
  'Left Midfielder': 'LM',
  'Right Midfielder': 'RM',

  // Defenders
  'Defender': 'DF',
  'Centre-Back': 'CB',
  'Center-Back': 'CB',
  'Centre Back': 'CB',
  'Center Back': 'CB',
  'Left-Back': 'LB',
  'Left Back': 'LB',
  'Right-Back': 'RB',
  'Right Back': 'RB',
  'Wing-Back': 'WB',
  'Wing Back': 'WB',
  'Left Wing-Back': 'LWB',
  'Right Wing-Back': 'RWB',
  'Sweeper': 'SW',

  // Goalkeeper
  'Goalkeeper': 'GK',
  'Goal Keeper': 'GK',
};

/**
 * Converts a full position name to its acronym
 *
 * @param position - Full position name (e.g., "Central Midfielder")
 * @returns Position acronym (e.g., "CM") or the original string if no mapping exists
 *
 * @example
 * getPositionAcronym('Central Midfielder') // Returns 'CM'
 * getPositionAcronym('Forward') // Returns 'FW'
 * getPositionAcronym('Unknown Position') // Returns 'Unknown Position'
 */
export function getPositionAcronym(position: string): string {
  // Try exact match first
  if (POSITION_ACRONYMS[position]) {
    return POSITION_ACRONYMS[position];
  }

  // Try case-insensitive match
  const positionLower = position.toLowerCase();
  const matchingKey = Object.keys(POSITION_ACRONYMS).find(
    (key) => key.toLowerCase() === positionLower
  );

  if (matchingKey) {
    return POSITION_ACRONYMS[matchingKey];
  }

  // If no match found, return original or first two letters as fallback
  return position.length >= 2 ? position.substring(0, 2).toUpperCase() : position;
}

/**
 * Checks if a position acronym exists for the given position
 *
 * @param position - Full position name
 * @returns True if an acronym mapping exists
 */
export function hasPositionAcronym(position: string): boolean {
  return position in POSITION_ACRONYMS;
}
