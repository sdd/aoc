const { prompt } = require('enquirer');
const config = require('./config');

module.exports = {
    startPrompt,
};

async function startPrompt() {
    const { year } = await prompt(config.PROMPT_SELECT_YEAR);
    const maxDay = (config.AOC_IN_PROGRESS && year === config.CURRENT_YEAR) ? config.CURRENT_DAY + 1 : 25;
    const { dayStr } = await prompt(config.PROMPT_SELECT_DAY(maxDay));

    return { year, day: parseInt(dayStr) };
}
