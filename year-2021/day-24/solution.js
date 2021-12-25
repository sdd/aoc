/* eslint-disable no-lonely-if */
/* eslint-disable complexity */
const d = require('debug')('solution');
const _ = require('lodash');
const chalk = require('chalk');

const util = require('../../utils');
const imp = require('../../imp');
const parsers = require('../../parse');

// First example and expected answers for each part.
// Ignored if empty strings.
const ex1 = ``;
const ex1expectedP1 = ``;
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
    const combined = [...lines.slice(0, 17).map(l => l.padEnd(10, ' '))];

    for(let l = 18; l < lines.length; l++) {
        combined[l % 18] = `${combined[l % 18]}${lines[l].padEnd(10, ' ')}`;
    }
    
    for(const c of combined) {
        console.log(c);
    }


    return lines.map(parsers.splitNonAlphanum);
}

function part1(input) {
    const chunks = [];
    for (let c = 0; c < 14; c++) {
        const chunk = {
            shouldPop: input[c * 18 + 4][2] === 26,
            b: input[c * 18 + 5][2],
            c: input[c * 18 + 15][2] 
        }
        chunks.push(chunk);
    }

    d('chunks: %O', chunks);

    // highest
    // const digits = [9, 6, 9, 2, 9, 9, 9, 4, 2, 9, 3, 9, 9, 6];

    // lowest
    const digits = [4, 1, 8, 1, 1, 7, 6, 1, 1, 8, 1, 1, 4, 1];

    let z = [];
    const digitTracker = [];
    for(let i = 0; i < 14; i++) {
        z = applyChunk(z, chunks[i], digits[i], digitTracker, i, digits);
    }

    d('z is now %o', z);

    return false;
}

function applyChunk(z, chunk, digit, digitTracker, i, digits) {
    console.log('');
    d('Digit = %o, chunk %o', digit, chunk);
    let x = z.length ? z[z.length - 1] : 0;

    if (chunk.shouldPop) {
        if (z.length) {
            z.pop();
            const b = digitTracker.pop();
            const db = b ? digit[b] : 0;
            d('%o gets matched with %o (%o, %o, %o, %o)', i, b, digit, db, chunk.b, b);
        }
        // d('popping z down to %o', z);
    }

    // d('x = %o (z[last] + b = %o + %o)', x + chunk.b, x, chunk.b);
    x += chunk.b;

    if (x !== digit) {
        // d('x != digit, pushing %o (digit + c = %o + %o)', digit + chunk.c, digit, chunk.c)
        z.push(digit + chunk.c);
        digitTracker.push(i)
        // d('z is now %o', z);
    } else {
        // d(`x == digit, ${  chalk.red('not pushing')}`);
    }

    // d('DigitTracker: %o', digitTracker);
    return z;
}

function part2(input) {
    return false;
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

