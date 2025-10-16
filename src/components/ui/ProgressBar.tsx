/**
 * ProgressBar Component
 *
 * A horizontal progress indicator showing completion percentage.
 * Displays a label above the bar and animates fill changes.
 *
 * @example
 * <ProgressBar current={3} total={10} label="Question 3 of 10" />
 * <ProgressBar current={5} total={5} label="Complete!" color="#00DC82" />
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SIZES, DURATIONS } from '@/src/constants/theme';

export interface ProgressBarProps {
  /** Current progress value */
  current: number;

  /** Total/maximum value */
  total: number;

  /** Label text to display above the bar */
  label?: string;

  /** Progress bar color (defaults to brand primary) */
  color?: string;

  /** Additional container styles */
  style?: ViewStyle;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  total,
  label,
  color = COLORS.brand.primary,
  style,
}) => {
  const progress = useSharedValue(0);

  // Calculate percentage (0-100)
  const percentage = Math.min(Math.max((current / total) * 100, 0), 100);

  useEffect(() => {
    progress.value = withTiming(percentage, {
      duration: DURATIONS.medium,
      easing: Easing.bezier(0.4, 0.0, 0.2, 1), // Material standard curve
    });
  }, [percentage, progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${progress.value}%`,
  }));

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text
          style={styles.label}
          accessible={true}
          accessibilityRole="text"
        >
          {label}
        </Text>
      )}
      <View
        style={styles.track}
        accessible={true}
        accessibilityRole="progressbar"
        accessibilityValue={{
          min: 0,
          max: total,
          now: current,
          text: `${Math.round(percentage)}% complete`,
        }}
      >
        <Animated.View
          style={[
            styles.fill,
            { backgroundColor: color },
            animatedStyle,
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },

  label: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.text.secondary,
    marginBottom: SPACING.xs,
  },

  track: {
    height: SIZES.progressBar,
    backgroundColor: COLORS.background.surfaceAlt,
    borderRadius: BORDER_RADIUS.sm,
    overflow: 'hidden',
  },

  fill: {
    height: '100%',
    borderRadius: BORDER_RADIUS.sm,
  },
});

export default ProgressBar;
