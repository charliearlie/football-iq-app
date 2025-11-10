-- =============================================================================
-- Football IQ Database Reset Migration
-- =============================================================================
-- This migration completely wipes the database clean for a fresh start.
-- WARNING: This will destroy ALL existing data!
-- =============================================================================

-- Drop all existing tables (if they exist) with CASCADE to handle dependencies
-- Core tables from migrations
DROP TABLE IF EXISTS leaderboards CASCADE;
DROP TABLE IF EXISTS game_sessions CASCADE;
DROP TABLE IF EXISTS user_progress CASCADE;
DROP TABLE IF EXISTS user_packs CASCADE;
DROP TABLE IF EXISTS players CASCADE;
DROP TABLE IF EXISTS packs CASCADE;

-- Extra tables (from previous iterations)
DROP TABLE IF EXISTS clubs CASCADE;
DROP TABLE IF EXISTS player_careers CASCADE;
DROP TABLE IF EXISTS transfers CASCADE;
DROP TABLE IF EXISTS matches CASCADE;
DROP TABLE IF EXISTS match_goalscorers CASCADE;
DROP TABLE IF EXISTS daily_challenges CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP TABLE IF EXISTS user_attempts CASCADE;
DROP TABLE IF EXISTS archive_purchases CASCADE;

-- Drop any existing custom types/enums
DROP TYPE IF EXISTS game_mode_type CASCADE;

-- Drop any existing functions
DROP FUNCTION IF EXISTS update_leaderboard() CASCADE;
DROP FUNCTION IF EXISTS get_user_stats(UUID) CASCADE;
DROP FUNCTION IF EXISTS get_pack_with_players(TEXT) CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Drop any existing triggers
-- Note: Triggers are automatically dropped when tables are dropped with CASCADE

-- Clean up any remaining schemas (keeping public)
-- No custom schemas to drop in this case

-- Reset sequences (if any existed)
-- Sequences will be recreated with the new schema

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Database reset complete. All tables, functions, and triggers have been dropped.';
END $$;
