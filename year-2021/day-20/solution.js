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

function part1(input) {
    return partx(input, 2);
}

function part2(input) {
    return partx(input, 50);
}

function partx(input, steps) {
    let map = _.cloneDeep(input.map);

    // add a buffer to the outside
    map = util.expand2D(map, 2, '.');

    function kernel(window) {
        const bitString = _.flatten(window)
            .map(c => (c === '#' ? '1' : '0'))
            .join('');
        return input.enhancement[parseInt(bitString, 2)];
    }

    for(let step = 1; step <= steps; step++) {

        // grow the map by 1
        map = util.expand2D(map, 1, '.');

        // "enhance" the image
        map = util.convolve(map, 3, kernel);

        // clean up the border
        const borderPixel = map[2][2];
        map = util.convolve(map, 1, (w, x, y) => {
            if (x < 2 || y < 2 || x >= map[y].length - 2 || y >= map.length - 2) {
                return borderPixel;
            }
            return w[0][0];
        });

        // console.log(`step ${step}`);
        // util.paint2D(map, { max: 20 });
        // console.log(' ');
    }

    return util.arrayCount(map, x => x === '#');
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
