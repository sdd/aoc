const d = require('debug')('solution');
const _ = require('lodash');

const util = require('../../utils');
const imp = require('../../imp');
const parsers = require('../../parse');

// First example and expected answers for each part.
// Ignored if empty strings.
const ex1 = ``;
const ex1expectedP1 = ``;
const ex1expectedP2 = ``;

// Seconf example and expected answers for each part.
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
 function parse({ raw, lines, alphanums, nums, comma, space, chars, multi, grid }) {
    return lines.map(l => l.split('x'));
}

function part1(input) {
    const res = input.map(([a, b, c]) => {
        const s1 = a*b;
        const s2 = a*c;
        let smallest = Math.min(s1, s2);
        const s3 = b*c;
        smallest = Math.min(smallest, s3);

        return (s1 + s1 + s2 + s2 + s3 + s3 + smallest);
        

    });
    return _.sum(res);
}

function part2(input) {
    const res = input.map((vals) => {
        vals.sort((a, b) => a - b);
        const [x, y, z] = vals;        
        const wrap = (x * 2) + (y * 2);
        const bow = x * y * z;
        return wrap + bow;
    })

    return _.sum(res);
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

