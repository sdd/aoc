const d = require('debug')('solution');
const _ = require('lodash');

const util = require('../../utils');
const imp = require('../../imp');
const parsers = require('../../parse');

// First example and expected answers for each part.
// Ignored if empty strings.
const ex1 = `Tile 2311:
..##.#..#.
##..#.....
#...##..#.
####.#...#
##.##.###.
##...#.###
.#.#.#..##
..#....#..
###...#.#.
..###..###

Tile 1951:
#.##...##.
#.####...#
.....#..##
#...######
.##.#....#
.###.#####
###.##.##.
.###....#.
..#.#..#.#
#...##.#..

Tile 1171:
####...##.
#..##.#..#
##.#..#.#.
.###.####.
..###.####
.##....##.
.#...####.
#.##.####.
####..#...
.....##...

Tile 1427:
###.##.#..
.#..#.##..
.#.##.#..#
#.#.#.##.#
....#...##
...##..##.
...#.#####
.#.####.#.
..#..###.#
..##.#..#.

Tile 1489:
##.#.#....
..##...#..
.##..##...
..#...#...
#####...#.
#..#.#.#.#
...#.#.#..
##.#...##.
..##.##.##
###.##.#..

Tile 2473:
#....####.
#..#.##...
#.##..#...
######.#.#
.#...#.#.#
.#########
.###.#..#.
########.#
##...##.#.
..###.#.#.

Tile 2971:
..#.#....#
#...###...
#.#.###...
##.##..#..
.#####..##
.#..####.#
#..#.#..#.
..####.###
..#.#.###.
...#.#.#.#

Tile 2729:
...#.#.#.#
####.#....
..#.#.....
....#..#.#
.##..##.#.
.#.####...
####.#.#..
##.####...
##..#.##..
#.##...##.

Tile 3079:
#.#.#####.
.#..######
..#.......
######....
####.#..#.
.#...#.##.
#.#####.##
..#.###...
..#.......
..#.###...`;
const ex1expectedP1 = 20899048083289;
const ex1expectedP2 = 273;

// Second example and expected answers for each part.
// Ignored if empty strings.
const ex2 = ``;
const ex2expectedP1 = ``;
const ex2expectedP2 = ``;

const SEA_MONSTER_RAW = `                  # 
#    ##    ##    ###
 #  #  #  #  #  #   `;

const SEA_MONSTER = SEA_MONSTER_RAW.split('\n').map(l => l.split('').map(x => x === '#'));

/**
 * Input parser.
 * @param {raw} raw unmodified input string from input-01.txt
 * @param {line} raw split on newlines, empty items removed, items trimmed
 * @param {comma} raw split on commas, empty items removed, items trimmed
 * @param {space} raw split on spaces, empty lines removed, items trimmed
 * @param {multi} raw, split on double newlines, empty items removed, split again on newlines, items trimmed
 */
function parse({ raw, line, comma, space, multi }) {
    return multi.filter(t => t.length > 1).map(block => {
        if (!block.length) { return []; }
        const [title, ...data] = block;
        const [id] = util.ints(title);
        return { id, data };
    });
}

function getTileSides(tile) {
    const top = tile.data[0];
    const bottomRev = tile.data[tile.data.length - 1];
    const right = tile.data.map(x => x[x.length - 1]).join('');
    const leftRev = tile.data.map(x => x[0]).join('');

    const topRev = top.split('').reverse().join('');
    const bottom = bottomRev.split('').reverse().join('');
    const rightRev = right.split('').reverse().join('');
    const left = leftRev.split('').reverse().join('');

    return [top, right, bottom, left, topRev, rightRev, bottomRev, leftRev].map(enumerateSide);
}

function enumerateSide(str) {
    let res = 0;
    for(let i = 0; i < str.length; i++) {
        if (str.charAt(i) === '#') res += (2**i);
    }
    return res;
}

function part1(input) {
    const tiles = input.map(tile => ({ ...tile, sides: getTileSides(tile) }));

    const tileSideMap = {};
    _.forEach(tiles, tile => {
        _.forEach(tile.sides, side => {
            if (tileSideMap[side] === undefined) {
                tileSideMap[side] = [tile.id];
            } else {
                tileSideMap[side].push(tile.id);
            }
        });
    });

    const matchCounts = tiles.map(({ id }) => {
        let count = 0;
        _.forEach(Object.entries(tileSideMap), ([sideId, tileIds]) => {
            if (tileIds.includes(id) && tileIds.length > 1) count++;
        });
        return ({ id, count });
    });

    const realCorners = matchCounts.filter(x => x.count === 4);
    return _.map(realCorners, 'id').reduce(_.multiply, 1);
}

