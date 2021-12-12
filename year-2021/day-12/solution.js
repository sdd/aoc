const d = require('debug')('solution');
const _ = require('lodash');

const util = require('../../utils');
const imp = require('../../imp');
const parsers = require('../../parse');

// First example and expected answers for each part.
// Ignored if empty strings.
const ex1 = `start-A
start-b
A-c
A-b
b-d
A-end
b-end`;
const ex1expectedP1 = 10;
const ex1expectedP2 = 36;

// Second example and expected answers for each part.
// Ignored if empty strings.
const ex2 = `fs-end
he-DX
fs-he
start-DX
pj-DX
end-zg
zg-sl
zg-pj
pj-he
RW-he
fs-DX
pj-RW
zg-RW
start-pj
he-WI
zg-he
pj-fs
start-RW`;
const ex2expectedP1 = 226;
const ex2expectedP2 = 3509;

/**
 * Input parser.
 * @param {raw} raw unmodified input string from input-01.txt
 * @param {line} raw split on newlines, empty items removed, items trimmed
 * @param {comma} raw split on commas, empty items removed, items trimmed
 * @param {space} raw split on spaces, empty lines removed, items trimmed
 * @param {multi} raw, split on double newlines, empty items removed, split again on newlines, items trimmed
 */
function parse({ raw, line, comma, space, multi }) {
    const lines = line.map(l => l.split('-'));

    const lineMap = new Map();
    for (const [start, end] of lines) {
        if (end !== 'start') {
            if (!lineMap.has(start)) {
                lineMap.set(start, [end]);
            } else {
                lineMap.set(start, [...lineMap.get(start), end]);
            }
        }

        if (start !== 'start') {
            if (!lineMap.has(end)) {
                lineMap.set(end, [start]);
            } else {
                lineMap.set(end, [...lineMap.get(end), start]);
            }
        }
    }

    return lineMap;
}

function part1(input) {
    return partx(input, false);
}

function part2(input) {
    return partx(input, true);
}

function partx(graph, canSecondVisitOne = false) {
    const completePaths = [];

    const inProgPaths = [['start']];
    while(inProgPaths.length) {
        const currPath = inProgPaths.pop();
        const currLoc = currPath[currPath.length - 1];

        if (currLoc === 'end') {
            completePaths.push(currPath);
        } else {
            for (const possNext of graph.get(currLoc)) {
                if (
                    possNext !== possNext.toLowerCase()
                    || !currPath.includes(possNext)
                    || (canSecondVisitOne && canSecondVisit(currPath, possNext))
                ) {
                    inProgPaths.push([...currPath, possNext]);
                }
            }
        }
    }

    return completePaths.length;
}

function canSecondVisit(currPath, possNext) {
    const lowerVisits = currPath.filter(
        x => (x === x.toLowerCase() && x !== 'end' && x !== 'start')
    );

    const visited = new Set();
    let doubled = false;

    for (const v of lowerVisits) {
        if (!visited.has(v)) {
            visited.add(v);
        } else if (!doubled) {
            doubled = true;
        } else {
            console.log('NOOOOOOOOOOOOOOOOOOOOOOOO')
            return false;
        }
    }

    return !doubled || !visited.has(possNext);
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

