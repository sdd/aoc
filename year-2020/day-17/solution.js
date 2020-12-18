const d = require('debug')('solution');
const _ = require('lodash');

const util = require('../../utils');
const imp = require('../../imp');
const parsers = require('../../parse');

// First example and expected answers for each part.
// Ignored if empty strings.
const ex1 = `.#.
..#
###`;
const ex1expectedP1 =112;
const ex1expectedP2 = ``;

// Seconf example and expected answers for each part.
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
    return line.map(l => l.split(''));
}

function part1(input) {
    let max = [input.length + 12, input[0].length + 12, 13];

    // create the world
    let prev = new Array(input.length + 12);
    for(let r = 0; r <= max[0] + 12; r++) {
        prev[r] = new Array(input[0].length + 12);
        for(let c = 0; c <= max[1] + 12; c++) {
            prev[r][c] = new Array(13);
        }
    }

    // populate from input
    for(let r = 0; r < input.length; r++) {
        for(let c = 0; c < input[0].length; c++) {
            prev[r+6][c+6][6] = !!(input[r][c] === '#');
        }
    }

    let count;
    for(let t = 1; t <= 6; t++) {
        let next = [];
        count = 0;
        for(let r = 0; r <= max[0]; r++) {
            next[r] = [];
            for(let c = 0; c <= max[1]; c++) {
                next[r][c] = [];
                for(let z = 0; z <= max[2]; z++) {

                    let curr = prev[r][c][z];
                    let adj = countAdj(prev, r, c, z, max);
                    if (curr) {
                        if (adj === 2 || adj === 3) {
                            next[r][c][z] = true;
                            count++;
                        } else {
                            next[r][c][z] = false;
                        }
                    } else {
                        if (adj === 3) {
                            next[r][c][z] = true;
                            count++;
                        } else {
                            next[r][c][z] = false;
                        }
                    }
                }
            }
        }

        prev = next;
        d('t=%d, count=%d', t, count);
    }
    return count;
}

function countAdj(world, r, c, z, max) {
    let count = 0;
    let tested = 0;
    for (let i = Math.max(0, r-1); i <= Math.min(max[0], r+1); i++) {
        for (let j = Math.max(0, c-1); j <= Math.min(max[1], c+1); j++) {
            for (let k = Math.max(0, z-1); k <= Math.min(max[2], z+1); k++) {
                if (world[i][j][k]) { count++; }
                tested++;
            }
        }
    }
    return count - (!!world[r][c][z] ? 1 : 0);
}

function countAdj4(world, r, c, z, w, max) {
    let count = 0;
    let tested = 0;
    for (let i = Math.max(0, r-1); i <= Math.min(max[0], r+1); i++) {
        for (let j = Math.max(0, c-1); j <= Math.min(max[1], c+1); j++) {
            for (let k = Math.max(0, z-1); k <= Math.min(max[2], z+1); k++) {
                for (let l = Math.max(0, w-1); l <= Math.min(max[3], w+1); l++) {
                    if (world[i][j][k][l]) { count++; }
                    tested++;
                }
            }
        }
    }
    return count - (!!world[r][c][z][w] ? 1 : 0);
}

function part2(input) {
    let max = [input.length + 12, input[0].length + 12, 13, 13];

    let prev = new Array(input.length + 12);
    for(let r = 0; r <= max[0] + 12; r++) {
        prev[r] = new Array(input[0].length + 12);
        for(let c = 0; c <= max[1] + 12; c++) {
            prev[r][c] = new Array(13);
            for(let z = 0; z <= max[2]; z++) {
                prev[r][c][z] = new Array(13);
            }
        }
    }

    for(let r = 0; r < input.length; r++) {
        for(let c = 0; c < input[0].length; c++) {
            prev[r+6][c+6][6][6] = !!(input[r][c] === '#');
        }
    }

    let count;
    for(let t = 1; t <= 6; t++) {
        let next = [];
        count = 0;
        for(let r = 0; r <= max[0]; r++) {
            next[r] = [];
            for(let c = 0; c <= max[1]; c++) {
                next[r][c] = [];
                for(let z = 0; z <= max[2]; z++) {
                    next[r][c][z] = [];
                    for(let w = 0; w <= max[3]; w++) {

                        let curr = prev[r][c][z][w];
                        let adj = countAdj4(prev, r, c, z, w, max);
                        if (curr) {
                            if (adj === 2 || adj === 3) {
                                next[r][c][z][w] = true;
                                count++;
                            } else {
                                next[r][c][z][w] = false;
                            }
                        } else {
                            if (adj === 3) {
                                next[r][c][z][w] = true;
                                count++;
                            } else {
                                next[r][c][z][w] = false;
                            }
                        }
                    }
                }
            }
        }

        prev = next;
        d('t=%d, count=%d', t, count);
    }
    return count;
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

