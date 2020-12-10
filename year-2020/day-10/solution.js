const d = require('debug')('solution');
const _ = require('lodash');

const util = require('../../utils');
const imp = require('../../imp');
const parsers = require('../../parse');

// First example and expected answers for each part.
// Ignored if empty strings.
const ex1 = `16
10
15
5
1
11
7
19
6
12
4`;
const ex1expectedP1 = 22;
const ex1expectedP2 = ``;

// Seconf example and expected answers for each part.
// Ignored if empty strings.
const ex2 = `28
33
18
42
31
14
46
20
48
47
24
23
49
45
19
38
39
11
1
32
25
35
8
17
7
9
4
2
34
10
3`;
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
    return _.sortBy(line.map(Number), x=>x);
}

function part1(input) {
    let gap1v = input[0] === 1 ? 1 : 0;
    let gap3v = input[0] === 3 ? 1 : 0;
    for(let i = 0; i < input.length; i++) {
        if (input[i+1] - input[i] === 1){
            gap1v++;
        }
        if (input[i+1] - input[i] === 3){
            gap3v++;
        }
    }
    gap3v++;

    return [gap1v, gap3v];
}

function part2(input) {
    input = [0, ...input];
    const mapCombosToEnd = {
        [input.pop()]: 1
    };

    while(input.length) {
        const curr = input.pop();
        let total = 0;
        for(let i = 1; i <= 3; i++) {
            if (mapCombosToEnd[curr+i]) {
                total += mapCombosToEnd[curr+i];
            }
        }
        mapCombosToEnd[curr] = total;
    }

    return mapCombosToEnd[0];
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

