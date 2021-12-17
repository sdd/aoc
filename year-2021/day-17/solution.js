const d = require('debug')('solution');
const _ = require('lodash');

const util = require('../../utils');
const imp = require('../../imp');
const parsers = require('../../parse');

// First example and expected answers for each part.
// Ignored if empty strings.
const ex1 = `target area: x=20..30, y=-10..-5`;
const ex1expectedP1 = ``;
const ex1expectedP2 = ``;

// Second example and expected answers for each part.
// Ignored if empty strings.
const ex2 = `target area: x=281..311, y=-74..-54`;
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
    const [_, _2, xr, yr] = line[0].split(' ')

    // const [ xl, xh, yl, yh] = vals;

    let [xs, xe] = xr.split('..');
    xs = Number(xs.slice(2));
    xe = Number(xe.slice(0, -1));

    let [ys, ye] = yr.split('..');
    ys = Number(ys.slice(2));
    ye = Number(ye);

    return {xs, xe, ys, ye};
}

function part1({xs, xe, ys, ye}) {
    let maxYIntersect = Number.MIN_SAFE_INTEGER;
    for (let ix = 0; ix <= 100; ix++) {
        for (let iy = 0; iy <= 100; iy++) {
        
            let x = 0;
            let y = 0;
            let dx = ix;
            let dy = iy;
            let maxY = Number.MIN_SAFE_INTEGER;
            
            while(y > ys) {
                x += dx;
                y += dy;
                dx -= Math.sign(dx);
                dy -= 1;
                maxY = Math.max(maxY, y);

                if (x >= xs && x <= xe && y >= ys && y <= ye) {
                    // ('intersect! pos=(%d, %d), ix=%d, iy=%d, maxY=%d', x, y, ix, iy, maxY);
                    maxYIntersect = Math.max(maxYIntersect,maxY);
                }
            }

        }
    }
    
    return maxYIntersect;
}

function part2({xs, xe, ys, ye}) {
    let maxYIntersect = Number.MIN_SAFE_INTEGER;
    const intersectCount = new Set();
    for (let ix = 0; ix <= 1000; ix++) {
        for (let iy = -1000; iy <= 1000; iy++) {
        
            let x = 0;
            let y = 0;
            let dx = ix;
            let dy = iy;
            let maxY = Number.MIN_SAFE_INTEGER;

            while(y >= ys) {
                x += dx;
                y += dy;
                dx -= Math.sign(dx);
                dy -= 1;
                maxY = Math.max(maxY, y);

                if (x >= xs && x <= xe && y >= ys && y <= ye) {
                    intersectCount.add(`${ix}_${iy}`);
                    // d('intersect! pos=(%d, %d), ix=%d, iy=%d, maxY=%d', x, y, ix, iy, maxY);
                    maxYIntersect = Math.max(maxYIntersect,maxY);
                }
            }

        }
    }
    
    return intersectCount.size;
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

