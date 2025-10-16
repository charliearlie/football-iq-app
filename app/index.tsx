/**
 * Home Screen
 *
 * Main landing screen displaying user stats and game mode selection cards.
 * Users can choose between Career Path Progressive, Career Path Full, or Transfer Game.
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Pressable,
  PressableStateCallbackType,
} from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, getShadow } from '@/src/constants/theme';
import { Card } from '@/src/components/ui/Card';
import { getUserStats } from '@/src/database/queries';
import type { UserStats } from '@/src/types/database';

interface GameModeCardProps {
  title: string;
  description: string;
  icon: string;
  accentColor: string;
  onPress: () => void;
}

const GameModeCard: React.FC<GameModeCardProps> = ({
  title,
  description,
  icon,
  accentColor,
  onPress,
}) => {
  return (
    <Card
      onPress={onPress}
      accentColor={accentColor}
      accessibilityLabel={`${title}. ${description}`}
      accessibilityHint="Double tap to start this game mode"
    >
      <View style={styles.gameModeContent}>
        <Text style={styles.gameModeIcon}>{icon}</Text>
        <View style={styles.gameModeTextContainer}>
          <Text style={styles.gameModeTitle}>{title}</Text>
          <Text style={styles.gameModeDescription}>{description}</Text>
        </View>
      </View>
    </Card>
  );
};

export default function HomeScreen() {
  const router = useRouter();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const userStats = await getUserStats();
      setStats(userStats);
    } catch (error) {
      console.error('Failed to load user stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const navigateToGame = (path: string) => {
    router.push(path as any);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Title Section */}
      <View style={styles.titleSection}>
        <Text style={styles.title}>⚽ Football Trivia</Text>
        <Text style={styles.subtitle}>Test your football knowledge!</Text>
      </View>

      {/* User Stats Card */}
      {loading ? (
        <Card style={styles.statsCard}>
          <ActivityIndicator size="small" color={COLORS.brand.primary} />
        </Card>
      ) : stats ? (
        <Card style={styles.statsCard}>
          <Text style={styles.statsTitle}>Your Stats</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.total_questions_answered}</Text>
              <Text style={styles.statLabel}>Questions</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.total_score}</Text>
              <Text style={styles.statLabel}>Total Score</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.current_streak}</Text>
              <Text style={styles.statLabel}>Streak</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {Math.round(stats.accuracy_rate * 100)}%
              </Text>
              <Text style={styles.statLabel}>Accuracy</Text>
            </View>
          </View>
        </Card>
      ) : null}

      {/* Game Modes Section */}
      <View style={styles.gameModesSection}>
        <Text style={styles.sectionTitle}>Choose a Game Mode</Text>

        <GameModeCard
          title="Career Path Progressive"
          description="Clubs revealed one by one. Guess the player!"
          icon="🎯"
          accentColor={COLORS.gameModes.careerPath.primary}
          onPress={() => navigateToGame('/games/career-path-progressive')}
        />

        <GameModeCard
          title="Career Path Full"
          description="All clubs shown at once. One guess only!"
          icon="📋"
          accentColor={COLORS.gameModes.careerPathFull.primary}
          onPress={() => navigateToGame('/games/career-path-full')}
        />

        <GameModeCard
          title="Transfer Game"
          description="Identify the player from a famous transfer"
          icon="🔄"
          accentColor={COLORS.gameModes.transfer.primary}
          onPress={() => navigateToGame('/games/transfer')}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.primary,
  },

  contentContainer: {
    padding: SPACING.md,
  },

  titleSection: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
    marginTop: SPACING.md,
  },

  title: {
    ...TYPOGRAPHY.h1,
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },

  subtitle: {
    ...TYPOGRAPHY.bodyRegular,
    color: COLORS.text.secondary,
  },

  statsCard: {
    marginBottom: SPACING.xl,
  },

  statsTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },

  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },

  statItem: {
    alignItems: 'center',
  },

  statValue: {
    ...TYPOGRAPHY.h2,
    color: COLORS.brand.primary,
    marginBottom: SPACING.xs,
  },

  statLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.tertiary,
  },

  gameModesSection: {
    marginBottom: SPACING.xl,
  },

  sectionTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
  },

  gameModeContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  gameModeIcon: {
    fontSize: 40,
    marginRight: SPACING.md,
  },

  gameModeTextContainer: {
    flex: 1,
  },

  gameModeTitle: {
    ...TYPOGRAPHY.h4,
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },

  gameModeDescription: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.text.secondary,
  },
});
