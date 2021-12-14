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
 * @param {raw} raw unmodified input string from input-01.txt
 * @param {line} raw split on newlines, empty items removed, items trimmed
 * @param {comma} raw split on commas, empty items removed, items trimmed
 * @param {space} raw split on spaces, empty lines removed, items trimmed
 * @param {multi} raw, split on double newlines, empty items removed, split again on newlines, items trimmed
 */
function parse({ raw, line, comma, space, multi }) {
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

