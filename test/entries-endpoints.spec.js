const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');

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
    describe('POST /api/entries/parties', () => {
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

    // TEST CASES: /api/entries/characters
    describe('POST /api/entries/characters', () => {
        context('Happy path', () => {
            it(`responds with 201 and serialized character`, () => {
                return supertest(app)
                    .post('/api/entries/characters')
                    .set('Authorization', `Bearer ${helpers.makeAuthToken(testUser)}`)
                    .send(testChar)
                    .expect(201)
                    .expect(res => {
                        expect(res.body).to.have.property('id')
                        expect(res.body.user_id).to.eql(testUser.expected_id)
                        expect(res.body.character_name).to.eql(testChar.character_name)
                        expect(res.body.character_class).to.eql(testChar.character_class)
                        expect(res.body.xp).to.eql(testChar.xp)
                        expect(res.body.gold_notes).to.eql(testChar.gold_notes)
                        expect(res.body.items_notes).to.eql(testChar.items_notes)
                        expect(res.body.character_notes).to.eql(testChar.character_notes)
                        expect(res.body.goals_1).to.eql(testChar.goals_1)
                        expect(res.body.goals_2).to.eql(testChar.goals_2)
                        expect(res.body.goals_3).to.eql(testChar.goals_3)
                        expect(res.body.goals_4).to.eql(testChar.goals_4)
                        expect(res.body.goals_5).to.eql(testChar.goals_5)
                        expect(res.body.goals_6).to.eql(testChar.goals_6)
                        expect(res.body.perks).to.eql(testChar.perks)
                        expect(res.body.date_modified).to.eql(testChar.date_modified.toISOString())
                    })
                    .expect(res =>
                        db
                            .from('gloomhelper_chars')
                            .select('*')
                            .where({ id: res.body.id })
                            .first()
                            .then(row => {
                                expect(row.user_id).to.eql(testUser.expected_id)
                                expect(row.character_name).to.eql(testChar.character_name)
                                expect(row.character_class).to.eql(testChar.character_class)
                                expect(row.xp).to.eql(testChar.xp)
                                expect(row.gold_notes).to.eql(testChar.gold_notes)
                                expect(row.items_notes).to.eql(testChar.items_notes)
                                expect(row.character_notes).to.eql(testChar.character_notes)
                                expect(row.goals_1).to.eql(testChar.goals_1)
                                expect(row.goals_2).to.eql(testChar.goals_2)
                                expect(row.goals_3).to.eql(testChar.goals_3)
                                expect(row.goals_4).to.eql(testChar.goals_4)
                                expect(row.goals_5).to.eql(testChar.goals_5)
                                expect(row.goals_6).to.eql(testChar.goals_6)
                                expect(row.perks).to.eql(testChar.perks)
                                expect(row.date_modified).to.eql(testChar.date_modified)
                            })
                    )
                ;
            })
        })
    })
})