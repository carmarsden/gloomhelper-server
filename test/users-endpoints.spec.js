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
    beforeEach('insert users', () => helpers.seedUsers(db, testUsers));
    afterEach('cleanup', () => helpers.cleanTables(db));

    // TEST CASES: /api/users/login
    describe('POST /api/users/login', () => {
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
    });

    // TEST CASES: /api/users/register
    describe('POST /api/users/register', () => {
        context('Happy path', () => {
            it(`responds 201, serialized user, storing bcrypted password`, () => {
                const loginInfo = {
                    username: 'new-user',
                    password: '12345aA!',
                };

                return supertest(app)
                    .post('/api/users/register')
                    .send(loginInfo)
                    .expect(201)
                    .expect(res => {
                        expect(res.body).to.have.property('id')
                        expect(res.body).to.have.property('username')
                        expect(res.body).to.not.have.property('password')
                        expect(res.body.username).to.eql(loginInfo.username)
                        const expectedDate = new Date().toLocaleString('en', { timeZone: 'UTC' })
                        const actualDate = new Date(res.body.date_created).toLocaleString()
                        expect(actualDate).to.eql(expectedDate)
                    })
                    .expect(res =>
                        db
                            .from('gloomhelper_users')
                            .select('*')
                            .where({ id: res.body.id })
                            .first()
                            .then(row => {
                                expect(row.username).to.eql(loginInfo.username)
                                const expectedDate = new Date().toLocaleString('en', { timeZone: 'UTC' })
                                const actualDate = new Date(row.date_created).toLocaleString()
                                expect(actualDate).to.eql(expectedDate)                
                                bcrypt.compare(loginInfo.password, row.password, function(err, match) {
                                    expect(match).to.be.true;
                                })
                            })
                    )
                ;
            })
        })

        context('User Validation', () => {
            const requiredFields = ['username', 'password']
            requiredFields.forEach(field => {
                const loginInfo = {
                    username: testUser.username,
                    password: testUser.password,
                };
    
                it(`responds with 400 error when '${field}' is missing`, () => {
                    delete loginInfo[field];
                    return supertest(app)
                        .post('/api/users/register')
                        .send(loginInfo)
                        .expect(400, {
                            error: `Missing '${field}' in request body`
                        })
                    ;
                })
            })

            it(`responds with 400 error when password is too short`, () => {
                const loginInfo = {
                    username: 'new-user',
                    password: 'short',
                };
                return supertest(app)
                    .post('/api/users/register')
                    .send(loginInfo)
                    .expect(400, {
                        error: `Password must be at least 8 characters`
                    })
                ;
            })

            it(`responds with 400 error when password is too long`, () => {
                const loginInfo = {
                    username: 'new-user',
                    password: '1'.repeat(73),
                };
                return supertest(app)
                    .post('/api/users/register')
                    .send(loginInfo)
                    .expect(400, {
                        error: `Password must be no more than 72 characters`
                    })
                ;
            })

            it(`responds with 400 error when password starts with spaces`, () => {
                const loginInfo = {
                    username: 'new-user',
                    password: ' 1234567aA!',
                };
                return supertest(app)
                    .post('/api/users/register')
                    .send(loginInfo)
                    .expect(400, {
                        error: `Password cannot start or end with empty spaces`
                    })
                ;
            })

            it(`responds with 400 error when password ends with spaces`, () => {
                const loginInfo = {
                    username: 'new-user',
                    password: '1234567aA! ',
                };
                return supertest(app)
                    .post('/api/users/register')
                    .send(loginInfo)
                    .expect(400, {
                        error: `Password cannot start or end with empty spaces`
                    })
                ;
            })

            it(`responds with 400 error when password is not complex enough`, () => {
                const loginInfo = {
                    username: 'new-user',
                    password: 'aaaaaaaa',
                };
                return supertest(app)
                    .post('/api/users/register')
                    .send(loginInfo)
                    .expect(400, {
                        error: `Password must contain at least one each of: upper case, lower case, number, and special character`
                    })
                ;
            })

            it(`responds with 400 error when username already exists`, () => {
                const loginInfo = {
                    username: testUser.username,
                    password: '1234567aA!',
                };
                return supertest(app)
                    .post('/api/users/register')
                    .send(loginInfo)
                    .expect(400, {
                        error: `Username already taken`
                    })
                ;
            })
        })
    })

})