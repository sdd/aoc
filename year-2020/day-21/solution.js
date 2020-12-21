const d = require('debug')('solution');
const _ = require('lodash');

const util = require('../../utils');
const imp = require('../../imp');
const parsers = require('../../parse');

// First example and expected answers for each part.
// Ignored if empty strings.
const ex1 = ``;
const ex1expectedP1 = ``;
const ex1expectedP2 = ``;

// Second example and expected answers for each part.
// Ignored if empty strings.
const ex2 = ``;
const ex2expectedP1 = ``;
const ex2expectedP2 = ``;

/**
 * Input parser.
 * @param {raw} raw unmodified input string from input-01.txt
 * @param {line} raw split on newlines, empty items removed, items trimmed
 * @param {comma} raw split on commas, empty items removed, items trimmed
 * @param {space} raw split on spaces, empty lines removed, items trimmed
 * @param {multi} raw, split on double newlines, empty items removed, split again on newlines, items trimmed
 */
function parse({ raw, line, comma, space, multi }) {
    return line.map(l => {
        const [i, a] = l.split(' (contains ');
        return { ingredients: i.split(' '), allergens: a.slice(0, -1).split(', ') };
    })
}

function common(foods) {
    const allergens = new Set();
    foods.forEach(food => {
        food.allergens.forEach(allergen => {
            allergens.add(allergen);
        })
    })

    let candidates = {};
    allergens.forEach(allergen => {
        let first = true;
        let union;
        foods.forEach(food => {
            if (food.allergens.includes(allergen)) {
                union = first ? [...food.ingredients] :  _.intersection(food.ingredients, union);
                first = false;
            }
        });
        candidates[allergen] = union;
    });

    let certainties = {};
    let changed = true;
    while (changed) {
        changed = false;
        _.toPairs(candidates).forEach(([a, cands]) => {
            if (cands.length === 1 && !certainties[a]) {
                certainties[a] = cands[0];
                changed = true;
                Object.keys(candidates).forEach(bc => {
                    candidates[bc] = _.without(candidates[bc], cands[0]);
                });
            }
        })
    }
    return certainties;
}

function part1(foods) {
    const badOnes = Object.values(common(foods));
    let goodCount = 0;
    foods.forEach(food => {
        food.ingredients.forEach(ing => {
            if (!badOnes.includes(ing)) goodCount++;
        });
    });
    return goodCount;
}

function part2(foods) {
    return _.sortBy(_.toPairs(common(foods)),x => x[0])
    .map(x => x[1])
    .join(',');
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

