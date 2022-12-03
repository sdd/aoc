const d = require('debug')('solution');
const _ = require('lodash');

const util = require('../../utils');
const imp = require('../../imp');
const parsers = require('../../parse');

// First example and expected answers for each part.
// Ignored if empty strings.
const ex1 = `7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1

22 13 17 11  0
 8  2 23  4 24
21  9 14 16  7
 6 10  3 18  5
 1 12 20 15 19

 3 15  0  2 22
 9 18 13 17  5
19  8  7 25 23
20 11 10 24  4
14 21 16 12  6

14 21 17 24  4
10 16 15  9 19
18  8 23 26 20
22 11 13  6  5
 2  0 12  3  7`;
const ex1expectedP1 = 4512;
const ex1expectedP2 = 1924;

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
    const callouts = comma;
    const boards = multi.slice(1).map(board => parsers.parseGrid(board));

    return { callouts, boards };
}

function part1({ callouts, boards }) {
    const called = new Set();
    const wasHeard = x => called.has(x);

    for(const current of callouts) {
        called.add(current);

        for(const board of boards) {
            let won = _.some(board, row => _.every(row, wasHeard));

            won = won || _.some(_.range(0, board[0].length), 
                col => _.every(board.map(row => row[col]), wasHeard)
            );

            if (won) {
                return current * _.sum(_.reject(_.flatten(board), wasHeard));
            }
        }
    }
}

function part2({ callouts, boards }) {
    const called = new Set();
    const wasHeard = x => called.has(x);
    const remainingBoards = new Set(_.range(0, boards.length));

    for(const current of callouts) {
        called.add(current);

        for(let bi = 0; bi < boards.length; bi++) {
            const board = boards[bi];

            let won = _.some(board, row => _.every(row, wasHeard));
            
            won = won || _.some(_.range(0, board[0].length), 
                col => _.every(board.map(row => row[col]), wasHeard)
            );

            if (won) {
                remainingBoards.delete(bi);
                if (remainingBoards.size === 0) {
                    return current * _.sum(_.reject(_.flatten(board), wasHeard));
                }
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

