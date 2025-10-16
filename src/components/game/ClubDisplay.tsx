/**
 * ClubDisplay Component
 *
 * Displays a club card with name, years played, and league/country information.
 * Used in Career Path game modes to show a player's career history.
 *
 * @example
 * <ClubDisplay
 *   club={{ name: 'Manchester United', country: 'England', league: 'Premier League' }}
 *   startYear={2003}
 *   endYear={2009}
 * />
 *
 * <ClubDisplay
 *   club={{ name: 'Real Madrid', country: 'Spain', league: 'La Liga' }}
 *   startYear={2009}
 *   endYear={null}
 * />
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '@/src/constants/theme';
import { Card } from '../ui/Card';
import type { Club } from '@/src/types/database';

export interface ClubDisplayProps {
  /** Club information */
  club: Pick<Club, 'name' | 'country' | 'league'>;

  /** Year player joined the club */
  startYear: number;

  /** Year player left the club (null if currently playing) */
  endYear: number | null;

  /** Show club badge/logo (future enhancement) */
  showBadge?: boolean;
}

export const ClubDisplay: React.FC<ClubDisplayProps> = ({
  club,
  startYear,
  endYear,
  showBadge = false,
}) => {
  const yearsRange = endYear ? `${startYear} - ${endYear}` : `${startYear} - Present`;

  return (
    <Card
      accentColor={COLORS.brand.primary}
      accessibilityLabel={`${club.name}, ${yearsRange}`}
    >
      <View style={styles.container}>
        {/* Club Name */}
        <Text style={styles.clubName} numberOfLines={2}>
          {club.name}
        </Text>

        {/* Years Range */}
        <Text style={styles.years}>{yearsRange}</Text>

        {/* League and Country */}
        <View style={styles.metaContainer}>
          {club.league && (
            <Text style={styles.metaText} numberOfLines={1}>
              {club.league}
            </Text>
          )}
          <Text style={styles.metaDivider}>•</Text>
          <Text style={styles.metaText} numberOfLines={1}>
            {club.country}
          </Text>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },

  clubName: {
    ...TYPOGRAPHY.h2,
    color: COLORS.text.primary,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },

  years: {
    ...TYPOGRAPHY.h3,
    color: COLORS.brand.primary,
    marginBottom: SPACING.sm,
  },

  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },

  metaText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.text.tertiary,
  },

  metaDivider: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.text.tertiary,
    marginHorizontal: SPACING.sm,
  },
});

export default ClubDisplay;
