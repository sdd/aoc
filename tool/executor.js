const d = require('debug')('aocx:exec');
const decache = require('decache');
const chalk = require('chalk');

const { dashPad } = require('./print-utils');
const { preProcessInput } = require('./parsing');

module.exports = {
    solveOnce
};

function solveOnce(state, examplesOnly = false) {
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
                const ex1p1res = soln.part1(soln.parse(input));
                const ex1p2res = soln.part2(soln.parse(input));
                state.ex1p1Correct = ex1p1res === soln.ex1expectedP1;
                state.ex1p2Correct = ex1p2res === soln.ex1expectedP2;

                d('ex1 part1 result: %o (expected: %o) %s', ex1p1res, soln.ex1expectedP1, state.ex1p1Correct ? chalk.green.bold('CORRECT!'): chalk.red('WRONG :-('));
                d('ex1 part2 result: %o (expected: %o) %s', ex1p2res, soln.ex1expectedP2, state.ex1p2Correct ? chalk.green.bold('CORRECT!'): chalk.red('WRONG :-('));
            }

            if (soln.ex2) {
                d('ex2: %o', soln.ex2);
                const input = preProcessInput(soln.ex2);
                d('ex2 parsed: %o', soln.parse(input));
                const ex2p1res = soln.part1(soln.parse(input));
                const ex2p2res = soln.part2(soln.parse(input));
                state.ex2p1Correct = ex2p1res === soln.ex2expectedP1;
                state.ex2p1Correct = ex2p2res === soln.ex2expectedP2;
                d('ex2 part1 result: %o (expected: %o) %s', ex2p1res, soln.ex2expectedP1, state.ex2p1Correct ? chalk.green.bold('CORRECT!'): chalk.red('WRONG :-('));
                d('ex2 part2 result: %o (expected: %o) %s', ex2p2res, soln.ex2expectedP2, state.ex2p2Correct ? chalk.green.bold('CORRECT!'): chalk.red('WRONG :-('));
            }
            console.log(chalk.yellow(dashPad()));
        }

        if (!examplesOnly) {
            console.log(chalk.red(dashPad('SOLVER')));
            d('executing part1...');
            const result1 = soln.part1(parsed);

            if (state.history?.rightAnswers?.part1) {
                const correct = `${result1}` === state.history.rightAnswers.part1.answer;
                d('part1 result: %o (expected: %o) %s', result1, state.history.rightAnswers.part1.answer, correct ? chalk.green.bold('CORRECT!'): chalk.red('WRONG :-('));
            } else {
                const prevBadAnswers = state.history.wrongAnswers.part1.map(x => x.answer);
                const knownWrong = prevBadAnswers.includes(`${result1}`)
                    ? chalk.red('Known to be WRONG :-(')
                    : '';
                d('part1 result: %o %s', result1, knownWrong);
            }
            
            d('executing part2...');
            const started = Date.now();
            const result2 = soln.part2(parsed);
            d('duration: %ds', (Date.now() - started) / 1000);

            if (state.history?.rightAnswers?.part2) {
                const correct = `${result2}` === state.history.rightAnswers.part2.answer;
                d('part2 result: %o (expected: %o) %s', result2, state.history.rightAnswers.part2.answer, correct ? chalk.green.bold('CORRECT!'): chalk.red('WRONG :-('));
            } else {
                const prevBadAnswers = state.history.wrongAnswers.part2.map(x => x.answer);
                const knownWrong = prevBadAnswers.includes(`${result2}`)
                    ? chalk.red('Known to be WRONG :-(')
                    : '';
                d('part2 result: %o %s', result2, knownWrong);
            }
            state.latestAnswers = [result1, result2];

            console.log(chalk.red(dashPad()));

            return {
                result1,
                result2
            };
        } else {
            console.log("EXAMPLES ONLY MODE: NOT RUNNING AGAINST MAIN QUESTION INPUT")
            console.log(chalk.red(dashPad()));

            return {
                result1: state.latestAnswers[0],
                result2: state.latestAnswers[1],
            };
        }

    } catch(e) {
        console.error(e);
    }
}

