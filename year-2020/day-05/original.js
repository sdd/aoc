const d = require('debug')('solution');
const _ = require('lodash');

const util = require('../../utils');
const imp = require('../../imp');
const parsers = require('../../parse');

// First example and expected answers for each part.
// Ignored if empty strings.
const ex1 = ``;
const ex1expectedP1 = ``;
const ex1expectedP2 = ``;

// Second example and expected answers for each part.
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
    return line.map(a => {
        const [ a1, a2, a3, a4, a5, a6, a7, b1, b2, b3] = a;
        let r = 0;
        if (a1 === 'B') { r += 64; } 
        if (a2 === 'B') { r += 32; } 
        if (a3 === 'B') { r += 16; } 
        if (a4 === 'B') { r += 8; } 
        if (a5 === 'B') { r += 4; } 
        if (a6 === 'B') { r += 2; } 
        if (a7 === 'B') { r += 1; }


        let c = 0;
        if (b1 === 'R') { c += 4; } 
        if (b2 === 'R') { c += 2; } 
        if (b3 === 'R') { c += 1; }

        let id = r * 8 + c;

        return id;
    });
}

function part1(input) {
    return _.max(input);
}

function part2(input) {
    let seen = _.times(900, x => x);
    input.forEach(id => {    
        seen[id] = false;
    });

    return seen.filter(x => x);
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

