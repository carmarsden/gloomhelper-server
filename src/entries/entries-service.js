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

    insertParty(db, newParty) {
        return db.insert(newParty)
            .into('gloomhelper_parties')
            .returning('*')
            .then(([party]) => party)
        ;
    },

    insertChar(db, newChar) {
        return db.insert(newChar)
            .into('gloomhelper_chars')
            .returning('*')
            .then(([char]) => char)
        ;
    },

    serializeParty(party) {
        return {
            id: party.id,
            user_id: party.user_id,
            party_name: xss(party.party_name),
            location: xss(party.location),
            reputation: party.reputation,
            party_notes: xss(party.party_notes),
            achievements: xss(party.achievements),
            date_modified: party.date_modified
        }
    },

    serializeChar(char) {
        return {
            id: char.id,
            user_id: char.user_id,
            character_name: xss(char.character_name),
            character_class: char.character_class,
            xp: char.xp,
            gold_notes: xss(char.gold_notes),
            items_notes: xss(char.items_notes),
            character_notes: xss(char.character_notes),
            goals_1: char.goals_1,
            goals_2: char.goals_2,
            goals_3: char.goals_3,
            goals_4: char.goals_4,
            goals_5: char.goals_5,
            goals_6: char.goals_6,
            perks: xss(char.perks),
            date_modified: char.date_modified
        }
    },

    serializeCharArray(arr) {
        return arr.map(this.serializeChar)
    },
}

module.exports = EntriesService;