/* eslint-disable no-bitwise */
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

function stateToKey(state) {
    return state.turn 
        + (state.p[0] << 1) 
        + (state.p[1] << 6) 
        + (state.s[0] << 11) 
        + (state.s[1] << 16); 
}

function keyToState(key) {
    return {
        turn: key & 1,
        p: [
            (key & (31 << 1)) >> 1,
            (key & (31 << 6)) >> 6,
        ],
        s: [
            (key & (31 << 11)) >> 11,
            (key & (31 << 16)) >> 16,
        ]
    }
}

const rollCounts = new Counter();
for(let r1 = 1; r1 <= 3; r1++) {
    for(let r2 = 1; r2 <= 3; r2++) {
        for(let r3 = 1; r3 <= 3; r3++) {
            rollCounts.inc(r1 + r2 + r3);
        }
    }
}

function part2(input) {
    const initialState = { p: [input[0], input[1]], s: [0, 0], turn: 0 };
    
    let stateCounts = new Counter();
    stateCounts.inc(stateToKey(initialState));

    const winCounts = [0, 0];

    let maxStateVal = stateToKey(initialState);
    let maxStateLen = 1;

    while(stateCounts.size) {
        const nextStateCounts = new Counter();
        maxStateLen = Math.max(maxStateLen, stateCounts.size);
        for(const [key, count] of stateCounts.entries()) {

            const turn = key & 1;
            const p0 = (key & (31 << 1)) >> 1;
            const p1 = (key & (31 << 6)) >> 6;
            const s0 = (key & (31 << 11)) >> 11;
            const s1 = (key & (31 << 16)) >> 16;

            for(const [roll, rollCount] of rollCounts.entries()) {
                let np;
                let ns;
                if (turn === 0) {
                    np = ((p0 + roll - 1) % 10) + 1;
                    ns = s0 + np;

                    if (ns >= 21) {
                        winCounts[turn] += (count * rollCount);
                    } else {
                        const newKey = 1
                            + (np << 1) 
                            + (p1 << 6)
                            + (ns << 11) 
                            + (s1 << 16);
                        maxStateVal = Math.max(maxStateVal, newKey);
                        
                        nextStateCounts.add(newKey, (count * rollCount));
                    }

                } else {
                    np = ((p1 + roll - 1) % 10) + 1;
                    ns = s1 + np;

                    if (ns >= 21) {
                        winCounts[turn] += (count * rollCount);
                    } else {
                        const newKey = 0
                            + (p0 << 1) 
                            + (np << 6)
                            + (s0 << 11) 
                            + (ns << 16);
                        maxStateVal = Math.max(maxStateVal, newKey);
                        
                        nextStateCounts.add(newKey, (count * rollCount));
                    }
                }
            }
        }
        stateCounts = nextStateCounts;
    }
    d('maxStateval: %d, maxStateLen: %d', maxStateVal, maxStateLen);
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

