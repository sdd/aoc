const chai = require('chai');
const { expect } = chai;
const imp = require('../imp');

const fns = require('./solution.js');

const { part1, part2 } = fns;

const ex1 = ``;

const ex2 = ``.split('\n');

const q1 = ``.split('\n');

// const q1 = require('./imp').arrLineSep('./16.txt');

describe('2020 day 2', () => {
    describe('part 1', () => {
        it('example 1', function () {

            const result = part1(ex1, 3, 2);

            expect(result).to.eql(1);
        });
        
        it('main q', function () {

            const result = part1(q1);

            expect(result).to.eql(2345);
        });

    });

    xdescribe('part 2', () => {

        it('example 1', function () {

            const result = part2(ex2);

            expect(result).to.eql(3456);
        });
        
        xit('main q', function () {

            const result = part2(q1);

            expect(result).to.eql(4567);
        });
    });
});
