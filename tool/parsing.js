const chalk = require('chalk');

module.exports = {
    preProcessInput,
    nonEmpty,
    trimItem,
}

function preProcessInput(raw) {
    const line = raw.split('\n').filter(nonEmpty).map(trimItem);
    const comma = raw.split(',').filter(nonEmpty).map(trimItem);
    const space = raw.split(/[ \t]/).filter(nonEmpty).map(trimItem);
    const multi = raw.split('\n\n')
        .map(block => block.split('\n').filter(nonEmpty).map(trimItem));

    return { raw, line, comma, space, multi };
}

function nonEmpty(item) {
    return item !== '' || (Array.isArray(item) && item.length !== 0);
}

function trimItem(item) {
    if (Array.isArray(item)) {
        return item.filter(nonEmpty);
    } else if (typeof item === 'string') {
        return item.trim();
    } else {
        return item;
    }
}


