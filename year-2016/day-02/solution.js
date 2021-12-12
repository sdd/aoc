/* eslint-disable prefer-destructuring */
const d = require('debug')('solution');
const _ = require('lodash');

const util = require('../../utils');
const imp = require('../../imp');
const parsers = require('../../parse');

// First example and expected answers for each part.
// Ignored if empty strings.
const ex1 = `ULL
RRDDD
LURDL
UUUUD`;
const ex1expectedP1 = 1985;
const ex1expectedP2 = '5DB3';

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
    return line.map(l => l.split(''));
}

function part1(input) {
    let result = 0;
    let pos = [1, 1];
    for (const line of input) {
        for (const char of line) {
            // eslint-disable-next-line default-case
            switch (char) {
                case 'U':
                    pos = [pos[0], Math.max(0, pos[1] - 1)];
                    break;
                case 'D':
                    pos = [pos[0], Math.min(2, pos[1] + 1)];
                    break;
                case 'L':
                    pos = [Math.max(0, pos[0] - 1), pos[1]];
                    break;
                case 'R':
                    pos = [Math.min(2, pos[0] + 1), pos[1]];
                    break;
            }
        }
        const digit = (pos[1] * 3 + pos[0] + 1);
        result = (result * 10) + digit;
    }

    return result;
}

function part2(input) {
    let result = '';
    let pos = [0, 2];

    const KB = [
        [0, 0, 1, 0, 0],
        [0, 2, 3, 4, 0],
        [5, 6, 7, 8, 9],
        [0, 'A', 'B', 'C', 0],
        [0, 0, 'D', 0, 0],
    ]

    for (const line of input) {
        for (const char of line) {
            let x; let y;
            // eslint-disable-next-line default-case
            switch (char) {
                case 'U':
                    x = pos[0];
                    y = Math.max(0, pos[1] - 1);
                    if (KB[y][x]) { pos = [x, y]; }
                    break;
                case 'D':
                    x = pos[0];
                    y = Math.min(4, pos[1] + 1);
                    if (KB[y][x]) { pos = [x, y]; }
                    break;
                case 'L':
                    x = Math.max(0, pos[0] - 1)
                    y = pos[1];
                    if (KB[y][x]) { pos = [x, y]; }
                    break;
                case 'R':
                    x = Math.min(4, pos[0] + 1);
                    y = pos[1];
                    if (KB[y][x]) { pos = [x, y]; }
                    break;
            }
        }
        result += KB[pos[1]][pos[0]];
    }

    return result;
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

