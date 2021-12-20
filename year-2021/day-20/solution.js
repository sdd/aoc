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
    // d('input: %O', input);
    let map = _.cloneDeep(input.map);
    // console.log('initial');
    // util.paint2D(map);

    // d('map: %O', map);

    const oldH = map.length;
    const oldW = map[0].length;

    const newMap = util.array2D(oldW + 20, oldH + 20, (y, x) => {
        if (y - 10 < 0 || x - 10 < 0 || y - 10 >= oldH || x - 10 >= oldW) {
            return '.';
        }
        // console.log({x, y, oldx: x - 3, oldy: y - 3});
        return map[y - 10][x - 10];
    });
    map = newMap;

    // console.log('initial expanded');
    // util.paint2D(map);

    for(let step = 1; step <= 2; step++) {
        const oldH = map.length;
        const oldW = map[0].length;

        let newMap = util.array2D(oldW + 2, oldH + 2, (y, x) => {
            if (y - 1 < 0 || x - 1 < 0 || y - 1 >= oldH || x - 1 >= oldW) {
                return '.';
            }
            return map[y - 1][x - 1];
        })

        // util.paint2D(newMap);
        // console.log('');
        // map = newMap;

        newMap = _.cloneDeep(map);
        for(let y = 1; y < newMap.length - 1; y++) {
            for(let x = 1; x < newMap[0].length - 1; x++) {
                let bitString = '';
                for(const pos of POSITIONS) {
                    bitString += map[y + pos[1]][x + pos[0]] === '#' ? '1' : '0';
                }
                const index = parseInt(bitString, 2);
                const result = input.enhancement[index];
                // d('x=%d,y=%d: bitString = %s, index=%d, result=%s', x, y, bitString, index, result);


                newMap[y][x] = result;
            }
        }

        console.log(`after step ${  step}`);
        util.paint2D(newMap);
        console.log('');
        map = newMap;

    }

    map[5][5] = 'S';
    map[map.length - 5][map[0].length - 5] = 'E';
    util.paint2D(map);

    let count = 0;
    for(let y = 5; y < map.length - 5; y++) {
        for(let x = 5; x < map[0].length- 5; x++) {
            if (map[y][x] === '#') {
                count++;
            }
        }
    }

    return count;
}

function part2(input) {
    // d('input: %O', input);
    let map = _.cloneDeep(input.map);
    // console.log('initial');
    // util.paint2D(map);

    // d('map: %O', map);

    const oldH = map.length;
    const oldW = map[0].length;

    const newMap = util.array2D(oldW + 20, oldH + 20, (y, x) => {
        if (y - 10 < 0 || x - 10 < 0 || y - 10 >= oldH || x - 10 >= oldW) {
            return '.';
        }
        // console.log({x, y, oldx: x - 3, oldy: y - 3});
        return map[y - 10][x - 10];
    });
    map = newMap;

    // console.log('initial expanded');
    // util.paint2D(map);

    for(let step = 1; step <= 50; step++) {
        const oldH = map.length;
        const oldW = map[0].length;

        let newMap = util.array2D(oldW + 2, oldH + 2, (y, x) => {
            if (y - 1 < 0 || x - 1 < 0 || y - 1 >= oldH || x - 1 >= oldW) {
                return '.';
            }
            return map[y - 1][x - 1];
        })

        // util.paint2D(newMap);
        // console.log('');
        map = newMap;

        newMap = _.cloneDeep(map);
        for(let y = 1; y < newMap.length - 1; y++) {
            for(let x = 1; x < newMap[0].length - 1; x++) {
                let bitString = '';
                for(const pos of POSITIONS) {
                    bitString += map[y + pos[1]][x + pos[0]] === '#' ? '1' : '0';
                }
                const index = parseInt(bitString, 2);
                const result = input.enhancement[index];
                // d('x=%d,y=%d: bitString = %s, index=%d, result=%s', x, y, bitString, index, result);


                newMap[y][x] = result;
            }
        }

        // console.log(`after step ${  step}`);
        // util.paint2D(newMap);
        // console.log('');
        
        map = newMap;
        if (step % 2 === 1) {
            for(let x = 0; x < map[0].length; x++) {
                map[0][x] = '#';
                map[map.length - 1][x] = '#';
            };

            for(let y = 0; y < map.length; y++) {
                map[y][0] = '#';
                map[y][map[0].length - 1] = '#';
            };
        }
        if (step % 2 === 0) {
            for(let x = 1; x < map[0].length - 1; x++) {
                map[1][x] = '.';
                map[map.length - 2][x] = '.';
            };

            for(let y = 1; y < map.length - 1; y++) {
                map[y][1] = '.';
                map[y][map[0].length - 2] = '.';
            };
        }
        paint2DCorner(map, 20);

    }

    // map[8][8] = 'S';
    // map[map.length - 8][map[0].length - 8] = 'E';
    paint2DCorner(map, 20);

    let count = 0;
    for(let y = 5; y < map.length - 5; y++) {
        for(let x = 5; x < map[0].length- 5; x++) {
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

function paint2DCorner(arr, size) {
    for (let r = 0; r < size; r++) {
        let out = '';
        for(let c = 0; c < size; c++) {
            switch (arr[r][c]) {
                case 0:
                    out += ' ';
                    break;
                case 'O':
                    out += chalk.bgGreen(chalk.red('O'));
                    break;
                case '#':
                case 1:
                    out += '█';
                    break;
                case -1:
                    out += '.';
                    break;
                case '.':
                default:
                    out += arr[r][c];
                    break;
            }
            // out += (arr[x][y] ? arr[x][y] === 1 ? 'W' : '_' : 'B');
        }
        // eslint-disable-next-line no-console
        console.log(out);
    }
}