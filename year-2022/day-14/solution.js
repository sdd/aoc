/* eslint-disable complexity */
const d = require('debug')('solution');
const _ = require('lodash');

const util = require('../../utils');
const imp = require('../../imp');
const parsers = require('../../parse');
const sets = require('../../sets');

// add string tags here to help future categorization.
const tags = [];

// First example and expected answers for each part.
// Ignored if empty strings.
const ex1 = `498,4 -> 498,6 -> 496,6
503,4 -> 502,4 -> 502,9 -> 494,9`;
const ex1expectedP1 = 24;
const ex1expectedP2 = 93;

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
    return lines.map(x => x.split(' -> ').map(pair => pair.split(',').map(Number)));
}

function part1(input) {
    input = _.cloneDeep(input);

    // get limits
    let miny = 10000000;
    let maxy = -1000000;
    let minx = 1000000;
    let maxx = -100000;
    for(const line of input) {
        for(const pair of line) {
            const [x, y] = pair;
            if (x < minx) {
                minx = x;
            }
            if (x > maxx) {
                maxx = x;
            }
            if (y < miny) {
                miny = y;
            }
            if (y > maxy) {
                maxy = y;
            }
        }
    }

    minx = Math.min(500, minx);
    maxx = Math.max(500, maxx);
    miny = Math.min(0, miny);
    maxy = Math.max(0, maxy);
    // d({ minx, maxx, miny, maxy });
    
    // build grid
    const grid = util.array2D(maxy - miny + 1, maxx - minx + 1);
    grid[0 - miny][500 - minx] = '+';

    for(const line of input) {
        const pos = line.shift();
        grid[pos[1] - miny][pos[0] - minx] = 1;
        while(line.length) {
            const to = line.shift();
            const xd = Math.sign(to[0] - pos[0]);
            const yd = Math.sign(to[1] - pos[1]);

            while(pos[0] !== to[0] || pos[1] !== to[1]) {
                pos[0] += xd;
                pos[1] += yd;
                grid[pos[1] - miny][pos[0] - minx] = 1;
            }
        }
    }

    // start dropping sand
    let sandcount = 0;

    while(sandcount <= grid.length * grid[0].length) {
        const sandpos = [500, 0];
        let moved = true;
        while(moved) {
            moved = false;

            if (grid[sandpos[1] - miny + 1] === undefined) {
                return sandcount;
            }

            if (grid[sandpos[1] - miny + 1][sandpos[0] - minx] === 0) {
                sandpos[1]++;
                moved = true;

                if (sandpos[0] < minx || sandpos[0] > maxx || sandpos[1] > maxy || sandpos[1] < miny) {
                    return sandcount;
                }
                continue;
            }

            if (grid[sandpos[1] - miny + 1][sandpos[0] - minx - 1] === 0) {
                sandpos[1]++;
                sandpos[0]--;
                moved = true;

                if (sandpos[0] < minx || sandpos[0] > maxx || sandpos[1] > maxy || sandpos[1] < miny) {
                    return sandcount;
                }
                continue;
            }

            if (grid[sandpos[1] - miny + 1][sandpos[0] - minx - 1] === undefined) {
                return sandcount;
            }

            if (grid[sandpos[1] - miny + 1][sandpos[0] - minx + 1] === 0) {
                sandpos[1]++;
                sandpos[0]++;
                moved = true;

                if (sandpos[0] < minx || sandpos[0] > maxx || sandpos[1] > maxy || sandpos[1] < miny) {
                    return sandcount;
                }
                continue;
            }

            if (grid[sandpos[1] - miny + 1][sandpos[0] - minx + 1] === undefined) {
                return sandcount;
            }
        }

        grid[sandpos[1] - miny][sandpos[0] - minx] = 'o';
        sandcount++;
    }

    return sandcount;
}

function part2(input) {
    input = _.cloneDeep(input);

    // get limits
    let miny = 10000000;
    let maxy = -1000000;
    let minx = 1000000;
    let maxx = -100000;
    for(const line of input) {
        for(const pair of line) {
            const [x, y] = pair;
            if (x < minx) {
                minx = x;
            }
            if (x > maxx) {
                maxx = x;
            }
            if (y < miny) {
                miny = y;
            }
            if (y > maxy) {
                maxy = y;
            }
        }
    }

    miny = Math.min(0, miny);
    maxy = Math.max(0, maxy) + 2;
    minx = 500 - (maxy - miny) - 1;
    maxx = 500 + (maxy - miny) + 1;
    d({ minx, maxx, miny, maxy });
    
    // build grid
    const grid = util.array2D(maxy - miny + 1, maxx - minx + 1);
    grid[0 - miny][500 - minx] = '+';

    for(const line of input) {
        const pos = line.shift();
        grid[pos[1] - miny][pos[0] - minx] = 1;
        while(line.length) {
            const to = line.shift();
            const xd = Math.sign(to[0] - pos[0]);
            const yd = Math.sign(to[1] - pos[1]);

            while(pos[0] !== to[0] || pos[1] !== to[1]) {
                pos[0] += xd;
                pos[1] += yd;
                grid[pos[1] - miny][pos[0] - minx] = 1;
            }
        }
    }

    // draw floor
    for(let x = 0; x < grid[0].length; x++) {
        grid[grid.length - 1][x] = 1;
    }

    // start dropping sand
    let sandcount = 0;

    while(sandcount <= grid.length * grid[0].length) {
        const sandpos = [500, 0];
        let moved = true;
        while(moved) {
            moved = false;

            if (grid[sandpos[1] - miny + 1][sandpos[0] - minx] === 0) {
                sandpos[1]++;
                moved = true;
                continue;
            }

            if (grid[sandpos[1] - miny + 1][sandpos[0] - minx - 1] === 0) {
                sandpos[1]++;
                sandpos[0]--;
                moved = true;
                continue;
            }

            if (grid[sandpos[1] - miny + 1][sandpos[0] - minx + 1] === 0) {
                sandpos[1]++;
                sandpos[0]++;
                moved = true;
                continue;
            }

            if (sandpos[1] === 0) {
                d({ blocked: 'blocked' });
                // util.paint2D(grid);
                return sandcount + 1;
            }
        }

        grid[sandpos[1] - miny][sandpos[0] - minx] = 'o';
        sandcount++;
    }

    return sandcount;
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
    tags,
};

