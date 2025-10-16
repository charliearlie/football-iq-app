/**
 * ScoreCard Component
 *
 * Displays the potential score/points available for the current question.
 * Animates when the value changes (e.g., when hints are revealed or clubs are skipped).
 *
 * @example
 * <ScoreCard potentialScore={3} label="Potential Points" />
 * <ScoreCard potentialScore={1} label="Points Available" color="#00DC82" />
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
} from 'react-native-reanimated';
import { COLORS, TYPOGRAPHY, SPACING } from '@/src/constants/theme';
import { Card } from '../ui/Card';

export interface ScoreCardProps {
  /** Points available for this question */
  potentialScore: number;

  /** Label to display (defaults to "Potential Points") */
  label?: string;

  /** Score color (defaults to brand primary) */
  color?: string;
}

export const ScoreCard: React.FC<ScoreCardProps> = ({
  potentialScore,
  label = 'Potential Points',
  color = COLORS.brand.primary,
}) => {
  const scale = useSharedValue(1);

  // Animate scale when potentialScore changes
  useEffect(() => {
    scale.value = withSequence(
      withSpring(1.1, { damping: 8, stiffness: 200 }),
      withSpring(1, { damping: 8, stiffness: 200 })
    );
  }, [potentialScore, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Card
      style={styles.container}
      accessibilityLabel={`${label}: ${potentialScore} points`}
    >
      <Text style={styles.label}>{label}</Text>
      <Animated.View style={animatedStyle}>
        <Text
          style={[styles.score, { color }]}
          accessible={true}
          accessibilityRole="text"
        >
          {potentialScore}
        </Text>
      </Animated.View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: SPACING.lg,
  },

  label: {
    ...TYPOGRAPHY.label,
    color: COLORS.text.tertiary,
    marginBottom: SPACING.sm,
  },

  score: {
    ...TYPOGRAPHY.display,
    fontWeight: '700',
  },
});

export default ScoreCard;
