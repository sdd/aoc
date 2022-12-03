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

class Graph extends Map {
    addEdge(a, b) {
        if (!super.has(a)) {
            super.set(a, [b]);
        } else {
            super.set(a, [...super.get(a), b]);
        }
    }
}

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
    const edges = lines.map(parsers.splitNonAlphanum);

    const graph = new Graph();
    for (const [a, b] of edges) {
        if (b !== 'start') graph.addEdge(a, b);
        if (a !== 'start') graph.addEdge(b, a);
    }

    return graph;
}

function part1(input) {
    return partx(input, false);
}

function part2(input) {
    return partx(input, true);
}

function partx(graph, canSecondVisitOne = false) {
    let completePathCount = 0;

    const pathQueue = [['start']];
    while(pathQueue.length) {
        const currPath = pathQueue.pop();
        const currLoc = currPath[currPath.length - 1];

        if (currLoc === 'end') {
            completePathCount++;
        } else {
            for (const next of graph.get(currLoc)) {
                if (
                    next !== next.toLowerCase()
                    || !currPath.includes(next)
                    || (canSecondVisitOne && canSecondVisit(currPath, next))
                ) {
                    pathQueue.push([...currPath, next]);
                }
            }
        }
    }

    return completePathCount;
}

function canSecondVisit(currPath, next) {
    const lowerCaseVisited = currPath.filter(x => (
        x === x.toLowerCase() && x !== 'end' && x !== 'start'
    ));

    const visited = new Set();
    let haveDoubleVisited = false;

    for (const node of lowerCaseVisited) {
        if (!visited.has(node)) {
            visited.add(node);
        } else if (!haveDoubleVisited) {
            haveDoubleVisited = true;
        }
    }

    return !haveDoubleVisited || !visited.has(next);
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

