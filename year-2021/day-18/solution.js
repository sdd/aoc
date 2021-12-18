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


    const reduced = input.reduce((acc, seq) => {
        const res = sfReduce([acc, seq]);
        // console.log(`REDUCE OUTER STEP:${JSON.stringify(res)}`);
        return res;
    });

    console.log(`FINAL: ${  JSON.stringify(reduced)}`);

    // const sum = reduced.reduce((acc, seq) => sfadd(acc, seq));

    // const mags = reduced.map(seq => calcMag(seq));

    return magnitude(reduced);
    // return _.sum(mags);
}

function part2(input) {

    let maxMag = Number.MIN_SAFE_INTEGER;
    for(const a of _.range(0, input.length)) {
        console.log(`a=${  a}`);
        for(const b of _.range(0, input.length)) {
            if (a === b) {
                continue;
            }

            const sumab = sfReduce([ input[a], input[b] ]);
            maxMag = Math.max(maxMag, magnitude(sumab));
        }
    }

    return maxMag;
}

function magnitude(item) {
    if (!Array.isArray(item)) {
        return item;
    } else {
        return (magnitude(item[0]) * 3) + (magnitude(item[1]) * 2);
    }
}

function sfReduce(seq) {
    let count = 1;
    let orig = seq;
    let result;
    while (true) {
        result = sfReduceStep(orig)[1];

        if (JSON.stringify(result) === JSON.stringify(orig)) {
            // d('no explosion, check for split');
            result = splitOuter(orig);
            if (JSON.stringify(result) === JSON.stringify(orig)) {
                // d('no split either');
            } else {
                // d('split occurred');
            }
        } else {
            // d('explosion occurred');
        }

        // d('STEP %s RESULT: %o', count, JSON.stringify(result));

        count++;
        if (count > 400) {
            d('RECURSE LIMIT REACHED');
            return result;
        }
        if (JSON.stringify(result) === JSON.stringify(orig)) {
            return result;
        } else {
            orig = result;
        }
    }
}

function sfReduceStep(seq, depth = 0) {
    if (!Array.isArray(seq)) {
        // d('reached a scalar');
        return [null, seq, null];
    }
    
    const [left, right] = seq;
    // d('checking depth %d items: left=%o, right=%o', depth, left, right);
    if (depth === 3) {
        if (Array.isArray(left)) {
            // need to explode left item
            // d('need to explode the left item (%o)', left);

            if (!Array.isArray(right)) {
                // simple case, just add to scalar
                // d('simple explode of left (%o) where right is scalar', left);
                return [left[0], [0, right + left[1]], null];
            } else {
                // d('explode left into right: %o', left);
                return [left[0], [0, addFromLeft(right, left[1])], null];
            }
            
        } else if (Array.isArray(right)) {
            // d('simple explode of right (%o) where left is scalar', right);
            // need to explode right item only, add to scalar in left
            return [null, [left + right[0], 0], right[1]];

        } else {
            // d('no explosion needed');
            // two scalars, no explosion required
            return [null, seq, null];
        }
    }


    const [leftPassedLeft, newLeft, leftPassedRight] = sfReduceStep(left, depth + 1);
    let rightPassedLeft = null;
    let newRight = right;
    let rightPassedRight = null;

    // only one explosion per action. only try right reduce if left didn't explode
    if (leftPassedLeft === null && leftPassedRight === null && JSON.stringify(left) === JSON.stringify(newLeft)) {
        // d('checking for RHS explosion');
        ([rightPassedLeft, newRight, rightPassedRight] = sfReduceStep(right, depth + 1));
    }

    // d('post-attempt-explodes: %o', {leftPassedLeft, newLeft, leftPassedRight, rightPassedLeft, newRight, rightPassedRight })

    if (leftPassedRight === null) {
        if (rightPassedLeft === null) {
            if (JSON.stringify(left) === JSON.stringify(newLeft) && JSON.stringify(right) === JSON.stringify(newRight)) {
                // simple case: nothing blew up.
                // check for splits.

                return [leftPassedLeft, [newLeft, newRight], rightPassedRight];
            } else {
                // explosion happened but no passing between left and right
                // d('explosion but no intra passing: %o. outers: ', [leftPassedLeft, rightPassedRight]);
                return [leftPassedLeft, [newLeft, newRight], rightPassedRight];
            }
        } else {
            // left was ok but val passed from right to left
            if (!Array.isArray(newLeft)) {
                // easy case, just add
                return [leftPassedLeft, [newLeft + rightPassedLeft, newRight], rightPassedRight];
            } else {
                // d('need to pass %o from right to left (%o)', rightPassedLeft, newLeft);
                return [leftPassedLeft, [addFromRight(newLeft, rightPassedLeft), newRight], rightPassedRight];
            }
        }
    } else {
        if (rightPassedLeft === null) {
            // right was ok but val passed from left to right
            if (!Array.isArray(newRight)) {
                return [leftPassedLeft, [newLeft, newRight + leftPassedRight], rightPassedRight];
            } else {
                // d('need to pass %o from left to right (%o)', leftPassedRight, newRight);
                const result = [leftPassedLeft, [newLeft, addFromLeft(newRight, leftPassedRight)], rightPassedRight];
                // d('result of pass was %o', result)
                return result;
            }
        } else {
            // crazy, val passed from left to right and right to left? don't think this can actually happen
            if (!Array.isArray(newRight) && !Array.isArray(newLeft)) {
                d('unexpected but handlable left-right pass');
                return [leftPassedLeft, [newLeft + leftPassedRight, newRight + leftPassedRight], rightPassedRight];
            } else {
                d('crazy left-right array-array pass');
                return [leftPassedLeft, [addFromRight(newLeft, rightPassedLeft), addFromLeft(newRight, leftPassedRight)], rightPassedRight];
            }
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

function splitOuter(orig) {
    const [left, right] = orig;

    const splitLeft = split(left);
    if (splitLeft !== left) {
        // d('left was split: %o', [splitLeft, right]);
        return [splitLeft, right];
    } else {
        const splitRight = split(right);
        if (splitRight !== right) {
            // d('right was split: %o', [left, splitRight]);
            return [left, splitRight];
        } else {
            // d('no split');
            return orig;
        }
    }
}

function split(item) {
    // console.log(`split ${  item  }:`);
    if (!Array.isArray(item)) {
        if (item > 9) {
            // console.log(`splitting ${  item}`);
            return [Math.floor(item / 2), Math.ceil(item / 2)];
        } else {
            // console.log(`not splitting ${  item}`);
            return item;
        }
    } else {
        const [left, right] = item;
        const splitLeft = split(left);
        if (splitLeft !== left) {
            // console.log(`${left  }was split into ${  splitLeft}`);
            return [splitLeft, right];
        } else {
            const splitRight = split(right);
            if (splitRight !== right) {
                // console.log(`${right  }was split into ${  splitRight}`);
                return [left, splitRight];
            } else {
                // console.log(`not splitting ${  item}`);
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

