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
    return nums;
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

