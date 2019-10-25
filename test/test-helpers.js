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

function makeUsersArray() {
    return [
        {
            username: 'test-user-1',
            password: 'password1',
            date_created: new Date('2019-01-01T12:20:32.615Z'),
        },
        {
            username: 'test-user-2',
            password: 'password2',
            date_created: new Date('2019-01-01T12:20:32.615Z'),
        },
        {
            username: 'test-user-3',
            password: 'password3',
            date_created: new Date('2019-01-01T12:20:32.615Z'),
        },
        {
            username: 'test-user-4',
            password: 'password4',
            date_created: new Date('2019-01-01T12:20:32.615Z'),
        },
    ]
}

function seedUsers(db, users) {
    const preppedUsers = users.map(user => ({
        ...user,
        password: bcrypt.hashSync(user.password, 1)
    }));

    return db.into('gloomhelper_users').insert(preppedUsers);
}

module.exports = {
    cleanTables,
    makeUsersArray,
    seedUsers,
}