/* eslint-disable arrow-body-style */
const d = require('debug')('solution');
const _ = require('lodash');

const util = require('../../utils');
const imp = require('../../imp');
const parsers = require('../../parse');
const sets = require('../../sets');
const utils = require('../../utils');

// add string tags here to help future categorization.
const tags = [];

// First example and expected answers for each part.
// Ignored if empty strings.
const ex1 = `5 9 2 8
9 4 7 3
3 8 6 5`;
const ex1expectedP1 = ``;
const ex1expectedP2 = 9;

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
    return lines.map(l => utils.ints(l));
}

function part1(input) {
    return _.sum(input.map(line => _.max(line) - _.min(line)))
}

function part2(input) {
    return _.sum(input.map(line => {
        for(let i = 0; i < line.length; i++) {
            for(let j = i + 1; j < line.length; j++) {
                if (line[j] !== 0 && line[i] / line[j] === Math.floor(line[i] / line[j])) {
                    return line[i] / line[j];
                }
                if (line[i] !== 0 && line[j] / line[i] === Math.floor(line[j] / line[i])) {
                    return line[j] / line[i];
                }
            }
        }

        return 0;
    }));
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

