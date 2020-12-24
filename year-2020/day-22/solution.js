const d = require('debug')('solution');
const _ = require('lodash');

const util = require('../../utils');
const imp = require('../../imp');
const parsers = require('../../parse');

// First example and expected answers for each part.
// Ignored if empty strings.
const ex1 = `Player 1:
9
2
6
3
1

Player 2:
5
8
4
7
10
`;
const ex1expectedP1 = 306;
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
    return multi.map(player => player.slice(1).map(Number));
}

function part1(input) {
    input = _.cloneDeep(input);

    while(input[0].length && input[1].length) {
        const p1 = input[0].shift();
        const p2 = input[1].shift();

        if (p1 > p2) {
            input[0].push(p1);
            input[0].push(p2);
        } else {
            input[1].push(p2);
            input[1].push(p1);
        }
    }

    let winner = input[0].length ? input[0] : input[1];
    return _.sum(winner.reverse().map((v, i) => v * (i+1)));
}

function hashDecks(deck1,deck2) {
    return `[${deck1.join(',')}] [${deck2.join(',')}]`;
}

function part2(input) {

    function recursiveCombat(deck1, deck2) {
        let prevConfigs = new Set();

        while(deck1.length && deck2.length) {
            let deckHash = hashDecks(deck1, deck2);
            if (prevConfigs.has(deckHash)) {
                return [1, deck1];
            } else {
                prevConfigs.add(deckHash);
            }

            const p1 = deck1.shift();
            const p2 = deck2.shift();

            let winner;
            if (deck1.length >= p1 && deck2.length >= p2) {
                winner = recursiveCombat(deck1.slice(0, p1), deck2.slice(0, p2))[0];
            } else {
                winner = (p1 > p2) ? 1 : 2;
            }

            if (winner === 1) {
                deck1.push(p1);
                deck1.push(p2);
            } else {
                deck2.push(p2);
                deck2.push(p1);
            }
        }

        let winner = deck1.length ? deck1 : deck2;
        return [deck1.length ? 1 : 2, _.sum(winner.reverse().map((v, i) => v * (i+1)))];
    }

    return recursiveCombat(input[0], input[1])[1];
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

