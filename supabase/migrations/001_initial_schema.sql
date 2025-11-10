-- =============================================================================
-- Football IQ Initial Schema Migration
-- =============================================================================
-- Creates all tables, indexes, RLS policies, and database functions
-- for the Football IQ trivia platform
-- =============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- CUSTOM TYPES
-- =============================================================================

-- Game mode enum for type safety
CREATE TYPE game_mode_type AS ENUM (
    'career_path_progressive',  -- Clubs revealed sequentially
    'career_path_full',         -- All clubs shown at once
    'transfer'                  -- Identify player from transfer
);

-- =============================================================================
-- TABLES
-- =============================================================================

-- -----------------------------------------------------------------------------
-- PACKS: Question packs that group players/questions together
-- -----------------------------------------------------------------------------
CREATE TABLE packs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    slug TEXT NOT NULL UNIQUE,
    price DECIMAL(10, 2),  -- NULL = free pack
    difficulty_range TEXT,  -- e.g., "1-3", "4-5"
    question_count INTEGER NOT NULL DEFAULT 0,
    is_free BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE packs IS 'Question packs that group players together for purchase';
COMMENT ON COLUMN packs.slug IS 'URL-friendly identifier for the pack';
COMMENT ON COLUMN packs.price IS 'Price in dollars. NULL for free packs';
COMMENT ON COLUMN packs.question_count IS 'Total number of players/questions in this pack';

-- -----------------------------------------------------------------------------
-- PLAYERS: Football players with career data for trivia questions
-- -----------------------------------------------------------------------------
CREATE TABLE players (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pack_id UUID NOT NULL REFERENCES packs(id) ON DELETE CASCADE,
    name TEXT NOT NULL,  -- Display name (e.g., "Messi")
    full_name TEXT,      -- Full legal name (e.g., "Lionel Andrés Messi")
    nationality TEXT NOT NULL,
    position TEXT,       -- e.g., "Forward", "Midfielder"

    -- Career path stored as JSONB array in chronological order (oldest → newest)
    -- Example: ["Newell's Old Boys (2003-2004)", "Barcelona (2004-2021)", "PSG (2021-2023)", "Inter Miami (2023-present)"]
    career_path JSONB NOT NULL,

    -- Name variations for flexible matching
    -- Example: ["Messi", "Lionel Messi", "Leo Messi", "La Pulga"]
    aliases JSONB NOT NULL DEFAULT '[]'::jsonb,

    -- Progressive hints for gameplay
    -- Example: {"hint1": "Won 8 Ballon d'Or awards", "hint2": "Argentina captain", "hint3": "Scored over 800 career goals"}
    hints JSONB,

    difficulty INTEGER NOT NULL CHECK (difficulty >= 1 AND difficulty <= 5),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE players IS 'Football players with career data for trivia questions';
COMMENT ON COLUMN players.career_path IS 'JSONB array of career clubs in chronological order';
COMMENT ON COLUMN players.aliases IS 'JSONB array of name variations for answer matching';
COMMENT ON COLUMN players.hints IS 'Progressive hints shown during gameplay';
COMMENT ON COLUMN players.difficulty IS 'Difficulty rating from 1 (easy) to 5 (expert)';

-- -----------------------------------------------------------------------------
-- USER_PACKS: Tracks which packs users have purchased/unlocked
-- -----------------------------------------------------------------------------
CREATE TABLE user_packs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    pack_id UUID NOT NULL REFERENCES packs(id) ON DELETE CASCADE,
    purchased_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Ensure user can't purchase same pack twice
    UNIQUE(user_id, pack_id)
);

COMMENT ON TABLE user_packs IS 'Tracks pack purchases and unlocks for each user';

-- -----------------------------------------------------------------------------
-- USER_PROGRESS: Tracks question completion and answers
-- -----------------------------------------------------------------------------
CREATE TABLE user_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    game_mode game_mode_type NOT NULL,

    answered_correctly BOOLEAN NOT NULL,
    attempts INTEGER NOT NULL DEFAULT 1,
    score_earned INTEGER NOT NULL DEFAULT 0,

    completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Allow replaying questions in different modes
    UNIQUE(user_id, player_id, game_mode)
);

COMMENT ON TABLE user_progress IS 'Tracks user answers and progress for each question';
COMMENT ON COLUMN user_progress.attempts IS 'Number of guesses before getting correct answer';
COMMENT ON COLUMN user_progress.score_earned IS 'Points earned for this question';

-- -----------------------------------------------------------------------------
-- GAME_SESSIONS: Active game sessions for resumability
-- -----------------------------------------------------------------------------
CREATE TABLE game_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    pack_id UUID NOT NULL REFERENCES packs(id) ON DELETE CASCADE,
    game_mode game_mode_type NOT NULL,

    current_question_index INTEGER NOT NULL DEFAULT 0,
    score INTEGER NOT NULL DEFAULT 0,

    -- Session state stored as JSONB for flexibility
    -- Example: {"revealed_clubs": 2, "hints_used": 1, "wrong_guesses": ["Ronaldo", "Neymar"]}
    session_state JSONB,

    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_activity_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- User can have multiple active sessions (different packs/modes)
    UNIQUE(user_id, pack_id, game_mode)
);

