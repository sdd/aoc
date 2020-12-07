const chalk = require('chalk');
const _ = require('lodash');
const d = require('debug')('aocx');

module.exports = {
    dashPad,
    showInputStats,
    showSolvePrompt,
};

function dashPad(str, len = process.stdout.columns) {
    if (!str) { return _.repeat('-', len); }
    const remaining = len - 2 - str.length;
    let left = Math.floor(remaining / 2);
    let right = Math.ceil(remaining / 2);

    return [_.repeat('-', left), str, _.repeat('-', right)].join(' ');
}

function showSolvePrompt(state) {
    let options = [
      { key: 'q', msg: 'quit', color: 'magenta' },
      { key: 'r', msg: 're-run', color: 'green' },
    ];

    if (!state.history.solvedPart1 && isSubmittable(state.latestAnswers[0])) {
        options.push({ key: '1', msg: 'submit part 1', color: 'bgRed' });
    }
    if (!state.history.solvedPart2 && isSubmittable(state.latestAnswers[1])) {
        options.push({ key: '2', msg: 'submit part 2', color: 'bgRed' });
    }

    const optionStrings = options.map(({ color, key, msg }) =>
        chalk[color](`${key} to ${msg}`)
    );

    console.log(`Options: press ${optionStrings.join(', ')}`);
}

function isSubmittable(answer) {
    return typeof answer === 'string' || typeof answer === 'number';
}

function showInputStats(state) {
    const input = state.questionInput;
    console.log(chalk.blue(dashPad('Input Stats')));

    const { raw, line, comma, space, multi } = state.questionInput;

    d('%d multiline blocks', multi.length);
    if (multi.length > 1) {
        d('First block: %o', multi[0]);
        d('Last block: %o', multi[multi.length - 1]);
    }
    
    d('%d lines.', line.length);
    if (line.length > 1) {
        d('First line: %o', line[0]);
        d('Last line: %o', line[line.length - 1]);
    }
    
    d('%d comma-seperated items.', comma.length);
    if (comma.length > 1) {
        d('First item: %o', comma[0]);
        d('Last item: %o', comma[comma.length - 1]);
    }

    d('%d space-seperated items.', space.length);
    if (space.length > 1) {
        d('First item: %o', space[0]);
        d('Last item: %o', space[space.length - 1]);
    }
    
    console.log(chalk.blue(dashPad()));
}
