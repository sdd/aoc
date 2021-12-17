const d = require('debug')('solution');
const _ = require('lodash');

const util = require('../../utils');
const imp = require('../../imp');
const parsers = require('../../parse');
const utils = require('../../utils');

// First example and expected answers for each part.
// Ignored if empty strings.
const ex1 =`0,9 -> 5,9
8,0 -> 0,8
9,4 -> 3,4
2,2 -> 2,1
7,0 -> 7,4
6,4 -> 2,0
0,9 -> 2,9
3,4 -> 1,4
0,0 -> 8,8
5,5 -> 8,2`;
const ex1expectedP1 = 5;
const ex1expectedP2 = 12;

// Second example and expected answers for each part.
// Ignored if empty strings.
const ex2 = ``;
const ex2expectedP1 = '';
const ex2expectedP2 = '';

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
    return lines.map(parsers.splitNonAlphanum);
}

function part1(input) {
    const vals = new Map();

    for (const line of input) {
        const [x1, y1, x2, y2] = line;
        if (x1 === x2 || y1 === y2) {
            const ystep = Math.sign(y2 - y1);
            const xstep = Math.sign(x2 - x1);

            let x = x1;
            let y = y1;
            while(x !== x2 || y !== y2) {
                incVal(vals, x, y)
                x += xstep;
                y += ystep;
            }
            incVal(vals, x2, y2);
        }
    }

    return [...vals.values()].filter(v => v >= 2).length;
}

function incVal(vals, x, y) {
    const key = `${x}_${y}`;
    const val = vals.get(key);
    vals.set(key, val ? val + 1 : 1);
}

function part2(input) {
    const vals = new Map();

    for (const line of input) {
        const [x1, y1, x2, y2] = line;
        const ystep = Math.sign(y2 - y1);
        const xstep = Math.sign(x2 - x1);

        let x = x1;
        let y = y1;
        while(x !== x2 || y !== y2) {
            incVal(vals, x, y)
            x += xstep;
            y += ystep;
        }
        incVal(vals, x2, y2);
    }

    return [...vals.values()].filter(v => v >= 2).length;
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

