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
 * @param {raw} raw unmodified input string from input-01.txt
 * @param {line} line split on newlines, empty items removed, items trimmed
 * @param {comma} comma split on commas, empty items removed, items trimmed
 * @param {space} space split on spaces, empty lines removed, items trimmed
 * @param {multi} multi, split on double newlines, empty items removed, split again on newlines, items trimmed
 */
function parse({ raw, line, comma, space, multi }) {
    return line;
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

