/**
 * Card Component
 *
 * An elevated surface container for grouping related content.
 * Supports optional press interactions and accent borders for game modes.
 *
 * @example
 * <Card>
 *   <Text>Card content</Text>
 * </Card>
 *
 * <Card onPress={handlePress} accentColor="#00DC82">
 *   <Text>Interactive card</Text>
 * </Card>
 */

import React from 'react';
import {
  View,
  Pressable,
  StyleSheet,
  ViewStyle,
  PressableStateCallbackType,
} from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, getShadow } from '@/src/constants/theme';

export interface CardProps {
  /** Card content */
  children: React.ReactNode;

  /** Optional accent color for left border (for game mode distinction) */
  accentColor?: string;

  /** Optional press handler (makes card interactive) */
  onPress?: () => void;

  /** Additional styles */
  style?: ViewStyle;

  /** Accessibility label for screen readers */
  accessibilityLabel?: string;

  /** Accessibility hint */
  accessibilityHint?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  accentColor,
  onPress,
  style,
  accessibilityLabel,
  accessibilityHint,
}) => {
  const cardStyles: ViewStyle[] = [
    styles.card,
    ...(accentColor ? [{ borderLeftWidth: 4, borderLeftColor: accentColor } as ViewStyle] : []),
    ...(style ? [style] : []),
  ];

  // If interactive, return Pressable
  if (onPress) {
    const getInteractiveStyle = (state: PressableStateCallbackType): ViewStyle[] => {
      const interactiveStyles = [
        ...cardStyles,
        styles.interactive,
      ];

      if (state.pressed) {
        interactiveStyles.push(styles.pressed);
        if (accentColor) {
          interactiveStyles.push({ borderColor: accentColor });
        }
      }

      return interactiveStyles;
    };

    return (
      <Pressable
        style={getInteractiveStyle}
        onPress={onPress}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
      >
        {children}
      </Pressable>
    );
  }

  // Static card
  return (
    <View
      style={cardStyles}
      accessible={!!accessibilityLabel}
      accessibilityLabel={accessibilityLabel}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.background.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    ...getShadow('md'),
  },

  interactive: {
    borderWidth: 1,
    borderColor: 'transparent',
  },

  pressed: {
    backgroundColor: COLORS.background.surfaceAlt,
    borderColor: COLORS.brand.primary,
    transform: [{ scale: 0.98 }],
  },
});

export default Card;
