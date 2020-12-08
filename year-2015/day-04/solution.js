const d = require('debug')('solution');
const _ = require('lodash');
const md5 = require('md5');

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
    return line;
}

function part1(input) {
    input = input[0];

    let i = -1;
    let hash = '';
    while(String(hash).slice(0, 5) !== '00000') {
        i++;
        hash = md5(`${input}${String(i)}`);
        // d('hash: %o', hash);
        // if (i === 200) break;
    }
    
    return i;
}

function part2(input) {
    input = input[0];

    let i = -1;
    let hash = '';
    while(String(hash).slice(0, 6) !== '000000') {
        i++;
        hash = md5(`${input}${String(i)}`);
        // d('hash: %o', hash);
        // if (i === 200) break;
    }
    
    return i;
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

