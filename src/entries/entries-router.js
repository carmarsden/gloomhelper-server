const express = require('express');
const logger = require('../logger');
const EntriesService = require('./entries-service');

const entriesRouter = express.Router();
const jsonParser = express.json();

entriesRouter
    .route('/')
    .get((req, res, next) => {
        Promise.all([
            EntriesService.getPartiesByUser(req.app.get('db'), req.query.user_id),
            EntriesService.getCharsByUser(req.app.get('db'), req.query.user_id)
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
    .post(jsonParser, (req, res, next) => {
        const body = req.body;
        body.user_id = Number(req.query.user_id);

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

module.exports = entriesRouter;