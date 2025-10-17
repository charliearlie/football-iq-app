/**
 * CareerTable Component
 *
 * Displays player career history in a compact table format.
 * Supports progressive reveal (for Career Path Progressive mode).
 *
 * @example
 * // Show all careers (Full mode)
 * <CareerTable
 *   careers={player.careers}
 *   revealedCount={player.careers.length}
 * />
 *
 * // Show first 3 careers (Progressive mode)
 * <CareerTable
 *   careers={player.careers}
 *   revealedCount={3}
 * />
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING } from '@/src/constants/theme';
import { CareerTableRow } from './CareerTableRow';
import type { CareerWithClub } from '@/src/types/database';

export interface CareerTableProps {
  /** Array of career entries */
  careers: CareerWithClub[];

  /** Number of careers to reveal (for progressive mode) */
  revealedCount: number;

  /** Maximum height for scrollable area (default: 300px) */
  maxHeight?: number;

  /** Optional style override */
  style?: any;
}

export const CareerTable: React.FC<CareerTableProps> = ({
  careers,
  revealedCount,
  maxHeight = 300,
  style,
}) => {
  // Only show the first N careers based on revealedCount
  const visibleCareers = careers.slice(0, revealedCount);

  // Handle empty state (when revealedCount = 0 or no careers)
  const isEmpty = visibleCareers.length === 0;

  return (
    <View style={[styles.container, style]}>
      {/* Header Row */}
      <View style={styles.header}>
        <Text style={styles.headerYears}>YEARS</Text>
        <Text style={styles.headerClub}>CLUB</Text>
        <Text style={styles.headerStat}>APPS</Text>
        <Text style={styles.headerStat}>GOALS</Text>
      </View>

      {/* Data Rows or Empty State */}
      {isEmpty ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No clubs revealed yet</Text>
        </View>
      ) : (
        <ScrollView
          style={[styles.scrollView, { maxHeight }]}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={true}
        >
          {visibleCareers.map((career, index) => (
            <CareerTableRow
              key={career.id}
              startYear={career.start_year}
              endYear={career.end_year}
              clubName={career.club.name}
              appearances={career.appearances}
              goals={career.goals}
              isAlternate={index % 2 === 1}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background.surface,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border.default,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: SPACING.sm,
    backgroundColor: COLORS.background.surfaceAlt,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.brand.primary,
  },

  headerYears: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.tertiary,
    width: '18%',
    fontWeight: '700',
  },

  headerClub: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.tertiary,
    width: '42%',
    fontWeight: '700',
  },

  headerStat: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.tertiary,
    width: '20%',
    textAlign: 'right',
    fontWeight: '700',
  },

  scrollView: {
    maxHeight: 300, // Prevent table from taking entire screen
  },

  scrollContent: {
    flexGrow: 1,
  },
});

export default CareerTable;
