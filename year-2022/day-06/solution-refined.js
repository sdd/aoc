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
const ex1 = `bvwbjplbgvbhsrlpgdmjqwftvncz`;
const ex1expectedP1 = 5;
const ex1expectedP2 = ``;

// Second example and expected answers for each part.
// Ignored if empty strings.
const ex2 = `mjqjpqmgbljsphdztnvjfqwrcgsmlb`;
const ex2expectedP1 = ``;
const ex2expectedP2 = 19;

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
    return chars;
}

function part1(input) {
    return partx(input, 4);
}

function partx(input, windowSize) {
    for(let i = windowSize - 1; i < input.length - 1; i++) {
        const m = new Set();
        for (let j = windowSize - 1; j >= 0; j--) {
            if (m.has(input[i-j])) {
                break;
            }
            m.add(input[i-j]);
        }
        if (m.size === windowSize) {
            return i + 1;
        }
    }
}

function part2(input) {
    return partx(input, 14);
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

