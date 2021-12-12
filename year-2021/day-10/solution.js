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
 * @param {raw} raw unmodified input string from input-01.txt
 * @param {line} raw split on newlines, empty items removed, items trimmed
 * @param {comma} raw split on commas, empty items removed, items trimmed
 * @param {space} raw split on spaces, empty lines removed, items trimmed
 * @param {multi} raw, split on double newlines, empty items removed, split again on newlines, items trimmed
 */
function parse({ raw, line, comma, space, multi }) {
    return line.map(l => l.split(''));
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

