const d = require('debug')('aocx:exec');
const decache = require('decache');
const chalk = require('chalk');

const { dashPad } = require('./print-utils');
const { preProcessInput } = require('./parsing');

module.exports = {
    solveOnce
};

function solveOnce(state) {
    const solnPath = `../year-${state.year}/day-${String(state.day).padStart(2, '0')}/solution.js`;
    decache(solnPath);

    let soln;
    try {
        soln = require(solnPath);
    } catch(e) {
        console.error(e);
    }

    try {
        const parsed = soln.parse(state.questionInput);
        console.log(chalk.cyan(dashPad('parser')));
        d('parsed item count: %d', parsed.length);
        d('first parsed item: %o', parsed[0]);
        d('last parsed item: %o', parsed[parsed.length - 1]);
        console.log(chalk.cyan(dashPad()));

        if (soln.ex1 || soln.ex2) {
            console.log(chalk.yellow(dashPad('Examples')));
            if (soln.ex1) {
                d('ex1: %o', soln.ex1);
                const input = preProcessInput(soln.ex1);
                d('ex1 parsed: %o', soln.parse(input));
                d('ex1 part1 result: %o', soln.part1(soln.parse(input)));
                d('ex1 part2 result: %o', soln.part2(soln.parse(input)));
            }

            if (soln.ex2) {
                d('ex2: %o', soln.ex2);
                const input = preProcessInput(soln.ex2);
                d('ex2 parsed: %o', soln.parse(input));
                d('ex2 part1 result: %o', soln.part1(soln.parse(input)));
                d('ex2 part2 result: %o', soln.part2(soln.parse(input)));
            }
            console.log(chalk.yellow(dashPad()));
        }

        console.log(chalk.red(dashPad('SOLVER')));
        d('executing part1...');
        const result1 = soln.part1(parsed);
        d('part1 result: %o', result1);
        d('executing part2...');
        const result2 = soln.part2(parsed);
        d('part2 result: %o', result2);
        console.log(chalk.red(dashPad()));

        state.latestAnswers = [result1, result2];
        return {
            result1,
            result2
        };
        
    } catch(e) {
        console.error(e);
    }
}

