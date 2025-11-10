import type { TypedSupabaseClient } from './client'
import type { Pack, Player, PackWithPlayers, UserStats, GameMode } from './types'

/**
 * Fetches all available packs
 */
export async function getPacks(client: TypedSupabaseClient) {
  const { data, error } = await client
    .from('packs')
    .select('*')
    .order('created_at', { ascending: true })

  if (error) throw error
  return data as Pack[]
}

/**
 * Fetches a pack with all its players using the database function
 */
export async function getPackWithPlayers(
  client: TypedSupabaseClient,
  slug: string
): Promise<PackWithPlayers | null> {
  const { data, error } = await client.rpc('get_pack_with_players', {
    p_slug: slug,
  })

  if (error) throw error
  if (!data || data.length === 0) return null

  // Transform the flat rows into a pack with nested players
  const firstRow = data[0]
  const pack: PackWithPlayers = {
    id: firstRow.pack_id,
    name: firstRow.pack_name,
    description: firstRow.pack_description,
    slug: firstRow.pack_slug,
    price: firstRow.pack_price,
    is_free: firstRow.pack_is_free,
    difficulty_range: null,
    question_count: data.filter(row => row.player_id).length,
    created_at: '',
    updated_at: '',
    players: data
      .filter(row => row.player_id)
      .map(row => ({
        id: row.player_id,
        pack_id: firstRow.pack_id,
        name: row.player_name,
        full_name: row.player_full_name,
        nationality: row.player_nationality,
        position: row.player_position,
        career_path: row.player_career_path as string[],
        aliases: row.player_aliases as string[],
        hints: row.player_hints as any,
        difficulty: row.player_difficulty,
        created_at: '',
        updated_at: '',
      })),
  }

  return pack
}

/**
 * Checks if a user owns a specific pack
 */
export async function userOwnsPack(
  client: TypedSupabaseClient,
  userId: string,
  packId: string
): Promise<boolean> {
  const { data, error } = await client
    .from('user_packs')
    .select('id')
    .eq('user_id', userId)
    .eq('pack_id', packId)
    .single()

  if (error && error.code !== 'PGRST116') throw error // PGRST116 = no rows returned
  return !!data
}

/**
 * Purchases a pack for a user (free or paid)
 */
export async function purchasePack(
  client: TypedSupabaseClient,
  userId: string,
  packId: string
) {
  const { data, error } = await client
    .from('user_packs')
    .insert({
      user_id: userId,
      pack_id: packId,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Records user progress for a question
 */
export async function recordProgress(
  client: TypedSupabaseClient,
  userId: string,
  playerId: string,
  gameMode: GameMode,
  answeredCorrectly: boolean,
  attempts: number,
  scoreEarned: number
) {
  const { data, error } = await client
    .from('user_progress')
    .upsert({
      user_id: userId,
      player_id: playerId,
      game_mode: gameMode,
      answered_correctly: answeredCorrectly,
      attempts,
      score_earned: scoreEarned,
      completed_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Gets user statistics using the database function
 */
export async function getUserStats(
  client: TypedSupabaseClient,
  userId: string
): Promise<UserStats | null> {
  const { data, error } = await client.rpc('get_user_stats', {
    p_user_id: userId,
  })

  if (error) throw error
  if (!data || data.length === 0) return null

  return data[0] as UserStats
}

/**
 * Gets the leaderboard (top N users)
 */
export async function getLeaderboard(
  client: TypedSupabaseClient,
  limit: number = 100
) {
  const { data, error } = await client
    .from('leaderboards')
    .select('*')
    .order('rank', { ascending: true })
    .limit(limit)

  if (error) throw error
  return data
}

/**
 * Creates or updates a game session
 */
export async function saveGameSession(
  client: TypedSupabaseClient,
  userId: string,
  packId: string,
  gameMode: GameMode,
  currentQuestionIndex: number,
  score: number,
  sessionState?: any
) {
  const { data, error } = await client
    .from('game_sessions')
    .upsert({
      user_id: userId,
      pack_id: packId,
      game_mode: gameMode,
      current_question_index: currentQuestionIndex,
      score,
      session_state: sessionState,
      last_activity_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Gets a user's active game session
 */
export async function getGameSession(
  client: TypedSupabaseClient,
  userId: string,
  packId: string,
  gameMode: GameMode
) {
  const { data, error } = await client
    .from('game_sessions')
    .select('*')
    .eq('user_id', userId)
    .eq('pack_id', packId)
    .eq('game_mode', gameMode)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data
}

/**
 * Deletes a game session (when completed)
 */
export async function deleteGameSession(
  client: TypedSupabaseClient,
  sessionId: string
) {
  const { error } = await client
    .from('game_sessions')
    .delete()
    .eq('id', sessionId)

  if (error) throw error
}
