BEGIN;

TRUNCATE
    gloomhelper_chars,
    gloomhelper_parties,
    gloomhelper_users
    RESTART IDENTITY CASCADE
;

INSERT INTO gloomhelper_users (username, password)
VALUES
    ('frodo', '$2a$12$gstfE9as99I6LAnx2erfN.U7/seJHsWGwCJ9DveR.Ugrqgz65L.Zu'),
    ('gandalf', '$2a$12$XKAo0NqWZzSLa9sKA4WHUOM1GC/OXqRUxb2GiD28kwfIBVkp2rVrW')
;

INSERT INTO gloomhelper_parties (user_id, party_name, location, reputation, party_notes, achievements)
    VALUES (1, 'Gloomhaven Gangsters', 'Gloomhaven', 4, 'last we checked, we were rising up against Jeksarah--pretty sure she''s evil??', 'First Steps\nSecond Steps');

INSERT INTO gloomhelper_chars (user_id, character_name, character_class, xp, gold_notes, items_notes, character_notes, goals_1, goals_2, goals_3, perks)
VALUES 
    (1, 'Sal', 'brute', 32, '13 (saving up for chainmail armor)', 'Eagle Eye Goggles\nBoots of Striding', 'x2 blessings next scenario', 3, 1, 0, '000010000000000'),
    (1, 'Transcendy MacMillion', 'spellweaver', 48, '46', 'Minor Manna Potion', 'Elite kills = 4', 2, 0, 0, '000001000000010')
;

COMMIT;
