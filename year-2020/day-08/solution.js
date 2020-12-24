const d = require('debug')('solution');
const _ = require('lodash');

const util = require('../../utils');
const imp = require('../../imp');
const parsers = require('../../parse');

// First example and expected answers for each part.
// Ignored if empty strings.
const ex1 = ``;
const ex1expectedP1 = ``;
const ex1expectedP2 = ``;

// Seconf example and expected answers for each part.
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
    return line
    .map(l => {
        const [inst, op] = l.split(' ');
        return { inst, op: Number(op) };
    });
}

function part1(input) {
    let visited = new Set();

    let pc = 0;
    let acc = 0;
    while(true) {
        if (visited.has(pc)) {
            break;
        }
        if (pc === input.length) {
            return ['terminated', acc];
        }
        visited.add(pc);

        const { inst, op } = input[pc];
        switch (inst) {
            case 'nop':
                pc++;
                break;

            case 'acc':
                acc += op;
                pc++;
                break;

            case 'jmp':
                pc += op;
                break;
        }
    }

    return [ 'loop', acc ];
}

const mapInst = { 'nop': 'jmp', 'jmp': 'nop', 'acc': 'acc' };

function part2(input) {
    let editLoc = 0;
    while(editLoc <= input.length) {
        const { inst, op } = input[editLoc];
        const newInst = mapInst[inst];
        const newInput = [
            ...input.slice(0, editLoc),
            { inst: newInst, op },
            ...input.slice(editLoc + 1),
        ]

        const res = part1(newInput);
        if (res[0] === 'terminated') return res[1];
        editLoc++;
    }

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

