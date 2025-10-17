/**
 * Career Path Progressive Game Screen
 *
 * Game flow:
 * 1. Load an unanswered career_path question
 * 2. Show clubs one at a time (starting with first)
 * 3. User can Skip (show next club) or Guess (enter player name)
 * 4. Score decreases as more clubs shown and with each wrong guess
 * 5. Game ends on correct guess or max wrong guesses reached
 * 6. Show result modal with score and correct answer
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, TYPOGRAPHY, SPACING } from '@/src/constants/theme';
import { GAME_CONSTANTS } from '@/src/constants/game';

// Components
import { GameHeader } from '@/src/components/game/GameHeader';
import { CareerTable } from '@/src/components/game/CareerTable';
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
  calculateCareerPathScore,
  getPotentialScore,
} from '@/src/utils';

// Types
import type { Question, PlayerWithCareer } from '@/src/types/database';

export default function CareerPathProgressiveScreen() {
  const router = useRouter();

  // Game state
  const [loading, setLoading] = useState(true);
  const [question, setQuestion] = useState<Question | null>(null);
  const [player, setPlayer] = useState<PlayerWithCareer | null>(null);
  const [currentClubIndex, setCurrentClubIndex] = useState(0);
  const [guess, setGuess] = useState('');
  const [wrongGuesses, setWrongGuesses] = useState(0);
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
      setCurrentClubIndex(0);
      setGuess('');
      setWrongGuesses(0);
      setIsComplete(false);
      setShowResult(false);
      setLoading(false);
    } catch (err) {
      console.error('Failed to load question:', err);
      setError('Failed to load question. Please try again.');
      setLoading(false);
    }
  };

  const handleSkip = () => {
    if (!player || currentClubIndex >= player.careers.length - 1) {
      return;
    }
    setCurrentClubIndex((prev) => prev + 1);
  };

  const handleGuess = async () => {
    if (!player || !question || guess.trim() === '') {
      return;
    }

    // Validate guess
    const validation = validatePlayerGuess(guess, player);

    if (validation.isCorrect) {
      // Correct answer!
      const scoreResult = calculateCareerPathScore(
        player.careers.length,
        currentClubIndex + 1,
        wrongGuesses
      );

      // Record answer
      await recordQuestionAnswer(question.id, true, scoreResult.finalScore, wrongGuesses + 1);

      // Show result
      setFinalScore(scoreResult.finalScore);
      setIsComplete(true);
      setShowResult(true);
    } else {
      // Wrong answer
      const newWrongGuesses = wrongGuesses + 1;
      setWrongGuesses(newWrongGuesses);
      setGuess('');

      // Check if game over
      if (newWrongGuesses >= GAME_CONSTANTS.MAX_WRONG_GUESSES) {
        // Game over
        await recordQuestionAnswer(question.id, false, 0, newWrongGuesses);

        setFinalScore(0);
        setIsComplete(true);
        setShowResult(true);
      } else if (currentClubIndex < player.careers.length - 1) {
        // Auto-reveal next club after wrong guess
        setCurrentClubIndex((prev) => prev + 1);
      }
      // If already on last club, just stay there and let user keep guessing
    }
  };

  const handleNext = () => {
    setShowResult(false);
    loadQuestion();
  };

  // Calculate potential score
  const potentialScore = player
    ? getPotentialScore('career_path_progressive', {
        totalClubs: player.careers.length,
        clubsRevealed: currentClubIndex + 1,
        wrongGuesses,
      })
    : 0;

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

  const isLastClub = currentClubIndex >= player.careers.length - 1;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      {/* Fixed Header */}
      <GameHeader
        wrongGuesses={wrongGuesses}
        maxWrongGuesses={GAME_CONSTANTS.MAX_WRONG_GUESSES}
        hideProgress={true}
        potentialScore={potentialScore}
        scoreLabel="Points"
      />

      {/* Scrollable Game Content */}
      <ScrollView
        style={styles.gameContent}
        contentContainerStyle={styles.gameContentInner}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.instructionText}>
          Who played for {currentClubIndex === 0 ? 'this club' : 'these clubs'}?
        </Text>
        <CareerTable
          careers={player.careers}
          revealedCount={currentClubIndex + 1}
          maxHeight={300}
          style={styles.careerTable}
        />
      </ScrollView>

      {/* Fixed Footer */}
      <View style={styles.footer}>
        <Input
          value={guess}
          onChangeText={setGuess}
          placeholder="Enter player name..."
          onSubmitEditing={handleGuess}
          accessibilityLabel="Player name guess input"
          style={styles.input}
        />
        <View style={styles.buttonContainer}>
          {!isLastClub && (
            <Button
              variant="ghost"
              onPress={handleSkip}
              accessibilityLabel="Skip to next club"
              style={styles.skipButton}
            >
              Skip Club
            </Button>
          )}
          <Button
            onPress={handleGuess}
            disabled={guess.trim() === ''}
            accessibilityLabel="Submit guess"
            style={styles.guessButton}
          >
            Guess
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
            ? `Guessed after ${currentClubIndex + 1} of ${player.careers.length} clubs shown`
            : `Maximum wrong guesses (${GAME_CONSTANTS.MAX_WRONG_GUESSES}) reached`
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

  // Scrollable game content
  gameContent: {
    flex: 1,
  },

  gameContentInner: {
    padding: SPACING.md,
    flexGrow: 1,
  },

  // Game content
  instructionText: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text.primary,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },

  careerTable: {
    marginBottom: SPACING.md,
  },

  // Fixed footer section
  footer: {
    padding: SPACING.sm,
    backgroundColor: COLORS.background.primary,
    borderTopWidth: 1,
    borderTopColor: COLORS.border.default,
  },

  // Input and buttons
  input: {
    marginBottom: SPACING.xs,
  },

  buttonContainer: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },

  skipButton: {
    flex: 1,
  },

  guessButton: {
    flex: 2,
  },

  // Loading and error states
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
});
