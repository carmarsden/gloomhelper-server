CREATE TABLE gloomhelper_users (
    id SERIAL PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    date_created TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE gloomhelper_parties (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES gloomhelper_users(id),
    party_name TEXT NOT NULL,
    location TEXT,
    reputation INTEGER NOT NULL,
    party_notes TEXT,
    achievements TEXT,
    date_modified TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TYPE class AS ENUM ('brute', 'cragheart', 'mindthief', 'spellweaver', 'scoundrel', 'tinkerer');

CREATE TABLE gloomhelper_chars (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES gloomhelper_users(id),
    character_name TEXT NOT NULL,
    character_class class NOT NULL,
    xp INTEGER NOT NULL DEFAULT 0,
    gold_notes TEXT,
    items_notes TEXT,
    character_notes TEXT,
    goals_1 INTEGER DEFAULT 0,
    goals_2 INTEGER DEFAULT 0,
    goals_3 INTEGER DEFAULT 0,
    goals_4 INTEGER DEFAULT 0,
    goals_5 INTEGER DEFAULT 0,
    goals_6 INTEGER DEFAULT 0,
    perks TEXT,
    date_modified TIMESTAMP NOT NULL DEFAULT now()
);