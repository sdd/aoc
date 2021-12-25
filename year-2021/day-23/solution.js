/* eslint-disable complexity */
/* eslint-disable no-lonely-if */
const d = require('debug')('solution');
const _ = require('lodash');

const util = require('../../utils');
const imp = require('../../imp');
const parsers = require('../../parse');

// First example and expected answers for each part.
// Ignored if empty strings.
const ex1 = `#############
#...........#
###B#C#B#D###
..#A#D#C#A#..  
..#########..`;
// const ex1 = '';
const ex1expectedP1 = 12521;
const ex1expectedP2 = 44169;

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
    const map = lines.map(l => l.padEnd(13, ' ').split(''));
    const pos = [];
    let id = 1;
    for(let y = 0; y < map.length; y++) {
        for(let x = 0; x < map[0].length; x++) {
            if (map[y][x] !== '#' && map[y][x] !== '.') {
                if (map[y][x] === ' ') {
                    map[y][x] = '.';
                } else {
                    pos.push({ type: map[y][x], x, y, id: id++, cost: 0, moves: 0 });
                    map[y][x] = '.';
                }
            }
        }
    }

    return { map, pos, lines };
}

const AMPH_TO_DEST_MAP = {
    A: 3,
    B: 5,
    C: 7,
    D: 9,
}

const AMPH_TO_COST_MAP = {
    A: 1,
    B: 10,
    C: 100,
    D: 1000,
}

function part1(input) {
    return partx(input, 3);
}

function part2(input) {
    const lines = _.cloneDeep(input.lines);
    lines.splice(3, 0, '###D#C#B#A###', '###D#B#A#C###');

    const map = lines.map(l => l.padEnd(13, ' ').split(''));
    const pos = [];
    let id = 1;
    for(let y = 0; y < map.length; y++) {
        for(let x = 0; x < map[0].length; x++) {
            if (map[y][x] !== '#' && map[y][x] !== '.') {
                if (map[y][x] === ' ') {
                    map[y][x] = '.';
                } else {
                    pos.push({ type: map[y][x], x, y, id: id++, cost: 0, moves: 0 });
                    map[y][x] = '.';
                }
            }
        }
    }

    return partx({ map, pos });
}

