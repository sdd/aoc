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
const ex1 = `0 2 7 0`;
const ex1expectedP1 = 5;
const ex1expectedP2 = ``;

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
    return space;
}

function part1(input) {
    input = _.clone(input);

    const seen = new Set();
    let count = 0;

    while(count < 100000) {
        let maxIdx = 0;
        let maxVal = input[0];
        for(let x = 0; x < input.length; x++) {
            if (input[x] > maxVal) {
                maxVal = input[x];
                maxIdx = x;
            }
        }

        let qtyToRedist = input[maxIdx];
        input[maxIdx] = 0;
        let currIdx = (maxIdx + 1) % input.length;
        while(qtyToRedist) {
            input[currIdx] += 1;
            currIdx = (currIdx + 1) % input.length;
            qtyToRedist -= 1;
        }
        

        count += 1;
        const hash = input.join(':');
        if (seen.has(hash)) {
            break;
        }
        seen.add(hash);
    }

    return count;
}

function part2(input) {
    input = _.clone(input);

    const seen = new Set();
    const seenMap = new Map();
    let count = 0;

    while(count < 100000) {
        let maxIdx = 0;
        let maxVal = input[0];
        for(let x = 0; x < input.length; x++) {
            if (input[x] > maxVal) {
                maxVal = input[x];
                maxIdx = x;
            }
        }

        let qtyToRedist = input[maxIdx];
        input[maxIdx] = 0;
        let currIdx = (maxIdx + 1) % input.length;
        while(qtyToRedist) {
            input[currIdx] += 1;
            currIdx = (currIdx + 1) % input.length;
            qtyToRedist -= 1;
        }
        

        count += 1;
        const hash = input.join(':');
        if (seen.has(hash)) {
            return count - seenMap.get(hash);
        }
        seen.add(hash);
        seenMap.set(hash, count);
    }

    return count;
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

