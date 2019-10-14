require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');

const { NODE_ENV } = require('./config');
const app = express();
const entriesRouter = require('./entries/entries-router');
const usersRouter = require('./users/users-router');


// LOGGING & API HANDLING MIDDLEWARE

const morganOption = (NODE_ENV === 'production') ? 'tiny' : 'common';

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());


// BASIC ENDPOINT & ROUTING

app.use('/api/entries', entriesRouter);
app.use('/api/users', usersRouter);


app.get('/api/', (req, res) => {
    res.json({ ok: true })
})


// ERROR HANDLING

app.use(function errorHandler(error, req, res, next) {
    let response;
    if (NODE_ENV === 'production') {
        response = { error: { message: 'server error' } };
    } else {
        console.error(error);
        response = { message: error.message, error };
    }
    res.status(500).json(response)
})    

module.exports = app;