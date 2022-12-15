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
const ex1 = `Sensor at x=2, y=18: closest beacon is at x=-2, y=15
Sensor at x=9, y=16: closest beacon is at x=10, y=16
Sensor at x=13, y=2: closest beacon is at x=15, y=3
Sensor at x=12, y=14: closest beacon is at x=10, y=16
Sensor at x=10, y=20: closest beacon is at x=10, y=16
Sensor at x=14, y=17: closest beacon is at x=10, y=16
Sensor at x=8, y=7: closest beacon is at x=2, y=10
Sensor at x=2, y=0: closest beacon is at x=2, y=10
Sensor at x=0, y=11: closest beacon is at x=2, y=10
Sensor at x=20, y=14: closest beacon is at x=25, y=17
Sensor at x=17, y=20: closest beacon is at x=21, y=22
Sensor at x=16, y=7: closest beacon is at x=15, y=3
Sensor at x=14, y=3: closest beacon is at x=15, y=3
Sensor at x=20, y=1: closest beacon is at x=15, y=3`;
const ex1expectedP1 = 26;
const ex1expectedP2 = 56000011;

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
    return lines.map(x => util.ints(x));
}

function part1(input) {
    const qy = input.length < 20 ? 10 : 2000000;
    input = _.cloneDeep(input);

    // get limits
    let miny = 100000000;
    let maxy = -100000000;
    let minx = 100000000;
    let maxx = -100000000;
    const bpos = new Set();
    for(const line of input) {
        const [x, y, bx, by] = line;
        bpos.add(`${bx},${by}`);
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
        if (bx < minx) {
            minx = bx;
        }
        if (bx > maxx) {
            maxx = bx;
        }
        if (by < miny) {
            miny = by;
        }
        if (by > maxy) {
            maxy = by;
        }
    }
    d({ minx, maxx, miny, maxy });

    let count = 0;
    for(let x = minx - 1000000; x < maxx + 1000000; x++) {
        let poss = true;
        for(const line of input) {
            const [sx, sy, bx, by] = line;
            const bdist = Math.abs(sx - bx) + Math.abs(sy - by);
            const sqdist = Math.abs(sx - x) + Math.abs(sy - qy);

            if (bdist >= sqdist) {
                poss = false;
                break;
            }
        }
        if (!poss) {
            // d({ x });
            if (!bpos.has(`${x},${qy}`)) {
                count++;
            } else {
                d(`beacon clash: ${x}`);
            }
        }
    }
    
    return count;
}

function part2(input) {
    const maxxy = input.length < 20 ? 20 : 4000000;
    input = _.cloneDeep(input);

    for(let i = 0; i < input.length; i++) {
        d({ i });
        const [s1x, s1y, b1x, b1y] = input[i];
        const b1dist = Math.abs(s1x - b1x) + Math.abs(s1y - b1y);

        // TR diag
        let y = s1y - b1dist - 1;
        for(let x = s1x; x <= s1x + b1dist + 1; x++) {
            if (x < 0 || y < 0 || x > maxxy || y > maxxy) {
                y++;
                continue;
            }
            let poss = true;
            for(let j = 0; j < input.length; j++) {
                if (i===j) {
                    continue;
                }
                const [s2x, s2y, b2x, b2y] = input[j];
                const b2dist = Math.abs(s2x - b2x) + Math.abs(s2y - b2y);
                const sqdist = Math.abs(s2x - x) + Math.abs(s2y - y);

                if (b2dist >= sqdist) {
                    poss = false;
                    break;
                }
            }
            if (poss) {
                d({ x, y });
                return (x * 4000000) + y;
            }
            y++;
        }

        // BR diag
        y = s1y + b1dist + 1;
        for(let x = s1x; x <= s1x + b1dist + 1; x++) {
            if (x < 0 || y < 0 || x > maxxy || y > maxxy) {
                y--;
                continue;
            }
            let poss = true;
            for(let j = 0; j < input.length; j++) {
                if (i===j) {
                    continue;
                }
                const [s2x, s2y, b2x, b2y] = input[j];
                const b2dist = Math.abs(s2x - b2x) + Math.abs(s2y - b2y);
                const sqdist = Math.abs(s2x - x) + Math.abs(s2y - y);

                if (b2dist >= sqdist) {
                    poss = false;
                    break;
                }
            }
            if (poss) {
                d({ x, y });
                return (x * 4000000) + y;
            }
            y--;
        }

        // TL diag
        y = s1y - b1dist - 1;
        for(let x = s1x; x >= s1x - b1dist - 1; x--) {
            if (x < 0 || y < 0 || x > maxxy || y > maxxy) {
                y++;
                continue;
            }
            let poss = true;
            for(let j = 0; j < input.length; j++) {
                if (i===j) {
                    continue;
                }
                const [s2x, s2y, b2x, b2y] = input[j];
                const b2dist = Math.abs(s2x - b2x) + Math.abs(s2y - b2y);
                const sqdist = Math.abs(s2x - x) + Math.abs(s2y - y);

                if (b2dist >= sqdist) {
                    poss = false;
                    break;
                }
            }
            if (poss) {
                d({ x, y });
                return (x * 4000000) + y;
            }
            y++;
        }

        // BL diag
        y = s1y + b1dist + 1;
        for(let x = s1x; x >= s1x - b1dist - 1; x--) {
            if (x < 0 || y < 0 || x > maxxy || y > maxxy) {
                y--;
                continue;
            }
            let poss = true;
            for(let j = 0; j < input.length; j++) {
                if (i===j) {
                    continue;
                }
                const [s2x, s2y, b2x, b2y] = input[j];
                const b2dist = Math.abs(s2x - b2x) + Math.abs(s2y - b2y);
                const sqdist = Math.abs(s2x - x) + Math.abs(s2y - y);

                if (b2dist >= sqdist) {
                    poss = false;
                    break;
                }
            }
            if (poss) {
                d({ x, y });
                return (x * 4000000) + y;
            }
            y--;
        }
    }

    
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

