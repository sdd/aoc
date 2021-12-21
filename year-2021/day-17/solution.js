const d = require('debug')('solution');
const _ = require('lodash');

const util = require('../../utils');
const imp = require('../../imp');
const parsers = require('../../parse');

// First example and expected answers for each part.
// Ignored if empty strings.
const ex1 = `target area: x=20..30, y=-10..-5`;
const ex1expectedP1 = 45;
const ex1expectedP2 = 112;

// Second example and expected answers for each part.
// Ignored if empty strings.
const ex2 = ``;
const ex2expectedP1 = '';
const ex2expectedP2 = '';

/**
 * Input parser.
 * @param {Object} arg collection of pre-parsed helpers
 * @param {string} arg.raw unmodified input string from input-01.txt
 * @param {Array<string>} arg.lines raw split on newlines, trimmed, empty filtered
 * @param {Array<string|Number>} arg.alphanums alphanumeric groups in lines[0]
 * @param {Array<Number>} arg.nums numeric values in lines[0]
 * @param {Array<string>} arg.comma split on commas, trimmed, empty filtered 
 * @param {Array<string>} arg.space split on spaces, trimmed, empty filtered
 * @param {Array<string>} arg.chars lines[0] split on each char
 * @param {Array<Array<string>} arg.multi split on double newlines, empty filtered, split again on newlines, trimmed
 * @param {Array<Array<string>} arg.grid 2D char grid
 */
 function parse({ raw, lines, alphanums, nums, comma, space, chars, multi, grid }) {
    return nums;
}

function part1([xs, xe, ys, ye]) {
    let maxYIntersect = -Infinity;

    for (let ix = 0; ix <= 100; ix++) {
        for (let iy = 0; iy <= 100; iy++) {
        
            let x = 0;
            let y = 0;
            let dx = ix;
            let dy = iy;
            let maxY = -Infinity;
            
            while(y > ys) {
                x += dx;
                y += dy;
                dx -= Math.sign(dx);
                dy -= 1;
                maxY = Math.max(maxY, y);

                if (x >= xs && x <= xe && y >= ys && y <= ye) {
                    maxYIntersect = Math.max(maxYIntersect, maxY);
                }
            }

        }
    }
    
    return maxYIntersect;
}

function part2([xs, xe, ys, ye]) {
    const intersectCount = new Set();

    for (let ix = 0; ix <= xe; ix++) {
        for (let iy = Math.min(ys, 0); iy <= 100; iy++) {
        
            let x = 0;
            let y = 0;
            let dx = ix;
            let dy = iy;

            while(y >= ys) {
                x += dx;
                y += dy;
                dx -= Math.sign(dx);
                dy -= 1;

                if (x >= xs && x <= xe && y >= ys && y <= ye) {
                    intersectCount.add(`${ix}_${iy}`);
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

