const d = require('debug')('solution');
const _ = require('lodash');

const util = require('../../utils');
const imp = require('../../imp');
const parsers = require('../../parse');

// First example and expected answers for each part.
// Ignored if empty strings.

// Commented out because the run time for this example on part 2
// would be ~forever
const ex1 = ''/*`mask = XXXXXXXXXXXXXXXXXXXXXXXXXXXXX1XXXX0X
mem[8] = 11
mem[7] = 101
mem[8] = 0
mask = XXXXXXXXXXXXXXXXXXXXXXXXXXXXX1XXXX0X
mem[8] = 11
mem[7] = 101
mem[8] = 0`*/;
const ex1expectedP1 = 165;
const ex1expectedP2 = ``;

// Second example and expected answers for each part.
// Ignored if empty strings.
const ex2 = `mask = 000000000000000000000000000000X1001X
mem[42] = 100
mask = 00000000000000000000000000000000X0XX
mem[26] = 1`;
const ex2expectedP1 = ``;
const ex2expectedP2 = 208;

/**
 * Input parser.
 * @param {raw} raw unmodified input string from input-01.txt
 * @param {line} raw split on newlines, empty items removed, items trimmed
 * @param {comma} raw split on commas, empty items removed, items trimmed
 * @param {space} raw split on spaces, empty lines removed, items trimmed
 * @param {multi} raw, split on double newlines, empty items removed, split again on newlines, items trimmed
 */
function parse({ raw, line, comma, space, multi }) {
    let res = [];
    let  ops = [];
    let l;
    line = [...line];
    let mask = line.shift();
    mask = mask.split(' = ')[1];
    while(line.length) {
        l = line.shift();
        if (l.startsWith('mask')) {
            res.push({ mask, ops });
            mask = l.split(' = ')[1];
            ops = [];
        } else {
            ops.push(util.ints(l));
        }
    }
    res.push({ mask, ops });
    return res;
}

function part1(input) {
    const mem = {};

    _.forEach(input, ({ mask, ops }) => {
        let maskBits = mask.split('').reverse().map((v, i) => ([v, i])).filter(([c]) => c !== 'X');

        _.forEach(ops, ([dest, val]) => {

            let res = val.toString(2).padStart(36, '0');
            _.forEach(maskBits, ([val, idx]) => {
                res = res.substr(0, 35 - idx) + val + res.substr(36 - idx)
            });

            mem[dest] = parseInt(res, 2);
        });
    })

    return _.sum(Object.values(mem));
}

function part2(input) {
    const mem = {};

    _.forEach(input, ({ mask, ops }) => {
        let maskBits = mask.split('').map(Number).reverse().map((v, i) => ([v, i]));
        let [xBits, nBits]  = _.partition(maskBits, ([val]) => Number.isNaN(val));
        let xbnperm = 2 ** xBits.length;
        //nBits = nBits.filter(([val]) => val);

        _.forEach(ops, ([dest, value]) => {
            let start = dest
            _.forEach(nBits, ([val, idx]) => {
                start &= val ? (1 << idx) : ~(1 << idx);
            });

            for(let xbi = 0; xbi < xbnperm; xbi++) {
                let memIdx = start;

                _.forEach(xBits, ([, bit], xBitIndex) => {
                    let bv = 1 << xBitIndex;
                    memIdx &= (xbi & bv) ? bv : ~bv;
                });

                mem[memIdx] = value;
            }
        });
    })

    return _.sum(Object.values(mem));
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