COMMENT ON TABLE game_sessions IS 'Active game sessions for pause/resume functionality';
COMMENT ON COLUMN game_sessions.session_state IS 'JSONB state for resuming gameplay';

-- -----------------------------------------------------------------------------
-- LEADERBOARDS: Global user rankings
-- -----------------------------------------------------------------------------
CREATE TABLE leaderboards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,

    total_score INTEGER NOT NULL DEFAULT 0,
    total_questions INTEGER NOT NULL DEFAULT 0,
    correct_answers INTEGER NOT NULL DEFAULT 0,
    accuracy_rate DECIMAL(5, 2) NOT NULL DEFAULT 0.00,  -- Percentage (0.00 - 100.00)

    -- Global rank (computed via trigger)
    rank INTEGER,

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE leaderboards IS 'Global leaderboard rankings for all users';
COMMENT ON COLUMN leaderboards.accuracy_rate IS 'Percentage of correct answers (0.00 - 100.00)';
COMMENT ON COLUMN leaderboards.rank IS 'Global ranking position (1 = highest score)';

-- =============================================================================
-- INDEXES FOR PERFORMANCE
-- =============================================================================

-- Packs
CREATE INDEX idx_packs_slug ON packs(slug);
CREATE INDEX idx_packs_is_free ON packs(is_free);

-- Players
CREATE INDEX idx_players_pack_id ON players(pack_id);
CREATE INDEX idx_players_difficulty ON players(difficulty);
CREATE INDEX idx_players_name ON players(name);

-- User Packs
CREATE INDEX idx_user_packs_user_id ON user_packs(user_id);
CREATE INDEX idx_user_packs_pack_id ON user_packs(pack_id);
CREATE INDEX idx_user_packs_user_pack ON user_packs(user_id, pack_id);

-- User Progress
CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX idx_user_progress_player_id ON user_progress(player_id);
CREATE INDEX idx_user_progress_user_player ON user_progress(user_id, player_id);
CREATE INDEX idx_user_progress_game_mode ON user_progress(game_mode);

-- Game Sessions
CREATE INDEX idx_game_sessions_user_id ON game_sessions(user_id);
CREATE INDEX idx_game_sessions_pack_id ON game_sessions(pack_id);
CREATE INDEX idx_game_sessions_last_activity ON game_sessions(last_activity_at);

-- Leaderboards
CREATE INDEX idx_leaderboards_total_score ON leaderboards(total_score DESC);
CREATE INDEX idx_leaderboards_rank ON leaderboards(rank);
CREATE INDEX idx_leaderboards_accuracy ON leaderboards(accuracy_rate DESC);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================

-- Enable RLS on all tables
ALTER TABLE packs ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_packs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboards ENABLE ROW LEVEL SECURITY;

-- -----------------------------------------------------------------------------
-- PACKS: Public read access (everyone can see available packs)
-- -----------------------------------------------------------------------------
CREATE POLICY "Packs are publicly readable"
    ON packs FOR SELECT
    USING (true);

-- -----------------------------------------------------------------------------
-- PLAYERS: Public read access (everyone can see player data)
-- -----------------------------------------------------------------------------
CREATE POLICY "Players are publicly readable"
    ON players FOR SELECT
    USING (true);

-- -----------------------------------------------------------------------------
-- USER_PACKS: Users can only see and manage their own pack purchases
-- -----------------------------------------------------------------------------
CREATE POLICY "Users can view their own pack purchases"
    ON user_packs FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can purchase packs"
    ON user_packs FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- USER_PROGRESS: Users can only see and manage their own progress
-- -----------------------------------------------------------------------------
CREATE POLICY "Users can view their own progress"
    ON user_progress FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can record their own progress"
    ON user_progress FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
    ON user_progress FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- GAME_SESSIONS: Users can only see and manage their own sessions
