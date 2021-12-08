const d = require('debug')('solution');
const _ = require('lodash');

const util = require('../../utils');
const imp = require('../../imp');
const parsers = require('../../parse');

// First example and expected answers for each part.
// Ignored if empty strings.
const ex1 = `16,1,2,0,4,2,7,1,2,14`;
const ex1expectedP1 = 37;
const ex1expectedP2 = 168;

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
    return comma.map(Number);
}

function part1(input) {
    const max = _.max(input);
    let best = Number.MAX_SAFE_INTEGER;

    for(let i = 0; i <= max; i++) {
        let sum = 0;
        for(const crab of input) {
            sum += Math.abs(crab - i);
        }
        if (sum < best) {
            best = sum;
        }
    }

    return best;
}

function triangle(x) {
    return (x * (x+1)) / 2;
}

function part2(input) {
    const max = _.max(input);
    let best = Number.MAX_SAFE_INTEGER;

    for(let i = 0; i <= max; i++) {
        let sum = 0;
        for(const crab of input) {
            sum += triangle(Math.abs(crab - i));
        }
        if (sum < best) {
            best = sum;
        }
    }

    return best;
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

