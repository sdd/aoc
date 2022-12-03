const d = require('debug')('solution');
const _ = require('lodash');

const util = require('../../utils');
const imp = require('../../imp');
const parsers = require('../../parse');

// add string tags here to help future categorization.
const tags = ['LINES', 'INT_LIST', ];

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
    return lines.map(Number);
}

function part1(input) {
    let c = 0;
    for (let i = 0; i <= input.length - 2; i++) {
        if (input[i + 1] > input[i]) {
            c++;
        }
    }
    return c;
}

function part2(input) {
    let c = 0;
    for (let i = 0; i <= input.length - 4; i++) {
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
    tags,
};

