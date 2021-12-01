const d = require('debug')('solution');
const _ = require('lodash');

const util = require('../../utils');
const imp = require('../../imp');
const parsers = require('../../parse');

// First example and expected answers for each part.
// Ignored if empty strings.
const ex1 = `99
200
208
210
200
207
240
269
260
263`;
const ex1expectedP1 = 7;
const ex1expectedP2 = 5;

// Second example and expected answers for each part.
// Ignored if empty strings.
const ex2 = ``;
const ex2expectedP1 = ``;
const ex2expectedP2 = 5;

/**
 * Input parser.
 * @param {raw} raw unmodified input string from input-01.txt
 * @param {line} raw split on newlines, empty items removed, items trimmed
 * @param {comma} raw split on commas, empty items removed, items trimmed
 * @param {space} raw split on spaces, empty lines removed, items trimmed
 * @param {multi} raw, split on double newlines, empty items removed, split again on newlines, items trimmed
 */
function parse({ raw, line, comma, space, multi }) {
    return line.map(Number);
}

function part1(input) {
    let c = 0;
    for (i = 0; i <= input.length - 2; i++) {
        if (input[i + 1] > input[i]) {
            c++;
        }
    }
    return c;
}

function part2(input) {
    let c = 0;
    for (i = 0; i <= input.length - 4; i++) {
        if (input[i + 3] > input[i]) {
            c++;
        }
    }
    return c;
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