function orientTile(tile, orientation) {
    const { id, data, normal = [], flipped = [] } = tile;

    let newData = [...data];

    const needToFlipHoriz = orientation >= 4;
    const rotations = orientation % 4;

    let newNorm = [...normal];
    let newFlipped = [ ...flipped ];

    if (needToFlipHoriz) {
        newNorm = [flipped[0], flipped[3], flipped[2], flipped[1]];
        newFlipped = [normal[0], normal[3], normal[2], normal[1]];
        newData = newData.map(row => (row.split ? row.split('').reverse() : row.reverse()));
    }

    let remainingRotations = rotations;
    while(remainingRotations) {
        newNorm = [newNorm[1], newNorm[2], newNorm[3], newNorm[0]];
        newFlipped = [newFlipped[1], newFlipped[2], newFlipped[3], newFlipped[0]];
        remainingRotations--;
    }

    // orient data
    const rotatedData = [];
    if (rotations === 0) {
        // don't rotate, but convert to 2d array still
        for(let r = 0; r < newData.length; r++) {
            rotatedData.push([]);
            for(let c = 0; c < newData.length; c++) {
                rotatedData[r].push(newData[r][c]);
            }
        }
    }
    if (rotations === 1) {
        // rotate data -90deg
        for(let r = 0; r < newData.length; r++) {
            rotatedData.push([]);
            for(let c = 0; c < newData.length; c++) {
                rotatedData[r].push(newData[c][newData.length - 1 - r]);
            }
        }

    } else if (rotations === 2) {
        // rotate data -180deg
        for(let r = 0; r < newData.length; r++) {
            rotatedData.push([]);
            for(let c = 0; c < newData.length; c++) {
                rotatedData[r].push(newData[newData.length - 1 - r][newData.length - 1 - c]);
            }
        }

    } else if (rotations === 3) {
        // rotate data 90deg
        for(let r = 0; r < newData.length; r++) {
            rotatedData.push([]);
            for(let c = 0; c < newData.length; c++) {
                rotatedData[r].push(newData[newData.length - 1 - c][r]);
            }
        }
    }
    newData = rotatedData;

    return { id, normal: newNorm, flipped: newFlipped, data: newData };
}

function matchOrientationToLeft(tile, keyToMatch) {
    if (keyToMatch === tile.normal[3]) {
        return 0;
    }
    if (keyToMatch === tile.normal[0]) {
        return 1;
    }
    if (keyToMatch === tile.normal[1]) {
        return 2;
    }
    if (keyToMatch === tile.normal[2]) {
        return 3;
    }
    if (keyToMatch === tile.flipped[0]) {
        return 5;
    }
    if (keyToMatch === tile.flipped[1]) {
        return 4;
    }
    if (keyToMatch === tile.flipped[2]) {
        return 7;
    }
    if (keyToMatch === tile.flipped[3]) {
        return 6;
    }

    d('doh');
}

function matchOrientationToTop(tile, keyToMatch) {
    if (keyToMatch === tile.normal[2]) {
        return 2;
    }
    if (keyToMatch === tile.normal[3]) {
        return 3;
    }
    if (keyToMatch === tile.normal[0]) {
        return 0;
    }
    if (keyToMatch === tile.normal[1]) {
        return 1;
    }
    if (keyToMatch === tile.flipped[0]) {
        return 4;
    }
    if (keyToMatch === tile.flipped[1]) {
        return 7;
    }
    if (keyToMatch === tile.flipped[2]) {
        return 6;
    }
    if (keyToMatch === tile.flipped[3]) {
        return 5;
    }

    d('doh');
}

