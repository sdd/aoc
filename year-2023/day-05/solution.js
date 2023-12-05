/* eslint-disable no-loop-func */
const d = require('debug')('solution');
const _ = require('lodash');

const util = require('../../utils');
const imp = require('../../imp');
const parsers = require('../../parse');
const sets = require('../../sets');

// add string tags here to help future categorization.
const tags = [];

// First example and expected answers for each part.
// Ignored if empty strings.
const ex1 = `seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4`;
const ex1expectedP1 = 35;
const ex1expectedP2 = 46;

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
    let [seeds, ...rest] = multi;

    seeds = seeds[0].split(' ').slice(1).map(Number);

    const maps = rest.map(item => {
        const [firstrow, ...otherRows] = item;

        let [from, ,to] = firstrow.split('-');
        to = to.split(' ')[0];

        const ranges = [];
        for (const rw of otherRows) {
            const [destStart, srcStart, rLen] = rw.split(' ').map(Number);
            ranges.push({ destStart, srcStart, rLen});
        }

        return {
            from, to, ranges
        }
    });

    return {
        seeds,
        maps
    }
}

function part1(input) {
    let { seeds, maps } = input;

    let loc = 'seed';

    while(loc !== 'location') {
        const map = _.find(maps, x => x.from === loc);
        if (!map) {
            return `could not find map from ${loc}`;
        }

        seeds = seeds.map(seed => {
            const range = _.find(map.ranges, r => seed >= r.srcStart && seed <= r.srcStart + r.rLen);
            if (range) {
                seed = seed - range.srcStart + range.destStart;
            }
            return seed;
        });

        loc = map.to;
    }

    return _.min(seeds);
}

function part2(input) {
    const { seeds, maps } = input;

    let seedRanges = _.chunk(seeds, 2).map(([a, b]) => [a, a+b]);

    let loc = 'seed';
    let newSeedRanges = [];

    while(loc !== 'location') {
        const map = _.find(maps, x => x.from === loc);
        if (!map) {
            return `could not find map from ${loc}`;
        }
        d({ seedRanges });

        seedRanges.forEach(seedRange => {
            const range = _.find(map.ranges, r => (seedRange[0] >= r.srcStart) && (seedRange[1] <= (r.srcStart + r.rLen)));
            d({ range });
            if (range) {
                const lenBefore = range.srcStart - seedRange[0];
                d({ lenBefore });
                if (lenBefore > 0) {
                    newSeedRanges.push([seedRange[0], range.srcStart - 1]);
                }

                const lenAfter = seedRange[1] - (range.srcStart + range.rLen);
                d({ lenAfter });
                if (lenAfter > 0) {
                    newSeedRanges.push([range.srcStart + range.rLen + 1, seedRange[1]]);
                }

                const startWithin = Math.max(seedRange[0], range.srcStart);
                const endWithin = Math.min(seedRange[1], range.srcStart + range.rLen);
                
                d({ startWithin, endWithin });
                
                if (startWithin >= seedRange[0] && endWithin <= seedRange[1]) {
                    const newRange = [
                        startWithin - range.srcStart + range.destStart,
                        endWithin - range.srcStart + range.destStart
                    ]
                    d({ newRange});
                    newSeedRanges.push(newRange);
                } else {
                    d('help');
                }
            } else {
                newSeedRanges.push(seedRange);
            }
        });

        loc = map.to;
        seedRanges = newSeedRanges;
        newSeedRanges = [];
    }

    return _.min(seedRanges.map(s => s[0]));
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
    tags,
};

