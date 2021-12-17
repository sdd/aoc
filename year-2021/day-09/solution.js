/* eslint-disable complexity */
const d = require('debug')('solution');
const _ = require('lodash');

const util = require('../../utils');
const imp = require('../../imp');
const parsers = require('../../parse');

// First example and expected answers for each part.
// Ignored if empty strings.
const ex1 = `2199943210
3987894921
9856789892
8767896789
9899965678`;
const ex1expectedP1 = 15;
const ex1expectedP2 = 1134;

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
    let riskSum = 0;
    for(let y = 0; y < input.length; y++) {
        for(let x = 0; x < input[0].length; x++) {
            const curr = input[y][x];
            if (
                (y === 0 || input[y-1][x] > curr)
                && (x === 0 || input[y][x-1] > curr)
                && (y === input.length - 1 || input[y+1][x] > curr)
                && (x === input[0].length - 1 || input[y][x+1] > curr)
                    
            ) {
                riskSum += (curr + 1);
            }
        }
    }
    return riskSum;
}

function part2(input) {
    const lowPoints = new Set();
    const yl = input.length;
    const xl = input[0].length;

    for(let y = 0; y < yl; y++) {
        for(let x = 0; x < xl; x++) {
            const curr = input[y][x];
            if (
                (y === 0 || input[y-1][x] > curr)
                && (x === 0 || input[y][x-1] > curr)
                && (y === yl - 1 || input[y+1][x] > curr)
                && (x === xl - 1 || input[y][x+1] > curr)
                    
            ) {
                lowPoints.add(`${x}_${y}`);
            }
        }
    }

    const basinVals = [];
    for (const lowPoint of lowPoints) {
        const unprocessed = [lowPoint];
        const processed = new Set();
        let basinTot = 0;
        
        const addIfUnseen = (x, y) => (processed.has(`${x}_${y}`) || unprocessed.push(`${x}_${y}`));

        while(unprocessed.length) {
            const pos = unprocessed.shift();

            if (!processed.has(pos)) {
                processed.add(pos);
                const [x, y] = pos.split('_').map(Number);

                if (input[y][x] < 9) {
                    basinTot++;
                    if (y > 0) { addIfUnseen(x, y-1); }
                    if (y < yl - 1) { addIfUnseen(x, y + 1); }
                    if (x > 0) { addIfUnseen(x - 1, y); }
                    if (x < xl - 1) { addIfUnseen(x + 1, y); }
                }
            }
        }
        basinVals.push(basinTot);
    }
    
    basinVals.sort((a, b) => b-a)
    return basinVals[0] * basinVals[1] * basinVals[2];
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

