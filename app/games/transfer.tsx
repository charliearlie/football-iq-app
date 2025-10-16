/**
 * Transfer Game Screen
 *
 * Game flow:
 * 1. Load an unanswered transfer question
 * 2. Show transfer (from club → to club, year)
 * 3. User can reveal hints (position, nationality) for fewer points
 * 4. User guesses the player
 * 5. Score based on hints revealed and wrong guesses
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
import { TransferDisplay } from '@/src/components/game/TransferDisplay';
import { ScoreCard } from '@/src/components/game/ScoreCard';
import { HintButton } from '@/src/components/game/HintButton';
import { ResultModal } from '@/src/components/game/ResultModal';
import { Input } from '@/src/components/ui/Input';
import { Button } from '@/src/components/ui/Button';

// Database queries
import {
  getUnansweredQuestion,
  getTransferWithDetails,
  recordQuestionAnswer,
} from '@/src/database/queries';

// Utils
import {
  validatePlayerGuess,
  calculateTransferScore,
  getPotentialScore,
} from '@/src/utils';

// Types
import type { Question, TransferWithDetails } from '@/src/types/database';

export default function TransferGameScreen() {
  const router = useRouter();

  // Game state
  const [loading, setLoading] = useState(true);
  const [question, setQuestion] = useState<Question | null>(null);
  const [transfer, setTransfer] = useState<TransferWithDetails | null>(null);
  const [hintsRevealed, setHintsRevealed] = useState({
    position: false,
    nationality: false,
  });
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

      // Get unanswered transfer question
      const q = await getUnansweredQuestion('transfer');

      if (!q) {
        setError('No questions available. You have answered them all!');
        setLoading(false);
        return;
      }

      // Get transfer with details
      const t = await getTransferWithDetails(q.entity_id);

      if (!t) {
        setError('Failed to load question data');
        setLoading(false);
        return;
      }

      setQuestion(q);
      setTransfer(t);
      setHintsRevealed({ position: false, nationality: false });
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

  const handleRevealHint = (hintType: 'position' | 'nationality') => {
    setHintsRevealed((prev) => ({
      ...prev,
      [hintType]: true,
    }));
  };

  const handleGuess = async () => {
    if (!transfer || !question || guess.trim() === '') {
      return;
    }

    // Validate guess
    const validation = validatePlayerGuess(guess, transfer.player);

    if (validation.isCorrect) {
      // Correct answer!
      const scoreResult = calculateTransferScore(hintsRevealed);

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
      }
    }
  };

  const handleNext = () => {
    setShowResult(false);
    loadQuestion();
  };

  // Calculate potential score
  const potentialScore = transfer
    ? getPotentialScore('transfer', {
        hintsRevealed,
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

  // No transfer/question loaded
  if (!transfer || !question) {
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
      <ScrollView style={styles.scrollContainer}>
        {/* Game Header */}
        <GameHeader
          wrongGuesses={wrongGuesses}
          maxWrongGuesses={GAME_CONSTANTS.MAX_WRONG_GUESSES}
          hideProgress={true}
        />

        {/* Score Card */}
        <View style={styles.content}>
          <ScoreCard potentialScore={potentialScore} label="Potential Points" />

          {/* Transfer Display */}
          <Text style={styles.instructionText}>
            Who made this transfer?
          </Text>
          <TransferDisplay
            fromClub={transfer.fromClub}
            toClub={transfer.toClub}
            year={transfer.transfer_year}
          />

          {/* Hints Section */}
          <View style={styles.hintsSection}>
            <Text style={styles.hintsTitle}>Hints</Text>
            <HintButton
              hintType="position"
              revealed={hintsRevealed.position}
              onReveal={() => handleRevealHint('position')}
              value={transfer.player.position || undefined}
            />
            <View style={styles.hintSpacer} />
            <HintButton
              hintType="nationality"
              revealed={hintsRevealed.nationality}
              onReveal={() => handleRevealHint('nationality')}
              value={transfer.player.nationality || undefined}
            />
          </View>

          {/* Input */}
          <Input
            value={guess}
            onChangeText={setGuess}
            placeholder="Enter player name..."
            onSubmitEditing={handleGuess}
            accessibilityLabel="Player name guess input"
            style={styles.input}
          />

          {/* Guess Button */}
          <Button
            onPress={handleGuess}
            disabled={guess.trim() === ''}
            accessibilityLabel="Submit guess"
            style={styles.guessButton}
          >
            Guess
          </Button>
        </View>
      </ScrollView>

      {/* Result Modal */}
      <ResultModal
        visible={showResult}
        isCorrect={finalScore > 0}
        score={finalScore}
        correctAnswer={transfer.player.full_name || transfer.player.name}
        breakdown={
          finalScore > 0
            ? `${finalScore} point${finalScore !== 1 ? 's' : ''}: ${
                !hintsRevealed.position && !hintsRevealed.nationality
                  ? 'No hints revealed'
                  : hintsRevealed.position && hintsRevealed.nationality
                  ? 'Both hints revealed'
                  : 'One hint revealed'
              }`
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

  scrollContainer: {
    flex: 1,
  },

  content: {
    padding: SPACING.md,
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

  instructionText: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text.primary,
    textAlign: 'center',
    marginVertical: SPACING.lg,
  },

  hintsSection: {
    marginVertical: SPACING.lg,
  },

  hintsTitle: {
    ...TYPOGRAPHY.h4,
    color: COLORS.text.secondary,
    marginBottom: SPACING.md,
  },

  hintSpacer: {
    height: SPACING.md,
  },

  input: {
    marginVertical: SPACING.lg,
  },

  guessButton: {
    width: '100%',
  },
});
