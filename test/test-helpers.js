const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

function cleanTables(db) {
    return db.raw(
        `TRUNCATE
            gloomhelper_chars,
            gloomhelper_parties,
            gloomhelper_users
            RESTART IDENTITY CASCADE`
    )
}

function makeAuthToken(user) {
    return jwt.sign(
        {user_id: user.expected_id},
        process.env.JWT_SECRET,
        {
            subject: user.username,
            expiresIn: process.env.JWT_EXPIRY,
            algorithm: 'HS256'
        }
    );
}

function makeUsersArray() {
    return [
        {
            expected_id: 1,
            username: 'test-user-1',
            password: 'password1',
            date_created: new Date('2019-01-01T12:20:32.615Z'),
        },
        {
            expected_id: 2,
            username: 'test-user-2',
            password: 'password2',
            date_created: new Date('2019-01-01T12:20:32.615Z'),
        },
        {
            expected_id: 3,
            username: 'test-user-3',
            password: 'password3',
            date_created: new Date('2019-01-01T12:20:32.615Z'),
        },
        {
            expected_id: 4,
            username: 'test-user-4',
            password: 'password4',
            date_created: new Date('2019-01-01T12:20:32.615Z'),
        },
    ]
}

function makeParty() {
    return {
        user_id: 1,
        party_name: "Gloomhaven Gangsters",
        location: "Gloomhaven",
        reputation: 4,
        party_notes: "last we checked, we were rising up against Jeksarah--pretty sure she's evil??",
        achievements: "First Steps\nSecond Steps",
        date_modified: new Date('2019-01-01T12:20:32.615Z')
    }
}

function makeChar() {
    return {
        user_id: 1,
        character_name: "Sal",
        character_class: "brute",
        xp: 32,
        gold_notes: "13 (saving up for chainmail armor)",
        items_notes: "Eagle Eye Goggles\nBoots of Striding",
        character_notes: "x2 blessings next scenario",
        goals_1: 3,
        goals_2: 1,
        goals_3: 0,
        goals_4: 0,
        goals_5: 0,
        goals_6: 0,
        perks: "000100000000000",
        date_modified: new Date('2019-01-01T12:20:32.615Z')
    }
}

function seedUsers(db, users) {
    const preppedUsers = users.map(user => ({
        username: user.username,
        date_created: user.date_created,
        password: bcrypt.hashSync(user.password, 1)
    }));

    return db.into('gloomhelper_users').insert(preppedUsers);
}

function seedEntries(db, party, char) {
    Promise.all([
        db.into('gloomhelper_parties').insert(party),
        db.into('gloomhelper_chars').insert(char)
    ])
    .catch(err => console.log(err))
}

module.exports = {
    cleanTables,
    makeAuthToken,
    makeUsersArray,
    makeParty,
    makeChar,
    seedUsers,
    seedEntries,
}