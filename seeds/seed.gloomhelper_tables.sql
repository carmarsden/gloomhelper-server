BEGIN;

TRUNCATE
    gloomhelper_chars,
    gloomhelper_parties,
    gloomhelper_users
    RESTART IDENTITY CASCADE
;

INSERT INTO gloomhelper_users (username, password)
VALUES
    ('frodo', 'thering'),
    ('gandalf', 'thewizard')
;

INSERT INTO gloomhelper_parties (user_id, party_name, location, reputation, party_notes, achievements)
    VALUES (1, 'Gloomhaven Gangsters', 'Gloomhaven', 4, 'last we checked, we were rising up against Jeksarah--pretty sure she''s evil??', '<ul><li>First Steps</li><li>Second Steps</li></ul>');

INSERT INTO gloomhelper_chars (user_id, character_name, character_class, xp, gold_notes, items_notes, character_notes, goals_1, goals_2, goals_3, perks)
VALUES 
    (1, 'Sal', 'brute', 32, '13 (saving up for chainmail armor)', '<ul><li>Eagle Eye Goggles</li><li>Boots of Striding</li></ul>', 'x2 blessings next scenario', 3, 1, 0, '000010000000000'),
    (1, 'Transcendy MacMillion', 'spellweaver', 48, '46', '<ul><li>Minor Manna Potion</li></ul>', 'Elite kills = 4', 2, 0, 0, '000001000000010')
;

COMMIT;
