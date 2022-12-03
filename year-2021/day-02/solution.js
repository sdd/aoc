const d = require('debug')('solution');
const _ = require('lodash');

const util = require('../../utils');
const imp = require('../../imp');
const parsers = require('../../parse');

// First example and expected answers for each part.
// Ignored if empty strings.
const ex1 = `forward 5
down 5
forward 8
up 3
down 8
forward 2`;
const ex1expectedP1 = 150;
const ex1expectedP2 = 900;

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
    return lines;
}

function part1(input) {
    let x = 0;
    let d = 0;

    _.forEach(input, line => {
        const [inst, dist] = line.split(' ');

        switch(inst) {
            case 'forward':
                x += Number(dist);
                break;
            case 'down':
                d += Number(dist);
                break;
            case 'up':
                d -= Number(dist);
                break;
            default:
                // nothing
        }
    });

    return x * d;
}

function part2(input) {
    let x = 0;
    let d = 0;
    let a = 0;

    _.forEach(input, line => {
        const [inst, dist] = line.split(' ');

        switch(inst) {
            case 'forward':
                x += Number(dist);
                d += Number(dist) * a;
                break;
            case 'down':
                a += Number(dist);
                break;
            case 'up':
                a -= Number(dist);
                break;
            default:
                // nothing
        }
    });

    return x * d;
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

