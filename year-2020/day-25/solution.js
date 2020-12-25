const d = require('debug')('solution');
const _ = require('lodash');

const util = require('../../utils');
const imp = require('../../imp');
const parsers = require('../../parse');

// First example and expected answers for each part.
// Ignored if empty strings.
const ex1 = `5764801
17807724
`;
const ex1expectedP1 = [8, 11];
const ex1expectedP2 = ``;

// Second example and expected answers for each part.
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
    return line.map(Number);
}

function part1(input) {
    const [ cardKey, doorKey ] = input;

    let cardLoopSize = 0;
    let doorLoopSize = 0;
    let loopSizeValid = false;
    let testLoopSize = 1;
    let val = 1;
    let subject = 7;
    while(!cardLoopSize || !doorLoopSize) {
        val = val * subject;
        val = val % 20201227;

        if (val === cardKey) {
            loopSizeValid = true;
            cardLoopSize = testLoopSize;
        }

        if (val === doorKey) {
            loopSizeValid = true;
            doorLoopSize = testLoopSize;
        }

        testLoopSize++;
    }

    d('cardLoopSize: %d, doorLoopSize: %d', cardLoopSize, doorLoopSize);

    subject = cardKey;
    let cardVal = 1;
    for(let i = 0; i < doorLoopSize; i++) {
        cardVal = cardVal * subject;
        cardVal = cardVal % 20201227;
    }

    subject = doorKey;
    let doorVal = 1;
    for(let i = 0; i < cardLoopSize; i++) {
        doorVal = doorVal * subject;
        doorVal = doorVal % 20201227;
    }

    return cardVal === doorVal && cardVal;
}

function part2(input) {
    return false;
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

