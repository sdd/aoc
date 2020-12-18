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
function parse({ raw, line, comma, space, multi }) {
    return [0,13,16,17,1,10,6];
}

function part1(input) {
    let count = input.length;
    while (count <= 2020) {
        let last = input[input.length - 1];
        let lastSpoken = _.findLastIndex(input.slice(0, input.length - 1), x => x === last);
        if (lastSpoken == -1) {
            input.push(0);

        } else {
            input.push((input.length) - (lastSpoken + 1));
        }

        count++;
    }
    return input[input.length -  1];
}

function part2(input) {
    input = [0,13,16,17,1,10,6];
    let started = Date.now();

    let count = 8;
    let lastSeen = {
        0: 1,
        13: 2,
        16: 3,
        17: 4,
        1: 5,
        10: 6,
    };

    let prevElem = 6;
    let val;

    while (count <= 30000000) {
        if (lastSeen[prevElem] === undefined) {
            lastSeen[prevElem] = count - 1;
            prevElem = 0;
        } else {
            val = count - lastSeen[prevElem] - 1;
            lastSeen[prevElem] = count - 1;
            prevElem = val;
        }
        count++;
    }

    let duration = (Date.now() - started) / 1000;
    d('duration: %ds', duration);
    return val;
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

