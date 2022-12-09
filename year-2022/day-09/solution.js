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
const ex2expectedP1 = ``;
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

const MAP_DIR_TO_X = {
    'U': 0,
    'D': 0, 
    'L': -1,
    'R': 1
};

const MAP_DIR_TO_Y = {
    'U': -1,
    'D': 1, 
    'L': 0,
    'R': 0
};

function part1(input) {
    const tPos =new Set();
    let hx = 0;
    let hy = 0;
    let tx = 0;
    let ty = 0;

    for(const [dir, dist] of input) {
        for(let i = 0; i < dist; i++) {
            
            hy += MAP_DIR_TO_Y[dir];
            hx += MAP_DIR_TO_X[dir];

            if (Math.abs(hx - tx) > 1 || Math.abs(hy - ty) > 1) {
                if (hx > tx) {
                    tx++;
                } else if (hx < tx) {
                    tx--;
                }

                if (hy > ty) {
                    ty++;
                } else if (hy < ty) {
                    ty--;
                }
            }

            tPos.add(`${tx},${ty}`);
        }
    }

    return tPos.size;
}

function part2(input) {
    const rope = util.array2D(10, 2);
    
    const tPos = new Set();    
    tPos.add(`0,0`);

    for(const [dir, dist] of input) {
        for(let i = 0; i < dist; i++) {
            
            rope[0][1] += MAP_DIR_TO_Y[dir];
            rope[0][0] += MAP_DIR_TO_X[dir];

            for (let j = 1; j < 10; j++) {
                if (Math.abs(rope[j-1][0] - rope[j][0]) > 1
                    || Math.abs(rope[j-1][1] - rope[j][1]) > 1) {
                    if (rope[j-1][0] > rope[j][0]) {
                        rope[j][0]++;
                    } else if (rope[j-1][0] < rope[j][0]) {
                        rope[j][0]--;
                    }

                    if (rope[j-1][1] > rope[j][1]) {
                        rope[j][1]++;
                    } else if (rope[j-1][1] < rope[j][1]) {
                        rope[j][1]--;
                    }
                }
            }

            tPos.add(`${rope[9][0]},${rope[9][1]}`);
        }
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

