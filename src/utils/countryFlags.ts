/**
 * Country Flag Emojis Utility
 *
 * Maps country names to their flag emojis for compact display.
 * Used primarily in the Transfer game mode hint system.
 */

/**
 * Mapping of country names to their flag emojis
 */
const COUNTRY_FLAGS: Record<string, string> = {
  // Europe
  'England': '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
  'Scotland': '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
  'Wales': '🏴󠁧󠁢󠁷󠁬󠁳󠁿',
  'Northern Ireland': '🇬🇧',
  'United Kingdom': '🇬🇧',
  'UK': '🇬🇧',
  'France': '🇫🇷',
  'Germany': '🇩🇪',
  'Spain': '🇪🇸',
  'Italy': '🇮🇹',
  'Portugal': '🇵🇹',
  'Netherlands': '🇳🇱',
  'Belgium': '🇧🇪',
  'Sweden': '🇸🇪',
  'Norway': '🇳🇴',
  'Denmark': '🇩🇰',
  'Switzerland': '🇨🇭',
  'Austria': '🇦🇹',
  'Poland': '🇵🇱',
  'Croatia': '🇭🇷',
  'Serbia': '🇷🇸',
  'Czech Republic': '🇨🇿',
  'Slovakia': '🇸🇰',
  'Hungary': '🇭🇺',
  'Romania': '🇷🇴',
  'Bulgaria': '🇧🇬',
  'Greece': '🇬🇷',
  'Turkey': '🇹🇷',
  'Russia': '🇷🇺',
  'Ukraine': '🇺🇦',
  'Ireland': '🇮🇪',

  // South America
  'Argentina': '🇦🇷',
  'Brazil': '🇧🇷',
  'Uruguay': '🇺🇾',
  'Colombia': '🇨🇴',
  'Chile': '🇨🇱',
  'Peru': '🇵🇪',
  'Ecuador': '🇪🇨',
  'Venezuela': '🇻🇪',
  'Paraguay': '🇵🇾',
  'Bolivia': '🇧🇴',

  // North/Central America
  'USA': '🇺🇸',
  'United States': '🇺🇸',
  'Mexico': '🇲🇽',
  'Canada': '🇨🇦',
  'Costa Rica': '🇨🇷',
  'Jamaica': '🇯🇲',

  // Africa
  'Egypt': '🇪🇬',
  'Nigeria': '🇳🇬',
  'Ghana': '🇬🇭',
  'Senegal': '🇸🇳',
  'Cameroon': '🇨🇲',
  'Ivory Coast': '🇨🇮',
  'South Africa': '🇿🇦',
  'Morocco': '🇲🇦',
  'Algeria': '🇩🇿',
  'Tunisia': '🇹🇳',

  // Asia
  'Japan': '🇯🇵',
  'South Korea': '🇰🇷',
  'Korea': '🇰🇷',
  'China': '🇨🇳',
  'Saudi Arabia': '🇸🇦',
  'Iran': '🇮🇷',
  'Australia': '🇦🇺',
  'India': '🇮🇳',

  // Other
  'New Zealand': '🇳🇿',
};

/**
 * Converts a country name to its flag emoji
 *
 * @param country - Full country name (e.g., "Portugal")
 * @returns Flag emoji (e.g., "🇵🇹") or a globe emoji (🌍) if no mapping exists
 *
 * @example
 * getCountryFlag('Portugal') // Returns '🇵🇹'
 * getCountryFlag('Argentina') // Returns '🇦🇷'
 * getCountryFlag('Unknown Country') // Returns '🌍'
 */
export function getCountryFlag(country: string): string {
  // Try exact match first
  if (COUNTRY_FLAGS[country]) {
    return COUNTRY_FLAGS[country];
  }

  // Try case-insensitive match
  const countryLower = country.toLowerCase();
  const matchingKey = Object.keys(COUNTRY_FLAGS).find(
    (key) => key.toLowerCase() === countryLower
  );

  if (matchingKey) {
    return COUNTRY_FLAGS[matchingKey];
  }

  // Default: globe emoji if no match
  return '🌍';
}

/**
 * Checks if a flag emoji exists for the given country
 *
 * @param country - Full country name
 * @returns True if a flag mapping exists
 */
export function hasCountryFlag(country: string): boolean {
  return country in COUNTRY_FLAGS;
}
