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

  /** Number of appearances (optional) */
  appearances?: number | null;

  /** Number of goals (optional) */
  goals?: number | null;

  /** Use compact layout (smaller, inline details) */
  compact?: boolean;

  /** Show club badge/logo (future enhancement) */
  showBadge?: boolean;
}

export const ClubDisplay: React.FC<ClubDisplayProps> = ({
  club,
  startYear,
  endYear,
  appearances,
  goals,
  compact = false,
  showBadge = false,
}) => {
  const yearsRange = endYear ? `${startYear}-${endYear}` : `${startYear}-Present`;

  // Compact mode for Career Path Full
  if (compact) {
    let details = `${yearsRange} • ${club.league || club.country}`;

    // Add stats if available
    if (appearances !== null && appearances !== undefined && goals !== null && goals !== undefined) {
      details += ` • ${appearances} apps, ${goals} goals`;
    }

    return (
      <View style={styles.compactContainer}>
        <Text style={styles.compactClubName} numberOfLines={1}>
          {club.name}
        </Text>
        <Text style={styles.compactDetails} numberOfLines={1}>
          {details}
        </Text>
      </View>
    );
  }

  // Full mode for Career Path Progressive
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

        {/* Stats (if available) */}
        {(appearances !== null && appearances !== undefined || goals !== null && goals !== undefined) && (
          <View style={styles.stats}>
            {appearances !== null && appearances !== undefined && (
              <Text style={styles.statText}>{appearances} apps</Text>
            )}
            {goals !== null && goals !== undefined && (
              <Text style={styles.statText}>{goals} goals</Text>
            )}
          </View>
        )}
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

  stats: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border.default,
  },

  statText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.text.secondary,
    fontWeight: '600',
  },

  // Compact mode styles
  compactContainer: {
    backgroundColor: COLORS.background.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.gameModes.careerPathFull.primary,
    marginBottom: SPACING.sm,
  },

  compactClubName: {
    ...TYPOGRAPHY.bodyLarge,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },

  compactDetails: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.text.secondary,
  },
});

export default ClubDisplay;
