/* eslint-disable no-continue */
const d = require('debug')('solution');
const _ = require('lodash');

const util = require('../../utils');
const imp = require('../../imp');
const parsers = require('../../parse');

// First example and expected answers for each part.
// Ignored if empty strings.
const ex1 = `1163751742
1381373672
2136511328
3694931569
7463417111
1319128137
1359912421
3125421639
1293138521
2311944581`;
const ex1expectedP1 = 40;
const ex1expectedP2 = 315;

// Second example and expected answers for each part.
// Ignored if empty strings.
const ex2 = ``;
const ex2expectedP1 = ``;
const ex2expectedP2 = ``;

const { array2D } = require('../../utils');
const { createNode, search } = require('../../astar');

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

function part1(input) {
    const width = input[0].length;
    const height = input.length;

    const grid = array2D(width, height, (y, x) => createNode(x, y, input[y][x]));

    const start = grid[0][0];
    const end = grid[height - 1][width - 1];
    const result = search(grid, start, end);

    return _.sum(_.map(result, 'weight'));
}

function part2(input) {
    const width = input[0].length;
    const height = input.length;

    const fwidth = width * 5
    const fheight = height * 5;

    const grid = array2D(fwidth, fheight, (y, x) => {
        const cellx = Math.floor(x / width);
        const celly = Math.floor(y / height);
        const added = cellx + celly;

        const weight = ((input[y % height][x % width] + added - 1) % 9) + 1;

        return createNode(x, y, weight);
    });

    const start = grid[0][0];
    const end = grid[fheight - 1][fwidth - 1];
    const result = search(grid, start, end);

    return _.sum(_.map(result, 'weight'));
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

