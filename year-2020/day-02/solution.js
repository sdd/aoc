const d = require('debug')('aoc');
const _ = require('lodash');

const util = require('../utils');
const imp = require('../imp');
const parsers = require('../parse');

const data = imp.lineStr('01.txt');
//const data = imp.lineNum('01.txt');
//const data = imp.SpaceStr('01.txt');
//const data = imp.SpaceNum('01.txt');
//const data = imp.commaStr('01.txt');
//const data = imp.commaNum('01.txt');

function parse(input) {
    return input.map(x => {
        //return x;
        return parsers.splitNonAlphanum(x);
    });
}

function part1(input) {
    return input
    .filter(([ lo, hi, letter, p ]) => {
        let count = p.split('').filter(l => l === letter).length;
        return count >= lo && count <= hi;
    })
    .length
}

function part2(input) {
    return input
    .filter(([ lo, hi, letter, p ]) =>
        (p[lo - 1] === letter) !== (p[hi - 1] === letter)
    )
    .length
}

module.exports = {
    part1,
    part2
};

const parsed = parse(data);


console.log('----------------------------');
d('parsed item count: %d', parsed.length);
d('first parsed item: %o', parsed[0]);
d('last parsed item: %o', parsed[parsed.length - 1]);

d('part1 result: %o', part1(parsed));
d('part2 result: %o', part2(parsed));

