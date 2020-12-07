const _ = require('lodash');
const inp = require('../imp');

const i1 = inp.lineNum('01.txt');

function calcPerModule(input) {
    for (i = 0; i < input.length; i++) {
        for(j = i + 1; j < input.length; j++) {
            for(k = i + 1; k < input.length; k++) {
                if (input[i] + input[j] + input[k] === 2020) {
                    console.log(input[i] + ' ' + input[j]);
                    console.log(input[i] * input[j] * input[k]);

                    return input[i] * input[j];
                }
            }
        }
    }
}

function calcPerModule2(mass) {
}


console.log('Part 1: ' + calcPerModule(i1)); 
console.log('Part 2: ');
