const d = require('debug')('solution');
const _ = require('lodash');

const util = require('../../utils');
const imp = require('../../imp');
const parsers = require('../../parse');

// First example and expected answers for each part.
// Ignored if empty strings.
const ex1 = `00100
11110
10110
10111
10101
01111
00111
11100
10000
11001
00010
01010`;
const ex1expectedP1 = 198;
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
    return lines;
}

function part1(input) {
    let gamma = 0;
    let eps = 0;

    const count = input.length;
    const len = input[0].length;

    for(let bit = 0; bit < len; bit++) {
        const count1 = input.filter(x => x.charAt(bit) === '1').length;
        if (count1 > (count / 2)) {
            gamma += (2 ** (len - bit - 1));
        } else {
            eps += (2 ** (len - bit - 1));
        }
    }

    return gamma * eps;
}

function part2(input) {
    let oxlist = [...input];
    let colist = [...input];

    const len = input[0].length;

    for(let bit = 0; bit < len; bit++) {
        const count1 = oxlist.filter(x => x.charAt(bit) === '1').length;
        if (count1 >= (oxlist.length / 2)) {
            oxlist = oxlist.filter(x => x.charAt(bit) === '1');
        } else {
            oxlist = oxlist.filter(x => x.charAt(bit) === '0');
        }
        if (oxlist.length === 1) { break; }
    }

    for(let bit = 0; bit < len; bit++) {
        let count1 = 0;
        _.forEach(colist, line => {
            if (line.charAt(bit) === '1') { count1++; }
        });
        if (count1 >= (colist.length / 2)) {
            colist = colist.filter(x => x.charAt(bit) === '0');
        } else {
            colist = colist.filter(x => x.charAt(bit) === '1');
        }
        if (colist.length === 1) { break; }
    }

    const oxrat = parseInt(oxlist[0], 2);
    const corat = parseInt(colist[0], 2);

    return oxrat * corat;
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

