const logger = require('../logger');

function checkRequirements(body, required, res) {
    for (const requirement of required) {
        if (!body[requirement]) {
            logger.error(`Missing '${requirement}' in post request`);
            return res.status(400).json({
                error: `Missing '${requirement}' in request body`
            })
        }
    }
}

module.exports = { checkRequirements }