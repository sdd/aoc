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
    return line.map(Number);
}

function part1(input) {
    for(let i = 25; i < input.length; i++) {
        const sums = new Set();
        for(let j = i-25; j < i; j++) {
            for(let k = i-25; k < i; k++) {
                if (j!==k) sums.add(input[k]+input[j]);
            }
        }
        
        if (!sums.has(input[i])) {
            return input[i];
        }
    }
    return false;
}

function part2(input) {
    const target = 675280050;

    for (let l = 2; l < input.length - 2; l++) {
        for(let start = 0; start < input.length - l; start++) {
            const val = _.sum(input.slice(start, start+l+1));
            
            if (val === target) {
                const min = _.min(input.slice(start, start+l+1));
                const max = _.max(input.slice(start, start+l+1));
                return min + max;
            }
        }
    }
    
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

