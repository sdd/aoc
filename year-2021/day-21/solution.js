/* eslint-disable no-loop-func */
const d = require('debug')('solution');
const _ = require('lodash');

const { Counter } = require('../../utils');
const imp = require('../../imp');
const parsers = require('../../parse');

// First example and expected answers for each part.
// Ignored if empty strings.
const ex1 = `Player 1 starting position: 4
Player 2 starting position: 8`;
const ex1expectedP1 = 739785;
const ex1expectedP2 = 444356092776315;

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
    return lines.map(l => Number(l[l.length - 1]));
}

function part1(input) {
    const pos = [...input];
    const score = [0, 0];
    let die = 1;
    let playerIndex = 0;

    do {
        pos[playerIndex] = ((pos[playerIndex] + (die++ + die++ + die++) - 1) % 10) + 1;
        score[playerIndex] += pos[playerIndex];
        playerIndex = 1 - playerIndex;
    } while(score[0] < 1000 && score[1] < 1000);
    
    return (--die) * score[playerIndex];
}

function part2(input) {
    const initialState = { p: [input[0], input[1]], s: [0, 0], turn: 0 };
    
    let stateCounts = new Counter();
    stateCounts.inc(JSON.stringify(initialState));

    const winCounts = [0, 0];

    while(stateCounts.size) {
        const nextStateCounts = new Counter();
        for(let [state, count] of stateCounts.entries()) {
            state = JSON.parse(state);

            for(let r1 = 1; r1 <= 3; r1++) {
                for(let r2 = 1; r2 <= 3; r2++) {
                    for(let r3 = 1; r3 <= 3; r3++) {
                        const p = ((state.p[state.turn] + r1 + r2 + r3 - 1) % 10) + 1;
                        const s = state.s[state.turn] + p;

                        if (s >= 21) {
                            winCounts[state.turn] += count;
                        } else {
                            const nextState = _.cloneDeep(state);
                            nextState.p[state.turn] = p;
                            nextState.s[state.turn] = s;
                            nextState.turn = 1 - nextState.turn;
                            
                            nextStateCounts.add(JSON.stringify(nextState), count);
                        }
                    }
                }
            }
        }
        stateCounts = nextStateCounts;
    }
    return Math.max(...winCounts);
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

