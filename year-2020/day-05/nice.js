const d = require('debug')('aoc');
const _ = require('lodash');

const util = require('../../utils');
const imp = require('../../imp');
const parsers = require('../../parse');

const data = imp.lineStr('01.txt');

function parse(input) {
    return input.map(x => {
        let id = 0; let i = -1;
        while(i++ < 9) id = (id << 1) + !(x.charCodeAt(i) & 4);
        return id;
    });
}

function part1(input) {
    return _.max(input);
}

function part2(input) {
    let seen = _.times(850, x => x);
    
    input.forEach(id => { seen[id] = false; });
    
    seen = seen.filter(x => x);

    let prev = 0;
    seen = _.dropWhile(seen, v => {
        let isNext = v === prev + 1;
        prev++;
        return isNext;
    });
    return seen[0];
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


