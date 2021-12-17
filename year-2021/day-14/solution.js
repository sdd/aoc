const d = require('debug')('solution');
const _ = require('lodash');

const { Counter } = require('../../utils');
const imp = require('../../imp');
const parsers = require('../../parse');

// First example and expected answers for each part.
// Ignored if empty strings.
const ex1 = `NNCB

CH -> B
HH -> N
CB -> H
NH -> C
HB -> C
HC -> B
HN -> C
NN -> C
BH -> H
NC -> B
NB -> B
BN -> B
BB -> N
BC -> B
CC -> N
CN -> C`;
const ex1expectedP1 = 1588;
const ex1expectedP2 = 2188189693529;

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
    const [[template], rules] = multi;

    return {
        template,
        rules: new Map(rules.map(r => r.split(' -> ')))
    };
}

function part1({template, rules}) {
    let current = template;
    for(let step = 1; step <= 10; step++) {
        let next = '';
        for(let pos = 0; pos <= current.length - 2; pos++) {
            next += current[pos] + rules.get(current.slice(pos, pos+2));
        }
        current = next + current.slice(-1);
    }

    return Counter.from(current).valRange();
}

function part2({template, rules }) {
    let current = new Counter();
    for(let pos = 0; pos <= template.length - 2; pos++) {
        current.inc(template.slice(pos, pos+2));
    }

    for(let step = 1; step <= 40; step++) {
        const next = new Counter();
        for(const [key, count] of current) {
            const nextChar = rules.get(key);
            next.add(`${key[0]}${nextChar}`, count);
            next.add(`${nextChar}${key[1]}`, count);
        }
        current = next;
    }    

    const freqs = new Counter();
    for (const [pair, count] of current) {
        freqs.add(pair[0], count);
    }
    freqs.inc(template.slice(-1));

    return freqs.valRange();
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

