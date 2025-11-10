-- =============================================================================
-- Football IQ Seed Data
-- =============================================================================
-- Seeds the database with the free "Football Legends" pack containing
-- 25 legendary football players with accurate career data
-- All players have 3+ clubs to make the game interesting
-- =============================================================================

-- Get or create the Football Legends pack
DO $$
DECLARE
    v_pack_id UUID;
BEGIN
    -- Insert the Football Legends pack (or get existing)
    INSERT INTO packs (name, description, slug, price, difficulty_range, question_count, is_free)
    VALUES (
        'Football Legends',
        'Test your knowledge of true football legends. From Pirlo to Beckham, can you recognize these iconic players from their career paths? For real football fans only!',
        'football-legends',
        NULL,  -- Free pack
        '2-5',
        25,
        true
    )
    ON CONFLICT (slug) DO UPDATE SET
        question_count = 25,
        updated_at = NOW()
    RETURNING id INTO v_pack_id;

    -- =============================================================================
    -- ANDREA PIRLO - EXAMPLE TEMPLATE FOR USER
    -- =============================================================================

    -- Andrea Pirlo (EXAMPLE with accurate career data)
    INSERT INTO players (pack_id, name, full_name, nationality, position, career_path, aliases, hints, difficulty)
    VALUES (
        v_pack_id,
        'Andrea Pirlo',
        'Andrea Pirlo',
        'Italy',
        'Midfielder',
        '["Brescia (1995-1998)", "Inter Milan (1998-2001)", "Reggina (1999, loan)", "Brescia (1999-2000, loan)", "AC Milan (2001-2011)", "Juventus (2011-2015)", "New York City FC (2015-2017)"]'::jsonb,
        '["Pirlo", "Andrea Pirlo", "Il Maestro", "The Architect"]'::jsonb,
        '{"hint1": "Won World Cup with Italy in 2006", "hint2": "Master of the deep-lying playmaker role", "hint3": "Famous for his vision, passing, and free-kicks"}'::jsonb,
        3
    ) ON CONFLICT DO NOTHING;

    -- =============================================================================
    -- DIFFICULTY 2-3: MEDIUM - True football legends
    -- =============================================================================

    -- Javier Zanetti
    INSERT INTO players (pack_id, name, full_name, nationality, position, career_path, aliases, hints, difficulty)
    VALUES (
        v_pack_id,
        'Javier Zanetti',
        'Javier Adelmar Zanetti',
        'Argentina',
        'Defender',
        '["Talleres (1993-1995)", "Banfield (1995-1996)", "Inter Milan (1996-2014)"]'::jsonb,
        '["Zanetti", "Javier Zanetti", "El Tractor", "Pupi"]'::jsonb,
        '{"hint1": "Inter Milan legend and captain for 13 years", "hint2": "Made 858 appearances for Inter Milan", "hint3": "Won Champions League with Inter in 2010"}'::jsonb,
        3
    ) ON CONFLICT DO NOTHING;

    -- Raúl González
    INSERT INTO players (pack_id, name, full_name, nationality, position, career_path, aliases, hints, difficulty)
    VALUES (
        v_pack_id,
        'Raúl',
        'Raúl González Blanco',
        'Spain',
        'Forward',
        '["Real Madrid (1994-2010)", "Schalke 04 (2010-2012)", "Al Sadd (2012-2014)", "New York Cosmos (2014-2015)"]'::jsonb,
        '["Raúl", "Raul", "Raúl González", "Raul Gonzalez"]'::jsonb,
        '{"hint1": "Real Madrid''s all-time leading scorer for many years", "hint2": "Won 3 Champions League titles with Real Madrid", "hint3": "Spain''s captain during early 2000s"}'::jsonb,
        3
    ) ON CONFLICT DO NOTHING;

    -- Clarence Seedorf
    INSERT INTO players (pack_id, name, full_name, nationality, position, career_path, aliases, hints, difficulty)
    VALUES (
        v_pack_id,
        'Clarence Seedorf',
        'Clarence Clyde Seedorf',
        'Netherlands',
        'Midfielder',
        '["Ajax (1992-1995)", "Sampdoria (1995-1996)", "Real Madrid (1996-2000)", "Inter Milan (2000-2002)", "AC Milan (2002-2012)", "Botafogo (2012-2014)"]'::jsonb,
        '["Seedorf", "Clarence Seedorf"]'::jsonb,
        '{"hint1": "Only player to win Champions League with 3 different clubs", "hint2": "Part of Ajax''s 1995 Champions League winning team", "hint3": "Known for his power, technique and long-range shooting"}'::jsonb,
        3
    ) ON CONFLICT DO NOTHING;

    -- Patrick Vieira
    INSERT INTO players (pack_id, name, full_name, nationality, position, career_path, aliases, hints, difficulty)
    VALUES (
        v_pack_id,
        'Patrick Vieira',
        'Patrick Vieira',
        'France',
        'Midfielder',
        '["Cannes (1993-1995)", "AC Milan (1995-1996)", "Arsenal (1996-2005)", "Juventus (2005-2006)", "Inter Milan (2006-2010)", "Manchester City (2010-2011)"]'::jsonb,
        '["Vieira", "Patrick Vieira"]'::jsonb,
        '{"hint1": "Captain of Arsenal''s Invincibles season", "hint2": "Won World Cup 1998 and Euro 2000 with France", "hint3": "Known for battles with Roy Keane"}'::jsonb,
        3
    ) ON CONFLICT DO NOTHING;

    -- Marcel Desailly
    INSERT INTO players (pack_id, name, full_name, nationality, position, career_path, aliases, hints, difficulty)
    VALUES (
        v_pack_id,
        'Marcel Desailly',
        'Marcel Desailly',
        'France',
        'Defender',
        '["Nantes (1986-1992)", "Marseille (1992-1993)", "AC Milan (1993-1998)", "Chelsea (1998-2004)", "Al Gharafa (2004-2005)", "Qatar SC (2005-2006)"]'::jsonb,
        '["Desailly", "Marcel Desailly", "The Rock"]'::jsonb,
        '{"hint1": "Won Champions League with Marseille and AC Milan", "hint2": "Won World Cup 1998 and Euro 2000 with France", "hint3": "Could play both center-back and defensive midfield"}'::jsonb,
        3
    ) ON CONFLICT DO NOTHING;

    -- Gianluigi Buffon
    INSERT INTO players (pack_id, name, full_name, nationality, position, career_path, aliases, hints, difficulty)
    VALUES (
        v_pack_id,
        'Gianluigi Buffon',
        'Gianluigi Buffon',
        'Italy',
        'Goalkeeper',
        '["Parma (1995-2001)", "Juventus (2001-2018)", "Paris Saint-Germain (2018-2019)", "Juventus (2019-2021)", "Parma (2021-2023)"]'::jsonb,
        '["Buffon", "Gianluigi Buffon", "Gigi Buffon", "Superman"]'::jsonb,
        '{"hint1": "Won World Cup with Italy in 2006", "hint2": "Made over 650 appearances for Juventus", "hint3": "One of the greatest goalkeepers of all time"}'::jsonb,
        2
    ) ON CONFLICT DO NOTHING;

    -- Ruud van Nistelrooy
    INSERT INTO players (pack_id, name, full_name, nationality, position, career_path, aliases, hints, difficulty)
    VALUES (
        v_pack_id,
        'Ruud van Nistelrooy',
        'Rutgerus Johannes Martinus van Nistelrooij',
        'Netherlands',
        'Forward',
        '["Den Bosch (1993-1997)", "Heerenveen (1997-1998)", "PSV (1998-2001)", "Manchester United (2001-2006)", "Real Madrid (2006-2009)", "Hamburg (2009-2010)", "Málaga (2010-2011)"]'::jsonb,
        '["van Nistelrooy", "Ruud van Nistelrooy", "Van Nistelrooy", "RVN"]'::jsonb,
        '{"hint1": "Scored 150 goals in 219 games for Manchester United", "hint2": "Won Premier League Golden Boot in 2003", "hint3": "Known as one of the best penalty box strikers ever"}'::jsonb,
        3
    ) ON CONFLICT DO NOTHING;

    -- Alessandro Del Piero
    INSERT INTO players (pack_id, name, full_name, nationality, position, career_path, aliases, hints, difficulty)
    VALUES (
        v_pack_id,
        'Alessandro Del Piero',
        'Alessandro Del Piero',
        'Italy',
        'Forward',
        '["Padova (1991-1993)", "Juventus (1993-2012)", "Sydney FC (2012-2014)", "Delhi Dynamos (2014)"]'::jsonb,
        '["Del Piero", "Alessandro Del Piero", "Alex Del Piero", "Pinturicchio"]'::jsonb,
        '{"hint1": "Juventus legend and all-time leading scorer", "hint2": "Won World Cup with Italy in 2006", "hint3": "Famous for his curled shots and free-kicks"}'::jsonb,
        3
    ) ON CONFLICT DO NOTHING;

    -- Edgar Davids
    INSERT INTO players (pack_id, name, full_name, nationality, position, career_path, aliases, hints, difficulty)
    VALUES (
        v_pack_id,
        'Edgar Davids',
        'Edgar Steven Davids',
        'Netherlands',
        'Midfielder',
        '["Ajax (1991-1996)", "AC Milan (1996-1997)", "Juventus (1997-2004)", "Barcelona (2004)", "Inter Milan (2004-2005)", "Tottenham Hotspur (2005-2006)", "Ajax (2007-2008)", "Crystal Palace (2010-2011)", "Barnet (2011-2014)"]'::jsonb,
        '["Davids", "Edgar Davids", "The Pitbull"]'::jsonb,
        '{"hint1": "Known for wearing protective goggles due to glaucoma", "hint2": "Part of Ajax''s 1995 Champions League winning team", "hint3": "Fierce defensive midfielder with incredible energy"}'::jsonb,
        3
    ) ON CONFLICT DO NOTHING;

    -- Claude Makélélé
    INSERT INTO players (pack_id, name, full_name, nationality, position, career_path, aliases, hints, difficulty)
    VALUES (
        v_pack_id,
        'Claude Makélélé',
        'Claude Makélélé Sinda',
        'France',
        'Midfielder',
        '["Nantes (1991-1997)", "Marseille (1997-1998)", "Celta Vigo (1998-2000)", "Real Madrid (2000-2003)", "Chelsea (2003-2008)", "Paris Saint-Germain (2008-2011)"]'::jsonb,
        '["Makélélé", "Claude Makélélé", "Makelele", "Claude Makelele"]'::jsonb,
        '{"hint1": "The Makélélé role named after his defensive midfield style", "hint2": "Won Champions League with Real Madrid in 2002", "hint3": "Key player in Chelsea''s back-to-back Premier League titles"}'::jsonb,
        4
    ) ON CONFLICT DO NOTHING;

    -- David Beckham
    INSERT INTO players (pack_id, name, full_name, nationality, position, career_path, aliases, hints, difficulty)
    VALUES (
        v_pack_id,
        'David Beckham',
        'David Robert Joseph Beckham',
        'England',
        'Midfielder',
        '["Manchester United (1992-2003)", "Real Madrid (2003-2007)", "LA Galaxy (2007-2012)", "AC Milan (2009, loan)", "AC Milan (2010, loan)", "Paris Saint-Germain (2013)"]'::jsonb,
        '["Beckham", "David Beckham", "Becks"]'::jsonb,
        '{"hint1": "Famous for his free-kick ability and crossing", "hint2": "Part of Manchester United''s treble-winning team 1999", "hint3": "Married to Victoria Adams from Spice Girls"}'::jsonb,
        2
    ) ON CONFLICT DO NOTHING;

    -- Zinedine Zidane
    INSERT INTO players (pack_id, name, full_name, nationality, position, career_path, aliases, hints, difficulty)
    VALUES (
        v_pack_id,
        'Zinedine Zidane',
        'Zinedine Yazid Zidane',
        'France',
        'Midfielder',
        '["Cannes (1989-1992)", "Bordeaux (1992-1996)", "Juventus (1996-2001)", "Real Madrid (2001-2006)"]'::jsonb,
        '["Zidane", "Zinedine Zidane", "Zizou"]'::jsonb,
        '{"hint1": "Won World Cup 1998 and Euro 2000 with France", "hint2": "Famous headbutt in 2006 World Cup final", "hint3": "Won 3 consecutive Champions Leagues as Real Madrid manager"}'::jsonb,
        2
    ) ON CONFLICT DO NOTHING;

    -- Ronaldinho
    INSERT INTO players (pack_id, name, full_name, nationality, position, career_path, aliases, hints, difficulty)
    VALUES (
        v_pack_id,
        'Ronaldinho',
        'Ronaldo de Assis Moreira',
        'Brazil',
        'Midfielder',
        '["Grêmio (1998-2001)", "Paris Saint-Germain (2001-2003)", "Barcelona (2003-2008)", "AC Milan (2008-2011)", "Flamengo (2011-2012)", "Atlético Mineiro (2012-2014)", "Querétaro (2014-2015)", "Fluminense (2015)"]'::jsonb,
        '["Ronaldinho", "Ronaldinho Gaúcho", "Dinho"]'::jsonb,
        '{"hint1": "Won Ballon d''Or in 2005", "hint2": "Known for his smile, tricks, and no-look passes", "hint3": "Received standing ovation at Santiago Bernabéu as Barcelona player"}'::jsonb,
        2
    ) ON CONFLICT DO NOTHING;

    -- Thierry Henry
    INSERT INTO players (pack_id, name, full_name, nationality, position, career_path, aliases, hints, difficulty)
    VALUES (
        v_pack_id,
        'Thierry Henry',
        'Thierry Daniel Henry',
        'France',
        'Forward',
        '["Monaco (1994-1999)", "Juventus (1999)", "Arsenal (1999-2007)", "Barcelona (2007-2010)", "New York Red Bulls (2010-2014)", "Arsenal (2012, loan)"]'::jsonb,
        '["Henry", "Thierry Henry", "Titi"]'::jsonb,
        '{"hint1": "Arsenal''s all-time leading scorer with 228 goals", "hint2": "Won World Cup 1998 and Euro 2000 with France", "hint3": "Part of Arsenal''s unbeaten Invincibles season 2003-04"}'::jsonb,
        3
    ) ON CONFLICT DO NOTHING;

    -- Andrés Iniesta
    INSERT INTO players (pack_id, name, full_name, nationality, position, career_path, aliases, hints, difficulty)
    VALUES (
        v_pack_id,
        'Andrés Iniesta',
        'Andrés Iniesta Luján',
        'Spain',
        'Midfielder',
        '["Barcelona (2002-2018)", "Vissel Kobe (2018-2023)", "Emirates Club (2023-present)"]'::jsonb,
        '["Iniesta", "Andrés Iniesta", "Don Andrés", "El Ilusionista"]'::jsonb,
        '{"hint1": "Scored winning goal in 2010 World Cup final", "hint2": "Won 9 La Liga titles with Barcelona", "hint3": "Named UEFA Best Player in Europe 2012"}'::jsonb,
        3
    ) ON CONFLICT DO NOTHING;

    -- Frank Lampard
    INSERT INTO players (pack_id, name, full_name, nationality, position, career_path, aliases, hints, difficulty)
    VALUES (
        v_pack_id,
        'Frank Lampard',
        'Frank James Lampard',
        'England',
        'Midfielder',
        '["West Ham United (1995-2001)", "Swansea City (1995-1996, loan)", "Chelsea (2001-2014)", "Manchester City (2014-2015)", "New York City FC (2015-2016)"]'::jsonb,
        '["Lampard", "Frank Lampard", "Super Frank"]'::jsonb,
        '{"hint1": "Chelsea''s all-time leading scorer with 211 goals", "hint2": "Scored 20+ goals for Chelsea in three consecutive seasons", "hint3": "Won Premier League three times with Chelsea"}'::jsonb,
        3
    ) ON CONFLICT DO NOTHING;

    -- Sergio Ramos
    INSERT INTO players (pack_id, name, full_name, nationality, position, career_path, aliases, hints, difficulty)
    VALUES (
        v_pack_id,
        'Sergio Ramos',
        'Sergio Ramos García',
        'Spain',
        'Defender',
        '["Sevilla (2003-2005)", "Real Madrid (2005-2021)", "Paris Saint-Germain (2021-2023)", "Sevilla (2023-2024)"]'::jsonb,
        '["Ramos", "Sergio Ramos", "SR4"]'::jsonb,
        '{"hint1": "Won 4 Champions League titles with Real Madrid", "hint2": "Spain''s most capped player with 180+ appearances", "hint3": "Scored crucial equalizer in 2014 Champions League final"}'::jsonb,
        3
    ) ON CONFLICT DO NOTHING;

    -- Luka Modrić
    INSERT INTO players (pack_id, name, full_name, nationality, position, career_path, aliases, hints, difficulty)
    VALUES (
        v_pack_id,
        'Luka Modrić',
        'Luka Modrić',
        'Croatia',
        'Midfielder',
        '["Dinamo Zagreb (2003-2008)", "Tottenham Hotspur (2008-2012)", "Real Madrid (2012-present)"]'::jsonb,
        '["Modrić", "Luka Modrić", "Modric", "Luka Modric"]'::jsonb,
        '{"hint1": "Won Ballon d''Or in 2018", "hint2": "Led Croatia to 2018 World Cup final", "hint3": "Won 5 Champions League titles with Real Madrid"}'::jsonb,
        3
    ) ON CONFLICT DO NOTHING;

    -- Robert Lewandowski
    INSERT INTO players (pack_id, name, full_name, nationality, position, career_path, aliases, hints, difficulty)
    VALUES (
        v_pack_id,
        'Robert Lewandowski',
        'Robert Lewandowski',
        'Poland',
        'Forward',
        '["Lech Poznań (2006-2010)", "Borussia Dortmund (2010-2014)", "Bayern Munich (2014-2022)", "Barcelona (2022-present)"]'::jsonb,
        '["Lewandowski", "Robert Lewandowski", "Lewy"]'::jsonb,
        '{"hint1": "Scored 5 goals in 9 minutes for Bayern Munich", "hint2": "Won Best FIFA Men''s Player 2020 and 2021", "hint3": "Poland''s all-time leading scorer"}'::jsonb,
        3
    ) ON CONFLICT DO NOTHING;

    -- Luis Suárez
    INSERT INTO players (pack_id, name, full_name, nationality, position, career_path, aliases, hints, difficulty)
    VALUES (
        v_pack_id,
        'Luis Suárez',
        'Luis Alberto Suárez Díaz',
        'Uruguay',
        'Forward',
        '["Nacional (2005-2006)", "Groningen (2006-2007)", "Ajax (2007-2011)", "Liverpool (2011-2014)", "Barcelona (2014-2020)", "Atlético Madrid (2020-2022)", "Nacional (2022-2023)", "Grêmio (2023-2024)", "Inter Miami (2024-present)"]'::jsonb,
        '["Suárez", "Luis Suárez", "Suarez", "Luis Suarez", "El Pistolero"]'::jsonb,
        '{"hint1": "Part of Barcelona''s famous MSN trio", "hint2": "Won European Golden Shoe twice", "hint3": "Controversial biting incidents in his career"}'::jsonb,
        3
    ) ON CONFLICT DO NOTHING;

    -- Sergio Agüero
    INSERT INTO players (pack_id, name, full_name, nationality, position, career_path, aliases, hints, difficulty)
    VALUES (
        v_pack_id,
        'Sergio Agüero',
        'Sergio Leonel Agüero del Castillo',
        'Argentina',
        'Forward',
        '["Independiente (2003-2006)", "Atlético Madrid (2006-2011)", "Manchester City (2011-2021)", "Barcelona (2021)"]'::jsonb,
        '["Agüero", "Sergio Agüero", "Aguero", "Sergio Aguero", "Kun Agüero"]'::jsonb,
        '{"hint1": "Scored iconic last-minute goal to win Premier League 2012", "hint2": "Manchester City''s all-time leading scorer", "hint3": "Won Copa América 2021 with Argentina"}'::jsonb,
        3
    ) ON CONFLICT DO NOTHING;

    -- =============================================================================
    -- DIFFICULTY 4-5: HARD - Legendary players requiring deep football knowledge
    -- =============================================================================

    -- Diego Maradona
    INSERT INTO players (pack_id, name, full_name, nationality, position, career_path, aliases, hints, difficulty)
    VALUES (
        v_pack_id,
        'Diego Maradona',
        'Diego Armando Maradona',
        'Argentina',
        'Midfielder',
        '["Argentinos Juniors (1976-1981)", "Boca Juniors (1981-1982)", "Barcelona (1982-1984)", "Napoli (1984-1991)", "Sevilla (1992-1993)", "Newell''s Old Boys (1993-1994)", "Boca Juniors (1995-1997)"]'::jsonb,
        '["Maradona", "Diego Maradona", "El Pibe de Oro", "D10S"]'::jsonb,
        '{"hint1": "Scored Hand of God and Goal of the Century in 1986 World Cup", "hint2": "Led Argentina to 1986 World Cup victory", "hint3": "Won two Serie A titles with Napoli"}'::jsonb,
        4
    ) ON CONFLICT DO NOTHING;

    -- Johan Cruyff
    INSERT INTO players (pack_id, name, full_name, nationality, position, career_path, aliases, hints, difficulty)
    VALUES (
        v_pack_id,
        'Johan Cruyff',
        'Hendrik Johannes Cruyff',
        'Netherlands',
        'Forward',
        '["Ajax (1964-1973)", "Barcelona (1973-1978)", "New York Cosmos (1979)", "Los Angeles Aztecs (1979)", "Washington Diplomats (1980-1981)", "Levante (1981)", "Ajax (1981-1983)", "Feyenoord (1983-1984)"]'::jsonb,
        '["Cruyff", "Johan Cruyff", "Johan Cruijff"]'::jsonb,
        '{"hint1": "Won 3 Ballon d''Or awards (1971, 1973, 1974)", "hint2": "Famous Cruyff Turn inventor", "hint3": "Led Ajax to 3 consecutive European Cups"}'::jsonb,
        4
    ) ON CONFLICT DO NOTHING;

    -- Franz Beckenbauer
    INSERT INTO players (pack_id, name, full_name, nationality, position, career_path, aliases, hints, difficulty)
    VALUES (
        v_pack_id,
        'Franz Beckenbauer',
        'Franz Anton Beckenbauer',
        'Germany',
        'Defender',
        '["Bayern Munich (1964-1977)", "New York Cosmos (1977-1980)", "Hamburg (1980-1982)", "New York Cosmos (1983)"]'::jsonb,
        '["Beckenbauer", "Franz Beckenbauer", "Der Kaiser"]'::jsonb,
        '{"hint1": "Won World Cup as player (1974) and manager (1990)", "hint2": "Revolutionized the sweeper position", "hint3": "Won Ballon d''Or twice"}'::jsonb,
        5
    ) ON CONFLICT DO NOTHING;

    -- George Best
    INSERT INTO players (pack_id, name, full_name, nationality, position, career_path, aliases, hints, difficulty)
    VALUES (
        v_pack_id,
        'George Best',
        'George Best',
        'Northern Ireland',
        'Winger',
        '["Manchester United (1963-1974)", "Stockport County (1975)", "Cork Celtic (1975-1976)", "Los Angeles Aztecs (1976-1978)", "Fulham (1976-1977)", "Fort Lauderdale Strikers (1978-1979)", "Hibernian (1979-1980)", "San Jose Earthquakes (1980-1981)", "Bournemouth (1983)"]'::jsonb,
        '["Best", "George Best", "Bestie", "The Fifth Beatle"]'::jsonb,
        '{"hint1": "Won Ballon d''Or in 1968", "hint2": "Part of Manchester United''s 1968 European Cup winning team", "hint3": "Famous playboy lifestyle in the swinging sixties"}'::jsonb,
        5
    ) ON CONFLICT DO NOTHING;

    RAISE NOTICE 'Football Legends pack created with 25 legendary players (all with 3+ clubs)!';
END $$;
