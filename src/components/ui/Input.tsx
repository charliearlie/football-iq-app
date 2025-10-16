/**
 * Input Component
 *
 * A text input field with focus and error states, matching the design system.
 * Includes an optional clear button when text is present.
 *
 * @example
 * <Input
 *   value={guess}
 *   onChangeText={setGuess}
 *   placeholder="Enter player name"
 *   onSubmitEditing={handleSubmit}
 * />
 *
 * <Input
 *   value={answer}
 *   onChangeText={setAnswer}
 *   error="Player name is required"
 *   onClear={() => setAnswer('')}
 * />
 */

import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  Pressable,
  StyleSheet,
  ViewStyle,
  TextInputProps,
} from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SIZES } from '@/src/constants/theme';

export interface InputProps extends Omit<TextInputProps, 'style'> {
  /** Input value */
  value: string;

  /** Value change handler */
  onChangeText: (text: string) => void;

  /** Placeholder text */
  placeholder?: string;

  /** Error message to display */
  error?: string;

  /** Clear button handler */
  onClear?: () => void;

  /** Submit handler (keyboard "done" button) */
  onSubmitEditing?: () => void;

  /** Auto capitalize mode */
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';

  /** Additional container styles */
  style?: ViewStyle;

  /** Accessibility label */
  accessibilityLabel?: string;
}

export const Input: React.FC<InputProps> = ({
  value,
  onChangeText,
  placeholder = '',
  error,
  onClear,
  onSubmitEditing,
  autoCapitalize = 'words',
  style,
  accessibilityLabel,
  ...restProps
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const showClearButton = !!onClear && value.length > 0;

  const containerStyle: ViewStyle[] = [
    styles.container,
    ...(isFocused ? [styles.containerFocused] : []),
    ...(error ? [styles.containerError] : []),
    ...(style ? [style] : []),
  ];

  return (
    <View>
      <View style={containerStyle}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={COLORS.text.tertiary}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onSubmitEditing={onSubmitEditing}
          autoCapitalize={autoCapitalize}
          autoCorrect={false}
          returnKeyType="done"
          accessible={true}
          accessibilityLabel={accessibilityLabel || placeholder}
          accessibilityHint={error ? error : undefined}
          {...restProps}
        />
        {showClearButton && (
          <Pressable
            style={styles.clearButton}
            onPress={onClear}
            hitSlop={SPACING.sm}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Clear input"
          >
            <Text style={styles.clearButtonText}>✕</Text>
          </Pressable>
        )}
      </View>

      {error && (
        <Text
          style={styles.errorText}
          accessible={true}
          accessibilityRole="alert"
        >
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background.surfaceAlt,
    borderWidth: 2,
    borderColor: COLORS.border.default,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    minHeight: SIZES.input.default,
  },

  containerFocused: {
    borderColor: COLORS.border.focus,
    backgroundColor: COLORS.background.surface,
  },

  containerError: {
    borderColor: COLORS.border.error,
    backgroundColor: 'rgba(255, 71, 87, 0.05)',
  },

  input: {
    flex: 1,
    ...TYPOGRAPHY.bodyRegular,
    color: COLORS.text.primary,
    paddingVertical: 14,
  },

  clearButton: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: SPACING.sm,
  },

  clearButtonText: {
    fontSize: 18,
    color: COLORS.text.tertiary,
    fontWeight: '600',
  },

  errorText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.semantic.error,
    marginTop: SPACING.xs,
    marginLeft: SPACING.xs,
  },
});

export default Input;
