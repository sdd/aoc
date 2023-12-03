const d = require('debug')('solution');
const _ = require('lodash');

const util = require('../../utils');
const imp = require('../../imp');
const parsers = require('../../parse');
const sets = require('../../sets');
const maze = require('../../maze');

// add string tags here to help future categorization.
const tags = [];

// First example and expected answers for each part.
// Ignored if empty strings.
const ex1 = `467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..`;
const ex1expectedP1 = 4361;
const ex1expectedP2 = 467835;

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
    return grid;
}

function nextToSymbol(grid, r, c) {
    const maxR = grid.length - 1;
    const maxC = grid[0].length - 1;
    for(const [dr, dc] of maze.D8_TO_RCD) {
        if (r + dr >= 0 && r + dr <= maxR) {
            if (c + dc >= 0 && c + dc <= maxC) {
                const loc = grid[r + dr][c + dc];
                if (!Number.isInteger(loc) && loc !== '.') {
                    return true;
                }
            }
        }
    }

    return false;
}

function nextToGear(grid, r, c) {
    const maxR = grid.length - 1;
    const maxC = grid[0].length - 1;
    for(const [dr, dc] of maze.D8_TO_RCD) {
        if (r + dr >= 0 && r + dr <= maxR) {
            if (c + dc >= 0 && c + dc <= maxC) {
                const loc = grid[r + dr][c + dc];
                if (loc === '*') {
                    return `${r+dr}_${c+dc}`;
                }
            }
        }
    }

    return false;
}

function part1(input) {
    const partNumbers = [];
    let inANumber = false;
    let numberIsGood = false;
    let number = 0;

    for(let r= 0; r < input.length; r++) {
        const row = input[r];
        for(let c = 0; c < row.length; c++) {
            const char = row[c];
            if (!inANumber && Number.isInteger(char)) {
                inANumber = true;
                numberIsGood = nextToSymbol(input, r, c);
                number = char;
            } else if (inANumber) {
                if (Number.isInteger(char)) {
                    number *= 10;
                    number += char;
                    if (!numberIsGood) {
                        numberIsGood = nextToSymbol(input, r, c);
                    }
                }
                    
                if (!Number.isInteger(char) || c === row.length - 1) {
                    if (numberIsGood) {
                        partNumbers.push(number);
                    }
                    inANumber = false;
                    numberIsGood = false;
                    number = 0;
                }
            }
        }
    }

    return _.sum(partNumbers);
}

function part2(input) {
    const gearNumbers = {};
    let inANumber = false;
    let numberIsGear = null;
    let number = 0;

    for(let r= 0; r < input.length; r++) {
        const row = input[r];
        for(let c = 0; c < row.length; c++) {
            const char = row[c];
            if (!inANumber && Number.isInteger(char)) {
                inANumber = true;
                numberIsGear = nextToGear(input, r, c);
                number = char;
            } else if (inANumber) {
                if (Number.isInteger(char)) {
                    number *= 10;
                    number += char;
                    if (!numberIsGear) {
                        numberIsGear = nextToGear(input, r, c);
                    }
                }
                
                if (!Number.isInteger(char) || c === row.length - 1) {
                    if (numberIsGear) {
                        if (!gearNumbers[numberIsGear]) {
                            gearNumbers[numberIsGear] = [];
                        }
                        gearNumbers[numberIsGear].push(number)
                    }
                    inANumber = false;
                    numberIsGear = null;
                    number = 0;
                }
            }
        }
    }

    let sum = 0;
    for(const entry of Object.values(gearNumbers)) {
        if (entry.length === 2) {
            sum += (entry[0] * entry[1]);
        }
    }

    return sum;
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

