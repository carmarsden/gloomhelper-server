const logger = require('../logger');
const UsersService = require('../users/users-service');

function requireAuth(req, res, next) {
    const authToken = req.get('Authorization') || '';

    let bearerToken;
    if (!authToken.toLowerCase().startsWith('bearer ')) {
        logger.error('Request is missing bearer token');
        return res.status(401).json({ error: 'Missing bearer token' })
    } else {
        bearerToken = authToken.slice(7, authToken.length);
    }

    try {
        const payload = UsersService.verifyJwt(bearerToken);

        UsersService.getUser(req.app.get('db'), payload.sub)
            .then(user => {
                if (!user) {
                    logger.error('Unauthorized token: no user found');
                    return res.status(401).json({ error: 'Unauthorized request' })
                }
                req.user = UsersService.serializeUser(user);
                next();
            })
            .catch(err => {
                console.error(err);
                next(err);
            })
        ;
    } catch(err) {
        logger.error(`Unauthorized request: ${err}`)
        res.status(401).json({ error: 'Unauthorized request' })
    }
}

module.exports = requireAuth;