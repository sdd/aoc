const d = require('debug')('solution');
const _ = require('lodash');

const util = require('../../utils');
const imp = require('../../imp');
const parsers = require('../../parse');

// First example and expected answers for each part.
// Ignored if empty strings.
const ex1 = `00100
11110
10110
10111
10101
01111
00111
11100
10000
11001
00010
01010`;
const ex1expectedP1 = 198;
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
    return line;
}

function part1(input) {
    let gamma = 0;
    let eps = 0;

    let count = input.length;
    let len = input[0].length;

    for(let bit = 0; bit < len; bit++) {
        let count1 = input.filter(x => x.charAt(bit) === '1').length;
        if (count1 > (count / 2)) {
            gamma += (2 ** (len - bit - 1));
        } else {
            eps += (2 ** (len - bit - 1));
        }
    }

    return gamma * eps;
}

function part2(input) {
    let oxlist = [...input];
    let colist = [...input];

    let len = input[0].length;

    for(let bit = 0; bit < len; bit++) {
        let count1 = oxlist.filter(x => x.charAt(bit) === '1').length;
        if (count1 >= (oxlist.length / 2)) {
            oxlist = oxlist.filter(x => x.charAt(bit) === '1');
        } else {
            oxlist = oxlist.filter(x => x.charAt(bit) === '0');
        }
        if (oxlist.length === 1) { break; }
    }

    for(let bit = 0; bit < len; bit++) {
        let count1 = 0;
        _.forEach(colist, line => {
            if (line.charAt(bit) === '1') { count1++; }
        });
        if (count1 >= (colist.length / 2)) {
            colist = colist.filter(x => x.charAt(bit) === '0');
        } else {
            colist = colist.filter(x => x.charAt(bit) === '1');
        }
        if (colist.length === 1) { break; }
    }

    let oxrat = parseInt(oxlist[0], 2);
    let corat = parseInt(colist[0], 2);

    return oxrat * corat;
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

