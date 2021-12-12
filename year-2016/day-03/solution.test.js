const chai = require('chai');
const { expect } = chai;
const imp = require('./imp');

const fns = require('./2.js');

const { part1, part2 } = fns;

const ex1 = ``;

const ex2 = ``.split('\n');

const q1 = ``.split('\n');

// const q1 = require('./imp').arrLineSep('./16.txt');

describe('2020 day 2', () => {
    describe('part 1', () => {
        it('example 1', () => {

            const result = part1(ex1, 3, 2);

            expect(result).to.eql(1);
        }).timeout(2000);
        
        it('main q', () => {

            const result = part1(q1);

            expect(result).to.eql(2345);
        }).timeout(2000);

    });

    xdescribe('part 2', () => {

        it('example 1', () => {

            const result = part2(ex2);

            expect(result).to.eql(3456);
        }).timeout(2000);
        
        xit('main q', () => {

            const result = part2(q1);

            expect(result).to.eql(4567);
        }).timeout(2000);
    });
});
