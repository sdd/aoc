const d = require('debug')('aoc');
const _ = require('lodash');

const util = require('../../utils');
const imp = require('../../imp');
const parsers = require('../../parse');

const data = imp.lineStr('01.txt');

function parse(input) {
    return input.map(a => {
        const [ a1, a2, a3, a4, a5, a6, a7, b1, b2, b3] = a;
        let r = 0;
        if (a1 === 'B') { r += 64; } 
        if (a2 === 'B') { r += 32; } 
        if (a3 === 'B') { r += 16; } 
        if (a4 === 'B') { r += 8; } 
        if (a5 === 'B') { r += 4; } 
        if (a6 === 'B') { r += 2; } 
        if (a7 === 'B') { r += 1; }


        let c = 0;
        if (b1 === 'R') { c += 4; } 
        if (b2 === 'R') { c += 2; } 
        if (b3 === 'R') { c += 1; }

        let id = r * 8 + c;

        return id;
    });
}

function part1(input) {
    return _.max(input);
}

function part2(input) {
    let seen = _.times(900, x => x);
    input.forEach(id => {    
        seen[id] = false;
    });

    return seen.filter(x => x);
}

module.exports = {
    part1,
    part2
};

// comment out the below if working with a test harness in watch mode
const parsed = parse(data);
console.log('----------------------------');
d('parsed item count: %d', parsed.length);
d('first parsed item: %o => %o', data[0], parsed[0]);
d('last parsed item: %o => %o', data[data.length - 1], parsed[parsed.length - 1]);

d('ex1: %s', 'FBFBBFFRLR');
d('ex1: %o', parse(['FBFBBFFRLR']));

d('part1 result: %o', part1(parsed));
d('part2 result: %o', part2(parsed));



