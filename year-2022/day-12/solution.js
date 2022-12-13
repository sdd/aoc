const d = require('debug')('solution');
const _ = require('lodash');

const util = require('../../utils');
const imp = require('../../imp');
const parsers = require('../../parse');
const sets = require('../../sets');
const { D4_TO_RCD } = require('../../maze');

// add string tags here to help future categorization.
const tags = ['GRID', 'SEARCH', 'PATH'];

// First example and expected answers for each part.
// Ignored if empty strings.
const ex1 = `Sabqponm
abcryxxl
accszExk
acctuvwj
abdefghi`;
const ex1expectedP1 = 31;
const ex1expectedP2 = 29;

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
    let start;
    let end;
    const origGrid = raw.split('\n').map(x => x.split(''));
    util.for2D(origGrid, (y, x) => {
        if (origGrid[y][x] === 'S') {
            start = [y, x];
            grid[y][x] = 0;
        } else if (origGrid[y][x] === 'E') {
            end = [y, x];
            grid[y][x] = 25;
        } else if (origGrid[y][x] !== undefined) {
            grid[y][x] = origGrid[y][x].charCodeAt(0) - 97;
        } else {
            d({y, x});
        }
    });

    return { grid, start, end };
}

function part1({ grid, start, end }) {
    return shortestPath(grid, start, end, 0, new Map());
}

function shortestPath(grid, start, end, currDist, visited) {
    if (start[0] === end[0] && start[1] === end[1]) {
        return currDist;
    }
    visited.set(`${start[0]},${start[1]}`, currDist);
    let bestDist = 100000000000000;
    const currSqHt = grid[start[0]][start[1]];
    for (const dir of D4_TO_RCD) {
        if (start[0] + dir[0] < 0 || start[0] + dir[0] >= grid.length || start[1] + dir[1] < 0 || start[1] + dir[1] >= grid[0].length) {
            continue;
        }
        if (visited.has(`${start[0] + dir[0]},${start[1] + dir[1]}`) && visited.get(`${start[0] + dir[0]},${start[1] + dir[1]}`) <= currDist + 1) {
            continue;
        }
        const nextSqPos = [start[0] + dir[0], start[1] + dir[1]];
        const nextSqHt = grid[nextSqPos[0]][nextSqPos[1]];
        if (nextSqHt - currSqHt <= 1) {
            const nextDst = shortestPath(grid, nextSqPos, end, currDist + 1, visited);
            if (nextDst < bestDist) {
                bestDist = nextDst;
            }
        }
    }
    return bestDist;
}

function part2({ grid, start, end }) {
    let bestDist = 100000000000;
    util.for2D(grid, (y, x) => {
        if (grid[y][x] === 0) {
            const dist = shortestPath(grid, [y, x], end, 0, new Map());
            if (dist < bestDist) {
                bestDist = dist;
            }
        }
    });

    return bestDist;
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

