const d = require('debug')('solution');
const _ = require('lodash');

const util = require('../../utils');
const imp = require('../../imp');
const parsers = require('../../parse');

// First example and expected answers for each part.
// Ignored if empty strings.
const ex1 = `F10
N3
F7
R90
F11`;
const ex1expectedP1 = 25;
const ex1expectedP2 = 286;

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
    return line.map(l => {
        let dir = l.slice(0, 1);
        let val = l.slice(1);
        return { dir, val };
    });
}

let DIR_TO_RC_DELTA = [
    [0, -1],
    [1, 0],
    [0, 1],
    [-1, 0],
]

const L_TO_DIR = {
    N: 0,
    E: 1,
    S: 2,
    W: 3
};

function part1(input) {
    let cdir = 1;
    let cpos = [0, 0];

    input.forEach(({ dir, val }) => {
        switch (dir) {
            case 'L':
            case 'R':
                cdir = cdir + (val / 90 * (dir === 'L' ? -1 : 1));
                cdir = ((cdir % 4) + 4) % 4;
                break;

            case 'F':
                cpos[0] += DIR_TO_RC_DELTA[cdir][0] * val;
                cpos[1] += DIR_TO_RC_DELTA[cdir][1] * val;
                break;

            case 'N':
            case 'E':
            case 'S':
            case 'W':
                cpos[0] += DIR_TO_RC_DELTA[L_TO_DIR[dir]][0] * val;
                cpos[1] += DIR_TO_RC_DELTA[L_TO_DIR[dir]][1] * val;
                break;
        }
    });

    return Math.abs(cpos[0]) + Math.abs(cpos[1]);
}

ROTATION_MAP = [
    ([r, c]) => ([r, c]),
    ([r, c]) => ([-c, r]),
    ([r, c]) => ([-r, -c]),
    ([r, c]) => ([c, -r]),
];

function part2(input) {
    let wpos = [10, -1];
    let spos = [0, 0]

    input.forEach(({ dir, val }) => {
        switch (dir) {
            case 'L':
            case 'R':
                let d = (val / 90) * (dir === 'L' ? -1 : 1);
                d = ((d % 4) + 4) % 4;
                wpos = ROTATION_MAP[d](wpos);
                break;

            case 'F':
                spos[0] += wpos[0] * val;
                spos[1] += wpos[1] * val;
                break;

            case 'N':
            case 'E':
            case 'S':
            case 'W':
                wpos[0] += DIR_TO_RC_DELTA[L_TO_DIR[dir]][0] * val;
                wpos[1] += DIR_TO_RC_DELTA[L_TO_DIR[dir]][1] * val;
                break;
        }
    });

    return Math.abs(spos[0]) + Math.abs(spos[1]);
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

