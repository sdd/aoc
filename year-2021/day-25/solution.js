const d = require('debug')('solution');
const _ = require('lodash');

const util = require('../../utils');
const imp = require('../../imp');
const parsers = require('../../parse');

// First example and expected answers for each part.
// Ignored if empty strings.
const ex1 = `v...>>.vv>
.vv>>.vv..
>>.>v>...v
>>v>>.>.v.
v>v.vv.v..
>.>>..v...
.vv..>.>v.
v.v..>>v.v
....v..v.>`;
const ex1expectedP1 = 58;
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
    return grid;
}

function part1(input) {
    let steps = 0;
    let moved = true;

    let map = _.cloneDeep(input);
    let newMap;

    do {
        moved = false;
        steps++;

        for (const char of ['>', 'v']) {
            newMap = _.cloneDeep(map);
            for(let y = 0; y < input.length; y++) {
                for (let x = 0; x < input[0].length; x++) {
                    if (map[y][x] === char) {
                        if (char === '>') {
                            if (map[y][(x + 1) % input[0].length] === '.') {
                                moved = true;
                                newMap[y][x] = '.';
                                newMap[y][(x + 1) % input[0].length] = '>';
                            }
                        } else if (char === 'v') {
                            if (map[(y + 1) % input.length][x] === '.') {
                                moved = true;
                                newMap[y][x] = '.';
                                newMap[(y + 1) % input.length][x] = 'v';
                            }
                        }
                    }
                }
            }
            map = newMap;
        }
        


    } while(moved === true);


    return steps;
}

function part2(input) {
    return false;
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

