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

const DIRHEX_TO_DPOS6 = {
    ne: [1, -1],
    e: [1, 0],
    se: [0, 1],

    sw: [-1, 1],
    w: [-1, 0],
    nw: [0, -1],
}

function move(pos, step) {
    let dpos = DIRHEX_TO_DPOS6[step];
    return [pos[0] + dpos[0], pos[1] + dpos[1]];
}

function hashPos(pos) {
    return pos.join('_');
}

function common(input, blackList = new Set()) {
    input.forEach(line => {
        let pos = [0, 0];
        for (let step of line) pos = move(pos, step);
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

const MAP_ADJ_TO_NEXT = {
    0: [0, 0, 1, 0, 0, 0, 0],
    1: [0, 1, 1, 0, 0, 0, 0],
};

function part2(input) {
    let startList = common(input);
    let minx = -100;
    let miny = -100;
    let maxx = 100;
    let maxy = 100;

    for (let pos of startList) {
        pos = pos.split('_').map(Number);
        minx = Math.min(minx, pos[0] - 100);
        maxx = Math.max(maxx, pos[0] + 100);
        miny = Math.min(miny, pos[1] - 100);
        maxy = Math.max(maxy, pos[1] + 100);
    }

    let world = util.array2D(maxx - minx, maxy - miny);

    for (pos of startList) {
        pos = pos.split('_').map(Number);
        world[pos[0] - minx][pos[1] - miny] = 1;
    }

    world = util.conwaySteps(world, util.adjCountHex, MAP_ADJ_TO_NEXT, 100);

    return util.arrayCount(world, 1);
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

