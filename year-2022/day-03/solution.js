const d = require('debug')('solution');
const _ = require('lodash');

const util = require('../../utils');
const imp = require('../../imp');
const parsers = require('../../parse');

// First example and expected answers for each part.
// Ignored if empty strings.
const ex1 = `vJrwpWtwJgWrhcsFMMfFFhFp
jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
PmmdzqPrVvPwwTWBwg
wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
ttgJtRGJQctTZtZT
CrZsJsPPZsGzwwsLwLmpwMDw`;
const ex1expectedP1 = 157;
const ex1expectedP2 = 70;

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
    return lines.map(x => x.split(''));
}

function part1(input) {
    let sum = 0;

    for (const r of input) {
        const c1 = r.slice(0, r.length / 2);
        const c2 = r.slice(r.length / 2);

        for (const i of c2) {
            if (c1.includes(i)) {

                const cc = i.charCodeAt(0);
                if (cc >= 97) {
                    sum += (cc - 96);
                } else {
                    sum += (cc - 65 + 27);
                }
                break;
            }
        }
    }
    return sum;
}

function intersection(setA, setB) {
    const inter = new Set();
    for (const elem of setB) {
        if (setA.has(elem)) {
        inter.add(elem);
        }
    }
    return inter;
}

function part2(input) {
    const chunks = _.chunk(input, 3);

    let sum = 0;
    for (const chunk of chunks) {
        const r1 = new Set(chunk[0]);
        const r2 = new Set(chunk[1]);
        const r3 = new Set(chunk[2]);

        const inter = intersection(intersection(r1, r2), r3);

        const cc = [...inter.entries()][0][0].charCodeAt(0);

        if (cc >= 97) {
            sum += (cc - 96);
        } else {
            sum += (cc - 65 + 27);
        }
    }

    return sum;
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

