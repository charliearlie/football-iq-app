/**
 * Database connection singleton
 *
 * This module provides a singleton pattern for the SQLite database connection.
 * The database is automatically initialized on first access.
 *
 * Usage:
 *   import { getDatabase } from '@/src/database/connection';
 *
 *   const db = await getDatabase();
 *   const result = await db.getAllAsync('SELECT * FROM players');
 */

import * as SQLite from 'expo-sqlite';
import { DATABASE_CONFIG } from '../constants/database';
import { initializeDatabase } from './schema';

/**
 * Singleton database instance
 * Null until first call to getDatabase()
 */
let databaseInstance: SQLite.SQLiteDatabase | null = null;

/**
 * Flag to track if database has been initialized
 */
let isInitialized = false;

/**
 * Promise to track ongoing initialization
 * Prevents multiple simultaneous initialization attempts
 */
let initializationPromise: Promise<SQLite.SQLiteDatabase> | null = null;

/**
 * Gets the database instance, creating and initializing it if necessary
 *
 * This function implements the singleton pattern:
 * - First call: creates database, initializes schema, returns instance
 * - Subsequent calls: returns existing instance
 * - Concurrent calls during initialization: wait for same initialization promise
 *
 * @returns Promise that resolves to the database instance
 * @throws Error if database creation or initialization fails
 */
export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  // If database is already initialized, return it immediately
  if (databaseInstance && isInitialized) {
    return databaseInstance;
  }

  // If initialization is in progress, wait for it
  if (initializationPromise) {
    return initializationPromise;
  }

  // Start new initialization
  initializationPromise = initializeDatabaseConnection();

  try {
    const db = await initializationPromise;
    return db;
  } finally {
    // Clear the initialization promise
    initializationPromise = null;
  }
}

/**
 * Checks the database schema version and resets if needed
 */
async function checkDatabaseVersion(db: SQLite.SQLiteDatabase): Promise<boolean> {
  try {
    const result = await db.getFirstAsync<{ value: string }>(
      'SELECT value FROM sync_metadata WHERE key = ?',
      ['schema_version']
    );

    const storedVersion = result ? parseInt(result.value, 10) : 0;

    if (storedVersion !== DATABASE_CONFIG.VERSION) {
      console.log(
        `Database version mismatch (stored: ${storedVersion}, expected: ${DATABASE_CONFIG.VERSION}). Resetting database...`
      );
      return true; // Needs reset
    }

    return false; // Version matches, no reset needed
  } catch (error) {
    // If sync_metadata table doesn't exist yet, this is a first run or old schema
    console.log('Could not read schema version, will initialize fresh database');
    return true; // Needs reset
  }
}

/**
 * Stores the current database schema version
 */
async function storeSchemaVersion(db: SQLite.SQLiteDatabase): Promise<void> {
  const now = new Date().toISOString();
  await db.runAsync(
    `INSERT OR REPLACE INTO sync_metadata (key, value, updated_at) VALUES (?, ?, ?)`,
    ['schema_version', DATABASE_CONFIG.VERSION.toString(), now]
  );
  console.log(`Schema version ${DATABASE_CONFIG.VERSION} stored in database`);
}

/**
 * Internal function to initialize the database connection
 */
async function initializeDatabaseConnection(): Promise<SQLite.SQLiteDatabase> {
  try {
    console.log(`Opening database: ${DATABASE_CONFIG.NAME}`);

    // Open or create the database
    let db = await SQLite.openDatabaseAsync(DATABASE_CONFIG.NAME);

    // Check if database version matches
    const needsReset = await checkDatabaseVersion(db);

    if (needsReset) {
      // Close current connection
      await db.closeAsync();

      // Delete old database
      await SQLite.deleteDatabaseAsync(DATABASE_CONFIG.NAME);
      console.log('Old database deleted');

      // Reopen fresh database
      db = await SQLite.openDatabaseAsync(DATABASE_CONFIG.NAME);
      console.log('Fresh database created');
    }

    // Store the instance
    databaseInstance = db;

    // Initialize the schema (idempotent)
    await initializeDatabase(db);

    // Store the current schema version
    await storeSchemaVersion(db);

    // Mark as initialized
    isInitialized = true;

    console.log('Database connection established successfully');

    return db;
  } catch (error) {
    // Reset state on failure
    databaseInstance = null;
    isInitialized = false;

    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';

    console.error('Failed to initialize database connection:', errorMessage);

    throw new Error(
      `Database connection failed: ${errorMessage}. ` +
        'Please ensure the app has proper file system permissions.'
    );
  }
}

/**
 * Closes the database connection
 *
 * This is typically not needed in React Native apps (the database
 * connection can remain open for the lifetime of the app), but is
 * provided for testing and special cases.
 *
 * @returns Promise that resolves when the database is closed
 */
export async function closeDatabaseAsync(): Promise<void> {
  if (databaseInstance) {
    try {
      await databaseInstance.closeAsync();
      console.log('Database connection closed');
    } catch (error) {
      console.error('Error closing database:', error);
      throw error;
    } finally {
      databaseInstance = null;
      isInitialized = false;
      initializationPromise = null;
    }
  }
}

/**
 * Resets the database (for testing only)
 *
 * WARNING: This deletes all data!
 *
 * @returns Promise that resolves when the database is reset
 */
export async function resetDatabaseAsync(): Promise<void> {
  // Close the current connection
  await closeDatabaseAsync();

  // Delete and recreate the database
  try {
    await SQLite.deleteDatabaseAsync(DATABASE_CONFIG.NAME);
    console.log('Database deleted successfully');

    // Get a fresh database (will trigger initialization)
    await getDatabase();

    console.log('Database reset complete');
  } catch (error) {
    console.error('Error resetting database:', error);
    throw new Error(
      `Failed to reset database: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Gets database connection status
 *
 * @returns Object with connection status information
 */
export function getDatabaseStatus(): {
  isConnected: boolean;
  isInitialized: boolean;
  databaseName: string;
} {
  return {
    isConnected: databaseInstance !== null,
    isInitialized,
    databaseName: DATABASE_CONFIG.NAME,
  };
}
