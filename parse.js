module.exports = {
    numberify,
    splitNonAlphanum,
};

const REGEX_MATCH_ALPHANUM = /([\da-zA-Z]+)/g;

function splitNonAlphanum(str) {
    return [ ...str.matchAll(REGEX_MATCH_ALPHANUM) ]
        .map(x => x[0])
        .map(numberify);
}

function numberify(str) {
    const possNum = Number(str);
    return Number.isNaN(possNum) ? str : possNum;
}


