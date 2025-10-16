/**
 * ResultModal Component
 *
 * Displays the result of a question attempt with score, correct answer,
 * and a breakdown explanation. Themed green for success, red for failure.
 *
 * @example
 * <ResultModal
 *   visible={true}
 *   isCorrect={true}
 *   score={3}
 *   correctAnswer="Cristiano Ronaldo"
 *   breakdown="3 points: Guessed on first club"
 *   onNext={loadNextQuestion}
 * />
 *
 * <ResultModal
 *   visible={true}
 *   isCorrect={false}
 *   score={0}
 *   correctAnswer="Lionel Messi"
 *   breakdown="Maximum wrong guesses reached"
 *   onNext={loadNextQuestion}
 * />
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING } from '@/src/constants/theme';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

export interface ResultModalProps {
  /** Modal visibility */
  visible: boolean;

  /** Whether the answer was correct */
  isCorrect: boolean;

  /** Score earned */
  score: number;

  /** The correct answer */
  correctAnswer: string;

  /** Breakdown explanation of scoring */
  breakdown: string;

  /** Handler for next question */
  onNext: () => void;
}

export const ResultModal: React.FC<ResultModalProps> = ({
  visible,
  isCorrect,
  score,
  correctAnswer,
  breakdown,
  onNext,
}) => {
  const themeColor = isCorrect ? COLORS.semantic.success : COLORS.semantic.error;
  const icon = isCorrect ? '✓' : '✗';
  const title = isCorrect ? 'Correct!' : 'Wrong Answer';

  return (
    <Modal
      visible={visible}
      onClose={onNext}
      disableBackdropPress={true}
      contentStyle={styles.content}
    >
      <View style={styles.container}>
        {/* Icon and Title */}
        <View style={styles.header}>
          <View style={[styles.iconContainer, { backgroundColor: `${themeColor}20` }]}>
            <Text style={[styles.icon, { color: themeColor }]}>
              {icon}
            </Text>
          </View>
          <Text style={[styles.title, { color: themeColor }]}>
            {title}
          </Text>
        </View>

        {/* Score */}
        <View style={styles.scoreSection}>
          <Text style={styles.scoreLabel}>Score Earned</Text>
          <Text style={[styles.score, { color: themeColor }]}>
            {score}
          </Text>
          <Text style={styles.scoreLabel}>points</Text>
        </View>

        {/* Correct Answer */}
        <View style={styles.answerSection}>
          <Text style={styles.answerLabel}>Correct Answer:</Text>
          <Text style={styles.answer}>{correctAnswer}</Text>
        </View>

        {/* Breakdown */}
        <View style={styles.breakdownSection}>
          <Text style={styles.breakdown}>{breakdown}</Text>
        </View>

        {/* Next Button */}
        <Button
          onPress={onNext}
          variant="primary"
          size="large"
          accessibilityLabel="Continue to next question"
        >
          Next Question
        </Button>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingVertical: SPACING.xl,
  },

  container: {
    alignItems: 'center',
  },

  header: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },

  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },

  icon: {
    fontSize: 48,
    fontWeight: 'bold',
  },

  title: {
    ...TYPOGRAPHY.h1,
    textAlign: 'center',
  },

  scoreSection: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xl,
    backgroundColor: COLORS.background.surfaceAlt,
    borderRadius: 16,
    width: '100%',
  },

  scoreLabel: {
    ...TYPOGRAPHY.label,
    color: COLORS.text.tertiary,
  },

  score: {
    ...TYPOGRAPHY.display,
    fontWeight: '700',
    marginVertical: SPACING.xs,
  },

  answerSection: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
    width: '100%',
  },

  answerLabel: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.text.secondary,
    marginBottom: SPACING.xs,
  },

  answer: {
    ...TYPOGRAPHY.h2,
    color: COLORS.text.primary,
    textAlign: 'center',
  },

  breakdownSection: {
    marginBottom: SPACING.xl,
    paddingHorizontal: SPACING.md,
    width: '100%',
  },

  breakdown: {
    ...TYPOGRAPHY.bodyRegular,
    color: COLORS.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default ResultModal;
