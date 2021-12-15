const _ = require('lodash');

function search(grid, start, end) {
    start.h = manhattan(start, end);
    const openQueue = [start];

    while (openQueue.length) {
        const current = openQueue.shift();

        if (current === end) {
            return pathTo(end);
        }
        current.closed = true;

        for (const neighbour of getNeighbours(grid, current)) {
            if (neighbour.closed) {
                continue;
            }

            const alreadyVisited = neighbour.visited;
            if (!neighbour.visited || current.g + neighbour.weight < neighbour.g) {
                neighbour.visited = true;
                neighbour.parent = current;
                neighbour.h = neighbour.h || manhattan(neighbour, end);
                neighbour.g = current.g + neighbour.weight;
                neighbour.f = neighbour.g + neighbour.h;
            }

            if (!alreadyVisited) {
                openQueue.splice(_.sortedIndexBy(openQueue, neighbour, 'f'), 0, neighbour);
            } else {
                openQueue.splice(_.findIndex(openQueue, x => x === neighbour), 1);
                openQueue.splice(_.sortedIndexBy(openQueue, neighbour, 'f'), 0, neighbour);
            }
        }
    }

    return false;
}

function pathTo(node) {
    let curr = node;
    const path = [];
    while (curr.parent) {
        path.unshift(curr);
        curr = curr.parent;
    }
    return path;
}

function getNeighbours(grid, { x, y }) {
    const neighbors = [];
    if (y > 0) {
        neighbors.push(grid[y - 1][x]);
    }
    if (y < grid.length - 1) {
        neighbors.push(grid[y + 1][x]);
    }
    if (x > 0) {
        neighbors.push(grid[y][x - 1]);
    }
    if (x < grid[0].length - 1) {
        neighbors.push(grid[y][x + 1]);
    }
    return neighbors;
}

function manhattan(a, b) {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

function createNode(x, y, weight) {
    return {
        x,
        y,
        weight,

        visited: false,
        closed: false,
        parent: null,

        f: 0,
        g: 0,
        h: 0,
    }
}

module.exports = {
    search,
    pathTo,
    getNeighbours,
    manhattan,
    createNode,
}