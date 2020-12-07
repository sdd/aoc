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
    ensureHistoryFileExists,
    getDayFolderPath,
}

function ensureYearFolderExists(state) {
    return fse.ensureDir(path.join(state.pkgDir, `year-${state.year}`));
}

async function ensureDayFolderExists(state, spinner) {
    spinner.start(`Creating folder for ${state.year} day ${state.day}`);
    if (!(await fse.pathExists(getDayFolderPath(state)))) {
        await fse.ensureDir(getDayFolderPath(state));
        spinner.succeed('day folder created');
    } else {
        spinner.succeed('day folder exists');
    }
}

function ensureSolutionFilesExist(state, spinner) {
    return Promise.all(config.TEMPLATE_FILES.map(async name => {
        const expectedPath = path.join(getDayFolderPath(state), name);
        if (!(await fse.pathExists(expectedPath))) {
            spinner.start(`creating ${name}`);
            await fse.copy(path.join(state.pkgDir, 'templates', name), expectedPath);
            spinner.succeed(`${name} created`);
        }
    }));
}

function getDayFolderPath(state) {
    return path.join(state.pkgDir, `year-${state.year}`, `day-${String(state.day).padStart(2, '0')}`);
}

async function ensureHistoryFileExists(state, spinner) {
    const histFilePath = path.join(getDayFolderPath(state), 'history.json');
    spinner.start('Checking for history file');
    if (await fse.pathExists(histFilePath)) {
        spinner.text = 'reading existing history file';
        const content = await fse.readJson(histFilePath);
        spinner.succeed('history file read');
        return content;
    } else {
        spinner.text = 'creating new history file';
        content = { ...state, created: (new Date()).toISOString() };
        await fse.writeJson(histFilePath, content);
        spinner.succeed('history file created');
        return content;
    }
}

async function ensureInputFilesExist(state, spinner) {
    spinner.start('checking for input data file...');
    try {
        const filePath = path.join(getDayFolderPath(state), 'input-01.txt');
        if (await fse.pathExists(filePath)) {
            spinner.text = 'loading existing input file';
            const content = await fse.readFile(filePath, { encoding: 'utf8' });
            spinner.succeed('existing input file loaded');
            return content;
        } else {
            spinner.text = 'downloading new input file';
            const content = await api.downloadInput(state, spinner);
            await fse.writeFile(filePath, content);
            spinner.succeed('new input file downloaded');
            return content;
        }
    } catch (e) {
        spinner.fail(e.message);

        // TODO: refactor
        process.exit(1);
    }
}

