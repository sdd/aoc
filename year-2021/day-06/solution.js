const d = require('debug')('solution');
const _ = require('lodash');

const { outputHelp } = require('commander');
const util = require('../../utils');
const imp = require('../../imp');
const parsers = require('../../parse');

// First example and expected answers for each part.
// Ignored if empty strings.
const ex1 = `3,4,3,1,2`;
const ex1expectedP1 = 5934;
const ex1expectedP2 = 26984457539;

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
    return partx(input, 80);
}

function part2(input) {
    return partx(input, 256);
}

function partx(input, days) {
    let now = _.fill(Array(9), 0);
    for (const i of input) {
        now[i]++;
    }
    
    for(let day = 0; day < days; day++) {
        const [n0, n1, n2, n3, n4, n5, n6, n7, n8] = now;
        now = [n1, n2, n3, n4, n5, n6, n7 + n0, n8, n0];
    }

    return _.sum(now);
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

