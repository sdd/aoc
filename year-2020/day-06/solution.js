const d = require('debug')('aoc');
const _ = require('lodash');

const util = require('../../utils');
const imp = require('../../imp');
const parsers = require('../../parse');

// First example and expected answers for each part.
// Ignored if empty strings.
const ex1 = ``;
const ex1expectedP1 = ``;
const ex1expectedP2 = ``;

// Seconf example and expected answers for each part.
// Ignored if empty strings.
const ex2 = `abc

a
b
c

ab
ac

a
a
a
a

b
`;
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
    return multi;
}

function part1(input) {
    let res = input.map(grp => {
        const seen = {};
        grp.forEach(person => {
            person.split('').forEach(q => {
                 if (!seen[q]) { seen[q] = 1; }
                 else { seen[q]++ };
            });
        });

        return Object.keys(seen).length;
        
    });    
    
    return _.sum(res);
}

function part2(input) {
    let res = input.map(grp => {
        const seen = {};
        grp.forEach(person => {
            person.split('').forEach(q => {
                 if (!seen[q]) { seen[q] = 1; }
                 else { seen[q]++ };
            });
        });

        return [seen, grp.length];
        
    });

    res = res.map(([seen, len]) => {
        let count = Object.values(seen).filter(x => x === len).length;
        return count;
    });

    return _.sum(res);
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

