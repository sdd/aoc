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
 * @param {raw} raw unmodified input string from input-01.txt
 * @param {line} raw split on newlines, empty items removed, items trimmed
 * @param {comma} raw split on commas, empty items removed, items trimmed
 * @param {space} raw split on spaces, empty lines removed, items trimmed
 * @param {multi} raw, split on double newlines, empty items removed, split again on newlines, items trimmed
 */
function parse({ raw, line, comma, space, multi }) {
    return line.map(l => {
        const frags = parsers.splitNonAlphanum(l);
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

