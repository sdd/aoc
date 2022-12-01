const d = require('debug')('solution');
const _ = require('lodash');

const util = require('../../utils');
const imp = require('../../imp');
const parsers = require('../../parse');

// First example and expected answers for each part.
// Ignored if empty strings.
const ex1 = `turn on 0,0 through 999,999
toggle 0,0 through 999,0
turn off 499,499 through 500,500
`;
const ex1expectedP1 = 998996;
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
    const rx = /(turn on|turn off|toggle) (\d+),(\d+) through (\d+),(\d+)/;
    return lines.map(line => line.match(rx).slice(1))
}

function part1(input) {
    const grid = util.array2D(1000, 1000);

    for (const [action, xl, yl, xh, yh] of input) {
        switch(action) {
            case 'turn on':
                for(let y = parseInt(yl, 10); y <= parseInt(yh, 10); y++) {
                    for(let x = parseInt(xl, 10); x <= parseInt(xh, 10); x++) {
                        grid[y][x] = 1;
                    }
                }
                break;

            case 'turn off':
                for(let y = parseInt(yl, 10); y <= parseInt(yh, 10); y++) {
                    for(let x = parseInt(xl, 10); x <= parseInt(xh, 10); x++) {
                        grid[y][x] = 0;
                    }
                }
                break;

                case 'toggle':
                    for(let y = parseInt(yl, 10); y <= parseInt(yh, 10); y++) {
                        for(let x = parseInt(xl, 10); x <= parseInt(xh, 10); x++) {
                            grid[y][x] = 1 - grid[y][x];
                        }
                    }
                    break;

            default:
                throw new Error('bad parse on item')
        }

    }

    return util.arrayCount(grid, x => x === 1);
}

function part2(input) {
    const grid = util.array2D(1000, 1000);

    for (const [action, xl, yl, xh, yh] of input) {
        switch(action) {
            case 'turn on':
                for(let y = parseInt(yl, 10); y <= parseInt(yh, 10); y++) {
                    for(let x = parseInt(xl, 10); x <= parseInt(xh, 10); x++) {
                        grid[y][x] += 1;
                    }
                }
                break;

            case 'turn off':
                for(let y = parseInt(yl, 10); y <= parseInt(yh, 10); y++) {
                    for(let x = parseInt(xl, 10); x <= parseInt(xh, 10); x++) {
                        grid[y][x] = Math.max(0, grid[y][x] - 1);
                    }
                }
                break;

                case 'toggle':
                    for(let y = parseInt(yl, 10); y <= parseInt(yh, 10); y++) {
                        for(let x = parseInt(xl, 10); x <= parseInt(xh, 10); x++) {
                            grid[y][x] += 2;
                        }
                    }
                    break;

            default:
                throw new Error('bad parse on item')
        }

    }

    return _.sum(_.flattenDeep(grid))
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

