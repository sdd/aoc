const config = require('./config');
const d = require('debug')('aocx:state');

const api = require('./aoc-api');
const { writeHistory } = require('./file-access');

module.exports = {
    aocDayNotYetStarted,
    spinUntilProblemOpen,
    tryAnswer,
};

function aocDayNotYetStarted(state) {
    if (state.year !== config.CURRENT_YEAR || config.CURRENT_MONTH !== 12 || state.day < config.CURRENT_DAY) {
        return false;
    }

    if (state.day > config.CURRENT_DAY) {
        return true;
    }

    return (new Date()).getHours() < config.TZ_OFFSET;
}

async function spinUntilProblemOpen(state, spinner) {
    spinner.start('Waiting for Unlock');
    const unlockTime = (new Date(`${state.year}-12-${String(state.day).padStart(2, '0')}T${String(config.TZ_OFFSET).padStart(2, '0')}:00:00`)).getTime()
    while (Date.now() < unlockTime) {
        const remainingSeconds = Math.round((unlockTime - Date.now()) / 1000);
        spinner.text = `Waiting for unlock (${remainingSeconds} seconds remaining)...`;
        await new Promise(res => { setTimeout(res, 1000); });
    }
    spinner.succeed('problem unlocked!');
}

async function spinUntilUnblocked(state, spinner) {
    const blockReleaseTime = new Date(state?.history?.submissionBlockedUntil);
    if (Date.now() > blockReleaseTime) {
        state.history.submissionBlockedUntil = undefined;
        return true;
    }

    spinner.start('Waiting for block to expire');
    while (Date.now() < blockReleaseTime) {
        const remainingSeconds = Math.ceil((blockReleaseTime - Date.now()) / 1000);
        spinner.text = `Blocked. Press a to abort waiting. (${remainingSeconds} seconds remaining)...`;
        await new Promise(res => { setTimeout(res, 1000); });
        if (state.abortWaiting) {
            state.abortWaiting = false;
            spinner.fail('Wait aborted.');
            return false;
        }
    }
    spinner.succeed('unblocked!');
    state.history.submissionBlockedUntil = undefined;
    return true;
}

async function tryAnswer(state, spinner, part) {
    const answer = state.latestAnswers[part-1];
    
    // don't do anything if this part has already been answered
    if (state.history.rightAnswers[`part${part}`]) {
        d('part %d already answered, ignoring');
        return;
    }

    // don't do anything if the current answer for this part is not a string or a number
    if (typeof answer !== 'string' && typeof answer !== 'number') {
        d('refusing to submit a non-string or non-number answer. try reformatting the return value');
        return;
    }

    // dont do anything if we already tried that answer
    const answerToSubmit = String(answer);
    if (state.history.wrongAnswers[`part${part}`].map(x => x.answer).includes(answerToSubmit)) {
        d('You already tried that. It was wrong');
        return;
    }

    if (state?.history?.submissionBlockedUntil) {
        const unblockResult = await spinUntilUnblocked(state, spinner);
        if (unblockResult == false) {
            writeHistory(state);
            return;
        }
    }

    // submit the answer
    spinner.start(`Submitting Part ${part} (answer: "${answer}")...`);
    const result = await api.submitAnswer(state, spinner, part, answer);
    // log the submission in history

    if (result.wasLockedOut) {
        spinner.fail(`You are locked out for ${result.lockoutTime} seconds`);
        state.history.submissionBlockedUntil = new Date(Date.now() + (result.lockoutTime * 1000));
    } else if (result.wasCorrect) {
        // log the correct answer and the time it was answered
        state.history.rightAnswers[`part${part}`] = { answer: answerToSubmit, succeeded: new Date() };
    } else {
        // log the incorrect answer so we don'tsubmit that again and can flag it in the logger
        state.history.wrongAnswers[`part${part}`].push({ answer: answerToSubmit, submitted: new Date() });
        // if there was a lockout, update the lockout expiry time
        if (result.lockoutTime) {
            state.history.submissionBlockedUntil = new Date(Date.now() + (result.lockoutTime * 1000));
        }
    }
    writeHistory(state);
}
