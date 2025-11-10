import { createClient, SupabaseClient } from '@supabase/supabase-js'
import type { Database } from './types'

/**
 * Creates a Supabase client instance
 * @param supabaseUrl - The Supabase project URL
 * @param supabaseKey - The Supabase anon/public key
 * @returns Configured Supabase client
 */
export function createSupabaseClient(
  supabaseUrl: string,
  supabaseKey: string
): SupabaseClient<Database> {
  return createClient<Database>(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  })
}

export type TypedSupabaseClient = SupabaseClient<Database>
