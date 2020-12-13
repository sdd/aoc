const d = require('debug')('solution');
const _ = require('lodash');

const util = require('../../utils');
const imp = require('../../imp');
const parsers = require('../../parse');

// First example and expected answers for each part.
// Ignored if empty strings.
const ex1 = `939
7,13,x,x,59,x,31,19`;
const ex1expectedP1 = 295;
const ex1expectedP2 = 1068781;

// Seconf example and expected answers for each part.
// Ignored if empty strings.
const ex2 = ``;
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
    return [{
        depart: Number(line[0]),
        ids: line[1].split(',').map(Number)
    }];
}

function part1([{ depart, ids }]) {
    let goodIds = _.filter(ids);

    let count = 0;
    while(++count) {
        let good = _.find(goodIds, id => (depart + count) % id === 0);
        if (good !== undefined) return count * good;
    }
}

function part2([{ ids }]) {
    let [[step, offset], ...rest] = ids.map((...args) => [...args]).filter(([val]) => val);
    let pos = step - offset;

    rest.forEach(([ val, offset ]) => {
        while ((pos + offset) % val !== 0) pos += step;
        step = step * val;
    });

    return pos;
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

