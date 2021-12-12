const _ = require('lodash');
const chalk = require('chalk');

module.exports = {
    array2D,
    for2D,
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

    arrayCount
};

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

function paint2D(arr) {
    for (let r = 0; r < arr.length; r++) {
        let out = '';
        for(let c = 0; c < arr[0].length; c++) {
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

// eslint-disable-next-line no-unused-vars
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

function arrayCount(array, item) {
    if (typeof item === 'function') {
        return _.flattenDeep(array).filter(item).length;
    }
    return _.flattenDeep(array).filter(x => x === item).length;
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
