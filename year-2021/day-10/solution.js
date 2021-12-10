/* eslint-disable no-continue */
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

function part1(input) {
    let score = 0;
    // eslint-disable-next-line no-restricted-syntax
    outer: for (const line of input) {
        const stack = [];
        for (const char of line) {
            // eslint-disable-next-line default-case
            switch (char) {
                case '(':
                case '[':
                case '{':
                case '<':
                    stack.push(char);
                    break;

                case ')':
                    if (stack.pop() !== '(') {
                        score += 3;
                        continue outer;
                    }
                    break;

                case ']':
                    if (stack.pop() !== '[') {
                        score += 57;
                        continue outer;
                    }
                    break;

                case '}':
                    if (stack.pop() !== '{') {
                        score += 1197;
                        continue outer;
                    }
                    break;

                case '>':
                    if (stack.pop() !== '<') {
                        score += 25137;
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
            // eslint-disable-next-line default-case
            switch (char) {
                case '(':
                case '[':
                case '{':
                case '<':
                    stack.push(char);
                    break;

                case ')':
                    if (stack.pop() !== '(') {
                        return false;
                    }
                    break;

                case ']':
                    if (stack.pop() !== '[') {
                        return false;
                    }
                    break;

                case '}':
                    if (stack.pop() !== '{') {
                        return false;
                    }
                    break;

                case '>':
                    if (stack.pop() !== '<') {
                        return false;
                    }
                    break;
            }
        }
        return stack;
    })
        .filter(x => x);

    const linescores = incomplete.map(line => {
        let score = 0;
        line.reverse();
        for (const char of line) {
            // eslint-disable-next-line default-case
            switch (char) {
                case '(':
                    score = (score * 5) + 1;
                    break;
                case '[':
                    score = (score * 5) + 2;
                    break;
                case '{':
                    score = (score * 5) + 3;
                    break;
                case '<':
                    score = (score * 5) + 4;
                    break;
            }
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

