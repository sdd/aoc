const d = require('debug')('solution');
const _ = require('lodash');

const util = require('../../utils');
const { DIR_TO_D4, D4_TO_RCD } = require('../../maze');
const imp = require('../../imp');
const parsers = require('../../parse');
const sets = require('../../sets');

// add string tags here to help future categorization.
const tags = [];

// First example and expected answers for each part.
// Ignored if empty strings.
const ex1 = `R 4
U 4
L 3
D 1
R 4
D 1
L 5
R 2`;
const ex1expectedP1 = 13;
const ex1expectedP2 = 1;

// Second example and expected answers for each part.
// Ignored if empty strings.
const ex2 = `R 5
U 8
L 8
D 3
R 17
D 10
L 25
U 20`;
const ex2expectedP1 = 88;
const ex2expectedP2 = 36;

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
    return lines.map(x => x.split(' '));
}

function part1(input) {
    return part2(input, 2);
}

const AXES = [0, 1];

function part2(input, size = 10) {
    const rope = util.array2D(size, 2);
    
    const tPos = new Set();    
    tPos.add(`0,0`);

    for(const [dir, dist] of input) {
        _.times(dist, () => {
            AXES.forEach(ax => {
                rope[0][ax] += D4_TO_RCD[DIR_TO_D4[dir]][ax];
            });

            _.times(size - 1, j => {
                if (AXES.map(ax => Math.abs(rope[j][ax] - rope[j+1][ax])).some(x => x > 1)) {
                    AXES.forEach(ax => {
                        rope[j+1][ax] += Math.sign(rope[j][ax] - rope[j+1][ax]);
                    })
                }
            });

            tPos.add(`${rope[size - 1][0]},${rope[size - 1][1]}`);
        });
    }

    return tPos.size;
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
