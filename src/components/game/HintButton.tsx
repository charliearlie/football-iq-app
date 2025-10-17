/**
 * HintButton Component
 *
 * A compact circular button to reveal a hint (position or nationality) in the Transfer game mode.
 * Shows an icon before revealing, and the actual value after revealing.
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
import { COLORS, TYPOGRAPHY, SPACING } from '@/src/constants/theme';
import { getPositionAcronym, getCountryFlag } from '@/src/utils';

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

  const getDisplayContent = (): { main: string; sub?: string } => {
    if (!revealed) {
      // Not revealed: show icon and "TAP"
      return {
        main: hintType === 'position' ? '⚽' : '🌍',
        sub: 'TAP',
      };
    }

    // Revealed: show actual value
    if (hintType === 'position' && value) {
      return {
        main: getPositionAcronym(value),
      };
    }

    if (hintType === 'nationality' && value) {
      return {
        main: getCountryFlag(value),
      };
    }

    return { main: '?' };
  };

  const getLabel = (): string => {
    return hintType === 'position' ? 'Position' : 'Nationality';
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

  const displayContent = getDisplayContent();

  return (
    <View style={buttonStyles.container}>
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
        <Text style={buttonStyles.mainText}>{displayContent.main}</Text>
        {displayContent.sub && (
          <Text style={buttonStyles.subText}>{displayContent.sub}</Text>
        )}
      </Pressable>
      <Text style={buttonStyles.labelText}>{getLabel()}</Text>
    </View>
  );
};

const CIRCLE_SIZE = 70;

const buttonStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
  },

  button: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    backgroundColor: COLORS.background.surface,
    borderWidth: 2,
    borderColor: COLORS.accent.yellow,
    justifyContent: 'center',
    alignItems: 'center',
  },

  revealed: {
    backgroundColor: COLORS.background.surfaceAlt,
    borderColor: COLORS.brand.primary,
  },

  pressed: {
    transform: [{ scale: 0.95 }],
    backgroundColor: COLORS.background.surfaceAlt,
  },

  disabled: {
    opacity: 0.5,
  },

  mainText: {
    fontSize: 32,
    textAlign: 'center',
  },

  subText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.accent.yellow,
    textAlign: 'center',
    marginTop: 2,
    fontWeight: '600',
  },

  labelText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.tertiary,
    textAlign: 'center',
    marginTop: SPACING.xs,
  },
});

export default HintButton;
