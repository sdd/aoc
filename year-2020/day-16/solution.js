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
    return _.sumBy(nearby, ticket =>
        _.sumBy(ticket, value =>
            _.every(fields, ({ ranges }) =>
                _.every(ranges, ([from, to]) => (value < from) || (value > to))
            ) ? value : 0
        )
    );
}

function part2([{nearby, fields, yours}]) {
    const validTickets = [...nearby, yours].filter(ticket =>
        _.every(ticket, value =>
            !_.every(fields, ({ ranges }) =>
                _.every(ranges, ([from, to]) => (value < from) || (value > to))
            )
        )
    );

    let fieldMap = fields.map(field =>
        _.filter(_.range(yours.length), fieldIndex =>
            _.every(validTickets, ticket =>
                _.some(field.ranges, ([from, to]) =>
                    ticket[fieldIndex] >= from && ticket[fieldIndex] <= to
                )
            )
        )
    );

    while(true) {
        const cand = _.findIndex(fieldMap, { length: 1 });
        if (cand !== -1) {
            const candVal = fieldMap[cand][0];
            fieldMap = fieldMap.map(x => (_.isNumber(x) ? x : _.without(x, candVal)));
            fieldMap[cand] = candVal;
            continue;
        }
        break;
    }

    return _.reduce(fieldMap.slice(0, 6).map(d => yours[d]), _.multiply, 1);
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