function part2(input) {
    const tiles = input.map(tile => ({ ...tile, sides: getTileSides(tile) }));

    const tileMap = tiles.reduce((acc, tile) => {
        acc[tile.id] = tile;
        tile.normal = tile.sides.slice(0, 4);
        tile.flipped = tile.sides.slice(4, tile.sides.length);

        return acc;
    }, {});

    const tileSideMap = {};
    _.forEach(tiles, tile => {
        _.forEach(tile.sides, side => {
            if (tileSideMap[side] === undefined) {
                tileSideMap[side] = [tile.id];
            } else {
                tileSideMap[side].push(tile.id);
            }
        });
    });

    const matchCounts = tiles.map(({ id }) => {
        let count = 0;
        _.forEach(Object.values(tileSideMap), (tileIds) => {
            if (tileIds.includes(id) && tileIds.length > 1) count++;
        });
        return ({ id, count });
    });

    const matchCountsCountMap = {};
    matchCounts.forEach(({ count }) => {
        if (matchCountsCountMap[count] === undefined) {
            matchCountsCountMap[count] = 1;
        } else {
            matchCountsCountMap[count]++;
        }
    });

    // find the corners
    const cornerIds = matchCounts.filter(x => x.count === 4).map(x=>x.id);

    // create empty map
    const map = [];
    const mapSideLength = Math.sqrt(tiles.length);
    for(let r = 0; r < mapSideLength; r++) {
        map.push([]);
    }

    // lets number our orientations from 0 to 7:
    // 0: flip: no, rotate: 0 degrees
    // 1: flip: no, rotate: -90 degrees (top -> left)
    // 2: flip: no, rotate: 180 degrees (top -> bottom)
    // 3: flip: no, rotate: 90 degrees (top -> right)

    // 4: flip: horiz, rotate: 0 degrees (topRev -> top, right -> left?)
    // 5: flip: horiz, rotate: -90 degrees (topRev -> left, right -> top?)
    // 6: flip: horiz, rotate: 180 degrees (topRev -> bottom, right -> right?)
    // 7: flip: horiz, rotate: 90 degrees (topRev -> right right -> bottom?)

    // determine which 2 edges of the first corner piece should be
    // top and left. assume cornerId[0] is the non-flipped tile.
    const normCount = tileMap[cornerIds[0]].normal.map(sideId => tileSideMap[sideId].length);

    let orientation;
    for(let i = 0; i < 4; i++) {
        // if this orientation has the mismatched edges at the top and left,
        // we're good.
        if (normCount[i % 4] === 1 && normCount[(i+3) % 4] === 1) {
            orientation = i;
            break;
        }
    }

    // place the top left corner piece
    const oriented = orientTile(tileMap[cornerIds[0]], orientation);
    map[0][0] = { id: cornerIds[0], orientation, oriented, original: tileMap[cornerIds[0]] };

    // place middle of top row
    for(let r = 0; r < mapSideLength; r++) {
        if (r !== 0) {
            // place leftmost piece
            const tileToTop = tileMap[map[r-1][0].id];
            const tileToTopOriented = orientTile(tileToTop, map[r - 1][0].orientation);
            const keyToMatch = tileToTopOriented.flipped[2];
            const tileId = tileSideMap[keyToMatch].filter(i => i !== tileToTop.id)[0];

            const orientation = matchOrientationToTop(tileMap[tileId], keyToMatch);
            const oriented = orientTile(tileMap[tileId], orientation);
            map[r][0] = { id: tileId, orientation, oriented, original: tileMap[tileId] };
        }

        // place following pieces
        for(let c = 1; c < mapSideLength; c++) {
            const tileToLeft = tileMap[map[r][c - 1].id];
            const tileToLeftOriented = orientTile(tileToLeft, map[r][c - 1].orientation);
            const keyToMatch = tileToLeftOriented.flipped[1];
            const tileId = tileSideMap[keyToMatch].filter(i => i !== tileToLeft.id)[0];

            const orientation = matchOrientationToLeft(tileMap[tileId], keyToMatch);
            const oriented = orientTile(tileMap[tileId], orientation);
            map[r][c] = { id:tileId, orientation, oriented, original: tileMap[tileId] };
        }
    }

    d('map: %o', map.map(r => r.map(t => t.id)));

    const stitched = [];
    const tileWidth = map[0][0].oriented.data[0].length - 2;
    const tileHeight = map[0][0].oriented.data.length - 2;
    for(let r = 0; r < map.length * tileHeight; r++) {
        stitched.push([]);
        for(let c = 0; c < map[0].length * tileWidth; c++) {
            const mapTile = map[Math.floor(r / tileHeight)][Math.floor(c / tileWidth)];
            const cellContent = mapTile.oriented.data[1 + (r % tileWidth)][1 + (c % tileHeight)];
            stitched[r].push(cellContent);
        }
    }

    let smCount = 0;
    let bestSmCount = 0;
    let roughness = 0;

    // check stitched map for sea monsters
    for (let orientation = 0; orientation < 8; orientation++) {
        const newStitched = _.cloneDeep(stitched);
        const oStitched = orientTile({ data: newStitched }, orientation).data;
        smCount = 0;

        for(let r = 0; r <= oStitched.length - SEA_MONSTER.length; r++) {
            for(let c = 0; c <= oStitched[0].length - SEA_MONSTER[0].length; c++) {

                // checking coord [r][c];
                let smGood = true;
                outer: for(let smr = 0; smr < SEA_MONSTER.length; smr++) {
                    for(let smc = 0; smc < SEA_MONSTER[0].length; smc++) {
                        if (SEA_MONSTER[smr][smc] && oStitched[r + smr][c + smc] === '.') {
                            smGood = false;
                            break outer;
                        }
                    }
                }

                if (smGood) {
                    smCount++;
                    // paint 'O' where the monster was
                    for(let smr = 0; smr < SEA_MONSTER.length; smr++) {
                        for(let smc = 0; smc < SEA_MONSTER[0].length; smc++) {
                            if (SEA_MONSTER[smr][smc]) {
                                oStitched[r + smr][c + smc] = 'O';
                            }
                        }
                    }
                }
            }
        }
        d('orientation: %d, monster count: %d', orientation, smCount);
        if (smCount > bestSmCount) {
            bestSmCount = smCount;
            roughness = _.flattenDeep(oStitched).filter(x => x === '#').length;
        }
        if (smCount > 0) {
            // d('orientation: %d, monster count: %d', orientation, smCount);
            d('dimensions: %dw x %dh', oStitched[0].length, oStitched.length);
            util.paint2D(oStitched);
        }
    }

    return roughness;
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

