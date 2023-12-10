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
const ex1 = `32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483`;
const ex1expectedP1 = 6440;
const ex1expectedP2 = 5905;

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
    return lines.map(line => {
        const [cards, bid] = line.split(' ')

        return {
            cards: cards.split(''),
            bid: Number(bid)
        };
 });
}

const CARD_RANK_P1 = [
    'A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'
];

const CARD_RANK_P2 = [
    'A', 'K', 'Q', 'T', '9', '8', '7', '6', '5', '4', '3', '2', 'J'
];

function calcHandTypeRank1(cards) {
    const counts = Object.values(
        _.countBy(cards)
    );
    
    counts.sort();
    counts.reverse();

    return Number(counts.join('').padEnd(5, '0'));
}

function calcHandTypeRank2(cards) {
    const initialCounts = _.countBy(cards);
    const jokers = initialCounts['J'] || 0;
    delete initialCounts['J'];

    const counts = Object.values(initialCounts)

    counts.sort();
    counts.reverse();

    counts[0] += jokers;

    return Number(counts.join('').padEnd(5, '0'));
}

function compareHands(a, b, rank, calcHandTypeRank) {
    const aType = calcHandTypeRank(a.cards);
    const bType = calcHandTypeRank(b.cards);

    // d({ a, aType, b, bType });

    if (aType > bType) {
        return 1;
    }
    
    if (aType < bType) {
        return -1;
    }

    for(let i = 0; i < 5; i++) {
        if (rank.indexOf(a.cards[i]) !== rank.indexOf(b.cards[i])) {
            return rank.indexOf(b.cards[i]) - rank.indexOf(a.cards[i]);
        }
    }

    return 0;
}

function part1(input) {
    const hands = _.cloneDeep(input);
    hands.sort((a, b) => compareHands(a, b, CARD_RANK_P1, calcHandTypeRank1));

    return _.reduce(hands, (sum, { bid }, index) => (sum + bid * (index + 1)), 0);
}

function part2(input) {
    const hands = _.cloneDeep(input);
    hands.sort((a, b) => compareHands(a, b, CARD_RANK_P2, calcHandTypeRank2));

    return _.reduce(hands, (sum, { bid }, index) => (sum + bid * (index + 1)), 0);
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

