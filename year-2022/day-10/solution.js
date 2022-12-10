const d = require('debug')('solution');
const _ = require('lodash');

const util = require('../../utils');
const imp = require('../../imp');
const parsers = require('../../parse');
const sets = require('../../sets');
const { array2D, paint2D } = require('../../utils');

// add string tags here to help future categorization.
const tags = [];

// First example and expected answers for each part.
// Ignored if empty strings.
const ex1 = `addx 15
addx -11
addx 6
addx -3
addx 5
addx -1
addx -8
addx 13
addx 4
noop
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx -35
addx 1
addx 24
addx -19
addx 1
addx 16
addx -11
noop
noop
addx 21
addx -15
noop
noop
addx -3
addx 9
addx 1
addx -3
addx 8
addx 1
addx 5
noop
noop
noop
noop
noop
addx -36
noop
addx 1
addx 7
noop
noop
noop
addx 2
addx 6
noop
noop
noop
noop
noop
addx 1
noop
noop
addx 7
addx 1
noop
addx -13
addx 13
addx 7
noop
addx 1
addx -33
noop
noop
noop
addx 2
noop
noop
noop
addx 8
noop
addx -1
addx 2
addx 1
noop
addx 17
addx -9
addx 1
addx 1
addx -3
addx 11
noop
noop
addx 1
noop
addx 1
noop
noop
addx -13
addx -19
addx 1
addx 3
addx 26
addx -30
addx 12
addx -1
addx 3
addx 1
noop
noop
noop
addx -9
addx 18
addx 1
addx 2
noop
noop
addx 9
noop
noop
noop
addx -1
addx 2
addx -37
addx 1
addx 3
noop
addx 15
addx -21
addx 22
addx -6
addx 1
noop
addx 2
addx 1
noop
addx -10
noop
noop
addx 20
addx 1
addx 2
addx 2
addx -6
addx -11
noop
noop
noop`;
const ex1expectedP1 = 13140;
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
    return lines.map(x => x.split(' ').map(parsers.numberify));
}

const CYCLES_OF_INTEREST = [20, 0, 60, 0, 100, 0, 140, 0, 180, 0, 220];

function part1(input) {
    let cycle = 1;
    let x = 1;

    const vals = [];

    let index = 0;
    while(cycle < 221) {
        const [op, arg] = input[index];
        if (cycle % 20 === 0) {
            vals.push(x);
        }

        switch (op) {
            case 'addx':
                if (cycle % 20 === 19) {
                    vals.push(x);
                }

                x += arg;
                cycle += 2;
                break;

            case 'noop':
                cycle += 1;
                break;

            default:
                // nothing
        }

        index++;
        if (index >= index.length) {
            index %= index.length;
        }
    }

    let sum = 0;
    for (x  of CYCLES_OF_INTEREST) {
        const val = vals.shift();
        sum += (x * val)
    }

    return sum;
}

function part2(input) {
    const grid = array2D(6, 40, () => '.');

    let cycle = 1;
    let x = 1;

    let idx = 0;
    let delay = 0;
    let nextx = 1;

    let crtX = 1;
    let crtY = 0;

    while(cycle < 241) {
        if (delay === 0) {
            const [op, arg] = input[idx];

            switch (op) {
                case 'addx':
                    nextx = x + arg;
                    delay = 1;
                    break;

                case 'noop':
                    break;

                default:
                    // nothing
            }

            idx++;
            if (idx === idx.length) {
                idx = 0;
            }
        } else {
            delay--;
            if (delay === 0) {
                x = nextx;
            }
        }
        
        if (Math.abs(crtX - x) <= 1) {
            grid[crtY][crtX] = '#';
        }

        crtX += 1;
        if (crtX > 40) {
            crtX = 1;
            crtY++;
        }

        cycle++;
    }

    paint2D(grid);
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

