const d = require('debug')('solution');
const _ = require('lodash');

const util = require('../../utils');
const imp = require('../../imp');
const parsers = require('../../parse');

// First example and expected answers for each part.
// Ignored if empty strings.
const ex1 = `be cfbegad cbdgef fgaecd cgeb fdcge agebfd fecdb fabcd edb | fdgacbe cefdb cefbgd gcbe
edbfga begcd cbg gc gcadebf fbgde acbgfd abcde gfcbed gfec | fcgedb cgb dgebacf gc
fgaebd cg bdaec gdafb agbcfd gdcbef bgcad gfac gcb cdgabef | cg cg fdcagb cbg
fbegcd cbd adcefb dageb afcb bc aefdc ecdab fgdeca fcdbega | efabcd cedba gadfec cb
aecbfdg fbg gf bafeg dbefa fcge gcbea fcaegb dgceab fcbdga | gecf egdcabf bgf bfgea
fgeab ca afcebg bdacfeg cfaedg gcfdb baec bfadeg bafgc acf | gebdcfa ecba ca fadegcb
dbcfg fgd bdegcaf fgec aegbdf ecdfab fbedc dacgb gdcebf gf | cefg dcbef fcge gbcadfe
bdfegc cbegaf gecbf dfcage bdacg ed bedf ced adcbefg gebcd | ed bcgafe cdgba cbgef
egadfb cdbfeg cegd fecab cgb gbdefca cg fgcdab egfdb bfceg | gbdfcae bgc cg cgb
gcafb gcf dcaebfg ecagb gf abcdeg gaef cafbge fdbac fegbdc | fgae cfgab fg bagce`;
const ex1expectedP1 = 26;
const ex1expectedP2 = 61229;

// Second example and expected answers for each part.
// Ignored if empty strings.
const ex2 = ``;
const ex2expectedP1 = ``;
const ex2expectedP2 = ``;

// 0: 6
// 1: 2   *
// 2: 5
// 3: 5
// 4: 4   *
// 5: 5
// 6: 6
// 7: 3   *
// 8: 7   *
// 9: 6

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
        const [input, output = ''] = l.split(' | ');
        return {
            i: input.split(' '),
            o: output.split(' ')
        };
    });
}

function part1(input) {
    let count = 0;
    for(line of input) {
        for(item of line.o) {
            if (item.length === 2 || item.length === 3 || item.length === 4 || item.length === 7) {
                count++;
            }
        }
    }
    return count;
}

// 0: 6
// 1: 2   *
// 2: 5
// 3: 5
// 4: 4   *
// 5: 5
// 6: 6
// 7: 3   *
// 8: 7   *
// 9: 6

function part2(input) {
    let total = 0;
    console.log(input.length);

    for(const line of input) {
        let c_f;
        let a;
        let b_d;
        let b;
        let d;
        let e;
        let c;
        let f;
        let g;

        const sortedI = _.sortBy(line.i, x => x.length);

        for(const item of sortedI) {
            const segs = item.split('');
            if (item.length === 2) {
                // this is a 1. must be c & f.
                c_f = segs;
                
            } else if (item.length === 3) {
                // is a 7. must be a, c, f.
                // the seg not in the 1 must be a.
                a = segs.filter(seg => (!c_f.includes(seg)))[0];
            } else if (item.length === 4) {
                // is a 4. the 2 segs not in 1 must be b & d.
                b_d = segs.filter(seg => (!c_f.includes(seg)));

            } else if (item.length === 5) {
                // is a 2, 3, or 5.
                const commonWith1 = segs.filter(seg => (c_f.includes(seg))).length;
                if (commonWith1 === 2) {
                    // if we have 2 in common with 1, this is a 3.
                    // if this is the case, the 2 segs not present
                    // are b & e.
                    const b_e = ['a', 'b', 'c', 'd', 'e', 'f', 'g'].filter(
                        seg => !segs.includes(seg)
                    );

                    // the one in common with b_d must be b.
                    const b_d_e = _.union(b_e, b_d);
                    
                    b = _.find(b_d_e, seg => (b_e.includes(seg) && b_d.includes(seg)));

                    // the other one from b_d must be d.
                    d = b_d.filter(seg => seg !== b)[0];

                    // the one in common eith b_e must be e
                    e = b_e.filter(seg => seg !== b)[0];
                } else {
                    // we have a 2 or a 5. don't care
                }

            } else if (item.length === 6) {
                // could be a 9 or a 6.
                // if we dont have both items in 1, we're a 6.

                if (!_.every(c_f, seg => segs.includes(seg))) { 
                    // which means the missing seg must be c.
                    c = ['a', 'b', 'c', 'd', 'e', 'f', 'g'].filter(
                        seg => !segs.includes(seg)    
                    )[0];

                    // which means the other seg in 1 must be f.
                    f = c_f.filter(seg => seg !== c)[0];

                    // the seg not in [a, b, c, d, e, f] must be g.
                    g = _.without(['a', 'b', 'c', 'd', 'e', 'f', 'g'], a, b, c, d, e, f)[0];
                }

            } else if (item.length === 7) {
                // is an 8. tells us nothing.

            }
        }

        const segMap = [
            [a, b, c, e, f, g], // 0
            [c, f], // 1
            [a, c, d, e, g], // 2
            [a, c, d, f, g], // 3
            [b, c, d, f], // 4
            [a, b, d, f, g], // 5
            [a, b, d, e, f, g],
            [a, c, f],
            [a, b, c, d, f, e, g],
            [a, b, c, d, f, g]
        ];

        let lineTotal = 0;
        for (const digit of line.o) {
            const segs = digit.split('');
            const val = _.findIndex(segMap, i => (i.length === segs.length && _.without(segs, ...i).length === 0))
            lineTotal = (lineTotal * 10) + val;
        }
        total += lineTotal;
    }
    return total;
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

