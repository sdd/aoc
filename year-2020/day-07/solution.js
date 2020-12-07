const d = require('debug')('solution');
const _ = require('lodash');

const util = require('../../utils');
const imp = require('../../imp');
const parsers = require('../../parse');

// First example and expected answers for each part.
// Ignored if empty strings.
const ex1 = `shiny gold bags contain 2 dark red bags.
dark red bags contain 2 dark orange bags.
dark orange bags contain 2 dark yellow bags.
dark yellow bags contain 2 dark green bags.
dark green bags contain 2 dark blue bags.
dark blue bags contain 2 dark violet bags.
dark violet bags contain no other bags.`;
const ex1expectedP1 = ``;
const ex1expectedP2 = 126;

// Seconf example and expected answers for each part.
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
    return line
        .map(l => l.split(' bags contain '))
        .map(([name, cc]) => ({
            name, canContain: cc.split(', ')
        }))
        .map(({ name, canContain }) => {
            const cc = canContain.map(s => {
                const [count, w1, w2] = s.split(' ');
                if (count === 'no') {
                    return 0;
                }
                return { count: Number(count), name: `${w1} ${w2}` }
            });

            return { name, canContain: cc[0] === 0 ? [] : cc }
        });
}

function part1(input) {
    let possibles = new Set(['shiny gold']);
    
    let lastSize = -1;
    while(lastSize != possibles.size) {
        lastSize = possibles.size;
        input.forEach(i => {
            _.forEach(i.canContain, j => {
                possibles.has(j.name) && possibles.add(i.name);
            }); 
        });
    };
    
    return possibles.size - 1;
}

function part2(input) {
    const containMap = util.list2map(input, 'name', 'canContain');
    
    function countContents(name) {
        return 1 + _.sum(
            containMap[name].map(({ count, name }) =>
                count * countContents(name)
            )
        );
    }

    return countContents('shiny gold') - 1;
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

