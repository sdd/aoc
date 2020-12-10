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
    return result;
}

function part2(input) {

    /*function chain(currJoltage, currChain, remaining) {
        let i = 0;
        if (!remaining.length) {
            fullChains.push(currChain);
            return currJoltage;
        }
        while(i < remaining.length && remaining[i] >= currJoltage && remaining[i] <= currJoltage + 3) {
            chain(remaining[i],
                [...currChain, remaining[i]],
                remaining.slice(i + 1)
            );
            i++;
        }
    }*/

    /*
    let fullChains = 0;
    let remainingChains = [[0, [], input]]z;
    function chain2([currJoltage, currChain, remaining]) {
        let i = 0;
        if (!remaining.length) {
            fullChains++;
            if (fullChains % 1000 === 0) {
                d('tot: %d, q: %d, curr: %s', fullChains, remainingChains.length, currChain.join(''));
            }
            return;
        }
        while(i < remaining.length && remaining[i] >= currJoltage && remaining[i] <= currJoltage + 3) {
            remainingChains.push([remaining[i],
                [...currChain, remaining[i]],
                remaining.slice(i + 1)
            ]);
            i++;
        }
    }
    while(remainingChains.length) {
        chain2(remainingChains.pop());
    }
    return fullChains;
     */

    /*
        function chain3(currJoltage, list, total) {
            if (!list.length) {
                return total;
            }
            let next = [];
            let i = 0;
            while (i < list.length && list[i] <= currJoltage + 3) {
                next.push(i);
                i++;
            }

            return _.sum(next.map(n => {
                let newJ = list[n];
                let newList = list.slice(n+1);
                return chain3(newJ, newList, total);
            }));
        }

        return chain3(0, input, 1);
        */

    /*
    function chain4(currJoltage, list, total) {
        d('total: %d, list: %o', total, list)
        if (!list.length) {
            return total;
        }
        let i = 0;
        while (i < list.length && list[i] <= currJoltage + 3) {
            i++;
        }

        return chain4(list.shift(), list, total * i-1 )
    }
    return chain4(0, input, 1);
    */
    
    input = [0, ...input];
    const mapCombosToEnd = {};
    let last = input.pop();
    mapCombosToEnd[last] = 1;

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

