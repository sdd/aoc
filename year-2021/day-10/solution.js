/* eslint-disable default-case, no-continue, no-restricted-syntax */
const d = require('debug')('solution');
const _ = require('lodash');

const util = require('../../utils');
const imp = require('../../imp');
const parsers = require('../../parse');

// First example and expected answers for each part.
// Ignored if empty strings.
const ex1 = `[({(<(())[]>[[{[]{<()<>>
    [(()[<>])]({[<{<<[]>>(
    {([(<{}[<>[]}>{[]{[(<()>
    (((({<>}<{<{<>}{[]{[]{}
    [[<[([]))<([[{}[[()]]]
    [{[{({}]{}}([{[{{{}}([]
    {<[[]]>}<{[{[{[]{()[[[]
    [<(<(<(<{}))><([]([]()
    <{([([[(<>()){}]>(<<{{
    <{([{{}}[<[[[<>{}]]]>[]]`;
const ex1expectedP1 = 26397;
const ex1expectedP2 = 288957;

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

const OPENER_MAP = {
    ')': '(',
    ']': '[',
    '}': '{',
    '>': '<',
};

function part1(input) {
    const SCORE_MAP = {
        ')': 3,
        ']': 57,
        '}': 1197,
        '>': 25137,
    };

    let score = 0;
    outer: for (const line of input) {
        const stack = [];
        for (const char of line) {
            switch (char) {
                case '(':
                case '[':
                case '{':
                case '<':
                    stack.push(char);
                    break;

                case ')':
                case ']':
                case '}':
                case '>':
                    if (stack.pop() !== OPENER_MAP[char]) {
                        score += SCORE_MAP[char];
                        continue outer;
                    }
                    break;
            }
        }
    }

    return score;
}

function part2(input) {
    const incomplete = input.map(line => {
        const stack = [];
        for (const char of line) {
            switch (char) {
                case '(':
                case '[':
                case '{':
                case '<':
                    stack.push(char);
                    break;

                case ')':
                case ']':
                case '}':
                case '>':
                    if (stack.pop() !== OPENER_MAP[char]) {
                        return false;
                    }
                    break;
            }
        }
        return stack;
    })
    .filter(x => x);

    const SCORE_MAP = {
        '(': 1,
        '[': 2,
        '{': 3,
        '<': 4,
    };

    const linescores = incomplete.map(line => {
        let score = 0;
        line.reverse();
        for (const char of line) {
            score = (score * 5) + SCORE_MAP[char];
        }
        return score;
    });

    linescores.sort((a, b) => b - a);
    const mid = Math.floor(linescores.length / 2);
    return linescores[mid];
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

