/**
 * Button Component
 *
 * A flexible button component with multiple variants, sizes, and states.
 * Follows the design system specifications for consistent styling.
 *
 * @example
 * <Button onPress={handlePress}>Press Me</Button>
 * <Button variant="secondary" size="large" onPress={handlePress}>Secondary</Button>
 * <Button variant="ghost" loading onPress={handlePress}>Loading</Button>
 */

import React from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  PressableStateCallbackType,
} from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SIZES, OPACITY } from '@/src/constants/theme';

export interface ButtonProps {
  /** Button text or custom content */
  children: React.ReactNode;

  /** Button press handler */
  onPress: () => void;

  /** Visual variant */
  variant?: 'primary' | 'secondary' | 'ghost';

  /** Button size */
  size?: 'small' | 'medium' | 'large';

  /** Disabled state */
  disabled?: boolean;

  /** Loading state (shows spinner, disables button) */
  loading?: boolean;

  /** Accessibility label for screen readers */
  accessibilityLabel?: string;

  /** Accessibility hint */
  accessibilityHint?: string;

  /** Additional styles for container */
  style?: ViewStyle;

  /** Additional styles for text */
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  accessibilityLabel,
  accessibilityHint,
  style,
  textStyle,
}) => {
  const isDisabled = disabled || loading;

  const getButtonStyle = (state: PressableStateCallbackType): ViewStyle[] => {
    const baseStyles: ViewStyle[] = [
      styles.base,
      styles[size],
      styles[variant],
    ];

    if (state.pressed && !isDisabled) {
      baseStyles.push(styles.pressed);
      const pressedKey = `${variant}Pressed` as const;
      if (pressedKey in styles) {
        baseStyles.push(styles[pressedKey as keyof typeof styles] as ViewStyle);
      }
    }

    if (isDisabled) {
      baseStyles.push(styles.disabled);
    }

    if (style) {
      baseStyles.push(style);
    }

    return baseStyles;
  };

  const getTextStyle = (): TextStyle[] => {
    const textStyles: TextStyle[] = [
      styles.text,
    ];

    const sizeTextKey = `${size}Text` as const;
    if (sizeTextKey in styles) {
      textStyles.push(styles[sizeTextKey as keyof typeof styles] as TextStyle);
    }

    const variantTextKey = `${variant}Text` as const;
    if (variantTextKey in styles) {
      textStyles.push(styles[variantTextKey as keyof typeof styles] as TextStyle);
    }

    if (isDisabled) {
      textStyles.push(styles.disabledText);
    }

    if (textStyle) {
      textStyles.push(textStyle);
    }

    return textStyles;
  };

  const getSpinnerColor = (): string => {
    if (variant === 'primary') {
      return COLORS.text.inverse;
    }
    return COLORS.brand.primary;
  };

  return (
    <Pressable
      style={getButtonStyle}
      onPress={onPress}
      disabled={isDisabled}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
    >
      {loading ? (
        <ActivityIndicator size="small" color={getSpinnerColor()} />
      ) : (
        typeof children === 'string' ? (
          <Text style={getTextStyle()} numberOfLines={1}>
            {children}
          </Text>
        ) : (
          children
        )
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  // Base styles
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BORDER_RADIUS.md,
    minHeight: SIZES.touchTarget,
  },

  // Size variants
  small: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    minHeight: SIZES.button.small,
  },
  medium: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: 14,
    minHeight: SIZES.button.medium,
  },
  large: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    minHeight: SIZES.button.large,
  },

  // Variant styles
  primary: {
    backgroundColor: COLORS.brand.primary,
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.brand.primary,
  },
  ghost: {
    backgroundColor: 'transparent',
  },

  // Pressed states
  pressed: {
    transform: [{ scale: 0.98 }],
  },
  primaryPressed: {
    backgroundColor: COLORS.brand.primaryDark,
  },
  secondaryPressed: {
    backgroundColor: COLORS.brand.primaryAlpha,
  },
  ghostPressed: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },

  // Disabled state
  disabled: {
    opacity: OPACITY.disabled,
  },

  // Text styles
  text: {
    ...TYPOGRAPHY.button,
    textAlign: 'center',
  },
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },

  // Text color per variant
  primaryText: {
    color: COLORS.text.inverse,
  },
  secondaryText: {
    color: COLORS.brand.primary,
  },
  ghostText: {
    color: COLORS.text.secondary,
  },

  disabledText: {
    // Opacity is handled by parent disabled style
  },
});

export default Button;
