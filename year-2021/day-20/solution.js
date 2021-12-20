/* eslint-disable no-loop-func */
const d = require('debug')('solution');
const _ = require('lodash');

const util = require('../../utils');
const imp = require('../../imp');
const parsers = require('../../parse');

// First example and expected answers for each part.
// Ignored if empty strings.
const ex1 = `..#.#..#####.#.#.#.###.##.....###.##.#..###.####..#####..#....#..#..##..###..######.###...####..#..#####..##..#.#####...##.#.#..#.##..#.#......#.###.######.###.####...#.##.##..#..#..#####.....#.#....###..#.##......#.....#..#..#..##..#...##.######.####.####.#.#...#.......#..#.#.#...####.##.#......#..#...##.#.##..#...##.#.##..###.#......#.#.......#.#.#.####.###.##...#.....####.#..#..#.##.#....##..#.####....##...##..#...#......#.#.......#.......##..####..#...#.#.#...##..#.#..###..#####........#..####......#..#

#..#.
#....
##..#
..#..
..###
`;
const ex1expectedP1 = 35;
const ex1expectedP2 = 3351;

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
    const enhancement = lines[0].split('');
    const map = lines.slice(1).map(l => l.split(''));
    
    return { enhancement, map };
}

const POSITIONS = [
    [-1, -1],
    [0, -1],
    [1, -1],
    [-1, 0],
    [0, 0],
    [1, 0],
    [-1, 1],
    [0, 1],
    [1, 1],
]

function part1(input) {
    return partx(input, 2);
}

function part2(input) {
    return partx(input, 50);
}

function partx(input, steps) {
    let map = _.cloneDeep(input.map);

    const h = map.length;
    const w = map[0].length;

    const b = 2;
    // add a buffer to the outside
    let newMap = util.array2D(w + b*2, h + b*2, (y, x) => {
        if (y - b < 0 || x - b < 0 || y - b >= h || x - b >= w) {
            return '.';
        }
        return map[y - b][x - b];
    });
    map = newMap;

    for(let step = 1; step <= steps; step++) {

        // expand the map
        newMap = util.array2D(map[0].length + 2, map.length + 2, (y, x) => {
            if (y - 1 < 0 || x - 1 < 0 || y - 1 >= map.length || x - 1 >= map[0].length) {
                return '.';
            }
            return map[y - 1][x - 1];
        })
        map = newMap;

        // "enhance" the image
        newMap = _.cloneDeep(map);
        for(let y = 1; y < newMap.length - 1; y++) {
            for(let x = 1; x < newMap[0].length - 1; x++) {
                let bitString = '';
                for(const pos of POSITIONS) {
                    bitString += map[y + pos[1]][x + pos[0]] === '#' ? '1' : '0';
                }
                const index = parseInt(bitString, 2);
                const result = input.enhancement[index];
                newMap[y][x] = result;
            }
        }
        map = newMap;

        // clean up the border
        const borderPixel = map[2][2];
        for(let x = 0; x < map[0].length; x++) {
            map[0][x] = borderPixel;
            map[1][x] = borderPixel;
            map[map.length - 1][x] = borderPixel;
            map[map.length - 2][x] = borderPixel;
        };

        for(let y = 0; y < map.length; y++) {
            map[y][0] = borderPixel;
            map[y][1] = borderPixel;
            map[y][map[0].length - 1] = borderPixel;
            map[y][map[0].length - 2] = borderPixel;
        };

        // console.log(`step ${  step}`);
        // util.paint2DCorner(map, 20);
        // console.log(' ');
    }

    let count = 0;
    for(let y = 0; y < map.length; y++) {
        for(let x = 0; x < map[0].length; x++) {
            if (map[y][x] === '#') {
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
