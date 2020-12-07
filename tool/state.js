const config = require('./config');
const d = require('debug')('aocx:state');

const api = require('./aoc-api');

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

async function tryAnswer(state, spinner, part) {
    d('tryAnswer: state.history = %O', state.history);
    // don't do anything if this part has already been answered
    if (state.history.rightAnswers[`part${part}`]) {
        d('part %d already answered, ignoring');
        return;
    }

    // don't do anything if the current answer for this part is not a string or a number
    if (typeof state.latestAnswers[part-1] !== 'string' && typeof state.latestAnswers[part-1] !== 'number') {
        d('refusing to submit a non-string or non-number answer. try reformatting the return value');
        return;
    }

    // dont do anything if we already tried that answer
    const answerToSubmit = String(state.latestAnswers[part-1]);
    if (state.history.wrongAnswers[`part${part}`].map(x => x.answer).includes(answerToSubmit)) {
        d('You already tried that. It was wrong');
        return;
    }

    // submit the answer
    const result = await api.submitAnswer(state, spinner, part, state.latestAnswers[part-1]);
    // log the submission in history
    
    if (result.wasCorrect) {
        // log the correct answer and the time it was answered
        state.history.rightAnswers[`part${part}`] = { answer: answerToSubmit, succeeded: new Date() };
    } else {
        // log the incorrect answer so we don'tsubmit that again and can flag it in the logger
        state.history.wrongAnswers.push({ answer: answerToSubmit, submitted: new Date() });
        // if there was a lockout, update the lockout expiry time
        if (result.lockoutTime) {
            state.history.submissionBlockedUntil = new Date(Date.now() + (result.lockoutTime * 1000 * 60));
        }
    }

    d('tryAnswer: final state = %O', state);
}
