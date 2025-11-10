import { supabase } from './client'
import type { Pack, Player, UserProgress } from '@football-iq/database'

/**
 * Offline-First Sync Architecture for Football IQ Mobile App
 *
 * Strategy:
 * - Content (packs, players) syncs FROM Supabase TO local SQLite (read-only)
 * - User data (progress, sessions) syncs FROM local SQLite TO Supabase (write-back)
 * - Local SQLite is the source of truth for gameplay (offline-first)
 * - Periodic background sync keeps data fresh
 */

export interface SyncStatus {
  lastSync: string | null
  packsCount: number
  playersCount: number
  pendingUploads: number
}

/**
 * Downloads packs and players from Supabase
 * This should be called on app startup and periodically
 */
export async function syncContentFromServer(): Promise<{
  packs: Pack[]
  players: Player[]
}> {
  try {
    // Fetch all packs
    const { data: packs, error: packsError } = await supabase
      .from('packs')
      .select('*')
      .order('created_at', { ascending: true })

    if (packsError) throw packsError

    // Fetch all players
    const { data: players, error: playersError } = await supabase
      .from('players')
      .select('*')

    if (playersError) throw playersError

    return {
      packs: packs || [],
      players: players || [],
    }
  } catch (error) {
    console.error('Error syncing content from server:', error)
    throw error
  }
}

/**
 * Uploads user progress to Supabase
 * This should be called after completing questions and periodically for pending uploads
 */
export async function syncUserProgressToServer(
  userId: string,
  progress: UserProgress[]
): Promise<void> {
  try {
    if (!userId || progress.length === 0) return

    // Upload progress records
    const { error } = await supabase
      .from('user_progress')
      .upsert(
        progress.map(p => ({
          user_id: userId,
          player_id: p.player_id,
          game_mode: p.game_mode,
          answered_correctly: p.answered_correctly,
          attempts: p.attempts,
          score_earned: p.score_earned,
          completed_at: p.completed_at,
        })),
        {
          onConflict: 'user_id,player_id,game_mode',
        }
      )

    if (error) throw error
  } catch (error) {
    console.error('Error syncing progress to server:', error)
    throw error
  }
}

/**
 * Downloads user progress from Supabase
 * This should be called on login to restore progress across devices
 */
export async function syncUserProgressFromServer(
  userId: string
): Promise<UserProgress[]> {
  try {
    if (!userId) return []

    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)

    if (error) throw error

    return data || []
  } catch (error) {
    console.error('Error fetching progress from server:', error)
    throw error
  }
}

/**
 * Performs a full bidirectional sync
 * 1. Download latest content (packs, players) from server
 * 2. Download user progress from server (merge with local)
 * 3. Upload pending local changes to server
 */
export async function performFullSync(
  userId: string,
  localProgress: UserProgress[]
): Promise<{
  content: { packs: Pack[]; players: Player[] }
  serverProgress: UserProgress[]
}> {
  try {
    // Step 1: Download content
    const content = await syncContentFromServer()

    // Step 2: Download user progress
    const serverProgress = await syncUserProgressFromServer(userId)

    // Step 3: Upload local progress that's newer than server
    // (You would implement logic here to compare timestamps and only upload newer records)
    await syncUserProgressToServer(userId, localProgress)

    return {
      content,
      serverProgress,
    }
  } catch (error) {
    console.error('Error performing full sync:', error)
    throw error
  }
}

/**
 * Checks if the user is online
 */
export async function checkConnectivity(): Promise<boolean> {
  try {
    const { error } = await supabase.from('packs').select('id').limit(1)
    return !error
  } catch {
    return false
  }
}

/**
 * Sets up real-time subscriptions for live updates (optional)
 * This is useful for leaderboard updates in real-time
 */
export function subscribeToLeaderboard(
  callback: (payload: any) => void
) {
  return supabase
    .channel('leaderboard-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'leaderboards',
      },
      callback
    )
    .subscribe()
}