function partx(input) {
    debugger; // eslint-disable-line no-debugger

    const { map } = input;
    const mapWidth = map[0].length;
    const initialState = _.cloneDeep(input.pos);
    let bestCost = Infinity;

    const stack = [initialState];
    let loops = 0;
    let moves = 0;
    let maxAtHome = 0;

    const seen = new Map();

    while (stack.length){
        loops++;
        if (loops % 100000 === 0) {
            // d('loop %d, stack length %d', loops, stack.length);
        }
        const currState = stack.pop();

        // sanity check
        for(let i = 0; i < currState.length - 1; i++) {
            if (currState[i].y < 1 || currState[i].y > input.length - 2 || (currState[i].y !== 1 && ![3, 5, 7, 9].includes(currState[i].x))) {
                d('a pod has gone out-of-bounds! %o', currState[i]);
                return false;
            }
            if (currState[i].moves > 2) {
                d('a pod has made more than 2 moves! %o', currState[i]);
                d('state: %o', currState);
                return false;
            }
            for(let j = i + 1; j < currState.length; j++) {
                if (currState[i].x === currState[j].x && currState[i].y === currState[j].y) {
                    d('two pods in the same square!, %o, %o', currState[i], currState[j]);
                    return false;
                }
            }
        }

        const numAtHome = countAtHome(currState);
        maxAtHome = Math.max(maxAtHome, numAtHome);
        if (numAtHome === currState.length) {
            // all at home! total up the move costs and keep if best
            const totalCost = _.sum(_.map(currState, 'cost'));
            if (totalCost < bestCost) {
                bestCost = totalCost;
                // d('new best cost: %d', bestCost);
            }
            // d('all home! totalCost=%d, bestCost=%d', totalCost, bestCost);
            continue;
        }

        for(const pod of currState) {
            if (podAtHome(pod, currState)) {
                // d('pod #%d (%s) home already, skipping', pod.id, pod.type);
                continue;
            }

            if (podBlocked(pod, currState)) {
                // d('pod #%d (%s) cant move, skipping', pod.id, pod.type);
                continue;
            }

            const cost = AMPH_TO_COST_MAP[pod.type];
            let dist;
            const possMoves = [];

            if (pod.y > 1) {
                // in room: can only move to non-room-blocking hallway positions and own room
                if (pathToHallClear(map, currState, pod)) {
                        // path to hallway is clear. evaluate possible moves left and right

                        // in corridor
                        let dx = -1;
                        while(pod.x + dx > 0 && squareIsEmpty(map, currState, pod.x + dx, 1)) {
                            // if not blocking a door
                            if (![3, 5, 7, 9].includes(pod.x + dx)) {
                                dist = pod.y - 1 + Math.abs(dx);
                                possMoves.push({ ...pod, y: 1, x: pod.x + dx, cost: pod.cost + (dist * cost), moves: pod.moves + 1 });
                                pod.moves === 2 && d('moving pod to the hallway a: from %o to %o', pod, possMoves[possMoves.length - 1]);
                            } else {
                                if (pod.x + dx === AMPH_TO_DEST_MAP[pod.type]) {
                                    // if we are blocking a door, is it our own?
                                    // is there a non-resident in here?
                                    if (nonResidentIn(currState, pod.x + dx)) {
                                        // invalid move
                                    } else {
                                        // move in
                                        if (canMoveIn(currState, pod)) {
                                            const lowestEmpty = getLowestEmpty(map, currState, pod.x + dx);
                                            if (lowestEmpty > 1) {
                                                dist = Math.abs(dx) + (lowestEmpty - 1) + pod.y - 1;
                                                possMoves.push({ ...pod, x: pod.x + dx, y: lowestEmpty, cost: pod.cost + (dist * cost), moves: pod.moves + 1 });
                                                pod.moves === 2 && d('moving pod home a: from %o to %o', pod, possMoves[possMoves.length - 1]);
                                            }
                                        } else {
                                            // d('blocked from moving home');
                                        }
                                    }
                                }
                            }
                            dx--;
                        }

                        dx = 1;
                        while(pod.x + dx < mapWidth - 1 && squareIsEmpty(map, currState, pod.x + dx, 1)) {
                            // if not blocking a door
                            if (![3, 5, 7, 9].includes(pod.x + dx)) {     
                                dist = pod.y - 1 + dx;
                                possMoves.push({ ...pod, y: 1, x: pod.x + dx, cost: pod.cost + (dist * cost), moves: pod.moves + 1});
                                pod.moves === 2 && d('moving pod to the hallway b: from %o to %o', pod, possMoves[possMoves.length - 1]);
                            } else {
                                if (pod.x + dx === AMPH_TO_DEST_MAP[pod.type]) {
                                    // if we are blocking a door, is it our own?
                                    // is there a non-resident in here?
                                    if (nonResidentIn(currState, pod.x + dx)) {
                                        // invalid move
                                    } else {
                                        // move in
                                        if (canMoveIn(currState, pod)) {
                                            const lowestEmpty = getLowestEmpty(map, currState, pod.x + dx);
                                            if (lowestEmpty > 1) {
                                                dist = Math.abs(dx) + (lowestEmpty - 1) + pod.y - 1;
                                                possMoves.push({ ...pod, x: pod.x + dx, y: lowestEmpty, cost: pod.cost + (dist * cost), moves: pod.moves + 1 });
                                                pod.moves === 2 && d('moving pod home b: from %o to %o', pod, possMoves[possMoves.length - 1]);
                                            }
                                        } else {
                                            // d('blocked from moving home');
                                        }
                                    }
                                }
                            }
                            dx++;
                        }
                    }
            } else {
                // in hallway: can only move to own room: only if nobody in way
                // and nobody incorrectly in that room
                if (canMoveIn(currState, pod)) {
                    const dir = AMPH_TO_DEST_MAP[pod.type] < pod.x ? -1 : 1;
                    let blocked = false;
                    let dx = dir;
                    while(pod.x + dx !== AMPH_TO_DEST_MAP[pod.type]) {
                        if (!squareIsEmpty(map, currState, pod.x + dx, 1)) {
                            blocked = true;
                        }
                        dx += dir;
                    }

                    if (!blocked) {
                        const lowestEmpty = getLowestEmpty(map, currState, AMPH_TO_DEST_MAP[pod.type]);
                        if (lowestEmpty > 1) {
                            dist = Math.abs(dx) + (lowestEmpty - 1);
                            possMoves.push({ ...pod, x: pod.x + dx, y: lowestEmpty, cost: pod.cost + (dist * cost), moves: pod.moves + 1 });
                            pod.moves === 2 && d('moving pod home c: from %o to %o', pod, possMoves[possMoves.length - 1]);
                        }
                    }
                }
            }

            const restOfState = currState.filter(p => (p.id !== pod.id));

            moves += possMoves.length;
            for (const possMove of possMoves) {
                const newState = [..._.cloneDeep(restOfState), possMove];

                const stateKey = JSON.stringify(newState.reduce((acc, p) => {
                    acc[p.id] = { x: p.x, y: p.y };
                    return acc;
                }, {}));

                const newCost = _.sum(_.map(newState, 'cost'));

                if (!seen.has(stateKey)) {
                    seen.set(stateKey, newCost);
                    stack.push(newState);
                } else {
                    const oldCost = seen.get(stateKey);
                    if (newCost < oldCost) {
                        seen.set(stateKey, newCost);
                        stack.push(newState);
                    }
                }
            }
        }
    }
    d('total loops: %d, total moves: %d, maxAtHome: %d', loops, moves, maxAtHome);

    return bestCost;
}

