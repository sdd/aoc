const d = require('debug')('solution');
const _ = require('lodash');

const util = require('../../utils');
const imp = require('../../imp');
const parsers = require('../../parse');

// First example and expected answers for each part.
// Ignored if empty strings.
const ex1 = ''/*`0: 4 1 5
1: 2 3 | 3 2
2: 4 4 | 5 5
3: 4 5 | 5 4
4: "a"
5: "b"

ababbb
bababa
abbbab
aaabbb
aaaabbb`;*/
const ex1expectedP1 = 2;
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
    const [rawRules, messages] = multi;

    const rules = rawRules.map(r => {
        const [id, def] = r.replace(/"/gi, '').split(': ');

        let expanded = [];
        let seqs = [[id]];
        let done = false;
        if (def.match(/^[a-z]+$/i)) {
            expanded = [def];
            done = true;
        } else {
            seqs = def.split(' | ').map(d => d.split(' '));
        }


        return {id, seqs, expanded, done };
    });

    return [{
        rules: rules.reduce((acc, { id, ...rest }) => {
            acc[id] = { id, ...rest };
            return acc;
        }, {}),
        messages
    }];
}

function possibleCombos(arr, prefix = '') {
    if (arr.length === 0) { return [prefix]; }
    let [item, ...rest] = arr;
    let results = item.map(i => possibleCombos(rest, `${prefix}${i}`));
    return _.flattenDeep(results);
}

function part1([{ rules, messages }]) {

    let mapCharsToSeq = {};
    Object.values(rules).forEach(r => {
        if (r.done) {
            mapCharsToSeq[r.expanded[0]] = r.id;
        }
    })

    let hasExpanded = true;
    while(hasExpanded) {
        hasExpanded = false;
        _.toPairs(rules).forEach(([id, body]) => {
            if (!body.done) {
                let newSeqs = [];
                body.seqs.forEach(seq => {
                    if (_.every(seq, sid => rules[sid] && rules[sid].done)) {

                        let comboBase = seq.map(sid => rules[sid].expanded);
                        let expanded = possibleCombos(comboBase);
                        expanded.forEach(x => { mapCharsToSeq[x] = id; });
                        rules[id].expanded = rules[id].expanded.concat(expanded);

                        hasExpanded = true;
                    } else {
                        newSeqs.push(seq);
                    }
                });
                body.seqs = newSeqs;
                if (!body.seqs.length) {
                    body.done = true;
                }
            }
        });
    }

    let possibleMsgs = _.toPairs(mapCharsToSeq).filter(([msg, rule]) => rule === '0').map(([msg]) => msg);
    let validMsgs = messages.filter(m => possibleMsgs.includes(m));
    return validMsgs.length;
}

function part2([{ rules, messages }]) {
    delete rules['8'];
    delete rules['11'];

    let mapCharsToSeq = {};
    Object.values(rules).forEach(r => {
        if (r.done) {
            mapCharsToSeq[r.expanded[0]] = r.id;
        }
    })

    let hasExpanded = true;
    while(hasExpanded) {
        hasExpanded = false;
        _.toPairs(rules).forEach(([id, body]) => {
            if (!body.done) {
                let newSeqs = [];
                body.seqs.forEach(seq => {
                    if (_.every(seq, sid => rules[sid] && rules[sid].done)) {

                        let comboBase = seq.map(sid => rules[sid].expanded);
                        let expanded = possibleCombos(comboBase);
                        expanded.forEach(x => { mapCharsToSeq[x] = id; });
                        rules[id].expanded = rules[id].expanded.concat(expanded);

                        hasExpanded = true;
                    } else {
                        newSeqs.push(seq);
                    }
                });
                body.seqs = newSeqs;
                if (!body.seqs.length) {
                    body.done = true;
                }
            }
        });
    }

    // semi-manually process rules 8 and 11.
    // Rule 0:   [[8, 11]]
    // Rule 8:   [[42], [42, 8]]
    // Rule 11:  [[42, 31], [42, 11, 31]]

    // The string must start with at least 1 rule 8, so
    // trim off the first rule 42.
    // then, preferentially match rule 11:
    //     if remaining string starts with a 42 and ends with an 11, trim them from the start and end.
    // if rule 11 didn't match, but 42 did at the start, trim the 42 at the start.
    // if after you repeat these until the string is empty, we have a good string.

    let good = 0;
    _.forEach(messages, message => {
        let atLeastOnce8 = false;
        let atLeastOnce11 = false;
        let modified = true;
        while (message.length && modified) {
            modified = false;

            let starts42 = rules['42'].expanded.find(prefix => message.startsWith(prefix));
            if (starts42) {

                if (atLeastOnce8) {
                    let ends31 = rules['31'].expanded.find(suffix => message.endsWith(suffix));
                    if (ends31) {
                        message = message.slice(starts42.length);
                        message = message.slice(0, message.length - ends31.length);
                        modified = true;
                        atLeastOnce11 = true;
                        continue;
                    }
                }

                message = message.slice(starts42.length);
                modified = true;
                atLeastOnce8 = true;
            }
        }

        if (atLeastOnce8 && atLeastOnce11 && !message.length) {
            good++;
        }
    });

    return good;
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

