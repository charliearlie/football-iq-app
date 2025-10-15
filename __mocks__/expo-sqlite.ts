/**
 * Mock for expo-sqlite that uses better-sqlite3 for testing
 */
import Database from 'better-sqlite3';

type RunResult = {
  changes: number;
  lastInsertRowid: number;
};

type SQLiteDatabase = {
  execAsync(source: string): Promise<void>;
  runAsync(source: string, params?: any[]): Promise<RunResult>;
  getFirstAsync<T>(source: string, params?: any[]): Promise<T | null>;
  getAllAsync<T>(source: string, params?: any[]): Promise<T[]>;
  closeAsync(): Promise<void>;
};

const databases = new Map<string, Database.Database>();

export async function openDatabaseAsync(
  databaseName: string
): Promise<SQLiteDatabase> {
  let db: Database.Database;

  // Use in-memory database for ':memory:' or create/open file database
  if (databaseName === ':memory:') {
    db = new Database(':memory:');
  } else {
    // For tests, use in-memory databases by default
    db = databases.get(databaseName) || new Database(':memory:');
    databases.set(databaseName, db);
  }

  return {
    async execAsync(source: string): Promise<void> {
      db.exec(source);
    },

    async runAsync(source: string, params?: any[]): Promise<RunResult> {
      const stmt = db.prepare(source);
      const info = stmt.run(...(params || []));
      return {
        changes: info.changes,
        lastInsertRowid: Number(info.lastInsertRowid),
      };
    },

    async getFirstAsync<T>(source: string, params?: any[]): Promise<T | null> {
      const stmt = db.prepare(source);
      const result = stmt.get(...(params || [])) as T | undefined;
      return result || null;
    },

    async getAllAsync<T>(source: string, params?: any[]): Promise<T[]> {
      const stmt = db.prepare(source);
      return stmt.all(...(params || [])) as T[];
    },

    async closeAsync(): Promise<void> {
      db.close();
    },
  };
}

export async function deleteDatabaseAsync(databaseName: string): Promise<void> {
  const db = databases.get(databaseName);
  if (db) {
    db.close();
    databases.delete(databaseName);
  }
}