function squareIsEmpty(map, state, x, y) {
    for(const pod of state) {
        if (pod.x === x && pod.y === y) {
            return false;
        }
    }
    return true;
}

function pathToHallClear(map, state, pod) {
    let y = pod.y - 1;
    while(y > 1) {
        if (!squareIsEmpty(map, state, pod.x, y)) {
            return false;
        }
        y--;
    }
    return true;
}

function canMoveIn(state, pod) {
    return !_.some(state, p => (p.x === AMPH_TO_DEST_MAP[pod.type] && p.type !== pod.type));
}

function getLowestEmpty(map, state, x) {
    for(let y = map.length - 2; y > 1; y--) {
        if (squareIsEmpty(map, state, x, y)) {
            return y;
        }
    }
    return 1;
}

function nonResidentIn(state, xPos) {
    for(const pod of state) {
        if (pod.x === xPos && pod.x !== AMPH_TO_DEST_MAP[pod.type]) {
            return true;
        }
    }
    return false;
}

function podAtHome(pod, state) {
    if (pod.x !== AMPH_TO_DEST_MAP[pod.type]) {
        return false;
    }
    if (pod.y === 3) {
        return true;
    }
    if (pod.y === 1) {
        return false;
    }
    return !nonResidentIn(state, pod.x);
}

function countAtHome(state) {
    let count = 0;
    for(const pod of state) {
        if (pod.y !== 1 && pod.x === AMPH_TO_DEST_MAP[pod.type]) {
            count++;
        }
    }
    return count;
}

function podBlocked(pod, state) {
    if (pod.y !== 3) {
        return false;
    }
    
    for(const pod2 of state) {
        if (pod2.x === pod.x && pod2.y === 2) {
            return true;
        }
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

