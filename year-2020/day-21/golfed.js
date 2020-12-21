const _ = require('lodash');

function parse({ raw, line, comma, space, multi }) {
    return line.map(l => {
        const [i, a] = l.split(' (contains ');
        return { ings: i.split(' '), alls: a.slice(0, -1).split(', ') };
    })
}

function common(foods) {
    let cands = _.uniq(_.flatten(_.map(foods, 'alls'))).reduce((acc, a) => acc.set(a, foods.reduce((union, f) =>
        (f.alls.includes(a) ? (union ? _.intersection(union, f.ings) : [...f.ings]) : union),
    false)), new Map());

    let certs = {};
    while (cands.size) for ([a, [cand, ...rest]] of cands.entries()) {
        if (!rest.length) {
            certs[a] = cand;
            cands.delete(a);
            for (bc of cands.keys()) cands.set(bc, _.without(cands.get(bc), cand));
        }
    }
    return certs;
}

function part1(foods) {
    const badOnes = Object.values(common(foods));
    return _.flatten(_.map(foods, 'ings')).filter(f => !badOnes.includes(f)).length;
}

function part2(foods) {
    return _.sortBy(_.toPairs(common(foods)), _.head).map(_.last).join(',');
}

module.exports = {
    ex1,
    ex2,
    ex1expectedP1,
    ex1expectedP2,
    ex2expectedP1,
    ex2expectedP2,
    part1,
    part2,
    parse,
};

