const d = require('debug')('aoc');
const _ = require('lodash');

const util = require('../../utils');
const imp = require('../../imp');
const parsers = require('../../parse');

const ex1 = '';
const ex2 = '';

function parse(raw) {
    const input = raw.split('\n').slice(0, -1);
    // const input = raw.split('\n\n');
    // const input = raw.split(',');
    // const input = raw.split(' ');
    
    return input.map(x => {
        //return x;
        return util.ints(x);
    });
}

function part1(input) {
    return input.length;
}

function part2(input) {
    return input.length;
}

module.exports = {
    ex1,
    ex2,
    part1,
    part2,
    parse,
};

