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
    return comma.map(Number);
}

function part1(input) {
    input = [...input];
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
    let lastSeen = input.reduce((acc, val, index) => ({ ...acc, [val]: index+1 }));
    /*let lastSeen = {
        0: 1,
        13: 2,
        16: 3,
        17: 4,
        1: 5,
        10: 6,
    };*/

    let prevElem = _.last(input);
    let count = input.length + 1;
    let val;

    while (count <= 30000000) {
        //val = lastSeen[prevElem] === undefined ? 0 : (count - lastSeen[prevElem] - 1)
        lastSeen[prevElem] = count - 1;
        prevElem = lastSeen[prevElem] === undefined ? 0 : (count - lastSeen[prevElem] - 1);
        count++;
    }

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

