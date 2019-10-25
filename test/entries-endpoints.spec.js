const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');
const EntriesService = require('../src/entries/entries-service');

describe('Entries endpoints', function() {
    // ESTABLISH TEST ENVIRONMENT
    let db;
    const testUsers = helpers.makeUsersArray();
    const testUser = testUsers[0];
    const testParty = helpers.makeParty();
    const testChar = helpers.makeChar();
    
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

    // TEST CASES: /api/entries
    describe('GET /api/entries', () => {
        beforeEach('insert entries', () => helpers.seedEntries(db, testParty, testChar));

        it('responds with entries on get request', () => {
            const expectedParty = {
                ...testParty,
                id: 1,
                date_modified: testParty.date_modified.toISOString()
            };
            const expectedChar = {
                ...testChar,
                id: 1,
                date_modified: testChar.date_modified.toISOString()
            };
            const expectedOutput = [
                [expectedParty], 
                [expectedChar]
            ];

            return supertest(app)
                .get('/api/entries')
                .set('Authorization', `Bearer ${helpers.makeAuthToken(testUser)}`)
                .expect(200, expectedOutput)
            ;
        })

        it(`responds with 401 error when fetching without JWT`, () => {
            return supertest(app)
                .get('/api/entries')
                .expect(401)
            ;
        })
    })

    // TEST CASES: /api/entries/parties
    describe.only('POST /api/entries/parties', () => {
        context('Happy path', () => {
            it(`responds with 201 and serialized party`, () => {
                return supertest(app)
                    .post('/api/entries/parties')
                    .set('Authorization', `Bearer ${helpers.makeAuthToken(testUser)}`)
                    .send(testParty)
                    .expect(201)
                    .expect(res => {
                        expect(res.body).to.have.property('id')
                        expect(res.body.user_id).to.eql(testUser.expected_id)
                        expect(res.body.party_name).to.eql(testParty.party_name)
                        expect(res.body.location).to.eql(testParty.location)
                        expect(res.body.reputation).to.eql(testParty.reputation)
                        expect(res.body.party_notes).to.eql(testParty.party_notes)
                        expect(res.body.achievements).to.eql(testParty.achievements)
                        expect(res.body.date_modified).to.eql(testParty.date_modified.toISOString())
                    })
                    .expect(res =>
                        db
                            .from('gloomhelper_parties')
                            .select('*')
                            .where({ id: res.body.id })
                            .first()
                            .then(row => {
                                expect(row.user_id).to.eql(testUser.expected_id)
                                expect(row.party_name).to.eql(testParty.party_name)
                                expect(row.location).to.eql(testParty.location)
                                expect(row.reputation).to.eql(testParty.reputation)
                                expect(row.party_notes).to.eql(testParty.party_notes)
                                expect(row.achievements).to.eql(testParty.achievements)
                                expect(row.date_modified).to.eql(testParty.date_modified)
                            })
                    )
                ;
            })
        })
    })


})