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
const ex1 = ``;
const ex1expectedP1 = ``;
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
    const moves = multi[1].map(line => util.posInts(line));

    const rawInit = raw.split('\n\n')[0].split('\n');

    const initial = rawInit.slice(0, -1).map(line => _.chunk(line.split(''), 4).map(l => l[1]));
    
    const buckets = util.array2D(9, 0);
    while(initial.length) {
        const row = initial.pop();
        for (let x = 0; x < row.length; x++) {
            if (row[x] !== ' ' && row[x] !== undefined) {
                buckets[x].push(row[x]);
            }
        }
    }

    return [{ moves, buckets }];
}

function part1([{ buckets, moves }]) {
    buckets = _.clone(buckets);
    moves = _.clone(moves);

    for( const [qty, from, to] of moves) {
        const chunk = buckets[from - 1].splice(buckets[from - 1].length - qty, qty);
        chunk.reverse();
        buckets[to - 1] = buckets[to - 1].concat(chunk);
    }

    const res = [];
    for(const bucket of buckets) {
        res.push(bucket.pop());
    }

    return res.join('');
}

function part2([{ buckets, moves }]) {
    buckets = _.clone(buckets);
    moves = _.clone(moves);

    for( const [qty, from, to] of moves) {
        const chunk = buckets[from - 1].splice(buckets[from - 1].length - qty, qty);
        buckets[to - 1] = buckets[to - 1].concat(chunk);
    }

    const res = [];
    for(const bucket of buckets) {
        res.push(bucket.pop());
    }

    return res.join('');
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

