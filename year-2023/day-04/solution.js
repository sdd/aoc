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
const ex1 = `Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`;
const ex1expectedP1 = 13;
const ex1expectedP2 = 30;

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
    return lines.map(l => {
        const [start, end] = l.split('|');
        const [,id, ...winning] = parsers.splitNonAlphanum(start);
        const own = parsers.splitNonAlphanum(end);

        return { id, winning, own}
    });
}

function part1(input) {
    let sum = 0;
    for (const game of input) {
        let tot = -1;
        for(const num of game.own) {
            if (game.winning.indexOf(num) > -1) {
                tot++;
            }
        }
        if (tot > -1) {
            tot = 2 ** tot;
            sum += tot;
        }
    }
    return sum;
}

function part2(input) {
    const scores = [];
    const counts = [];
    for (const game of input) {
        let tot = 0;
        for(const num of game.own) {
            if (game.winning.indexOf(num) > -1) {
                tot++;
            }
        }
        scores.push(tot);
        counts.push(1);
    }
    
    for(let i = 0; i < scores.length; i++) {
        const score = scores[i];
        for(let j = 1; j <= score; j++) {
            counts[i + j] += counts[i];
        }
    }

    return _.sum(counts);
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

