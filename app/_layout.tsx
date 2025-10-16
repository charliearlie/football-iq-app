/**
 * Root Layout
 *
 * Application root with Stack navigation and database initialization.
 * Initializes database and seeds data on first mount.
 */

import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View, StyleSheet, Text } from 'react-native';
import 'react-native-reanimated';

import { COLORS, TYPOGRAPHY } from '@/src/constants/theme';
import { getDatabase } from '@/src/database/connection';
import { seedDatabase } from '@/src/database/seed';

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function initializeApp() {
      try {
        console.log('Initializing database...');

        // Initialize database
        await getDatabase();

        // Seed data
        await seedDatabase();

        console.log('App initialization complete');
        setIsReady(true);
      } catch (err) {
        console.error('Failed to initialize app:', err);
        setError(err instanceof Error ? err.message : 'Failed to initialize database');
      }
    }

    initializeApp();
  }, []);

  // Show loading spinner while initializing
  if (!isReady && !error) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.brand.primary} />
        <Text style={styles.loadingText}>Initializing...</Text>
      </View>
    );
  }

  // Show error screen if initialization failed
  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>⚠️</Text>
        <Text style={styles.errorTitle}>Initialization Error</Text>
        <Text style={styles.errorMessage}>{error}</Text>
      </View>
    );
  }

  // Render app navigation
  return (
    <>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: COLORS.background.primary },
          headerTintColor: COLORS.text.primary,
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 18,
          },
          contentStyle: { backgroundColor: COLORS.background.primary },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: 'Football Trivia',
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="games/career-path-progressive"
          options={{
            title: 'Career Path',
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="games/career-path-full"
          options={{
            title: 'Career Path - Full',
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="games/transfer"
          options={{
            title: 'Transfer Game',
            headerShown: true,
          }}
        />
      </Stack>
      <StatusBar style="light" />
    </>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.background.primary,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },

  loadingText: {
    ...TYPOGRAPHY.bodyRegular,
    color: COLORS.text.secondary,
    marginTop: 16,
  },

  errorText: {
    fontSize: 64,
    marginBottom: 16,
  },

  errorTitle: {
    ...TYPOGRAPHY.h2,
    color: COLORS.semantic.error,
    marginBottom: 8,
  },

  errorMessage: {
    ...TYPOGRAPHY.bodyRegular,
    color: COLORS.text.secondary,
    textAlign: 'center',
  },
});
