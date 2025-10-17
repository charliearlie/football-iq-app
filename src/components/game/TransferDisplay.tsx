/**
 * TransferDisplay Component
 *
 * Displays a transfer between two clubs with an arrow and year.
 * Used in the Transfer game mode to show the transfer the player must identify.
 *
 * @example
 * <TransferDisplay
 *   fromClub={{ name: 'Barcelona', country: 'Spain', league: 'La Liga' }}
 *   toClub={{ name: 'Paris Saint-Germain', country: 'France', league: 'Ligue 1' }}
 *   year={2021}
 * />
 */

import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '@/src/constants/theme';
import { Card } from '../ui/Card';
import type { Club } from '@/src/types/database';

export interface TransferDisplayProps {
  /** Club player transferred from */
  fromClub: Pick<Club, 'name' | 'country' | 'league'>;

  /** Club player transferred to */
  toClub: Pick<Club, 'name' | 'country' | 'league'>;

  /** Year of transfer */
  year: number;
}

export const TransferDisplay: React.FC<TransferDisplayProps> = ({
  fromClub,
  toClub,
  year,
}) => {
  const { width } = useWindowDimensions();
  const isNarrow = width < 400;

  const ClubCard = ({ club }: { club: Pick<Club, 'name' | 'country' | 'league'> }) => (
    <View style={[styles.clubCard, isNarrow && styles.clubCardNarrow]}>
      <Text style={styles.clubName} numberOfLines={2}>
        {club.name}
      </Text>
      <View style={styles.metaContainer}>
        {club.league && (
          <>
            <Text style={styles.metaText} numberOfLines={1}>
              {club.league}
            </Text>
            <Text style={styles.metaDivider}>•</Text>
          </>
        )}
        <Text style={styles.metaText} numberOfLines={1}>
          {club.country}
        </Text>
      </View>
    </View>
  );

  return (
    <Card
      accentColor={COLORS.accent.blue}
      accessibilityLabel={`Transfer from ${fromClub.name} to ${toClub.name} in ${year}`}
    >
      <View style={styles.container}>
        {/* Year */}
        <View style={styles.yearContainer}>
          <Text style={styles.yearLabel}>Transfer Year</Text>
          <Text style={styles.year}>{year}</Text>
        </View>

        {/* Clubs with Arrow */}
        <View style={[styles.clubsContainer, isNarrow && styles.clubsContainerNarrow]}>
          <ClubCard club={fromClub} />

          <View style={styles.arrowContainer}>
            <Text style={styles.arrow}>→</Text>
          </View>

          <ClubCard club={toClub} />
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },

  yearContainer: {
    alignItems: 'center',
    marginBottom: SPACING.md,
  },

  yearLabel: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.text.tertiary,
    marginBottom: SPACING.xs,
  },

  year: {
    ...TYPOGRAPHY.h2,
    color: COLORS.accent.blue,
  },

  clubsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },

  clubsContainerNarrow: {
    flexDirection: 'column',
  },

  clubCard: {
    flex: 1,
    alignItems: 'center',
    padding: SPACING.sm,
    backgroundColor: COLORS.background.surfaceAlt,
    borderRadius: BORDER_RADIUS.md,
  },

  clubCardNarrow: {
    width: '100%',
    marginBottom: SPACING.sm,
  },

  clubName: {
    ...TYPOGRAPHY.h4,
    color: COLORS.text.primary,
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },

  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },

  metaText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.tertiary,
  },

  metaDivider: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.tertiary,
    marginHorizontal: SPACING.xs,
  },

  arrowContainer: {
    marginHorizontal: SPACING.md,
  },

  arrow: {
    fontSize: 32,
    color: COLORS.accent.blue,
    fontWeight: 'bold',
  },
});

export default TransferDisplay;
