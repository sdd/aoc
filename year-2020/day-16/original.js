const d = require('debug')('solution');
const _ = require('lodash');

const util = require('../../utils');
const imp = require('../../imp');
const parsers = require('../../parse');

// First example and expected answers for each part.
// Ignored if empty strings.
const ex1 = ''/*`class: 1-3 or 5-7
row: 6-11 or 33-44
seat: 13-40 or 45-50

your ticket:
7,1,14

nearby tickets:
7,3,47
40,4,50
55,2,20
38,6,12`*/;
const ex1expectedP1 = 71;
const ex1expectedP2 = ``;

// Seconf example and expected answers for each part.
// Ignored if empty strings.
const ex2 = `class: 0-1 or 4-19
row: 0-5 or 8-19
seat: 0-13 or 16-19

your ticket:
11,12,13

nearby tickets:
3,9,18
15,1,5
5,14,9`;
const ex2expectedP1 = ``;
const ex2expectedP2 = ``;

/**
 * Input parser.
 * @param {raw} raw unmodified input string from input-01.txt
 * @param {line} raw split on newlines, empty items removed, items trimmed
 * @param {comma} raw split on commas, empty items removed, items trimmed
 * @param {space} raw split on spaces, empty lines removed, items trimmed
 * @param {multi} raw, split on double newlines, empty items removed, split again on newlines, items trimmed
 */
function parse({ raw, line, comma, space, multi }) {

    const fields = multi[0].map(l => {
        const [ name, ranges ] = l.split(':');
        return { name, ranges: ranges.split(' or ').map(r => r.split('-').map(Number)) };
    });
    const yours = multi[1][1].split(',').map(Number);

    const nearby = multi[2].map(l=> l.split(',').map(Number));
    nearby.shift();

    return [{ yours, nearby, fields }];
}

function part1([{ nearby, fields, yours }]) {
    let errRate = 0;
    nearby.forEach(ticket => {
        ticket.forEach(value => {
            const valid = !_.every(fields, ({ ranges }) => {
                const oor =  _.every(ranges, ([from, to]) => {
                    let outside = (value < from) || (value > to);
                    //d('value %d outside %d -> %d: %o', value, from, to, outside);
                    return outside;
                });
                //d('outside every range: %o', oor);
                return oor;
            });
            if (!valid) {
                //d('invalid value: %d', value);
                errRate += value;
            }
        });
    });

    return errRate;
}

function part2(input) {
    const {nearby, fields, yours} = input[0];
    d('all tickets: %o', nearby.length);

    let validTickets = nearby.filter(ticket => {
        return _.every(ticket, value => {
            return !_.every(fields, ({ ranges }) => {
                const oer =  _.every(ranges, ([from, to]) => {
                    let outside = (value < from) || (value > to);
                    //d('value %d outside %d -> %d: %o', value, from, to, outside);
                    return outside;
                });
                //d('outside every range: %o', oor);
                return oer;
            });
        });
    });

    d('valid tickets: %o', validTickets.length);

    let classIndexToTicketIndex = [];
    let remainingFields = _.range(yours.length);

    _.forEach(fields, field => {
        const matchingFields = _.filter(remainingFields, fieldIndex => {
            let extracted = [...validTickets, yours].map(t => t[fieldIndex]);
            //d('matching against index %d: %o', fieldIndex, extracted);
            let allTicketsMatch =  _.every(extracted, ticketVal => {
                const validMatch = _.some(field.ranges, ([from, to]) => ticketVal >= from && ticketVal <= to);
                if (!validMatch) {
                    //d('invalid: ticketVal %d, ranges %o', ticketVal, cls.ranges);
                }
                return validMatch;
            });
            //d('class %s, index %d, all match: %o', cls.name, fieldIndex, allTicketsMatch);
            return allTicketsMatch;
        });
        d('field "%s" matches %o', field.name, matchingFields);

        classIndexToTicketIndex.push(matchingFields);
    });

    d('map %o', classIndexToTicketIndex);
    d('map lengths: %o', classIndexToTicketIndex.map(c => c.length));
    let changes = true;
    while(changes) {
        changes = false;
        let cand = _.findIndex(classIndexToTicketIndex, c => c.length === 1);
        if (cand !== -1) {
            let candVal = classIndexToTicketIndex[cand][0];
            classIndexToTicketIndex = classIndexToTicketIndex.map(l => (typeof l === 'number' ? l :  l.filter(v => v !== candVal)));
            classIndexToTicketIndex[cand] = candVal;
            changes = true;
        }
    }
    d('map: %o', classIndexToTicketIndex);

    let departureFields = classIndexToTicketIndex.slice(0, 6);
    d('just departure: %o', departureFields);
    let yourDepFields = departureFields.map(d => yours[d]);
    d("your departure field values: %o", yourDepFields);

    let product = _.reduce(yourDepFields, (acc, val) => acc*val, 1 );

    return product;
}

module.exports = {
    ex1,
    ex2,
    ex1expectedP1,
    ex1expectedP2,
    ex2expectedP1,
    ex2expectedP2,
    part1,
    part2,
    parse,
};

