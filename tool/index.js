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

(async () => {

    if (!process.env.AOC_SESSION) {
        console.error('AOC_SESSION env var not present. Exiting.');
        process.exit(1);
    }

    const state = {
        pkgDir: await PkgDir(__dirname),
        sessionToken: process.env.AOC_SESSION,
        ...(await startPrompt())
    };

    const spinner = ora('starting...').start();

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
    let results = solveOnce(state);
    showSolvePrompt(state);

    state.watcher = util.createWatcher(state, event => {
        console.log(`${event} changed, rerunning...`);
        process.stdin.resume();
        showInputStats(state); 
        solveOnce(state);
        showSolvePrompt(state);
    });

    keyHandler.initialise({
        'q': () => util.gracefulExit(state),
        '\u0003': () => util.gracefulExit(state),
        'r': () => { solveOnce(state); showSolvePrompt(state); },
        '1': () => tryAnswer(state, spinner, 1),
        '2': () => tryAnswer(state, spinner, 2),
    });
})();

