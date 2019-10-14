const bcrypt = require('bcryptjs');
const xss = require('xss');

const VALID_PW_REGEX = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/;

const UsersService = {
    userExists(db, username) {
        return db('gloomhelper_users')
            .where({ username })
            .first()
            .then(user => !!user)   // this is to convert a user record to true, or lack of user record to false
        ;
    },

    insertUser(db, newUser) {
        return db
            .insert(newUser)
            .into('gloomhelper_users')
            .returning('*')
            .then(([user]) => user)
        ;
    },

    validatePassword(password) {
        if (password.length < 8) {
            return 'Password must be at least 8 characters'
        }
        if (password.length > 72) {
            return 'Password must be no more than 72 characters'
        }
        if (password.startsWith(' ') || password.endsWith(' ')) {
            return 'Password cannot start or end with empty spaces'
        }
        if (!VALID_PW_REGEX.test(password)) {
            return 'Password must contain at least one each of: upper case, lower case, number, and special character'
        }
        return null;
    },

    hashPassword(password) {
        return bcrypt.hash(password, 12)
    },

    serializeUser(user) {
        return {
            id: user.id,
            username: xss(user.username),
            date_created: new Date(user.date_created)
        }
    },
};

module.exports = UsersService;