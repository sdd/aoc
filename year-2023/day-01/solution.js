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
const ex1 = `1abc2
pqr3stu8vwx
a1b2c3d4e5f
treb7uchet`;
const ex1expectedP1 = 142;
const ex1expectedP2 = ``;

// Second example and expected answers for each part.
// Ignored if empty strings.
const ex2 = `two1nine
eightwothree
abcone2threexyz
xtwone3four
4nineeightseven2
zoneight234
7pqrstsixteen`;
const ex2expectedP1 = ``;
const ex2expectedP2 = 281;

const TWO_NUM_REGEXP = /^.*?(\d).*(\d)/;
const ONE_NUM_REGEXP = /^.*?(\d)/;

const TWO_NUM_REGEXP_P2 = /^.*?(\d|one|two|three|four|five|six|seven|eight|nine).*(\d|one|two|three|four|five|six|seven|eight|nine)/;
const ONE_NUM_REGEXP_P2 = /^.*?(\d|one|two|three|four|five|six|seven|eight|nine)/;

const DIGITS = [
    "zero",
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine"
];

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
    return lines;
}

function part1(input) {
    let sum = 0;
    for(const line of input) {
        const matches = line.match(TWO_NUM_REGEXP);
        let val = 0;
        if(matches) {
            val = (Number(matches[1]) * 10) + Number(matches[2]);
        } else {
            const matches1 = line.match(ONE_NUM_REGEXP);
            if(matches1) {
                val = (Number(matches1[1]) * 10) + Number(matches1[1]);
            }
        }
        sum += val;
    }
I cou
    return sum;
}

function part2(input) {
    let sum = 0;
    for(const line of input) {
        let val = 0;

        const matches = line.match(TWO_NUM_REGEXP_P2);
        if(matches) {
            const d1 = DIGITS.indexOf(matches[1]) !== -1 ? DIGITS.indexOf(matches[1]) : Number(matches[1]);
            const d2 = DIGITS.indexOf(matches[2]) !== -1 ? DIGITS.indexOf(matches[2]) : Number(matches[2]);

            val = (d1 * 10) + d2;
        } else {
            const matches1 = line.match(ONE_NUM_REGEXP_P2);
            if(matches1) {
                const d1 = DIGITS.indexOf(matches1[1]) !== -1 ? DIGITS.indexOf(matches1[1]) : Number(matches1[1]);

                val = (d1 * 10) + d1;
            }
        }
        sum += val;
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
    tags,
};

