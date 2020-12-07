const d = require('debug')('aoc');
const _ = require('lodash');

const util = require('../../utils');
const imp = require('../../imp');
const parsers = require('../../parse');

const data = imp.importSepParse('\n', s => s.trim(), false)('01.txt');
//const data = imp.lineNum('01.txt');
//const data = imp.lineNum('01.txt');
//const data = imp.SpaceStr('01.txt');
//const data = imp.SpaceNum('01.txt');
//const data = imp.commaStr('01.txt');
//const data = imp.commaNum('01.txt');

function parse(input) {
    let res = [];
    let curr = '';

    while(input.length) {
        let line = input.pop();
        if (line === '') {
            res.push(curr);
            curr = '';
        } else {
            curr = `${curr} ${line}`.trim();
        }
    }

    return res.map(x => {
        return x.split(' ').reduce((acc, item) => {
            const [k, v] = item.split(':');
            acc[k] = v;
            return acc;
        }, {});
    });
}

function part1(input) {
    let res = input.filter(x =>
        x.ecl && x.pid && x.eyr && x.hcl && x.byr && x.iyr && x.hgt
    );
    
    return res.length;
}

const R_HGT_IN = /^(\d{2})in$/
const R_HGT_CM = /^(1\d{2,3})cm$/
const R_HCL = /^#[\da-f]{6}$/;
const R_PID = /^\d{9}$/;

const VAL_ECL = ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'];

function part2(input) {
    let res = input.map(x => {
        x.byr = Number(x.byr);
        x.eyr = Number(x.eyr);
        x.iyr = Number(x.iyr);

       if (x.hgt) {
           const mIn = x.hgt.match(R_HGT_IN);
           const mCm = x.hgt.match(R_HGT_CM);
           if (mIn && Number(mIn[1]) >= 59 && Number(mIn[1]) <= 76) {
               x.hgt = { unit: 'in', val: Number(mIn[1]) };
           } else if (mCm && Number(mCm[1]) >= 150 && Number(mCm[1]) <=193) {
               x.hgt = { unit: 'cm', val: Number(mCm[1]) };
           } else {
               x.hgt = false;
           }
           
       }
        return x; 
    });

    res = res.filter(x => {
        return (Number.isFinite(x.byr) && x.byr >= 1920 && x.byr <= 2002)
           && (Number.isFinite(x.iyr) && x.iyr >= 2010 && x.iyr <= 2020)
           && (Number.isFinite(x.eyr) && x.eyr >= 2020 && x.eyr <= 2030)
           && x.hgt
           && x.hcl && R_HCL.test(x.hcl)
           && x.ecl && VAL_ECL.includes(x.ecl)
           && x.pid && R_PID.test(x.pid)
    });
    
    return res.length;
}

module.exports = {
    part1,
    part2
};


// comment out the below if working with a test harness in watch mode
const parsed = parse(data);
console.log('----------------------------');
d('parsed item count: %d', parsed.length);
d('first parsed item: %o', parsed[0]);
d('last parsed item: %o', parsed[parsed.length - 1]);

d('part1 result: %o', part1([...parsed]));
d('part2 result: %o', part2(parsed));

