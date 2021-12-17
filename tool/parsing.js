const chalk = require('chalk');
const { splitNonAlphanum, numberify } = require('../parse');

module.exports = {
    preProcessInput,
    nonEmpty,
    trimItem,
}

function preProcessInput(raw) {
    const lines = raw.split('\n').filter(nonEmpty).map(trimItem);
    const alphanums = splitNonAlphanum(lines[0]);
    const nums = alphanums.filter(x => !isNaN(x));
    const comma = lines[0].split(',').filter(nonEmpty).map(trimItem).map(numberify);
    const space = lines[0].split(/[ \t]/).filter(nonEmpty).map(trimItem).map(numberify);
    const chars = lines[0].split('');
    const multi = raw.split('\n\n')
        .map(block => block.split('\n').filter(nonEmpty).map(trimItem));
    const grid = lines.map(line => line.split('').map(numberify));

    return { raw, lines, alphanums, nums, comma, space, chars, multi, grid };
}

function nonEmpty(item) {
    return item !== '' || (Array.isArray(item) && item.length !== 0);
}

function trimItem(item) {
    if (Array.isArray(item)) {
        return item.filter(nonEmpty);
    } if (typeof item === 'string') {
        return item.trim();
    } 
        return item;
    
}


