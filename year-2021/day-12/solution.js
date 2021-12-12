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

function parse({ raw, line, comma, space, multi }) {
    const edges = line.map(l => l.split('-'));

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
    const lowerCaseVisited = currPath.filter(
        x => (x === x.toLowerCase() && x !== 'end' && x !== 'start')
    );

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

