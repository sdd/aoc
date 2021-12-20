const _ = require('lodash');
const chalk = require('chalk');

const REGEX_INTS = /-?\d+/g;
const REGEX_POSITIVE_INTS = /\d+/g;

function ints(str) {
    return str.match(REGEX_INTS).map(Number) || [];
}

function posints(str) {
    return str.match(REGEX_POSITIVE_INTS).map(Number) || [];
}

function list2map(list, keyGetter, valGetter) {
    return list.reduce((acc, item, index) => {
        let key; let val;

        switch(typeof keyGetter) {
            case 'number':
            case 'string':
                key = item[keyGetter];
                break;

            case 'function':
                key = keyGetter(item, index, acc);
                break;

            default:
                key = keyGetter;
        }

        switch(typeof valGetter) {
            case 'number':
            case 'string':
                val = item[valGetter];
                break;

            case 'function':
                val = valGetter(item, index, acc);
                break;

            default:
                val = keyGetter;
        }

        acc[key] = val;

        return acc;

    }, {});
}

function array2D(x, y = x, fn = () => 0) {
    const arr = new Array(x);

    for (let i = 0; i < x; i++) {
        arr[i] = new Array(y);

        for (let j = 0; j < y; j++) {
            arr[i][j] = fn(i, j);
        }
    }

    return arr;
}

function maxIndexBy(arr, fn = x => x) {
    return _.sortBy(_.toPairs(arr), ([k, v]) => fn(v))[arr.length - 1][0];
}

function minIndexBy(arr, fn = x => x) {
    return _.sortBy(_.toPairs(arr), ([k, v]) => fn(v))[0][0];
}

const DEFAULT_CHAR_MAP = {
    '0': ' ',  // "empty"
    'O': chalk.bgGreen(chalk.red('O')), // Y2020D19 Seamonster
    '1': '█',  // "wall"
    '#': '█',  // "wall"
    '-1': '.',
}

function paint2D(arr, {
    max,
    maxHeight = max || (arr.length - 1),
    maxWidth = max || (arr[0].length - 1),
    charMap = DEFAULT_CHAR_MAP,
} = {}) {
    for (let r = 0; r <= maxHeight  && r < arr.length; r++) {
        let out = '';
        for(let c = 0; c <= maxWidth && c < arr[r].length; c++) {
            if (charMap[arr[r][c]] !== undefined) {
                out += charMap[arr[r][c]];
            } else {
                out += arr[r][c];
            }
        }
        // eslint-disable-next-line no-console
        console.log(out);
    }
}

function for2D(arr, fn, {
    xCond = x => x < arr.length,
    yCond = y => y < arr[0].length
} = {}) {
    for(let i = 0; xCond(i); i++) {
        for(let j = 0; yCond(j); j++) {
            fn(i, j, arr);
        }
    }
}

function expand2D(map, addSize, addVal) {
    return array2D(map[0].length + addSize * 2, map.length + addSize * 2, (y, x) => {
        if (y - addSize < 0 
            || x - addSize < 0
            || y - addSize >= map.length
            || x - addSize >= map[0].length
        ) {
            return addVal;
        }
        return map[y - addSize][x - addSize];
    });
}

function arrayCount(array, item) {
    if (typeof item === 'function') {
        return _.flattenDeep(array).filter(item).length;
    }
    return _.flattenDeep(array).filter(x => x === item).length;
}

function convolve(map, kernelSize, fn) {
    const newMap = _.cloneDeep(map);
    const inset = Math.floor(kernelSize / 2);

    for(let y = inset; y < newMap.length - inset; y++) {
        for(let x = inset; x < newMap[0].length - inset; x++) {
            
            const window = [];
            for(let wy = y - inset; wy <= y + inset; wy++) {
                const row = [];
                for(let wx = x - inset; wx <= x + inset; wx++) {
                    row.push(map[wy][wx]);
                }
                window.push(row);
            }
            newMap[y][x] = fn(window, x, y);
        }
    }

    return newMap;
}

function conwayStep(world, adjFunc, adjToNextMap) {
    const nextWorld = array2D(world.length, world[0].length);

    for(let x = 0; x < world.length; x++) {
        for(let y = 0; y < world[0].length; y++) {
            const adjCount = adjFunc(world, x, y);

            const mapNext = adjToNextMap[world[x][y]][adjCount];
            nextWorld[x][y] = mapNext;
        }
    }

    return nextWorld;
}

function conwaySteps(world, adjCountFn, adjToNextMap, steps) {
    let nextWorld = world;
    for(let i = 1; i <= steps; i++) {
        nextWorld = conwayStep(nextWorld, adjCountFn, adjToNextMap);
    }

    return nextWorld;
}

function adjCountHex(world, x, y) {
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

/**
 * Counter: counts the frequencies of items
 */
class Counter extends Map {

    /**
     * adds value to the count of key
     * @param {any} key 
     * @param {any} value 
     * @returns Counter
     */
    add(key, value) {
        if (!this.has(key)) {
            return this.set(key, value);
        }
        return this.set(key, this.get(key) + value);
    };

    /**
     * increments the count of key
     * @param {any} key 
     * @returns Counter
     */
    inc(key) {
        return this.add(key, 1);
    }

    /**
     * 
     * @returns a sorted array of entries
     */
    sortedEntries() {
        const entries = [...this.entries()];
        entries.sort((a, b) => a[1] - b[1]);
        return entries;
    }

    /**
     * 
     * @returns the frequency of the most common entry
     */
    maxVal() {
        return this.sortedEntries().pop()[1];
    }

    /**
     * 
     * @returns the frequency of the least common entry
     */
    minVal() {
        return this.sortedEntries()[0][1];
    }

    /**
     * 
     * @returns the difference between the most and least common entries
     */
    valRange() {
        return this.maxVal() - this.minVal();
    }
}

/**
 * 
 * @param {iterable} iterable (incl Strings)
 * @returns a Counter initialised to the frequencies in iterable
 */
Counter.from = iterable => {
    const freq = new Counter();
    for (const item of iterable) {
        freq.inc(item);
    }
    return freq;
}

module.exports = {
    Counter,

    array2D,
    for2D,
    expand2D,
    convolve,
    ints,
    list2map,
    minIndexBy,
    maxIndexBy,
    paint2D,
    posints,
    posInts: posints,

    conwayStep,
    conwaySteps,
    adjCountHex,

    arrayCount,
};