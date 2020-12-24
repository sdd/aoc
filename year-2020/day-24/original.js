const d = require('debug')('solution');
const _ = require('lodash');

const util = require('../../utils');
const imp = require('../../imp');
const parsers = require('../../parse');

// First example and expected answers for each part.
// Ignored if empty strings.
const ex1 = `sesenwnenenewseeswwswswwnenewsewsw
neeenesenwnwwswnenewnwwsewnenwseswesw
seswneswswsenwwnwse
nwnwneseeswswnenewneswwnewseswneseene
swweswneswnenwsewnwneneseenw
eesenwseswswnenwswnwnwsewwnwsene
sewnenenenesenwsewnenwwwse
wenwwweseeeweswwwnwwe
wsweesenenewnwwnwsenewsenwwsesesenwne
neeswseenwwswnwswswnw
nenwswwsewswnenenewsenwsenwnesesenew
enewnwewneswsewnwswenweswnenwsenwsw
sweneswneswneneenwnewenewwneswswnese
swwesenesewenwneswnwwneseswwne
enesenwswwswneneswsenwnewswseenwsese
wnwnesenesenenwwnenwsewesewsesesew
nenewswnwewswnenesenwnesewesw
eneswnwswnwsenenwnwnwwseeswneewsenese
neswnwewnwnwseenwseesewsenwsweewe
wseweeenwnesenwwwswnew
`;
const ex1expectedP1 = 10;
const ex1expectedP2 = ``;

// Second example and expected answers for each part.
// Ignored if empty strings.
const ex2 = ``;
const ex2expectedP1 = 2;
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
    return line.map(l => {
        let res = [];
        while (l.length) {
            if (l.indexOf('ne') === 0) {
                res.push('ne');
                l = l.slice(2);
            } else if (l.indexOf('e') === 0) {
                res.push('e');
                l = l.slice(1);
            } else if (l.indexOf('se') === 0) {
                res.push('se');
                l = l.slice(2);
            } else if (l.indexOf('sw') === 0) {
                res.push('sw');
                l = l.slice(2);
            } else if (l.indexOf('w') === 0) {
                res.push('w');
                l = l.slice(1);
            } else if (l.indexOf('nw') === 0) {
                res.push('nw');
                l = l.slice(2);
            }
        }
        return res;
    })
}

const STEP_TO_DPOS = {
    ne: [1, -1],
    e: [1, 0],
    se: [0, 1],

    sw: [-1, 1],
    w: [-1, 0],
    nw: [0, -1],
}

function move(pos, step) {
    let dpos = STEP_TO_DPOS[step];
    return [pos[0] + dpos[0], pos[1] + dpos[1]];
}

function hashPos(pos) {
    return pos.join('_');
}

function common(input, blackList = new Set()) {
    input.forEach(line => {
        let pos = [0, 0];
        for (let step in line) pos = move(pos, step);
        let hash = hashPos(pos);
        if (blackList.has(hash)) {
            blackList.delete(hash);
        } else {
            blackList.add(hash);
        }
    })

    return blackList;
}

function part1(input) {
    return common(input).size;
}

function getAdjCount(world, x, y) {
    let count = 0;
    if (x < world.length - 1 && y >= 1) {
        count += world[x + 1][y - 1] ? 1 : 0;
    }
    if (x < world.length - 1) {
        count += world[x + 1][y] ? 1 : 0;
    }
    if (y < world[0].length - 1) {
        count += world[x][y + 1] ? 1 : 0;
    }

    if (x >= 1 && y < world[0].length - 1) {
        count += world[x - 1][y + 1] ? 1 : 0;
    }
    if (x >= 1) {
        count += world[x - 1][y] ? 1 : 0;
    }
    if (y >= 1) {
        count += world[x][y - 1] ? 1 : 0;
    }
    return count;
}

function part2(input) {
    let startList = common(input);
    let minx = 0;
    let miny = 0;
    let maxx = 0;
    let maxy = 0;

    for (let pos of startList) {
        pos = pos.split('_').map(Number);
        minx = Math.min(minx, pos[0]);
        maxx = Math.max(maxx, pos[0]);
        miny = Math.min(miny, pos[1]);
        maxy = Math.max(maxy, pos[1]);
    }

    minx -= 100;
    maxx += 100;
    miny -= 100;
    maxy += 100;

    let world = new Array(maxx - minx);
    for(let x = 0; x < world.length; x++) {
        world[x] = new Array(maxy - miny);
        for(let y = 0; y < world[0].length; y++) {
            world[x][y] = false;
        }
    }

    for (pos of startList) {
        pos = pos.split('_').map(Number);
        world[pos[0] - minx][pos[1] - miny] = true;
    }

    for(let i = 1; i <= 100; i++) {
        let nextWorld = new Array(maxx - minx);
        for(let x = 0; x < nextWorld.length; x++) {
            nextWorld[x] = new Array(maxy - miny)
        }

        for(let x = 0; x < world.length; x++) {
            for(let y = 0; y < world[0].length; y++) {
                let adjCount = getAdjCount(world, x, y);
                if (world[x][y] === true) {
                    if (adjCount === 0 || adjCount > 2) {
                        nextWorld[x][y] = false;
                    } else {
                        nextWorld[x][y] = true;
                    }
                } else {
                    if (adjCount === 2) {
                        nextWorld[x][y] = true;
                    } else {
                        nextWorld[x][y] = false;
                    }
                }
            }
        }
        world = nextWorld;
    }

    let count = 0;
    for(let x = 0; x < world.length; x++) {
        for(let y = 0; y < world[0].length; y++) {
            if (world[x][y]) {
                count++;
            }
        }
    }

    return count;
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

