const _ = require('lodash');

const GOT_RETRY = 1;
const TZ_OFFSET = 5;

const TEMPLATE_FILES = [ 'solution.js'/* , 'solution.test.js' */];
const ORIGIN = 'https://adventofcode.com';

const [ CURRENT_YEAR, CURRENT_MONTH, CURRENT_DAY ] = (new Date).toISOString().split('T')[0].split('-').map(Number);
const AOC_IN_PROGRESS = CURRENT_MONTH === 12 && CURRENT_DAY <= 25;

const PROMPT_SELECT_YEAR = {
    type: 'select',
    name: 'year',
    choices: _.range(CURRENT_YEAR, 2014, -1).map(String),
    result: x => parseInt(x, 10)
};

const PROMPT_SELECT_DAY = maxDay => ({
    type: 'select',
    name: 'dayStr',
    initial: maxDay !== 25 ? String(maxDay) : '1',
    choices: _.range(1, maxDay + 1).map(String),
});

module.exports = Object.freeze({
    GOT_RETRY,
    TZ_OFFSET,
    TEMPLATE_FILES,
    ORIGIN,
    CURRENT_DAY,
    CURRENT_YEAR,
    CURRENT_MONTH,
    AOC_IN_PROGRESS,
    PROMPT_SELECT_DAY,
    PROMPT_SELECT_YEAR
});

