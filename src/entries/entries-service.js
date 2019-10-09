const xss = require('xss');

const EntriesService = {
    getPartiesByUser(db, user_id) {
        return db.from('gloomhelper_parties AS party')
            .select('*')
            .where('party.user_id', user_id)
            .orderBy('party.date_modified', 'desc')
        ;
    },

    getCharsByUser(db, user_id) {
        return db.from('gloomhelper_chars AS char')
            .select('*')
            .where('char.user_id', user_id)
            .orderBy('char.xp', 'asc')
        ;
    },
}

module.exports = EntriesService;