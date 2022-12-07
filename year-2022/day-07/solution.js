const d = require('debug')('solution');
const _ = require('lodash');

const util = require('../../utils');
const imp = require('../../imp');
const parsers = require('../../parse');
const sets = require('../../sets');

// add string tags here to help future categorization.
const tags = [];

// First example and expected answers for each part.
// Ignored if empty strings.
const ex1 = `$ cd /
$ ls
dir a
14848514 b.txt
8504156 c.dat
dir d
$ cd a
$ ls
dir e
29116 f
2557 g
62596 h.lst
$ cd e
$ ls
584 i
$ cd ..
$ cd ..
$ cd d
$ ls
4060174 j
8033020 d.log
5626152 d.ext
7214296 k`;
const ex1expectedP1 = 95437;
const ex1expectedP2 = 24933642;

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
    return multi[0];
}

function part1(input) {
    const fs = buildFs(input);
    // d({ fs });

    const dirSizeMap = new Map();
    const rootSize = calcFileSize(fs, '', dirSizeMap);
    dirSizeMap.set('/', rootSize);
    d({ dirSizeMap });

    return _.sum([...dirSizeMap.values()].filter(x => x <= 100000));
}

function buildFs(input) {
    input = _.clone(input);
    let cd;

    const fs = new Map();
    let state = 'PROMPT';
    let ptrToCd = fs;

    while(input.length) {
        const line = input.shift();

        const frags = line.split(' ');
        if (frags[0] === '$') {
            state = 'PROMPT';
        }

        switch (state) {
            case 'PROMPT':
                switch (frags[1]) {
                    case 'cd':
                        if (frags[2] === '/') {
                            // d('cd to root');
                            ptrToCd = fs;
                        } else {
                            ptrToCd = ptrToCd.get(frags[2]);
                        }
                        state = 'PROMPT';
                        break;

                    case 'ls':
                        state = 'LSOUT'
                        break;

                    default:
                        // none
                }
                break;

            case 'LSOUT':
                switch (frags[0]) {
                    case 'dir':
                        if (frags[1] !== '..') {
                            if (!ptrToCd.has(frags[1])) {
                                ptrToCd.set(frags[1], new Map());
                                ptrToCd.get(frags[1]).set('..', ptrToCd);
                            }
                        } 
                        break;

                    default:
                        ptrToCd.set(frags[1], Number(frags[0]));
                }
                break;

            default:
                // none
        }
    }
    return fs;
}

function calcFileSize(x, path, map) {
    let size = 0;
    for (const [k, v] of x.entries()) {
        if (k === '..') {
            continue;
        }
        if (typeof v === 'number') {
            size += v;
        } else {
            const subDirPath = `${path}/${k}`;
            const subDirSize = calcFileSize(v, subDirPath, map);
            size += subDirSize;
            map.set(subDirPath, subDirSize);
        }
    }
    return size;
}

function part2(input) {
    const fs = buildFs(input);
    //d({ fs });

    const dirSizeMap = new Map();
    const rootSize = calcFileSize(fs, '', dirSizeMap);
    dirSizeMap.set('/', rootSize);
    //d({ dirSizeMap });

    const available = 70000000 - dirSizeMap.get('/');
    const required = 30000000 - available;
    d({ required, available });

    let best = 1000000000000;
    for(let [k, v] of dirSizeMap.entries() ) {
        if ((v >= required) && v < best) {
            best = v;
            d({ k, v });
        }
    }

    return best;
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
    tags,
};

