const d = require('debug')('solution');
const _ = require('lodash');

const util = require('../../utils');
const imp = require('../../imp');
const parsers = require('../../parse');

// First example and expected answers for each part.
// Ignored if empty strings.
const ex1 = `aaaaa-bbb-z-y-x-123[abxyz]
a-b-c-d-e-f-g-h-987[abcde]
not-a-real-room-404[oarel]
totally-real-room-200[decoy]`;
const ex1expectedP1 = 1514;
const ex1expectedP2 = ``;

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
    return lines.map(l => {
        const frags = parsers.splitNonAlphanumPos(l);
        const checksum = frags.pop();
        const sector = Number(frags.pop());

        return {
            sector,
            checksum,
            name: frags.join('-'),
        };
    });
}

function part1(input) {
    const real = input.filter(l => {
        const counts = _.entries(_.countBy(l.name.split('').filter(x => x !== '-')));
        counts.sort((b, a) => (a[1] - b[1]) || (a[0] > b[0] ? -1 : 1));

        return _.every(l.checksum.split(''), char => char === counts.shift()[0]);
    });
    
    return _.sum(real.map(r => r.sector));
}

function part2(input) {
    const real = input.filter(l => {
        const counts = _.entries(_.countBy(l.name.split('').filter(x => x !== '-')));
        counts.sort((b, a) => (a[1] - b[1]) || (a[0] > b[0] ? -1 : 1));
        
        return _.every(l.checksum.split(''), char => char === counts.shift()[0]);
    });

    for(const item of real) {
        let result = '';
        const delta = item.sector % 26;
        for(const char of item.name.split('')) {
            if (char === '-') {
                result += ' ';
            } else {
                const code = char.charCodeAt(0) - 97;
                result += String.fromCharCode( ((code + delta) % 26) + 97);

            }
        }
        if (result.includes('north')) {
            return item.sector;
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

