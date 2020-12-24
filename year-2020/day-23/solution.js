const d = require('debug')('solution');
const _ = require('lodash');

const util = require('../../utils');
const imp = require('../../imp');
const parsers = require('../../parse');

// First example and expected answers for each part.
// Ignored if empty strings.
const ex1 = `389125467
`;
const ex1expectedP1 = `67384529`;
const ex1expectedP2 = `149245887792`;

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
    return line[0].split('').map(Number);
}

function part1(input) {
    let cups = [...input];

    let round = 1;
    while (round <= 100) {
        let [current, a, b, c, ...rest] = cups;

        let subtrahend = 1;
        if (current - subtrahend < 1) {
            subtrahend -= 9;
        }
        let insertPoint = -1;
        while (insertPoint === -1) {
            insertPoint = _.findIndex(rest, x => x === current - subtrahend);
            subtrahend++;
            if (current - subtrahend < 1) {
                subtrahend -= 9;
            }
        }

        rest.splice((insertPoint + 1), 0, a, b, c);
        cups = [ ...rest, current ];
        //d('round: %d, cups: %s', round, cups.join(''));

        round++;
    }

    let oneIndex = _.findIndex(cups, x => x === 1);

    let result = [ ...cups.slice(oneIndex + 1), ...cups.slice(0, oneIndex) ];

    return result.join('');
}

let PART2_MAX = 1000000;
let PART2_ROUNDS = 10000000;

//let PART2_MAX = 9;
//let PART2_ROUNDS = 10;
function part2(input) {

    let cupsList = {};
    for(let i = 0; i < input.length - 1; i++) {
        cupsList[input[i]] = input[i+1];
    }
    cupsList[input[input.length - 1]] = input.length + 1;
    ///*
    cupsList[PART2_MAX] = input[0];
    for(let i = 10; i < PART2_MAX; i ++) {
        cupsList[i] = i + 1;
    }
    //*/

    let round = 1;
    let current = input[0];
    while (round <= PART2_ROUNDS) {
        let a = cupsList[current];
        let b = cupsList[a];
        let c = cupsList[b];

        cupsList[current] = cupsList[c];

        let insertPoint = current - 1;
        if (insertPoint < 1) { insertPoint = PART2_MAX; }
        while(insertPoint === a || insertPoint === b || insertPoint === c || insertPoint === 0) {
            insertPoint--;
            if (insertPoint < 1) { insertPoint += PART2_MAX; }
        }

        let afterInsert = cupsList[insertPoint];
        cupsList[insertPoint] = a;
        cupsList[c] = afterInsert;

        //(round % 1000 == 0) && d('%d% done', round * 100 / PART2_ROUNDS);

        round++;
        current = cupsList[current];
    }

    let oneNext = cupsList[1];
    return oneNext * cupsList[oneNext];
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

