/* eslint-disable prefer-destructuring */
/* eslint-disable no-lonely-if */
/* eslint-disable no-else-return */
const d = require('debug')('solution');
const _ = require('lodash');

const combinations = require('combinations');
const util = require('../../utils');
const imp = require('../../imp');
const parsers = require('../../parse');


// First example and expected answers for each part.
// Ignored if empty strings.
const ex1 = `[[[0,[5,8]],[[1,7],[9,6]]],[[4,[1,2]],[[1,4],2]]]
[[[5,[2,8]],4],[5,[[9,9],0]]]
[6,[[[6,2],[5,6]],[[7,6],[4,7]]]]
[[[6,[0,7]],[0,9]],[4,[9,[9,0]]]]
[[[7,[6,4]],[3,[1,3]]],[[[5,5],1],9]]
[[6,[[7,3],[3,2]]],[[[3,8],[5,7]],4]]
[[[[5,4],[7,7]],8],[[8,3],8]]
[[9,3],[[9,9],[6,[4,9]]]]
[[2,[[7,7],7]],[[5,8],[[9,3],[0,2]]]]
[[[[5,2],5],[8,[3,7]]],[[5,[7,5]],[4,4]]]`;
const ex1expectedP1 = 4140;
const ex1expectedP2 = 3993;

// Second example and expected answers for each part.
// Ignored if empty strings.
const ex2 = ``;
const ex2expectedP1 = '';
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
    return lines.map(l => JSON.parse(l))
}

function part1(input) {
    const reduced = input.reduce((acc, seq) => sfReduce([acc, seq]));
    return magnitude(reduced);
}

function part2(input) {
    let maxMag = Number.MIN_SAFE_INTEGER;
    for(const a of _.range(0, input.length)) {
        for(const b of _.range(0, input.length)) {
            if (a === b) { continue; }

            const sumab = sfReduce([ input[a], input[b] ]);
            maxMag = Math.max(maxMag, magnitude(sumab));
        }
    }

    return maxMag;
}

function magnitude(item) {
    return Array.isArray(item) 
        ? (magnitude(item[0]) * 3) + (magnitude(item[1]) * 2)
        : item;
}

function sfReduce(seq) {
    let count = 1;
    let orig = seq;
    let result;

    while (++count < 600) { // arbitrary limit to prevent infinite loop in case of a bug
        result = explode(orig);

        if (JSON.stringify(result) === JSON.stringify(orig)) {
            // no explosion, check for split
            result = split(orig);
        }

        if (result === orig) {
            // no explosion or split. reduce complete.
            return result;
        } else {
            orig = result;
        }
    }
    d('LOOP LIMIT REACHED');
    return result;
}

function explode(seq) {
    return explodeInner(seq, 0)[1];
}

function explodeInner(seq, depth) {
    if (!Array.isArray(seq)) {
        return [null, seq, null];
    }
    
    const [left, right] = seq;
    if (depth === 3) {
        if (Array.isArray(left)) {
            // need to explode left item
            if (!Array.isArray(right)) {
                // simple case, just add to scalar
                return [left[0], [0, right + left[1]], null];
            } else {
                // explode left into overflow left and right item
                return [left[0], [0, addFromLeft(right, left[1])], null];
            }
            
        } else if (Array.isArray(right)) {
            // explode right into left and overflow right
            return [null, [left + right[0], 0], right[1]];

        } else {
            // two scalars, no explosion required
            return [null, seq, null];
        }
    }

    // check LHS for explosion
    const [leftPassedLeft, newLeft, leftPassedRight] = explodeInner(left, depth + 1);
    let rightPassedLeft = null;
    let newRight = right;
    let rightPassedRight = null;

    // only one explosion per action. only try right reduce if left didn't explode
    if (leftPassedLeft === null && leftPassedRight === null && JSON.stringify(left) === JSON.stringify(newLeft)) {
        // checking for RHS explosion
        ([rightPassedLeft, newRight, rightPassedRight] = explodeInner(right, depth + 1));
    }

    if (leftPassedRight === null) {
        if (rightPassedLeft === null) {
            // nothing doing
            return [leftPassedLeft, [newLeft, newRight], rightPassedRight];
        } else {
            // val passed from right to left
            if (!Array.isArray(newLeft)) {
                return [leftPassedLeft, [newLeft + rightPassedLeft, newRight], rightPassedRight];
            } else {
                return [leftPassedLeft, [addFromRight(newLeft, rightPassedLeft), newRight], rightPassedRight];
            }
        }
    } else {
        // val passed from left to right
        if (!Array.isArray(newRight)) {
            return [leftPassedLeft, [newLeft, newRight + leftPassedRight], rightPassedRight];
        } else {
            return [leftPassedLeft, [newLeft, addFromLeft(newRight, leftPassedRight)], rightPassedRight];
        }
    }
}

function addFromLeft(pair, val) {
    const [left, right] = pair;
    if (!Array.isArray(left)) {
        return [left + val, right];
    } else {
        return [addFromLeft(left, val), right];
    }
}

function addFromRight(pair, val) {
    const [left, right] = pair;
    if (!Array.isArray(right)) {
        return [left, right + val];
    } else {
        return [left, addFromRight(right, val)];
    }
}

function split(item) {
    if (!Array.isArray(item)) {
        // item is scalar
        if (item > 9) {
            // need to split it
            return [Math.floor(item / 2), Math.ceil(item / 2)];
        } else {
            // nothing doing
            return item;
        }
    } else {
        // item is a pair
        const [left, right] = item;
        const splitLeft = split(left);
        if (splitLeft !== left) {
            // there was a split in the left item
            return [splitLeft, right];
        } else {
            const splitRight = split(right);
            if (splitRight !== right) {
                // there was a split in the right item
                return [left, splitRight];
            } else {
                // nothing doing
                return item;
            }
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
};

