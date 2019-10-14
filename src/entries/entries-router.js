const express = require('express');
const logger = require('../logger');
const EntriesService = require('./entries-service');
const requireAuth = require('../auth/require-auth');

const entriesRouter = express.Router();
const jsonParser = express.json();

entriesRouter
    .route('/')
    .get(requireAuth, (req, res, next) => {
        Promise.all([
            EntriesService.getPartiesByUser(req.app.get('db'), req.user.id),
            EntriesService.getCharsByUser(req.app.get('db'), req.user.id)
        ])
            .then(entries => {
                res.json(entries)
            })
            .catch(next)
        ;
    })
;

entriesRouter
    .route('/parties')
    .post(requireAuth, jsonParser, (req, res, next) => {
        const body = req.body;
        body.user_id = Number(req.user.id);

        // validate requirements: check for required values
        const required = ['party_name', 'reputation'];
        for (const requirement of required) {
            if (!body[requirement]) {
                logger.error(`Missing '${requirement}' in party post request`);
                return res.status(400).json({
                    error: `Missing '${requirement}' in request body`
                })
            }
        }

        // validate reputation: must be an integer from -20 to +20
        if (typeof(body.reputation) !== 'number') {
            body.reputation = Number(body.reputation);
        }

        if (Number.isNaN(body.reputation) || !Number.isInteger(body.reputation)) {
            logger.error(`Reputation is not an integer in party post request`);
            return res.status(400).json({
                error: `Reputation must be an integer`
            })
        }

        if (body.reputation < -20 || body.reputation > 20) {
            logger.error(`Reputation must be from -20 to +20`);
            return res.status(400).json({
                error: `Reputation must be between -20 and +20`
            })
        }

        // insert party
        const party = EntriesService.serializeParty(body);
        EntriesService.insertParty(req.app.get('db'), party)
            .then(result => {
                res.status(201).json(EntriesService.serializeParty(result))
            })
            .catch(next)
        ;
    })
;

entriesRouter
    .route('/characters')
    .post(requireAuth, jsonParser, (req, res, next) => {
        const body = req.body;
        body.user_id = Number(req.user.id);

        // validate requirements: check for required values
        const required = ['character_name', 'character_class'];
        for (const requirement of required) {
            if (!body[requirement]) {
                logger.error(`Missing '${requirement}' in character post request`);
                return res.status(400).json({
                    error: `Missing '${requirement}' in request body`
                })
            }
        }

        // validate class: check it is one of accepted values
        const classes = ['brute', 'cragheart', 'mindthief', 'spellweaver', 'scoundrel', 'tinkerer'];
        if (!classes.includes(body.character_class)) {
            logger.error(`Invalid character_class in character post request`);
            return res.status(400).json({
                error: `Character class must be one of the following: brute, cragheart, mindthief, spellweaver, scoundrel, tinkerer`
            })
        }

        // validate xp (if provided): must be a positive integer
        if (body.xp) {
            if (typeof(body.xp) !== 'number') {
                body.xp = Number(body.xp);
            }
    
            if (Number.isNaN(body.xp) || !Number.isInteger(body.xp)) {
                logger.error(`XP is not an integer in character post request`);
                return res.status(400).json({
                    error: `XP must be an integer`
                })
            }
    
            if (body.xp < 0) {
                logger.error(`XP must be 0 or positive`);
                return res.status(400).json({
                    error: `XP cannot be less than 0`
                })
            }
        }

        // validate goals (if provided): all must be integers 0 - 3
        const goals = ['goals_1', 'goals_2', 'goals_3', 'goals_4', 'goals_5', 'goals_6'];
        for (const goal of goals) {
            if (body[goal]) {
                if (typeof(body[goal]) !== 'number') {
                    body[goal] = Number(body[goal]);
                }
    
                if (Number.isNaN(body[goal]) || !Number.isInteger(body[goal])) {
                    logger.error(`${goal} is not an integer in character post request`);
                    return res.status(400).json({
                        error: `${goal} must be an integer`
                    })
                }
    
                if (body[goal] < 0 || body[goal] > 3) {
                    logger.error(`${goal} is not range 0-3 in character post request`);
                    return res.status(400).json({
                        error: `${goal} must be between 0 and 3`
                    })
                }
            }
        }

        // validate perks (if provided): must be 15-char string of 0's and 1's
        if (body.perks) {
            if (typeof(body.perks) !== 'string' || body.perks.length !== 15) {
                logger.error(`Perks string is wrong length in character post request`);
                return res.status(400).json({
                    error: `Perks must be a string of length 15`
                })
            }

            const ALL_BINARY = /^[0-1]+$/;
            if (!ALL_BINARY.test(body.perks)) {
                logger.error(`Perks string is not all 0's and 1's in character post request`);
                return res.status(400).json({
                    error: `Perks string must be only 0's and 1's`
                })
            }
        }

        // insert character
        const char = EntriesService.serializeChar(body);
        EntriesService.insertChar(req.app.get('db'), char)
            .then(result => {
                res.status(201).json(EntriesService.serializeChar(result))
            })
            .catch(next)
        ;
    })
;

module.exports = entriesRouter;