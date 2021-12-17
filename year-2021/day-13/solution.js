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
    let [dots, folds] = multi;
    dots = dots.map(l => l.split(',').map(Number));

    folds = folds.map(l => {
        const frags = l.split(' ');
        const last = frags[frags.length - 1];
        const [axis, val] = last.split('=');
        return { axis, val: Number(val) };
    });

    const maxX = _.max(dots.map(dot => dot[0])) + 1;
    const maxY = _.max(dots.map(dot => dot[1])) + 1;

    const paper = util.array2D(maxY, maxX);

    for(const dot of dots) {
        paper[dot[1]][dot[0]] = 1;
    }

    return { paper, folds };
}

function part1({ paper, folds }) {
    paper = doFold(paper, folds[0]);

    return _.sum(_.flatten(paper));
}

function part2({ paper, folds }) {
    paper = folds.reduce(doFold, paper);

    util.paint2D(paper);
    return false;
}

function doFold(paper, { axis, val }) {
    let newPaper;
    
    if (axis === 'y') {
        newPaper = util.array2D(val, paper[0].length);

        const isEven = paper.length % 2 === 0;

        for(let y = (isEven ? 1 : 0); y < val; y++) {
            for(let x = 0; x < paper[0].length; x++) {
                newPaper[y][x] = paper[y][x]
                || paper[paper.length - y - (isEven ? 0 : 1)][x];
            }
        }
    } else {
        newPaper = util.array2D(paper.length, val);

        for(let y = 0; y < paper.length; y++) {
            for(let x = 0; x < val; x++) {
                newPaper[y][x] = paper[y][x]
                || paper[y][paper[0].length - x - 1];
            }
        }
    }

    return newPaper;
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

