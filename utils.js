const _ = require('lodash');
module.exports = {
    array2D,
    ints,
    minIndexBy,
    maxIndexBy,
    paint2D,
    posints,
    posInts: posints,
};

const REGEX_INTS = /-?\d+/g;
const REGEX_POSITIVE_INTS = /\d+/g;

function ints(str) {
    return str.match(REGEX_INTS).map(Number) || [];
}

function posints(str) {
    return str.match(REGEX_POSITIVE_INTS).map(Number) || [];
}

function array2D(x, y = x, fn = () => 0) {
    let arr = new Array(x);

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
    for (y = 0; y < arr[0].length; y++) {
        let out = '';
        for(x = 0; x < arr.length; x++) {
            switch (arr[x][y]) {
                case 0:
                    out += ' ';
                    break;
                case 1:
                    out += '█';
                    break;
                case -1:
                    out += '.';
                    break;
            }
            // out += (arr[x][y] ? arr[x][y] === 1 ? 'W' : '_' : 'B');
       }
       console.log(out);
    }
}

function for2D(arr, fn, {
    xCond = x => x < arr.length,
    yCond = y => y < arr[0].length
}) {
    for(i = 0; xCond(); i++) {
        for(j = 0; yCond(); j++) {
            fn(i, j, arr);
        }
    }   
}
