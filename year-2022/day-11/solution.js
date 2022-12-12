const d = require('debug')('solution');
const _ = require('lodash');

const util = require('../../utils');
const imp = require('../../imp');
const parsers = require('../../parse');
const sets = require('../../sets');
const { array2D } = require('../../utils');

// add string tags here to help future categorization.
const tags = [];

// First example and expected answers for each part.
// Ignored if empty strings.
const ex1 = `Monkey 0:
Starting items: 79, 98
Operation: new = old * 19
Test: divisible by 23
  If true: throw to monkey 2
  If false: throw to monkey 3

Monkey 1:
Starting items: 54, 65, 75, 74
Operation: new = old + 6
Test: divisible by 19
  If true: throw to monkey 2
  If false: throw to monkey 0

Monkey 2:
Starting items: 79, 60, 97
Operation: new = old * old
Test: divisible by 13
  If true: throw to monkey 1
  If false: throw to monkey 3

Monkey 3:
Starting items: 74
Operation: new = old + 3
Test: divisible by 17
  If true: throw to monkey 0
  If false: throw to monkey 1`;
const ex1expectedP1 = 10605;
const ex1expectedP2 = 2713310158;

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
    return multi.map(ls => {
        // const ls = para.split('\n');
        const holding = util.posInts(ls[1]);
        const opfrags = ls[2].split(' ');
        const operator = opfrags[4];
        const operand = opfrags[5] === 'old' ? NaN : Number(opfrags[5]);
        const test = Number(ls[3].split(' ')[3]);
        const consequent = Number(ls[4].split(' ')[5]);
        const alternative = Number(ls[5].split(' ')[5]);

        return {
            holding, operator, operand, test, consequent, alternative
        }
    });
}

function part1(input) {
    const monkeys = _.cloneDeep(input);
    const inspections = array2D(1, monkeys.length, () => 0)[0];

    for(let round = 1; round <= 20; round++) {
        for(let mIdx = 0; mIdx < monkeys.length; mIdx++) {
            const monkey = monkeys[mIdx];
            while(monkey.holding.length) {
                let item = monkey.holding.shift();
                inspections[mIdx]++;
                switch (monkey.operator) {
                    case '*':
                        if (Number.isNaN(monkey.operand)) {
                            item *= item;
                        } else {
                            item *= monkey.operand;
                        }
                        break;

                    case '+':
                        item += monkey.operand;
                        break;

                    default:
                        // none
                }

                item = Math.floor(item / 3);

                if (item % monkey.test === 0) {
                    monkeys[monkey.consequent].holding.push(item);
                } else {
                    monkeys[monkey.alternative].holding.push(item);
                }
            }
        }
    }

    inspections.sort((a ,b) => a - b);
    d({ inspections });
    return String(inspections.pop() * inspections.pop());
}


function part2(input) {
    const monkeys = _.cloneDeep(input);
    const inspections = array2D(1, monkeys.length, () => 0)[0];

    const modulus = monkeys.map(x => x.test).reduce((acc, val) => acc * val, 1);

    for(let round = 1; round <= 10000; round++) {
        for(let mIdx = 0; mIdx < monkeys.length; mIdx++) {
            const monkey = monkeys[mIdx];
            while(monkey.holding.length) {
                let item = monkey.holding.shift();
                inspections[mIdx]++;
                switch (monkey.operator) {
                    case '*':
                        if (Number.isNaN(monkey.operand)) {
                            item *= item;
                        } else {
                            item *= monkey.operand;
                        }
                        break;

                    case '+':
                        item += monkey.operand;
                        break;

                    default:
                        // none
                }

                item %= modulus;

                if (item % monkey.test === 0) {
                    monkeys[monkey.consequent].holding.push(item);
                } else {
                    monkeys[monkey.alternative].holding.push(item);
                }
            }
        }
    }

    inspections.sort((a ,b) => a - b);
    d({ inspections });
    return String(inspections.pop() * inspections.pop());
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

