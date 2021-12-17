module.exports = {
    numberify,
    splitNonAlphanum,
    splitNonAlphanumPos,
};

const REGEX_MATCH_ALPHANUM = /(-?\d+|[a-zA-Z]+)/g;

const REGEX_MATCH_POS_ALPHANUM = /([\da-zA-Z]+)/g;

function splitNonAlphanum(str) {
    return [ ...str.matchAll(REGEX_MATCH_ALPHANUM) ]
        .map(x => x[0])
        .map(numberify);
}

function splitNonAlphanumPos(str) {
    return [ ...str.matchAll(REGEX_MATCH_POS_ALPHANUM) ]
        .map(x => x[0])
        .map(numberify);
}

function numberify(str) {
    const possNum = Number(str);
    return Number.isNaN(possNum) ? str : possNum;
}
