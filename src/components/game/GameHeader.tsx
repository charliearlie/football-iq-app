/**
 * GameHeader Component
 *
 * Displays game progress and wrong guess counter at the top of game screens.
 * Shows progress bar for Career Path modes, and wrong guess counter for all modes.
 *
 * @example
 * <GameHeader
 *   currentItem={3}
 *   totalItems={10}
 *   wrongGuesses={2}
 *   maxWrongGuesses={5}
 * />
 *
 * <GameHeader
 *   wrongGuesses={1}
 *   maxWrongGuesses={5}
 *   hideProgress={true}
 * />
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING } from '@/src/constants/theme';
import { ProgressBar } from '../ui/ProgressBar';

export interface GameHeaderProps {
  /** Current item index (for progress) */
  currentItem?: number;

  /** Total items (for progress) */
  totalItems?: number;

  /** Current wrong guesses count */
  wrongGuesses: number;

  /** Maximum allowed wrong guesses */
  maxWrongGuesses: number;

  /** Hide progress bar (for Transfer mode) */
  hideProgress?: boolean;

  /** Potential score to display inline */
  potentialScore?: number;

  /** Label for score (defaults to "Points") */
  scoreLabel?: string;
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  currentItem,
  totalItems,
  wrongGuesses,
  maxWrongGuesses,
  hideProgress = false,
  potentialScore,
  scoreLabel = 'Points',
}) => {
  const showProgress = !hideProgress && currentItem !== undefined && totalItems !== undefined;

  // Determine wrong guess color based on severity
  const getWrongGuessColor = (): string => {
    const percentage = wrongGuesses / maxWrongGuesses;
    if (percentage >= 0.8) {
      return COLORS.semantic.error;
    }
    if (percentage >= 0.5) {
      return COLORS.semantic.warning;
    }
    return COLORS.text.secondary;
  };

  return (
    <View
      style={styles.container}
      accessible={true}
      accessibilityRole="header"
    >
      {showProgress && (
        <View style={styles.progressSection}>
          <ProgressBar
            current={currentItem}
            total={totalItems}
            label={`Item ${currentItem} of ${totalItems}`}
          />
        </View>
      )}

      <View style={styles.statsRow}>
        <Text
          style={[styles.wrongGuessText, { color: getWrongGuessColor() }]}
          accessible={true}
          accessibilityLabel={`${wrongGuesses} wrong guesses out of ${maxWrongGuesses} maximum`}
        >
          ❌ Wrong: {wrongGuesses}/{maxWrongGuesses}
        </Text>

        {potentialScore !== undefined && (
          <View style={styles.scoreContainer}>
            <Text
              style={styles.scoreValue}
              accessible={true}
              accessibilityLabel={`${potentialScore} ${potentialScore === 1 ? 'point' : scoreLabel.toLowerCase()} available`}
            >
              {potentialScore}
            </Text>
            <Text style={styles.scoreLabel}>
              {potentialScore === 1 ? scoreLabel.replace(/s$/i, '') : scoreLabel}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.background.surface,
  },

  progressSection: {
    marginBottom: SPACING.sm,
  },

  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  wrongGuessText: {
    ...TYPOGRAPHY.bodySmall,
    fontWeight: '600',
  },

  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },

  scoreValue: {
    ...TYPOGRAPHY.h2,
    color: COLORS.brand.primary,
    fontWeight: '700',
  },

  scoreLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.tertiary,
    textTransform: 'uppercase',
  },
});

export default GameHeader;
