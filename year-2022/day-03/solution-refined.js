const d = require('debug')('solution');
const _ = require('lodash');

const util = require('../../utils');
const imp = require('../../imp');
const parsers = require('../../parse');
const sets = require('../../sets');


// First example and expected answers for each part.
// Ignored if empty strings.
const ex1 = `vJrwpWtwJgWrhcsFMMfFFhFp
jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
PmmdzqPrVvPwwTWBwg
wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
ttgJtRGJQctTZtZT
CrZsJsPPZsGzwwsLwLmpwMDw`;
const ex1expectedP1 = 157;
const ex1expectedP2 = 70;

// Second example and expected answers for each part.
// Ignored if empty strings.
const ex2 = ``;
const ex2expectedP1 = ``;
const ex2expectedP2 = ``;

/**
 * Input parser.
 * @param {Object} arg collection of pre-parsed helpers
 * @param {string} arg.raw unmodified input string from input-01.txt
 * @param {Array<string>} arg.lines raw split on newlines, trimmed, empty filtered
 * @param {Array<string|Number>} arg.alphanums alphanumeric groups in lines[0]
 * @param {Array<Number>} arg.nums numeric values in lines[0]
 * @param {Array<string>} arg.comma split on commas, trimmed, empty filtered 
 * @param {Array<string>} arg.space split on spaces, trimmed, empty filtered
 * @param {Array<string>} arg.chars split lines[0] on every char
 * @param {Array<Array<string>} arg.multi split on double newlines, empty filtered, split again on newlines, trimmed
 * @param {Array<Array<string>} arg.grid 2D char grid
 */
 function parse({ raw, lines, alphanums, nums, comma, space, chars, multi, grid }) {
    return lines.map(x => x.split(''));
}

function part1(input) {
    return _.sum(input.map(r => {
        const sacks = _.chunk(r, r.length / 2).map(x => new Set(x));

        const inter = sets.intersection(...sacks);
        const cc = [...inter.values()][0].charCodeAt(0);

        return cc >= 97 ? (cc - 96) : (cc - 65 + 27);
    }));
}

function part2(input) {
    return _.sum(_.chunk(input, 3).map(chunk => {
        const inter = chunk.map(x => new Set(x)).reduce(sets.intersection);

        const cc = [...inter.values()][0].charCodeAt(0);

        return cc >= 97 ? (cc - 96) : (cc - 65 + 27);
    }));
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

