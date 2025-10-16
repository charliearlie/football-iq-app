/**
 * Badge Component
 *
 * A small colored pill indicator, primarily used for displaying difficulty levels.
 * Automatically styles based on difficulty (easy, medium, hard).
 *
 * @example
 * <Badge text="Easy" difficulty="easy" />
 * <Badge text="Hard" difficulty="hard" />
 * <Badge text="Custom" variant="custom" color="#8B5CF6" />
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '@/src/constants/theme';

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface BadgeProps {
  /** Text to display in badge */
  text: string;

  /** Difficulty level (auto-styles the badge) */
  difficulty?: DifficultyLevel;

  /** Custom variant for non-difficulty badges */
  variant?: 'info' | 'success' | 'warning' | 'error' | 'custom';

  /** Custom color (only used with variant="custom") */
  color?: string;

  /** Additional container styles */
  style?: ViewStyle;

  /** Additional text styles */
  textStyle?: TextStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  text,
  difficulty,
  variant,
  color,
  style,
  textStyle,
}) => {
  // Determine badge styling based on difficulty or variant
  const getBadgeColors = (): { bg: string; border: string; text: string } => {
    if (difficulty) {
      return {
        bg: COLORS.difficulty[difficulty].background,
        border: COLORS.difficulty[difficulty].border,
        text: COLORS.difficulty[difficulty].primary,
      };
    }

    if (variant === 'custom' && color) {
      return {
        bg: `${color}1A`, // 10% opacity
        border: `${color}4D`, // 30% opacity
        text: color,
      };
    }

    // Variant-based colors
    switch (variant) {
      case 'info':
        return {
          bg: 'rgba(43, 135, 240, 0.1)',
          border: 'rgba(43, 135, 240, 0.3)',
          text: COLORS.accent.blue,
        };
      case 'success':
        return {
          bg: 'rgba(0, 220, 130, 0.1)',
          border: 'rgba(0, 220, 130, 0.3)',
          text: COLORS.semantic.success,
        };
      case 'warning':
        return {
          bg: 'rgba(255, 193, 7, 0.1)',
          border: 'rgba(255, 193, 7, 0.3)',
          text: COLORS.semantic.warning,
        };
      case 'error':
        return {
          bg: 'rgba(255, 71, 87, 0.1)',
          border: 'rgba(255, 71, 87, 0.3)',
          text: COLORS.semantic.error,
        };
      default:
        // Default to info
        return {
          bg: 'rgba(43, 135, 240, 0.1)',
          border: 'rgba(43, 135, 240, 0.3)',
          text: COLORS.accent.blue,
        };
    }
  };

  const colors = getBadgeColors();

  const containerStyle: ViewStyle = {
    backgroundColor: colors.bg,
    borderColor: colors.border,
  };

  const textColorStyle: TextStyle = {
    color: colors.text,
  };

  return (
    <View
      style={[styles.badge, containerStyle, style]}
      accessible={true}
      accessibilityRole="text"
      accessibilityLabel={`${text} ${difficulty || variant || ''}`}
    >
      <Text style={[styles.text, textColorStyle, textStyle]}>
        {text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: SPACING.md - 4, // 12px
    paddingVertical: SPACING.xs + 2, // 6px
    borderRadius: BORDER_RADIUS.sm,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },

  text: {
    ...TYPOGRAPHY.caption,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});

export default Badge;
