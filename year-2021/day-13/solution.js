const d = require('debug')('solution');
const _ = require('lodash');

const util = require('../../utils');
const imp = require('../../imp');
const parsers = require('../../parse');

// First example and expected answers for each part.
// Ignored if empty strings.
const ex1 = `6,10
0,14
9,10
0,3
10,4
4,11
6,0
6,12
4,1
0,13
10,12
3,4
3,0
8,4
1,10
2,14
8,10
9,0

fold along y=7
fold along x=5`;
const ex1expectedP1 = 17;
const ex1expectedP2 = ``;

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
    let [dots, folds] = multi;
    dots = dots.map(l => l.split(',').map(Number));

    folds = folds.map(l => {
        const frags = l.split(' ');
        const last = frags[frags.length - 1];
        const [axis, val] = last.split('=');
        return { axis, val: Number(val) };
    })

    return { dots, folds };
}

function part1({ dots, folds }) {
    const maxX = _.max(dots.map(dot => dot[0])) + 1;
    const maxY = _.max(dots.map(dot => dot[1])) + 1;

    const paper = util.array2D(maxY, maxX);
    for(const dot of dots) {
        paper[dot[1]][dot[0]] = '#';
    }

    const { axis, val } = folds[0];
    let newPaper;
    if (axis === 'y') {
        newPaper = util.array2D(val + 1, paper[0].length);

        for(let y = 0; y < val; y++) {
            for(let x = 0; x < paper[0].length; x++) {
                newPaper[y][x] = paper[y][x];
            }
        }
        for(let yo = val, yn = val; yo < paper.length; yo++, yn--) {
            for(let x = 0; x < paper[0].length; x++) {
                newPaper[yn][x] = newPaper[yn][x] || paper[yo][x];
            }
        }
    } else if (axis === 'x') {
        newPaper = util.array2D(paper.length, val + 1);

        for(let y = 0; y < paper.length; y++) {
            for(let x = 0; x < val; x++) {
                newPaper[y][x] = paper[y][x];
            }
        }
        for(let y = 0; y < paper.length; y++) {
            for(let xo = val, xn = val; xo < paper[0].length; xo++, xn--) {
                newPaper[y][xn] = newPaper[y][xn] || paper[y][xo];
            }
        }
    }

    let count = 0;
    for(let y = 0; y < newPaper.length; y++) {
        for(let x = 0; x < newPaper[0].length; x++) {
            if (newPaper[y][x]) { count++; }
        }
    }

    return count;
}

function part2({ dots, folds }) {
    const maxX = _.max(dots.map(dot => dot[0])) + 1;
    const maxY = _.max(dots.map(dot => dot[1])) + 1;

    let paper = util.array2D(maxY, maxX);
    for(const dot of dots) {
        paper[dot[1]][dot[0]] = '#';
    }
    let newPaper;
    
    for (const fold of folds) {
        const { axis, val } = fold;
        if (axis === 'y') {
            const overlap = Math.min(0, paper.length - (2 * val) + 1);
            newPaper = util.array2D(val - overlap, paper[0].length);

            for(let y = 0; y < val; y++) {
                for(let x = 0; x < paper[0].length; x++) {
                    newPaper[y - overlap][x] = paper[y][x];
                }
            }

            for(let yo = val + 1, yn = newPaper.length - 1; yo < paper.length && yn >= 0; yo++, yn--) {
                for(let x = 0; x < paper[0].length; x++) {
                    newPaper[yn][x] = newPaper[yn][x] || paper[yo][x];
                }
            }
        } else if (axis === 'x') {
            const overlap = Math.min(0, paper[0].length - (2 * val) + 1);
            newPaper = util.array2D(paper.length, val - overlap);

            for(let y = 0; y < paper.length; y++) {
                for(let x = 0; x < val; x++) {
                    newPaper[y][x - overlap] = paper[y][x];
                }
            }

            for(let y = 0; y < paper.length; y++) {
                for(let xo = val + 1, xn = newPaper[0].length - 1; xo < paper[0].length && xn >= 0; xo++, xn--) {
                    newPaper[y][xn] = newPaper[y][xn] || paper[y][xo];
                }
            }
        }
        paper = newPaper;
    }
    util.paint2D(newPaper);

    return false;
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

