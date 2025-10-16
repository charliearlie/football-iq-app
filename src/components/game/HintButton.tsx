/**
 * HintButton Component
 *
 * A button to reveal a hint (position or nationality) in the Transfer game mode.
 * Shows the hint value once revealed and becomes disabled after revealing.
 *
 * @example
 * <HintButton
 *   hintType="position"
 *   revealed={false}
 *   onReveal={handleRevealPosition}
 * />
 *
 * <HintButton
 *   hintType="nationality"
 *   revealed={true}
 *   value="Brazil"
 *   onReveal={handleRevealNationality}
 * />
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable, ViewStyle, PressableStateCallbackType } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SIZES } from '@/src/constants/theme';

export interface HintButtonProps {
  /** Type of hint */
  hintType: 'position' | 'nationality';

  /** Whether hint has been revealed */
  revealed: boolean;

  /** Callback when hint is revealed */
  onReveal: () => void;

  /** Hint value (shown when revealed) */
  value?: string;

  /** Disabled state */
  disabled?: boolean;
}

export const HintButton: React.FC<HintButtonProps> = ({
  hintType,
  revealed,
  onReveal,
  value,
  disabled = false,
}) => {
  const isDisabled = disabled || revealed;

  const getIcon = (): string => {
    if (hintType === 'position') {
      return '⚽';
    }
    return '🌍';
  };

  const getLabel = (): string => {
    if (hintType === 'position') {
      return 'Position';
    }
    return 'Nationality';
  };

  const getButtonStyle = (state: PressableStateCallbackType): ViewStyle[] => {
    const styles: ViewStyle[] = [buttonStyles.button];

    if (revealed) {
      styles.push(buttonStyles.revealed);
    }

    if (state.pressed && !isDisabled) {
      styles.push(buttonStyles.pressed);
    }

    if (isDisabled && !revealed) {
      styles.push(buttonStyles.disabled);
    }

    return styles;
  };

  return (
    <Pressable
      style={getButtonStyle}
      onPress={onReveal}
      disabled={isDisabled}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={
        revealed
          ? `${getLabel()}: ${value}`
          : `Reveal ${getLabel()} hint`
      }
      accessibilityState={{ disabled: isDisabled }}
    >
      <View style={buttonStyles.content}>
        <Text style={buttonStyles.icon}>{getIcon()}</Text>
        <View style={buttonStyles.textContainer}>
          <Text style={buttonStyles.label}>{getLabel()}</Text>
          {revealed && value ? (
            <Text style={buttonStyles.value}>{value}</Text>
          ) : (
            <Text style={buttonStyles.promptText}>Tap to reveal</Text>
          )}
        </View>
      </View>
    </Pressable>
  );
};

const buttonStyles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.background.surface,
    borderWidth: 2,
    borderColor: COLORS.accent.yellow,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    minHeight: SIZES.touchTarget,
    justifyContent: 'center',
  },

  revealed: {
    backgroundColor: COLORS.background.surfaceAlt,
    borderColor: COLORS.brand.primary,
  },

  pressed: {
    transform: [{ scale: 0.98 }],
    backgroundColor: COLORS.background.surfaceAlt,
  },

  disabled: {
    opacity: 0.5,
  },

  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  icon: {
    fontSize: 28,
    marginRight: SPACING.md,
  },

  textContainer: {
    flex: 1,
  },

  label: {
    ...TYPOGRAPHY.label,
    color: COLORS.text.secondary,
    marginBottom: SPACING.xxs,
  },

  value: {
    ...TYPOGRAPHY.h4,
    color: COLORS.text.primary,
  },

  promptText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.accent.yellow,
    fontStyle: 'italic',
  },
});

export default HintButton;
