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
const ex1 = `[1,1,3,1,1]
[1,1,5,1,1]

[[1],[2,3,4]]
[[1],4]

[9]
[[8,7,6]]

[[4,4],4,4]
[[4,4],4,4,4]

[7,7,7,7]
[7,7,7]

[]
[3]

[[[]]]
[[]]

[1,[2,[3,[4,[5,6,7]]]],8,9]
[1,[2,[3,[4,[5,6,0]]]],8,9]`;
const ex1expectedP1 = 13;
const ex1expectedP2 = 140;

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
    return multi.map(x => x.map(y => eval(y)));
}

function part1(input) {
    let sum = 0;
    for(let x = 0; x < input.length; x++) {
        const [left, right] = input[x];
        const res = compFn(left, right);
        if (res) {
            sum += (x + 1);
        }
    };

    return sum;
}

function compFn(left, right) {
    if (typeof left !== 'object') {
        left = [left];
    }

    if (typeof right !== 'object') {
        right = [right];
    } 
    
    for(let x = 0; x < Math.max(left.length, right.length); x++) {
        if (left[x] === undefined) {
            return true;
        }

        if (right[x] === undefined) {
            return false;
        }

        if (left[x] !== right[x]) {
            if (typeof left[x] === 'object' || typeof right[x] === 'object') {
                const res = compFn(left[x], right[x]);
                if (typeof res === 'boolean') {
                    return res;
                }
            } else {
                return left[x] < right[x];
            }
        }
    }
}

function part2(input) {
    const packets = [];
    for(const[left, right ] of input) {
        packets.push(left);
        packets.push(right);
    }

    packets.push([[2]]);
    packets.push([[6]]);

    packets.sort((a, b) => compFn(a, b) ? -1 : 1);

    const divIdxs = [];
    for(let x = 0; x < packets.length; x++) {
        if (JSON.stringify(packets[x]) === '[[2]]' || JSON.stringify(packets[x]) === '[[6]]') {
            divIdxs.push(x + 1);
        }
    }

    return divIdxs.pop() * divIdxs.pop();
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

