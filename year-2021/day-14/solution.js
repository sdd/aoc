const d = require('debug')('solution');
const _ = require('lodash');

const util = require('../../utils');
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
    let [template, rules] = multi;

    rules = rules.map(r => r.split(' -> ')).reduce((map, [k, v]) => {
        map.set(k, v);
        return map;
    }, new Map());

    return {
        template: template[0], rules
    };
}

function part1({template, rules}) {
    let current = template;
    let next = '';
    for(let step = 1; step <= 10; step++) {
        for(let pos = 0; pos <= current.length - 2; pos++) {
            const currPair = current.slice(pos, pos+2);
            const rule = rules.get(currPair);
            next += `${current[pos]}${rule}`;
        }
        next += current.charAt(current.length - 1);
        current = next;
        next = '';
    }
    

    const cc = current.split('');
    const freq = new Map();
    for (const char of cc) {
        if (!freq.has(char)) {
            freq.set(char, 1);
        } else {
            freq.set(char, freq.get(char) + 1);
        }
    }

    const freqEnt = [...freq.entries()];

    freqEnt.sort((a, b) => a[1] - b[1]);

    const a = freqEnt[0];
    const b = freqEnt[freqEnt.length - 1];
    console.log(a, b);

    return b[1] - a[1];
}

function part2({template, rules }) {
    let current = new Map();
    for(let pos = 0; pos <= template.length - 2; pos++) {
        const currPair = template.slice(pos, pos+2);
        if (!current.has(currPair)) {
            current.set(currPair, 1);
        } else {
            current.set(currPair, current.get(currPair) + 1);
        }
    }
    let next;

    for(let step = 1; step <= 40; step++) {
        next = new Map();

        for(const [key, count] of current.entries()) {
            const nextChar = rules.get(key);
            const next1 = `${key.charAt(0)}${nextChar}`;
            const next2 = `${nextChar}${key.charAt(1)}`;

            if (!next.has(next1)) {
                next.set(next1, count);
            } else {
                next.set(next1, next.get(next1) + count);
            }

            if (!next.has(next2)) {
                next.set(next2, count);
            } else {
                next.set(next2, next.get(next2) + count);
            }
        }
        current = next;
    }    

    const freqEnt = [...current.entries()];
    const fc = new Map();

    for (const [pair, count] of freqEnt) {
        const first = pair.charAt(0);
        if (!fc.has(first)) {
            fc.set(first, count);
        } else {
            fc.set(first, fc.get(first) + count);
        }
    }
    const lastInputChar = template.charAt(template.length - 1);
    fc.set(lastInputChar, fc.get(lastInputChar) + 1);

    const freqs = [...fc.entries()];
    freqs.sort((a, b) => a[1] - b[1]);
    return freqs.pop()[1] - freqs[0][1];
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

