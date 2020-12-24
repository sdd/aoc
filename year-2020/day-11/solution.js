const d = require('debug')('solution');
const _ = require('lodash');

const util = require('../../utils');
const imp = require('../../imp');
const parsers = require('../../parse');

// First example and expected answers for each part.
// Ignored if empty strings.
const ex1 = `L.LL.LL.LL
LLLLLLL.LL
L.L.L..L..
LLLL.LL.LL
L.LL.LL.LL
L.LLLLL.LL
..L.L.....
LLLLLLLLLL
L.LLLLLL.L
L.LLLLL.LL`;
const ex1expectedP1 = 37;
const ex1expectedP2 = 26;

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
    return line.map(l =>l.split('') );
}

function part1(input) {

    let newState = [];
    let stateChanged = true;
    while(stateChanged) {
        stateChanged = false;
        newState = [];

        for(let r = 0; r < input.length; r++) {
            let row = input[r];
            let newRow = [];
            newState.push(newRow);
            for(let c = 0; c < input[r].length; c++) {
                if (row[c] === '.') {
                    newRow.push('.');
                    continue;
                }

                let adjOccCount = 0;
                if (row[c - 1] === '#') { adjOccCount++; }
                if (row[c + 1] === '#') { adjOccCount++; }
                if (r > 0 && input[r - 1][c-1] === '#') { adjOccCount++; }
                if (r > 0 && input[r - 1][c] === '#') { adjOccCount++; }
                if (r > 0 && input[r - 1][c+ 1] === '#') { adjOccCount++; }
                if (r < input.length - 1 && input[r + 1][c - 1] === '#') { adjOccCount++; }
                if (r < input.length - 1 && input[r + 1][c] === '#') { adjOccCount++; }
                if (r < input.length - 1 && input[r + 1][c + 1] === '#') { adjOccCount++; }

                if (row[c] === 'L') {
                    if (adjOccCount === 0) {
                        newRow.push('#');
                        stateChanged = true;
                    } else {
                        newRow.push('L');
                    }
                } else {
                    if (adjOccCount >= 4) {
                        newRow.push('L');
                        stateChanged = true;
                    } else {
                        newRow.push('#');
                    }
                }
            }
        }
        input = newState;
    }
    return countOccupied(input);
}

function countOccupied(state) {
    let c = 0;
    for(let i = 0; i < state.length; i++)
        for (let j = 0; j < state[i].length; j++)
            if (state[i][j] === '#')
                c++;
    return c;
}

const dirs = [
    [0, -1],
    [1, -1],
    [1, 0],
    [1, 1],
    [0, 1],
    [-1, 1],
    [-1, 0],
    [-1, -1],
];

function occupiedInDir(input, r, c, dir) {
    r = r + dirs[dir][0];
    c = c + dirs[dir][1];
    while(r >= 0 && c >= 0 && r < input.length && c < input[r].length) {
        if (input[r][c] === '#') {
            return true;
        }
        if (input[r][c] === 'L') {
            return false;
        }

        r = r + dirs[dir][0];
        c = c + dirs[dir][1];
    }
    return false;
}

function part2(input) {
    let newState = [];
    let stateChanged = true;
    while(stateChanged) {
        stateChanged = false;
        newState = [];

        for(let r = 0; r < input.length; r++) {
            let row = input[r];
            let newRow = [];
            newState.push(newRow);
            for(let c = 0; c < input[r].length; c++) {
                if (row[c] === '.') {
                    newRow.push('.');
                    continue;
                }

                let adjOccCount = 0;
                for (let d = 0; d < 8; d++) {
                    if (occupiedInDir(input, r, c, d)) adjOccCount++;
                }

                if (row[c] === 'L') {
                    if (adjOccCount === 0) {
                        newRow.push('#');
                        stateChanged = true;
                    } else {
                        newRow.push('L');
                    }
                } else {
                    if (adjOccCount >= 5) {
                        newRow.push('L');
                        stateChanged = true;
                    } else {
                        newRow.push('#');
                    }
                }
            }
        }
        input = newState;
    }
    return countOccupied(input);
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

