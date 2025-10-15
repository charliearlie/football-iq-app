/**
 * Sync-related types and interfaces
 *
 * This module defines the type system for data synchronization between
 * the local SQLite database and the remote server.
 *
 * Design principles:
 * - Server is the source of truth for content (clubs, players, questions)
 * - Client is the source of truth for user data until synced
 * - All timestamps use ISO 8601 format for consistency
 * - is_synced flag tracks if local changes need to be pushed to server
 */

/**
 * Base interface for all entities that can be synchronized with the server
 *
 * This interface should be extended by all database models that participate
 * in sync operations.
 */
export interface SyncableEntity {
  /**
   * Timestamp from the server indicating when the entity was last updated
   * on the server. ISO 8601 format.
   *
   * Null for local-only entities that haven't been synced yet.
   */
  server_updated_at: string | null;

  /**
   * Timestamp indicating when the entity was last modified locally.
   * ISO 8601 format.
   *
   * Used to track local changes and determine if entity needs to be synced.
   */
  local_updated_at: string | null;

  /**
   * Sync status flag
   * - 1 = entity is synced with server (no local changes)
   * - 0 = entity has local changes that need to be pushed to server
   *
   * Note: SQLite doesn't have a boolean type, so we use 0|1
   */
  is_synced: 0 | 1;
}

/**
 * Sync status enum for better type safety
 */
export enum SyncStatus {
  /** Entity is synced with server */
  Synced = 1,
  /** Entity needs to be synced to server */
  NotSynced = 0,
}

/**
 * Sync direction - which way the data flows
 */
export enum SyncDirection {
  /** Data flows FROM server TO client (read-only content) */
  FromServer = 'from_server',
  /** Data flows FROM client TO server (user-generated data) */
  ToServer = 'to_server',
  /** Data can flow in both directions */
  Bidirectional = 'bidirectional',
}

/**
 * Conflict resolution strategy
 *
 * When both client and server have changes to the same entity,
 * we need a strategy to resolve the conflict.
 */
export enum ConflictResolution {
  /** Server wins - discard local changes */
  ServerWins = 'server_wins',
  /** Client wins - push local changes to server */
  ClientWins = 'client_wins',
  /** Last write wins - use timestamps to determine winner */
  LastWriteWins = 'last_write_wins',
  /** Manual resolution required */
  Manual = 'manual',
}

/**
 * Sync operation result
 */
export interface SyncResult {
  /** Whether the sync was successful */
  success: boolean;

  /** Number of entities downloaded from server */
  downloaded: number;

  /** Number of entities uploaded to server */
  uploaded: number;

  /** Number of conflicts encountered */
  conflicts: number;

  /** Error message if sync failed */
  error?: string;

  /** Timestamp when sync completed */
  completedAt: string;
}

/**
 * Delta sync metadata
 *
 * For efficient syncing, we only want to sync entities that have changed
 * since the last sync. This metadata tracks the last sync timestamp.
 */
export interface DeltaSyncMetadata {
  /** Timestamp of last successful sync (ISO 8601) */
  lastSyncTimestamp: string | null;

  /** Opaque token from server for incremental sync */
  syncToken: string | null;
}

/**
 * Sync payload for pushing changes to server
 *
 * This is a generic type that can be used for any entity type.
 */
export interface SyncPushPayload<T> {
  /** Type of entity being synced */
  entityType: string;

  /** Array of entities to create on server */
  creates: T[];

  /** Array of entities to update on server */
  updates: T[];

  /** Array of entity IDs to delete on server */
  deletes: Array<string | number>;

  /** Client timestamp when payload was created */
  clientTimestamp: string;
}

/**
 * Sync payload for pulling changes from server
 */
export interface SyncPullPayload<T> {
  /** Type of entity being synced */
  entityType: string;

  /** Array of entities from server */
  entities: T[];

  /** Token to use for next incremental sync */
  nextSyncToken: string | null;

  /** Server timestamp when payload was created */
  serverTimestamp: string;

  /** Whether this is a full sync or incremental */
  isFull: boolean;
}

/**
 * Sync conflict
 *
 * Represents a conflict between local and server state
 */
export interface SyncConflict<T> {
  /** The entity type that has a conflict */
  entityType: string;

  /** The entity ID */
  entityId: string | number;

  /** Local version of the entity */
  localVersion: T;

  /** Server version of the entity */
  serverVersion: T;

  /** Timestamp when conflict was detected */
  detectedAt: string;

  /** Resolution strategy to use */
  resolution: ConflictResolution;
}
