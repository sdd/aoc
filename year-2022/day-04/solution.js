const d = require('debug')('solution');
const _ = require('lodash');

const util = require('../../utils');
const imp = require('../../imp');
const parsers = require('../../parse');
const sets = require('../../sets');

// add string tags here to help future categorization.
const tags = [];

// First example and expected answers for each part.
// Ignored if empty strings.
const ex1 = `2-4,6-8
2-3,4-5
5-7,7-9
2-8,3-7
6-6,4-6
2-6,4-8`;
const ex1expectedP1 = 2;
const ex1expectedP2 = 4;

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
    return lines.map(x => parsers.splitNonAlphanumPos(x));
}

function part1(input) {
    let sum = 0;

    for(const [l1, h1, l2, h2] of input) {
        if (l2 >= l1 && l2 <= h1 && h2 <= h1 && h2 >= l1) {
            sum += 1;
        } else if (l1 >= l2 && l1 <= h2 && h1 <= h2 && h1 >= l2) {
            sum += 1;
        }
    }

    return sum;
}

function part2(input) {
    let sum = 0;

    for(const [l1, h1, l2, h2] of input) {
        if (l2 <= h1 && l2 >= l1) {
            sum += 1;
        } else if (l1 <= h2 && l1 >= l2) {
            sum += 1;
        }
    }

    return sum;
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
    tags,
};

