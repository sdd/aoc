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
    return raw.split('');
}

const D_TO_X = { '^': 0, 'v': 0, '>': 1, '<': -1 };
const D_TO_Y = { '^': 1, 'v': -1, '>': 0, '<': 0 };

function part1(input) {
    let pos = [0, 0];
    let visited = new Set();

    _.forEach(input, i => {
        pos[0] += D_TO_X[i];
        pos[1] += D_TO_Y[i];
        visited.add(pos.join('_'));
        i++;
    });

    
    return visited.size;
}

function part2(input) {
    let pos = [[0, 0], [0, 0]];

    
    let visited = new Set();

    _.forEach(input, (i, idx) => {
        pos[idx % 2][0] += D_TO_X[i];
        pos[idx % 2][1] += D_TO_Y[i];
        visited.add(pos[idx % 2].join('_'));
        i++;
    });

    
    return visited.size;
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

