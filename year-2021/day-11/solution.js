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
 * @param {raw} raw unmodified input string from input-01.txt
 * @param {line} raw split on newlines, empty items removed, items trimmed
 * @param {comma} raw split on commas, empty items removed, items trimmed
 * @param {space} raw split on spaces, empty lines removed, items trimmed
 * @param {multi} raw, split on double newlines, empty items removed, split again on newlines, items trimmed
 */
function parse({ raw, line, comma, space, multi }) {
    return line.map(l => l.split('').map(Number));
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
        for(let y = 0; y < input.length; y++) {
            for(let x = 0; x< input.length; x++) {

                if (!flashSet.has(`${x}_${y}`)) {
                    input[y][x] += 1;
                    const cell = input[y][x];

                    if (cell > 9) {
                        flashCount += flash(input, x, y, flashSet);
                    }
                }
            }
        }
    }

    return flashCount;
}

function flash(map, x, y, flashSet) {
    let flashCount = 1;
    map[y][x] = 0;
    flashSet.add(`${x}_${y}`);

    for (const a of ADJ_MAP) {
        if (y + a[1] >= 0 && x + a[0] >= 0 && y + a[1] < map.length && x + a[0] < map[0].length) {
            if (!flashSet.has(`${x+a[0]}_${y+a[1]}`)) {
                map[y + a[1]][x + a[0]]++;
                if (map[y + a[1]][x + a[0]] > 9) {
                    flashCount += flash(map, x + a[0], y + a[1], flashSet);
                }
            }
        }
    }

    return flashCount;
}

function part2(input) {
    let flashSet = new Set();
    let numFlashedThisStep = 0;
    
    let step = 1;
    while (step < 1000) {
        flashSet = new Set();
        numFlashedThisStep = 0;
        for(let y = 0; y < input.length; y++) {
            for(let x = 0; x < input.length; x++) {

                if (!flashSet.has(`${x}_${y}`)) {
                    input[y][x] += 1;

                    if (input[y][x] > 9) {
                        numFlashedThisStep += flash(input, x, y, flashSet);
                        if (numFlashedThisStep === input.length * input[0].length) {
                            return step;
                        }
                    }
                }
            }
        }
        step++;
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

