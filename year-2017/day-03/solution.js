const d = require('debug')('solution');
const _ = require('lodash');

const util = require('../../utils');
const maze = require('../../maze');
const imp = require('../../imp');
const parsers = require('../../parse');
const sets = require('../../sets');

// add string tags here to help future categorization.
const tags = [];

// First example and expected answers for each part.
// Ignored if empty strings.
const ex1 = `12`;
const ex1expectedP1 = 3;
const ex1expectedP2 = 23;

// Second example and expected answers for each part.
// Ignored if empty strings.
const ex2 = `1024`;
const ex2expectedP1 = 31;
const ex2expectedP2 = 1968;

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
    return raw;
}

const MAP_PHASE_TO_DIR = {
    0: [1, 0],
    1: [0, -1],
    2: [-1, 0],
    3: [0, 1]
};

function part1(input) {
    let x = 0;
    let y = 0;
    let idx = 1;
    let phase = 0;
    let lastRing = 0;

    while(idx < input) {
        idx += 1;
        x += MAP_PHASE_TO_DIR[phase][0];
        y += MAP_PHASE_TO_DIR[phase][1];

        const ring = Math.floor(Math.ceil(Math.sqrt(idx)) / 2);

        switch(phase) {
            case 0:
                if (ring !== lastRing) {
                    phase = 1;
                }
                break;

            case 1:
                if (y === 0 - ring) {
                    phase = 2;
                }
                break;

            case 2:
                if (x === 0 - ring) {
                    phase = 3;
                }
                break;

            case 3:
                if (y === ring) {
                    phase = 0;
                }
                break;

            default:
                // nothing
        }
        lastRing = ring;
    }
    
    return Math.abs(x) + Math.abs(y);
}

function part2(input) {
    let x = 100;
    let y = 100;
    let idx = 1;
    let phase = 0;
    let lastRing = 0;

    const grid = util.array2D(200, 200);
    grid[100][100] = 1;

    while(idx < 1000000) {
        idx += 1;
        const ring = Math.floor(Math.ceil(Math.sqrt(idx)) / 2);

        x += MAP_PHASE_TO_DIR[phase][0];
        y += MAP_PHASE_TO_DIR[phase][1];

        const val = _.sum(maze.D8_TO_RCD.map(([yd, xd]) => grid[y+yd][x+xd]));

        grid[y][x] = val;
        if (val > input) {
            return val;
        }

        switch(phase) {
            case 0:
                if (ring !== lastRing) {
                    phase = 1;
                }
                break;

            case 1:
                if (y === 100 - ring) {
                    phase = 2;
                }
                break;

            case 2:
                if (x === 100 - ring) {
                    phase = 3;
                }
                break;

            case 3:
                if (y === 100 + ring) {
                    phase = 0;
                }
                break;

            default:
                // nothing
        }
        lastRing = ring;
    }
    
    return Math.abs(x - 100) + Math.abs(y - 100);
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

