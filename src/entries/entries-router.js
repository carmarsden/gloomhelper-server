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

module.exports = entriesRouter;