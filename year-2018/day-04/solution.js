/* eslint-disable prefer-destructuring */
const d = require('debug')('solution');
const _ = require('lodash');

const util = require('../../utils');
const imp = require('../../imp');
const parsers = require('../../parse');
const sets = require('../../sets');

// First example and expected answers for each part.
// Ignored if empty strings.
const ex1 = `[1518-11-01 00:00] Guard #10 begins shift
[1518-11-01 00:05] falls asleep
[1518-11-01 00:25] wakes up
[1518-11-01 00:30] falls asleep
[1518-11-01 00:55] wakes up
[1518-11-01 23:58] Guard #99 begins shift
[1518-11-02 00:40] falls asleep
[1518-11-02 00:50] wakes up
[1518-11-03 00:05] Guard #10 begins shift
[1518-11-03 00:24] falls asleep
[1518-11-03 00:29] wakes up
[1518-11-04 00:02] Guard #99 begins shift
[1518-11-04 00:36] falls asleep
[1518-11-04 00:46] wakes up
[1518-11-05 00:03] Guard #99 begins shift
[1518-11-05 00:45] falls asleep
[1518-11-05 00:55] wakes up`;
const ex1expectedP1 = 240;
const ex1expectedP2 = 4455;

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
    const x = _.clone(lines);
    x.sort();

    const guards = {};

    let currGuard;
    let startSleep;
    while(x.length) {
        const line = x.shift();

        if (line.includes('#')) {
            // we have a new guard
            currGuard = line.split('#')[1].split(' ')[0];
        } else if (line.includes('falls')) {
            // guard fell asleep
            startSleep = Number(line.split(':')[1].slice(0, 2));
        } else {
            // guard woke up
            const endSleep = Number(line.split(':')[1].slice(0, 2));

            if (!guards[currGuard]) {
                guards[currGuard] = {};
            }
            for(let min = startSleep; min < endSleep; min++) {
                if (guards[currGuard][min] === undefined) {
                    guards[currGuard][min] = 1;
                } else {
                    guards[currGuard][min] += 1;
                }
            }
        }
    }

    return guards;
}

function part1(guards) {
    let mostMins = 0;
    let mostMinsGuard;
    for(const [gId, mins] of Object.entries(guards)) {
        const totMins = _.sum(Object.values(mins));
        if (totMins > mostMins) {
            mostMins = totMins;
            mostMinsGuard = gId;
        }
    }

    let topSleepNums = 0;
    let topSleepMin;
    for(const [min, count] of Object.entries(guards[mostMinsGuard])) {
        if (count > topSleepNums) {
            topSleepNums = count;
            topSleepMin = min;
        }
    }

    return topSleepMin * mostMinsGuard;
}

function part2(guards) {
    let topSleepNums = 0;
    let topSleepMin;
    let topSleepGuard;
    for(const [gId, mins] of Object.entries(guards)) {
        for(const [min, count] of Object.entries(mins)) {
            if (count > topSleepNums) {
                topSleepNums = count;
                topSleepMin = min;
                topSleepGuard = gId;
            }
        }
    }

    return topSleepGuard * topSleepMin;
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

