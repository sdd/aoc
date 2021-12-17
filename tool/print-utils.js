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
    const left = Math.floor(remaining / 2);
    const right = Math.ceil(remaining / 2);

    return [_.repeat('-', left), str, _.repeat('-', right)].join(' ');
}

function showSolvePrompt(state) {
    const options = [
      { key: 'q', msg: 'quit', color: 'magenta' },
      { key: 'r', msg: 're-run', color: 'green' },
      { key: 'e', msg: 're-run (examples only)', color: 'green' },
    ];

    if (!state.history?.rightAnswers?.part1 && isSubmittable(state.latestAnswers[0])) {
        const prevBadAnswers = state.history.wrongAnswers.part1.map(x => x.answer);
        if (!prevBadAnswers.includes(`${state.latestAnswers[0]}`)) {
            options.push({ key: '1', msg: 'submit part 1', color: 'bgRed' });
        }
    }
    if (!state.history?.rightAnswers?.part2 && isSubmittable(state.latestAnswers[1])) {
        const prevBadAnswers = state.history.wrongAnswers.part2.map(x => x.answer);
        if (!prevBadAnswers.includes(`${state.latestAnswers[1]}`)) {
            options.push({ key: '2', msg: 'submit part 2', color: 'bgRed' });
        }
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

    const { raw, lines, alphanums, nums, chars, comma, space, multi, grid } = state.questionInput;

    if (multi.length > 1) {
        d('%o multi-line blocks', multi.length);
        d('First block: %o', multi[0]);
        d('Last block: %o', multi[multi.length - 1]);
    } else {
        //d('no multi-line blocks');
    }
    
    if (lines.length > 1) {
        d('%o lines', lines.length);
        d('First line: %o', lines[0]);
        d('Last line: %o', lines[lines.length - 1]);
    } else {
        d('1 line, %o chars', chars.length);
        if (chars.length <= 100) {
            d('line: %o', lines[0]);
        }
    }

    if (alphanums.length > 1) {
        d('%o alphanums in first line (first %o, last %o)', alphanums.length, alphanums[0], alphanums[alphanums.length - 1]);
    } else {
        //d('no alphanums in first line');
    }

    if (nums.length > 1) {
        d('%o nums in first line (first %o, last %o)', nums.length, nums[0], nums[nums.length - 1]);
    } else {
        //d('no nums in first line');
    }

    if (comma.length > 1) {
        d('%o comma-separated items in first line (first %o, last %o)', comma.length, comma[0], comma[comma.length - 1]);
    } else {
        d('not comma-separated');
    }

    if (space.length > 1) {
        d('%o space-separated items (first %o, last %o)', space.length, space[0], space[space.length - 1]);
    } else {
        d('not space-separated');
    }

    if (grid.length > 1) {
        if (_.every(grid, row => row.length === grid[0].length)) {
            d('%d x %d grid', grid[0].length, grid.length);
        } else {
            //d('not a simple grid');
        }
    } else {
        //d('not a simple grid');
    }
    
    console.log(chalk.blue(dashPad()));
}
