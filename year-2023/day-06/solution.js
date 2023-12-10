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
const ex1 = `Time:      7  15   30
Distance:  9  40  200`;
const ex1expectedP1 = 288;
const ex1expectedP2 = 71503;

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
    const [times, dists] = lines.map(x => parsers.splitNonAlphanum(x));

    return _.zipWith(times, dists, (duration, record) => ({ duration, record })).slice(1);
}

function part1(input) {
    const counts = [];

    for(const { duration, record } of input) {
        let count = 0;
        for(let speed = 0; speed <= duration; speed++) {
            const dist = speed * (duration - speed);
            if (dist > record) {
                count++;
            }
        }
        counts.push(count);
    }


    return _.reduce(counts, _.multiply, 1);
}

function part2(input) {
    const duration = Number(_.map(input, 'duration').join(''));
    const record = Number(_.map(input, 'record').join(''));
    
    let count = 0;

    for(let speed = 0; speed <= duration; speed++) {
        const dist = speed * (duration - speed);
        if (dist > record) {
            count++;
        }
    }

    return count;
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

