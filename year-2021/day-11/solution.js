/* eslint-disable no-loop-func */
const d = require('debug')('solution');
const _ = require('lodash');

const util = require('../../utils');
const imp = require('../../imp');
const parsers = require('../../parse');

// First example and expected answers for each part.
// Ignored if empty strings.
const ex1 = `5483143223
2745854711
5264556173
6141336146
6357385478
4167524645
2176841721
6882881134
4846848554
5283751526`;
const ex1expectedP1 = 1656;
const ex1expectedP2 = 195;

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
    return grid;
}

const ADJ_MAP = [
    [0, -1],
    [1, -1],
    [1, 0],
    [1, 1],
    [0, 1],
    [-1, 1],
    [-1, 0],
    [-1, -1],
]

function part1(input) {
    input = _.cloneDeep(input); // Missing this out caused me so much pain
    let flashCount = 0;

    for (let step = 1; step <= 100; step++) {
        const flashSet = new Set();
        for(let y = 0; y < 10; y++) {
            for(let x = 0; x < 10; x++) {
                if (!flashSet.has(`${x}_${y}`)) {
                    if (++input[y][x] > 9) {
                        flashCount += flash(input, x, y, flashSet);
                    }
                }
            }
        }
    }

    return flashCount;
}

function flash(map, x, y, flashSet) {
    map[y][x] = 0;
    let flashCount = 1;
    flashSet.add(`${x}_${y}`);

    for (const a of ADJ_MAP) {
        if (y + a[1] >= 0 && x + a[0] >= 0 && y + a[1] < 10 && x + a[0] < 10) {
            if (!flashSet.has(`${x+a[0]}_${y+a[1]}`)) {
                if (++map[y + a[1]][x + a[0]] > 9) {
                    flashCount += flash(map, x + a[0], y + a[1], flashSet);
                }
            }
        }
    }

    return flashCount;
}

function part2(input) {
    let flashCount;
    let flashSet;

    let step = 0;
    while (++step < 1000) {
        flashSet = new Set();
        flashCount = 0;
        for(let y = 0; y < 10; y++) {
            for(let x = 0; x < 10; x++) {
                if (!flashSet.has(`${x}_${y}`)) {
                    if (++input[y][x] > 9) {
                        flashCount += flash(input, x, y, flashSet);
                        if (flashCount === 100) {
                            return step;
                        }
                    }
                }
            }
        }
    }
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

