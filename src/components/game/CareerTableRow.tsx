/**
 * CareerTableRow Component
 *
 * Ultra-compact table row displaying a single career entry.
 * Designed to maximize information density while maintaining readability.
 *
 * Layout: Years | Club Name | Apps | Goals
 *
 * @example
 * <CareerTableRow
 *   startYear={2003}
 *   endYear={2009}
 *   clubName="Manchester United"
 *   appearances={292}
 *   goals={118}
 * />
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING } from '@/src/constants/theme';

export interface CareerTableRowProps {
  /** Year player joined the club */
  startYear: number;

  /** Year player left the club (null if currently playing) */
  endYear: number | null;

  /** Club name */
  clubName: string;

  /** Number of appearances */
  appearances: number | null;

  /** Number of goals */
  goals: number | null;

  /** Whether this is an alternate row (for subtle background variation) */
  isAlternate?: boolean;
}

export const CareerTableRow: React.FC<CareerTableRowProps> = ({
  startYear,
  endYear,
  clubName,
  appearances,
  goals,
  isAlternate = false,
}) => {
  // Format years as short string (e.g., "03-09" or "23-")
  const formatYear = (year: number): string => {
    return year.toString().slice(-2);
  };

  const yearsText = endYear
    ? `${formatYear(startYear)}-${formatYear(endYear)}`
    : `${formatYear(startYear)}-`;

  return (
    <View style={[styles.row, isAlternate && styles.rowAlternate]}>
      <Text style={styles.yearsCol} numberOfLines={1}>
        {yearsText}
      </Text>
      <Text style={styles.clubCol} numberOfLines={1}>
        {clubName}
      </Text>
      <Text style={styles.statsCol} numberOfLines={1}>
        {appearances ?? '-'}
      </Text>
      <Text style={styles.statsCol} numberOfLines={1}>
        {goals ?? '-'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border.default,
    minHeight: 32,
  },

  rowAlternate: {
    backgroundColor: COLORS.background.surfaceAlt,
  },

  yearsCol: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.text.secondary,
    width: '18%',
  },

  clubCol: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.text.primary,
    width: '42%',
    fontWeight: '500',
  },

  statsCol: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.text.secondary,
    width: '20%',
    textAlign: 'right',
    fontWeight: '600',
  },
});

export default CareerTableRow;
