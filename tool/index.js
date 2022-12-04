process.env.DEBUG="*";
const d = require('debug')('aoc-runner');
const _ = require('lodash');
const ora = require('ora');
const PkgDir = require('pkg-dir');

const config = require('./config');
const fileAccess = require('./file-access');
const { dashPad, showInputStats, showSolvePrompt } = require('./print-utils');
const { aocDayNotYetStarted, spinUntilProblemOpen, tryAnswer } = require('./state');
const { startPrompt } = require('./prompt');
const keyHandler = require('./key-handler');
const aocApi = require('./aoc-api');
const { preProcessInput } = require('./parsing');
const { solveOnce } = require('./executor');
const util = require('./utils');
const chalk = require('chalk');

(async () => {

    if (!process.env.AOC_SESSION) {
        console.error('AOC_SESSION env var not present. Exiting.');
        process.exit(1);
    }

    const state = {
        pkgDir: await PkgDir(__dirname),
        sessionToken: process.env.AOC_SESSION,
        examplesOnly: !!process.env.EXAMPLES_ONLY,
        ...(await startPrompt()),
    };

    const spinner = ora('starting...').start();

    await setupDay(state, spinner);

    keyHandler.initialise({
        'q': () => util.gracefulExit(state),
        '\u0003': () => util.gracefulExit(state),
        'r': () => { state.examplesOnly = false; solveOnce(state); showSolvePrompt(state); },
        'e': () => { state.examplesOnly = true; solveOnce(state); showSolvePrompt(state); },
        '1': () => { tryAnswer(state, spinner, 1); console.log('yo'); showSolvePrompt(state); },
        '2': () => { tryAnswer(state, spinner, 2); showSolvePrompt(state); },
        'u': () => { showSolvePrompt(state); },
        'a': () => { state.abortWaiting = true; },
        'd': async () => {
            Object.assign(state, await startPrompt());
            await setupDay(state, spinner);
        },
    });
})();

async function setupDay(state, spinner) {
    await fileAccess.ensureYearFolderExists(state, spinner);
    await fileAccess.ensureDayFolderExists(state, spinner);
    await fileAccess.ensureSolutionFilesExist(state, spinner);

    const LIVE_WAIT_MODE = config.AOC_IN_PROGRESS && aocDayNotYetStarted(state);
    if (LIVE_WAIT_MODE) {
        await spinUntilProblemOpen(state, spinner);
    }

    state.questionInput = preProcessInput(await fileAccess.ensureInputFilesExist(state, spinner));
    state.history =  await fileAccess.ensureHistoryFileExists(state, spinner);

    showInputStats(state); 
    solveOnce(state);
    await autoSubmit(state, spinner);
    showSolvePrompt(state);

    if (state.watcher) {
        await state.watcher.close();
    }
    state.watcher = util.createWatcher(state, async event => {
        console.log(`${event} changed, rerunning...`);
        process.stdin.resume();
        showInputStats(state); 
        solveOnce(state);
        await autoSubmit(state, spinner);
        showSolvePrompt(state);
    });

    process.stdin.setRawMode(true);
    process.stdin.resume();
}

async function autoSubmit(state, spinner) {
    if (!state.history?.rightAnswers?.part1) {
        // correct answer not yet submitted for part1

        if (state.ex1p1Correct && (state.ex2p1Correct || !state.ex2)) {
            // example 1 correctly solved for part 1, example 2 either not present or solved for part 1

            if (state.latestAnswers && state.latestAnswers[0] !== undefined && state.latestAnswers[0] !== false) {
                // answer present for part1

                const prevBadAnswers = state.history.wrongAnswers.part1.map(x => x.answer);
                if (!prevBadAnswers.includes(`${state.latestAnswers[0]}`)) {
                    // havent yet tried the current answer

                    console.log(chalk.magenta(dashPad('AUTO SUBMIT')));
                    await tryAnswer(state, spinner, 1);
                    console.log(chalk.magenta(dashPad()));
                }
            }
        }
    }

    if (!state.history?.rightAnswers?.part2) {
        // correct answer not yet submitted for part2

        if (state.ex1p2Correct && (state.ex2p2Correct || !state.ex2)) {
            // example 1 correctly solved for part 2, example 2 either not present or solved for part 2

            if (state.latestAnswers && state.latestAnswers[1] !== undefined && state.latestAnswers[1] !== false) {
                // answer present for part2

                const prevBadAnswers = state.history.wrongAnswers.part2.map(x => x.answer);
                if (!prevBadAnswers.includes(`${state.latestAnswers[1]}`)) {
                    // havent yet tried the current answer

                    console.log(chalk.magenta(dashPad('AUTO SUBMIT')));
                    await tryAnswer(state, spinner, 2);
                    console.log(chalk.magenta(dashPad()));
                }
            }
        }
    }
}