/**
 * Career Path Full Game Screen
 *
 * Game flow:
 * 1. Load an unanswered career_path question
 * 2. Show ALL clubs at once in a scrollable list
 * 3. User has ONE guess
 * 4. Score: 1 point for correct, 0 for incorrect
 * 5. Show result modal with score and correct answer
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, TYPOGRAPHY, SPACING } from '@/src/constants/theme';
import { GAME_CONSTANTS } from '@/src/constants/game';

// Components
import { ClubDisplay } from '@/src/components/game/ClubDisplay';
import { ResultModal } from '@/src/components/game/ResultModal';
import { Input } from '@/src/components/ui/Input';
import { Button } from '@/src/components/ui/Button';

// Database queries
import {
  getUnansweredQuestion,
  getPlayerWithFullCareer,
  recordQuestionAnswer,
} from '@/src/database/queries';

// Utils
import {
  validatePlayerGuess,
  calculateCareerPathFullScore,
} from '@/src/utils';

// Types
import type { Question, PlayerWithCareer, CareerWithClub } from '@/src/types/database';

export default function CareerPathFullScreen() {
  const router = useRouter();

  // Game state
  const [loading, setLoading] = useState(true);
  const [question, setQuestion] = useState<Question | null>(null);
  const [player, setPlayer] = useState<PlayerWithCareer | null>(null);
  const [guess, setGuess] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadQuestion();
  }, []);

  const loadQuestion = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get unanswered question
      const q = await getUnansweredQuestion('career_path');

      if (!q) {
        setError('No questions available. You have answered them all!');
        setLoading(false);
        return;
      }

      // Get player with full career
      const p = await getPlayerWithFullCareer(q.entity_id);

      if (!p || p.careers.length === 0) {
        setError('Failed to load question data');
        setLoading(false);
        return;
      }

      setQuestion(q);
      setPlayer(p);
      setGuess('');
      setIsComplete(false);
      setShowResult(false);
      setLoading(false);
    } catch (err) {
      console.error('Failed to load question:', err);
      setError('Failed to load question. Please try again.');
      setLoading(false);
    }
  };

  const handleGuess = async () => {
    if (!player || !question || guess.trim() === '' || isComplete) {
      return;
    }

    // Validate guess
    const validation = validatePlayerGuess(guess, player);
    const scoreResult = calculateCareerPathFullScore(validation.isCorrect);

    // Record answer
    await recordQuestionAnswer(question.id, validation.isCorrect, scoreResult.finalScore, 1);

    // Show result
    setFinalScore(scoreResult.finalScore);
    setIsComplete(true);
    setShowResult(true);
  };

  const handleNext = () => {
    setShowResult(false);
    loadQuestion();
  };

  const renderCareerItem = ({ item }: { item: CareerWithClub }) => (
    <View style={styles.careerItem}>
      <ClubDisplay
        club={item.club}
        startYear={item.start_year}
        endYear={item.end_year}
      />
    </View>
  );

  // Loading state
  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.brand.primary} />
        <Text style={styles.loadingText}>Loading question...</Text>
      </View>
    );
  }

  // Error state
  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.errorText}>{error}</Text>
        <Button onPress={() => router.back()} style={styles.errorButton}>
          Go Back
        </Button>
      </View>
    );
  }

  // No player/question loaded
  if (!player || !question) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>No question available</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.instructionText}>
            Who played for these clubs?
          </Text>
          <Text style={styles.hintText}>
            ({player.careers.length} clubs total)
          </Text>
        </View>

        {/* Clubs List */}
        <FlatList
          data={player.careers}
          renderItem={renderCareerItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={true}
        />

        {/* Input and Guess Button */}
        <View style={styles.footer}>
          <Input
            value={guess}
            onChangeText={setGuess}
            placeholder="Enter player name..."
            onSubmitEditing={handleGuess}
            editable={!isComplete}
            accessibilityLabel="Player name guess input"
            style={styles.input}
          />
          <Button
            onPress={handleGuess}
            disabled={guess.trim() === '' || isComplete}
            accessibilityLabel="Submit guess"
            style={styles.guessButton}
          >
            {isComplete ? 'Answered' : 'Guess'}
          </Button>
        </View>
      </View>

      {/* Result Modal */}
      <ResultModal
        visible={showResult}
        isCorrect={finalScore > 0}
        score={finalScore}
        correctAnswer={player.full_name || player.name}
        breakdown={
          finalScore > 0
            ? 'Correct! You identified the player from their full career.'
            : 'Incorrect guess. The correct answer is shown above.'
        }
        onNext={handleNext}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.primary,
  },

  centerContainer: {
    flex: 1,
    backgroundColor: COLORS.background.primary,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.lg,
  },

  loadingText: {
    ...TYPOGRAPHY.bodyRegular,
    color: COLORS.text.secondary,
    marginTop: SPACING.md,
  },

  errorIcon: {
    fontSize: 64,
    marginBottom: SPACING.md,
  },

  errorText: {
    ...TYPOGRAPHY.bodyRegular,
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },

  errorButton: {
    minWidth: 200,
  },

  header: {
    padding: SPACING.md,
    alignItems: 'center',
    backgroundColor: COLORS.background.surface,
  },

  instructionText: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text.primary,
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },

  hintText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.text.tertiary,
    textAlign: 'center',
  },

  listContent: {
    padding: SPACING.md,
  },

  careerItem: {
    marginBottom: SPACING.md,
  },

  footer: {
    padding: SPACING.md,
    backgroundColor: COLORS.background.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border.default,
  },

  input: {
    marginBottom: SPACING.md,
  },

  guessButton: {
    width: '100%',
  },
});
