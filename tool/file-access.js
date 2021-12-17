const path = require('path');
const fse = require('fs-extra');
const _ = require('lodash');
const chalk = require('chalk');

const config = require('./config');
const api = require('./aoc-api');

module.exports = {
    ensureDayFolderExists,
    ensureInputFilesExist,
    ensureYearFolderExists,
    ensureSolutionFilesExist,
    checkSolutionFileExists,
    checkHistoryFileExists,
    ensureHistoryFileExists,
    getDayFolderPath,
    writeHistory,
}

function ensureYearFolderExists(state) {
    return fse.ensureDir(path.join(state.pkgDir, `year-${state.year}`));
}

async function ensureDayFolderExists(state, spinner) {
    spinner && spinner.start(`Creating folder for ${state.year} day ${state.day}`);
    if (!(await fse.pathExists(getDayFolderPath(state)))) {
        await fse.ensureDir(getDayFolderPath(state));
        spinner && spinner.succeed('day folder created');
    } else {
        spinner && spinner.succeed('day folder exists');
    }
}

function ensureSolutionFilesExist(state, spinner) {
    return Promise.all(config.TEMPLATE_FILES.map(async name => {
        const expectedPath = path.join(getDayFolderPath(state), name);
        if (!(await fse.pathExists(expectedPath))) {
            spinner && spinner.start(`creating ${name}`);
            await fse.copy(path.join(state.pkgDir, 'templates', name), expectedPath);
            spinner && spinner.succeed(`${name} created`);
        }
    }));
}

function checkSolutionFileExists(state, spinner) {
    const expectedPath = path.join(getDayFolderPath(state), 'solution.js');
    return fse.pathExists(expectedPath);
}

function getDayFolderPath(state) {
    return path.join(state.pkgDir, `year-${state.year}`, `day-${String(state.day).padStart(2, '0')}`);
}

async function ensureHistoryFileExists(state, spinner) {
    const histFilePath = path.join(getDayFolderPath(state), 'history.json');
    spinner && spinner.start('Checking for history file');
    if (await fse.pathExists(histFilePath)) {
        if (spinner) { spinner.text = 'reading existing history file'; }
        const content = await fse.readJson(histFilePath);
        spinner && spinner.succeed('history file read');
        return content;
    } 
    if (spinner) { spinner.text = 'creating new history file'; }
    const content = { ...createHistory(), created: (new Date()).toISOString() };
    await fse.writeJson(histFilePath, content, { spaces: 2 });
    spinner && spinner.succeed('history file created');
    return content;
}

function checkHistoryFileExists(state, spinner) {
    const histFilePath = path.join(getDayFolderPath(state), 'history.json');
    return fse.pathExists(histFilePath);
}

async function writeHistory(state, spinner) {
    const histFilePath = path.join(getDayFolderPath(state), 'history.json');
    const content = state.history;
    await fse.writeJson(histFilePath, content, { spaces: 2 });
}

async function ensureInputFilesExist(state, spinner) {
    spinner && spinner.start('checking for input data file...');
    try {
        const filePath = path.join(getDayFolderPath(state), 'input-01.txt');
        if (await fse.pathExists(filePath)) {
            if (spinner) { spinner.text = 'loading existing input file'; }
            const content = await fse.readFile(filePath, { encoding: 'utf8' });
            spinner && spinner.succeed('existing input file loaded');
            return content;
        } 
        if (spinner) { spinner.text = 'downloading new input file'; }
            const content = await api.downloadInput(state, spinner);
            await fse.writeFile(filePath, content);
            spinner && spinner.succeed('new input file downloaded');
            return content;
        
    } catch (e) {
        spinner.fail(e.message);

        // TODO: refactor
        process.exit(1);
    }
}

function createHistory() {
    return {
        "submissionBlockedUntil": false,
        "sessions": [],
        "wrongAnswers": {
            "part1": [],
            "part2": []
        },
        "rightAnswers": {
            "part1": false,
            "part2": false
        }
    };
}
