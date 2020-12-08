const { promisify } = require('util');
const d = require('debug')('aoc-api');
const got = require('got');
const word2num = require('words-to-numbers').default;
const { CookieJar } = require('tough-cookie');

const config = require('./config');

const REGEX_LOCKOUT_TIME = /(\d+) ((minutes?|hours?))/;
const REGEX_ALREADY_LOCKED_OUT = /You have (\d+)m (\d\d)s left to wait/;
const TEXT_INCORRECT_ANSWER = 'not the right answer';
const TEXT_TOO_LOW = 'too low';
const TEXT_TOO_HIGH = 'too high';

const cookieJar = new CookieJar();
const setCookie = promisify(cookieJar.setCookie.bind(cookieJar));

module.exports = {
    downloadInput,
    submitAnswer,
};

async function downloadInput(state, spinner) {
    await setCookie(`session=${state.sessionToken}`, config.ORIGIN);
    const reqUrl =`${config.ORIGIN}/${state.year}/day/${state.day}/input`;
    spinner.text = `downloading new input file from ${reqUrl}`;

    try {
        const response = await got(reqUrl, { cookieJar, retry: config.GOT_RETRY });
        spinner.succeed('input file downloaded');
        return response.body;
    } catch(e) {
        spinner.fail(e.message);
        d('Error downloading input file: %o', e);
        throw e;
    }
}

async function submitAnswer(state, spinner, level, answer) {
    await setCookie(`session=${state.sessionToken}`, config.ORIGIN);
    const reqUrl =`${config.ORIGIN}/${state.year}/day/${state.day}/answer`;
    spinner.text = `Submitting answer of "${answer}" for part ${level} (${reqUrl})`;

    try {
        const form = { level, answer };
        
        const response = await got.post(reqUrl, { form, cookieJar, retry: config.GOT_RETRY });
        spinner.succeed('answer successfully submitted');
        spinner.start('parsing answer');
        const { wasCorrect, lockoutTime } = parseForSuccess(response.body);
        if (wasCorrect) {
            spinner.succeed('CORRECT ANSWER!');
        } else {
            spinner.fail(`INCORRECT ANSWER :-(  (lockout time: ${lockoutTime}`);
        }
        
        return {wasCorrect, lockoutTime };
    } catch(e) {
        spinner.fail(e.message);
        d('Error downloading input file: %o', e);
        throw e;
    }
}

function parseForSuccess(str) {
    const alreadyLockedOut = str.match(REGEX_ALREADY_LOCKED_OUT);
    if (alreadyLockedOut) {
        const lockoutTime = alreadyLockedOut[1] * 60 + alreadyLockedOut[2];
        return { wasLockedOut: true, lockoutTime };
    }
    
    const wasCorrect = !str.includes(TEXT_INCORRECT_ANSWER);
    const tooLow = !wasCorrect && str.includes(TEXT_TOO_LOW); 
    const tooHigh = !wasCorrect && str.includes(TEXT_TOO_HIGH);
    const lockedOut = !wasCorrect && str.match(REGEX_LOCKOUT_TIME);
    lockedOut && d('locked Out: %s', lockedOut[1]);
    
    const lockoutTime = lockedOut && word2num(lockedOut[1]) * (lockedOut[2].slice(0, 6) === 'minute' ? 60 : 1) 

    return { wasCorrect, tooLow, tooHigh, lockoutTime };
}
