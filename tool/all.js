/* eslint-disable no-await-in-loop */
const d = require('debug')('aocx:all');
const _ = require('lodash');
const ora = require('ora');
const PkgDir = require('pkg-dir');
const chalk = require('chalk');

const fileAccess = require('./file-access');
const { preProcessInput } = require('./parsing');
const { solveOnce } = require('./executor');

const [ CURRENT_YEAR, CURRENT_MONTH, CURRENT_DAY ] = (new Date).toISOString().split('T')[0].split('-').map(Number);
const AOC_IN_PROGRESS = CURRENT_MONTH === 12 && CURRENT_DAY <= 25;

(async () => {

    const state = {
        pkgDir: await PkgDir(__dirname),
    };
    //const spinner = ora('starting...').start();

for (let year = 2020; year <= CURRENT_YEAR - (CURRENT_MONTH === 12 ? 0 : 1); year++) {
    state.year = year;
    
    // show year
    d('year: %o', year);

    const maxDay = (year === CURRENT_YEAR && AOC_IN_PROGRESS) ? CURRENT_DAY : 25;
    for(const day of _.range(1, maxDay)) {
        //d('year: %o, day: %o', year, day);

        state.day = day;

        // check folder exists
        await fileAccess.ensureYearFolderExists(state);
        await fileAccess.ensureDayFolderExists(state);
        
        // check solution and history exist
        if (await fileAccess.checkSolutionFileExists(state) && await fileAccess.checkHistoryFileExists(state)) {
            state.questionInput = preProcessInput(await fileAccess.ensureInputFilesExist(state));
            state.history =  await fileAccess.ensureHistoryFileExists(state);

            const results = solveOnce(state, false, true);
            //console.log({ results, state });
            const part1IsCorrect = state.history?.rightAnswers?.part1.answer === `${results.result1}`;
            const part2IsCorrect = state.history?.rightAnswers?.part2.answer === `${results.result2}`;

            console.log(`Day ${String(state.day).padStart(2, '0')}: ${part1IsCorrect ? chalk.yellow.bold('⭐') : chalk.red.bold('X') }${part2IsCorrect ? chalk.yellow.bold('⭐') : chalk.red.bold('X') }`)

        } else {
            // print a blank for theday
            console.log('∅');
        }
    }
}

})();