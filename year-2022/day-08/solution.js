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
const ex1 = `30373
25512
65332
33549
35390`;
const ex1expectedP1 = 21;
const ex1expectedP2 = 8;

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

function part1(input) {
    const seen = new Set();

    // from the top
    for(let col = 0; col < input[0].length; col++) {
        let currMax = -1;
        for(let row = 0; row < input.length; row++) {
            if (input[row][col] > currMax) {
                currMax = input[row][col];
                seen.add(`${col},${row}`);
            }
        }
    }

    // from the bottom
    for(let col = 0; col < input[0].length; col++) {
        let currMax = -1;
        for(let row = input.length - 1; row >= 0; row--) {
            if (input[row][col] > currMax) {
                currMax = input[row][col];
                seen.add(`${col},${row}`);
            }
        }
    }

    // from the left
    for(let row = 0; row < input.length; row++) {
        let currMax = -1;
        for(let col = 0; col < input[0].length; col++) {
            if (input[row][col] > currMax) {
                currMax = input[row][col];
                seen.add(`${col},${row}`);
            }
        }
    }

    // from the right
    for(let row = 0; row < input.length; row++) {
        let currMax = -1;
        for(let col = input[0].length - 1; col >= 0; col--) {
            if (input[row][col] > currMax) {
                currMax = input[row][col];
                seen.add(`${col},${row}`);
            }
        }
    }

    return seen.size;
}

function part2(input) {
    let bestScore = 0;

    for(let col = 0; col < input[0].length; col++) {
        for(let row = 0; row < input.length; row++) {
            const currHeight = input[row][col];
            
            // look north
            let i = row;
            let northCount = 0;
            while(i > 0) {
                i--;
                northCount++;
                if (input[i][col] >= currHeight) {
                    break;
                }
            }

            // look south
            i = row;
            let southCount = 0;
            while(i < input.length - 1) {
                i++;
                southCount++;
                if (input[i][col] >= currHeight) {
                    break;
                }
            }

            // look east
            i = col;
            let eastCount = 0;
            while(i > 0) {
                i--;
                eastCount++;
                if (input[row][i] >= currHeight) {
                    break;
                }
            }

            // look west
            i = col;
            let westCount = 0;
            while(i < input[0].length - 1) {
                i++;
                westCount++;
                if (input[row][i] >= currHeight) {
                    break;
                }
            }

            const score = northCount * eastCount * southCount * westCount;

            // d({ row, col, score, northCount, eastCount, southCount, westCount })
            if (score > bestScore) {
                bestScore = score;
            }
        }
    }

    return bestScore;
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

