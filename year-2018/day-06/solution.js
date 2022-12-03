const d = require('debug')('solution');
const _ = require('lodash');

const util = require('../../utils');
const imp = require('../../imp');
const parsers = require('../../parse');
const sets = require('../../sets');
const { posInts, Counter, paint2D } = require('../../utils');

// First example and expected answers for each part.
// Ignored if empty strings.
const ex1 = `1, 1
1, 6
8, 3
3, 4
5, 5
8, 9`;
const ex1expectedP1 = 17;
const ex1expectedP2 = 16;

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
    return lines.map(posInts);
}

function part1(input) {
    const xMin = _.min(input.map(x => x[0]));
    const xMax = _.max(input.map(x => x[0]));
    const yMin = _.min(input.map(x => x[1]));
    const yMax = _.max(input.map(x => x[1]));

    const gW = xMax - xMin + 2;
    const gH = yMax - yMin + 2;

    const grid = util.array2D(gH, gW, () => -1);
    const areaCounts = new Counter();

    util.for2D(grid, (i, j) => {
        let bestDist = 5000;
        let bestId;
        let bestIsTied = false;
        for(let id = 0; id < input.length; id++) {
            const dist = Math.abs(input[id][0] - xMin - j) + Math.abs(input[id][1] - yMin - i);
            if (dist < bestDist) {
                bestDist = dist;
                bestId = id;
                bestIsTied = false;
            } else if (dist === bestDist) {
                bestIsTied = true;
            }
        }
        if (!bestIsTied) {
            grid[i][j] = bestId;
            areaCounts.inc(bestId);
        }
        bestIsTied = false;
    });

    for(let x = 0; x < gW; x++) {
        areaCounts.delete(grid[0][x]);
        areaCounts.delete(grid[gH - 1][x]);
    }

    for(let y = 0; y < gH; y++) {
        areaCounts.delete(grid[y][0]);
        areaCounts.delete(grid[y][gW - 1]);
    }

    return areaCounts.maxVal();
}

function part2(input) {
    const xMin = _.min(input.map(x => x[0]));
    const xMax = _.max(input.map(x => x[0]));
    const yMin = _.min(input.map(x => x[1]));
    const yMax = _.max(input.map(x => x[1]));

    // adjust target (32 for example 1, 10000 for main q)
    const target = input.length === 6 ? 32 : 10000

    const buffer = 10;
    let regionSize = 0;

    for(let x = xMin - buffer; x < xMax + buffer; x++) {
        for(let y = yMin - buffer; y < yMax + buffer; y++) {
            let totDist = 0;
            for(let i = 0; i < input.length; i++) {
                const dist = Math.abs(x - input[i][0]) + Math.abs(y - input[i][1]);
                totDist += dist;
            }
            if (totDist < target) {
                regionSize++;
            }
        }
    }

    return regionSize;
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

