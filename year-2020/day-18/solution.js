const d = require('debug')('solution');
const _ = require('lodash');

const util = require('../../utils');
const imp = require('../../imp');
const parsers = require('../../parse');

// First example and expected answers for each part.
// Ignored if empty strings.
const ex1 = `1 + 2 * 3 + 4 * 5 + 6`;
const ex1expectedP1 = 13632;
const ex1expectedP2 = ``;

// Seconf example and expected answers for each part.
// Ignored if empty strings.
const ex2 = ``;
const ex2expectedP1 = `51`;
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
    return line.map(l => l.replace(/ /gi, ''));
}

function part1(input) {
    function evaluate(string) {
        let pos = 0;
        let bracketStart = null;
        let bracketDepth = 0;

        let lVal = null;
        let operator = null;
        let rVal = null;

        while(pos < string.length) {
            let curr = string.charAt(pos);
            if (curr === '(') {
                bracketDepth++;
                if (bracketStart === null) {
                    bracketStart = pos;
                }
                pos++;
                continue;
            } else if (curr === ')') {
                bracketDepth--;
                if (bracketDepth === 0) {
                    let result = evaluate(string.slice(bracketStart + 1, pos));
                    if (lVal === null) {
                        lVal = result;
                    } else {
                        rVal = result;
                    }
                    bracketStart = null;
                } else {
                    pos++;
                    continue;
                }
            } else if (bracketDepth > 0) {
                pos++;
                continue;
            } else if (Number.isNaN(parseInt(curr))) {
                operator = curr;
            } else if (lVal === null) {
                lVal = parseInt(curr);
            } else {
                rVal = parseInt(curr);
            }

            if (lVal !== null && operator !== null && rVal !== null) {
                switch(operator) {
                    case '+':
                        lVal = lVal + rVal;
                        break;
                    case '*':
                        lVal = lVal * rVal;
                        break;

                    default:
                        console.log('broken');
                        return false;
                }
                operator = null;
                rVal = null;
            }
            pos++;
        }
        return lVal;
    }

    let res = input.map(l => evaluate(l));
    return _.sum(res);
}

function part2(input) {
    function evaluate(string) {
        let pos = 0;
        let bracketStart = null;
        let bracketDepth = 0;

        let lVal = null;
        let operator = null;
        let rVal = null;

        while(pos < string.length) {
            let curr = string.charAt(pos);
            if (curr === '(') {
                bracketDepth++;
                if (bracketStart === null) {
                    bracketStart = pos;
                }
                pos++;
                continue;
            } else if (curr === ')') {
                bracketDepth--;
                if (bracketDepth === 0) {
                    let result = evaluate(string.slice(bracketStart + 1, pos));
                    if (lVal === null) {
                        lVal = result;
                    } else {
                        rVal = result;
                    }
                    bracketStart = null;
                } else {
                    pos++;
                    continue;
                }
            } else if (bracketDepth > 0) {
                pos++;
                continue;
            } else if (Number.isNaN(parseInt(curr))) {
                operator = curr;

                // here's the difference for part 2
                if (operator === "*") {
                    rVal = evaluate(string.slice(pos+1));
                    pos = string.length - 1;
                }
                
            } else if (lVal === null) {
                lVal = parseInt(curr);
            } else {
                rVal = parseInt(curr);
            }

            if (lVal !== null && operator !== null && rVal !== null) {
                switch(operator) {
                    case '+':
                        lVal = lVal + rVal;
                        break;
                    case '*':
                        lVal = lVal * rVal;
                        break;

                    default:
                        console.log('broken');
                        return false;
                }
                operator = null;
                rVal = null;
            }
            pos++;
        }
        return lVal;
    }

    let res = input.map(l => evaluate(l));
    return _.sum(res);
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

