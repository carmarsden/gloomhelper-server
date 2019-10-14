const express = require('express');
const logger = require('../logger');
const UsersService = require('./users-service');

const usersRouter = express.Router();
const jsonParser = express.json();

usersRouter
    .post('/', jsonParser, (req, res, next) => {
        const { username, password } = req.body;

        // validate requirements: check for required values
        const required = ['username', 'password'];
        for (const requirement of required) {
            if (!req.body[requirement]) {
                logger.error(`Missing '${requirement}' in user registration request`);
                return res.status(400).json({
                    error: `Missing '${requirement}' in request body`
                })
            }
        }

        // validate username: cannot start/end with space, must be >3 characters
        if (username.startsWith(' ') || username.endsWith(' ')) {
            logger.error(`Username cannot start or end with empty spaces`);
            return res.status(400).json({
                error: `Username cannot start or end with empty spaces`
            })
        }

        if (username.length <= 3) {
            logger.error(`Username must be at least 3 characters`);
            return res.status(400).json({
                error: `Username must be at least 3 characters`
            })
        }

        // validate username: must be

        // validate password
        const passwordError = UsersService.validatePassword(password);
        if (passwordError) {
            logger.error(`User registration failed: invalid password`);
            return res.status(400).json({ error: passwordError })
        }

        // ensure user does not exist before posting
        UsersService.userExists(req.app.get('db'), username)
            .then(usernameExists => {
                if (usernameExists) {
                    logger.error(`User registration failed: ${username} already taken`);
                    return res.status(400).json({ error: 'Username already taken' })
                }

                return UsersService.hashPassword(password)
                    .then(hashedPass => {
                        const newUser = {
                            username,
                            password: hashedPass,
                            date_created: 'now()',
                        };
                        return UsersService.insertUser(req.app.get('db'), newUser)
                            .then(user => {
                                logger.info(`New user created: ${user.username}`);
                                res
                                    .status(201)
                                    .json(UsersService.serializeUser(user))
                                ;
                            })
                        ;
                    })
                ;
            })
            .catch(next)
        ;
    })
;

module.exports = usersRouter;