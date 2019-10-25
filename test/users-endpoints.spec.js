const knex = require('knex');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Users endpoints', function() {
    // ESTABLISH TEST ENVIRONMENT
    let db;
    const testUsers = helpers.makeUsersArray();
    const testUser = testUsers[0];
    
    before('establish knex db instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        });
        app.set('db', db);
    });
    after('disconnect from db', () => db.destroy());

    before('cleanup', () => helpers.cleanTables(db));
    afterEach('cleanup', () => helpers.cleanTables(db));

    // TEST CASES: /api/users/login
    describe('POST /api/users/login', () => {
        beforeEach('insert users', () => helpers.seedUsers(db, testUsers));

        it('responds with 200 and JWT when credentials valid', () => {
            const validUser = {
                username: testUser.username,
                password: testUser.password
            };
            const expectedToken = jwt.sign(
                { user_id: 1 },
                process.env.JWT_SECRET,
                {
                    subject: testUser.username,
                    expiresIn: process.env.JWT_EXPIRY,
                    algorithm: 'HS256',
                }
            );

            return supertest(app)
                .post('/api/users/login')
                .send(validUser)
                .expect(200, {
                    authToken: expectedToken
                })
            ;
        })

        it('responds with 400 error when bad username', () => {
            const invalidUser = { username: 'invalid-name', password: 'password1' };
            return supertest(app)
                .post('/api/users/login')
                .send(invalidUser)
                .expect(400, { error: 'Incorrect username or password' })
            ;
        })

        it('responds with 400 error when bad password', () => {
            const invalidUser = { username: testUser.username, password: 'invalid-pass' };
            return supertest(app)
                .post('/api/users/login')
                .send(invalidUser)
                .expect(400, { error: 'Incorrect username or password' })
            ;
        })

        const requiredFields = ['username', 'password']
        requiredFields.forEach(field => {
            const loginInfo = {
                username: testUser.username,
                password: testUser.password,
            };

            it(`responds with 400 error when '${field}' is missing`, () => {
                delete loginInfo[field];
                return supertest(app)
                    .post('/api/users/login')
                    .send(loginInfo)
                    .expect(400, {
                        error: `Missing '${field}' in request body`
                    })
                ;
            })
        })
    })
})