-- -----------------------------------------------------------------------------
CREATE POLICY "Users can view their own game sessions"
    ON game_sessions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own game sessions"
    ON game_sessions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own game sessions"
    ON game_sessions FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own game sessions"
    ON game_sessions FOR DELETE
    USING (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- LEADERBOARDS: Public read, only owner can update
-- -----------------------------------------------------------------------------
CREATE POLICY "Leaderboards are publicly readable"
    ON leaderboards FOR SELECT
    USING (true);

CREATE POLICY "Users can insert their own leaderboard entry"
    ON leaderboards FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own leaderboard entry"
    ON leaderboards FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- =============================================================================
-- DATABASE FUNCTIONS
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Function: update_updated_at_column
-- Trigger function to automatically update updated_at timestamp
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- -----------------------------------------------------------------------------
-- Function: update_leaderboard
-- Updates leaderboard entry when user completes a question
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_leaderboard()
RETURNS TRIGGER AS $$
BEGIN
    -- Insert or update leaderboard entry
    INSERT INTO leaderboards (user_id, total_score, total_questions, correct_answers, accuracy_rate)
    VALUES (
        NEW.user_id,
        NEW.score_earned,
        1,
        CASE WHEN NEW.answered_correctly THEN 1 ELSE 0 END,
        CASE WHEN NEW.answered_correctly THEN 100.00 ELSE 0.00 END
    )
    ON CONFLICT (user_id) DO UPDATE SET
        total_score = leaderboards.total_score + NEW.score_earned,
        total_questions = leaderboards.total_questions + 1,
        correct_answers = leaderboards.correct_answers + CASE WHEN NEW.answered_correctly THEN 1 ELSE 0 END,
        accuracy_rate = ROUND(
            ((leaderboards.correct_answers + CASE WHEN NEW.answered_correctly THEN 1 ELSE 0 END)::DECIMAL /
             (leaderboards.total_questions + 1)::DECIMAL) * 100,
            2
        ),
        updated_at = NOW();

    -- Recalculate ranks for all users (ordered by total_score DESC)
    WITH ranked_users AS (
        SELECT
            user_id,
            ROW_NUMBER() OVER (ORDER BY total_score DESC, accuracy_rate DESC, updated_at ASC) as new_rank
        FROM leaderboards
    )
    UPDATE leaderboards
    SET rank = ranked_users.new_rank
    FROM ranked_users
    WHERE leaderboards.user_id = ranked_users.user_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- -----------------------------------------------------------------------------
-- Function: get_user_stats
-- Returns aggregate statistics for a specific user
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION get_user_stats(p_user_id UUID)
RETURNS TABLE(
    total_score INTEGER,
    total_questions INTEGER,
    correct_answers INTEGER,
    accuracy_rate DECIMAL,
    global_rank INTEGER,
    packs_owned INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        COALESCE(l.total_score, 0)::INTEGER,
        COALESCE(l.total_questions, 0)::INTEGER,
        COALESCE(l.correct_answers, 0)::INTEGER,
        COALESCE(l.accuracy_rate, 0.00)::DECIMAL,
        l.rank::INTEGER,
        (SELECT COUNT(*)::INTEGER FROM user_packs WHERE user_id = p_user_id)
    FROM leaderboards l
    WHERE l.user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;

-- -----------------------------------------------------------------------------
-- Function: get_pack_with_players
-- Fetches a pack with all its players for gameplay
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION get_pack_with_players(p_slug TEXT)
RETURNS TABLE(
    pack_id UUID,
    pack_name TEXT,
    pack_description TEXT,
    pack_slug TEXT,
    pack_price DECIMAL,
    pack_is_free BOOLEAN,
    player_id UUID,
    player_name TEXT,
    player_full_name TEXT,
    player_nationality TEXT,
    player_position TEXT,
    player_career_path JSONB,
    player_aliases JSONB,
    player_hints JSONB,
    player_difficulty INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        p.id,
        p.name,
        p.description,
        p.slug,
        p.price,
        p.is_free,
        pl.id,
        pl.name,
        pl.full_name,
        pl.nationality,
        pl.position,
        pl.career_path,
        pl.aliases,
        pl.hints,
        pl.difficulty
    FROM packs p
    LEFT JOIN players pl ON pl.pack_id = p.id
    WHERE p.slug = p_slug
    ORDER BY pl.difficulty ASC, pl.name ASC;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- TRIGGERS
-- =============================================================================

-- Update updated_at on packs
CREATE TRIGGER update_packs_updated_at
    BEFORE UPDATE ON packs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Update updated_at on players
CREATE TRIGGER update_players_updated_at
    BEFORE UPDATE ON players
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Update updated_at on leaderboards
CREATE TRIGGER update_leaderboards_updated_at
    BEFORE UPDATE ON leaderboards
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Update leaderboard when user completes a question
CREATE TRIGGER trigger_update_leaderboard
    AFTER INSERT ON user_progress
    FOR EACH ROW
    EXECUTE FUNCTION update_leaderboard();

-- =============================================================================
-- SUCCESS MESSAGE
-- =============================================================================

DO $$
BEGIN
    RAISE NOTICE 'Football IQ schema created successfully!';
    RAISE NOTICE '✓ 6 tables created: packs, players, user_packs, user_progress, game_sessions, leaderboards';
    RAISE NOTICE '✓ All indexes created for optimal performance';
    RAISE NOTICE '✓ RLS policies enabled for data security';
    RAISE NOTICE '✓ Database functions and triggers configured';
    RAISE NOTICE 'Ready for seed data!';
END $$;
