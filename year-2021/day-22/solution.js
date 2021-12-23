/* eslint-disable no-else-return */
/* eslint-disable complexity */
const d = require('debug')('solution');
const _ = require('lodash');

const util = require('../../utils');
const imp = require('../../imp');
const parsers = require('../../parse');

// First example and expected answers for each part.
// Ignored if empty strings.
const ex1 = `on x=10..12,y=10..12,z=10..12
on x=11..13,y=11..13,z=11..13
off x=9..11,y=9..11,z=9..11
on x=10..10,y=10..10,z=10..10`;
const ex1expectedP1 = 39;
const ex1expectedP2 = 39;

// Second example and expected answers for each part.
// Ignored if empty strings.
const ex2 = `on x=-20..26,y=-36..17,z=-47..7
on x=-20..33,y=-21..23,z=-26..28
on x=-22..28,y=-29..23,z=-38..16
on x=-46..7,y=-6..46,z=-50..-1
on x=-49..1,y=-3..46,z=-24..28
on x=2..47,y=-22..22,z=-23..27
on x=-27..23,y=-28..26,z=-21..29
on x=-39..5,y=-6..47,z=-3..44
on x=-30..21,y=-8..43,z=-13..34
on x=-22..26,y=-27..20,z=-29..19
off x=-48..-32,y=26..41,z=-47..-37
on x=-12..35,y=6..50,z=-50..-2
off x=-48..-32,y=-32..-16,z=-15..-5
on x=-18..26,y=-33..15,z=-7..46
off x=-40..-22,y=-38..-28,z=23..41
on x=-16..35,y=-41..10,z=-47..6
off x=-32..-23,y=11..30,z=-14..3
on x=-49..-5,y=-3..45,z=-29..18
off x=18..30,y=-20..-8,z=-3..13
on x=-41..9,y=-7..43,z=-33..15`;
const ex2expectedP1 = 590784;
const ex2expectedP2 = 590784;

/**
 * Input parser.
 * @param {Object} arg collection of pre-parsed helpers
 * @param {string} arg.raw unmodified input string from input-01.txt
 * @param {Array<string>} arg.lines raw split on newlines, trimmed, empty filtered
 * @param {Array<string|Number>} arg.alphanums alphanumeric groups in lines[0]
 * @param {Array<Number>} arg.nums numeric values in lines[0]
 * @param {Array<string>} arg.comma split on commas, trimmed, empty filtered 
 * @param {Array<string>} arg.space split on spaces, trimmed, empty filtered
 * @param {Array<string>} arg.chars split lines[0] on every char
 * @param {Array<Array<string>} arg.multi split on double newlines, empty filtered, split again on newlines, trimmed
 * @param {Array<Array<string>} arg.grid 2D char grid
 */
 function parse({ raw, lines, alphanums, nums, comma, space, chars, multi, grid }) {
    lines = lines.map(l => parsers.splitNonAlphanum(l));

    // convert the ranges from [a..b] style into [a..b) style for easier processing
    return lines.map(([state, _2, xl, xh, _3, yl, yh, _4, zl, zh]) => ({
        state: state === 'on',
        xl,
        xh: xh + 1,
        yl,
        yh: yh + 1,
        zl,
        zh: zh + 1
    }));
}

function part1(input) {
    const world = new Map();

    for(let x=-50; x <= 50; x++) {
        for(let y=-50; y <= 50; y++) {
            for(let z=-50; z <= 50; z++) {
                world.set(`${x},${y},${z}`, false);
            }
        }
    }

    for(const vol of input) {
        for(let x = Math.max(vol.xl, -50); x < Math.min(vol.xh, 51); x++) {
            for(let y = Math.max(vol.yl, -50); y < Math.min(vol.yh, 51); y++) {
                for(let z = Math.max(vol.zl, -50); z < Math.min(vol.zh, 51); z++) {
                    world.set(`${x},${y},${z}`, vol.state);
                }
            }
        }
    }

    let count = 0;
    for (const val of world.values()) {
        if (val) count++;
    }

    return count;
}

function part2(input) {
    let disjointPoweredCuboids = [];
    
    for(const newCuboid of input) {
        // check for intersection
        const [intersectors, disjoint] = _.partition(disjointPoweredCuboids, cube => cuboidsIntersect(cube, newCuboid));

        if (!intersectors.length && newCuboid.state) {
            // d('no intersections. adding cube');
            disjointPoweredCuboids.push(newCuboid);
            continue;
        }

        // create a list of cuboids to process, starting with the new one from the input                    
        let newCuboids = [newCuboid];
        while(newCuboids.length) {
            const candidate = newCuboids.pop();

            const intIdx = _.findIndex(intersectors, i => cuboidsIntersect(i, candidate));
            if (intIdx === -1) {
                // no intersectors this time round.
                intersectors.push(candidate);
            } else {
                // we have an intersector. remove it from the list of intersectors
                const [intersector] = intersectors.splice(intIdx, 1);

                // split the intersector and candidate into disjoint cuboids
                const result = splitCuboids(intersector, candidate);

                // put the resulting cuboids back onto the list of volumes to process
                newCuboids = newCuboids.concat(result);
            }
        }
        // now newCuboids is empty & intersectors contains only disjoint cuboids resulting from
        // breaking down any intersections between the new item and existing cuboids into 
        // disjoint volumes

        // update nonIntersectingCuboids
        disjointPoweredCuboids = disjoint.concat(intersectors.filter(i => i.state));
    }

    return _.sum(disjointPoweredCuboids.map(c => 
        (c.xh - c.xl) * (c.yh - c.yl) * (c.zh - c.zl)
    ));
}

function cuboidsIntersect(a, b) {  
    const xInt = b.xl < a.xl ? (b.xh > a.xl) : (b.xl < a.xh);
    const yInt = b.yl < a.yl ? (b.yh > a.yl) : (b.yl < a.yh);
    const zInt = b.zl < a.zl ? (b.zh > a.zl) : (b.zl < a.zh);

    return xInt && yInt && zInt;
}

function splitCuboids(a, b) {
    // short circuit if a and b are both same state and either a fully contains b or vice versa
    if ( !(a.state ^ b.state)) { // eslint-disable-line no-bitwise
        // check for b entirely within a
        if (
            b.xl > a.xl && b.xh < a.xh
            && b.yl > a.yl && b.yh < a.yh
            && b.zl > a.zl && b.zh < a.zh
        ) {
            // d('b entirely within a');
            return [a];
        }

        // check for a entirely within b
        if (
            a.xl > b.xl && a.xh < b.xh
            && a.yl > b.yl && a.yh < b.yh
            && a.zl > b.zl && a.zh < b.zh
        ) {
            // d('a entirely within b');
            return [b];
        }
    }

    // determine the planes that we need to split on in each axis
    const xPlanes = _.uniq([a.xl, b.xl, a.xh, b.xh]);
    const yPlanes = _.uniq([a.yl, b.yl, a.yh, b.yh]);
    const zPlanes = _.uniq([a.zl, b.zl, a.zh, b.zh]);
    xPlanes.sort((a, b) => a - b);
    yPlanes.sort((a, b) => a - b);
    zPlanes.sort((a, b) => a - b);
    
    const volumesOn = [];
    const volumesOff = [];

    // shatter the two cuboids to produce all volumes in all split planes
    for(let xi = 0; xi < xPlanes.length - 1; xi++) {
        for(let yi = 0; yi < yPlanes.length - 1; yi++) {
            for(let zi = 0; zi < zPlanes.length - 1; zi++) {
                
                const newVol = {
                    xl: xPlanes[xi],
                    xh: xPlanes[xi + 1],
                    yl: yPlanes[yi],
                    yh: yPlanes[yi + 1],
                    zl: zPlanes[zi],
                    zh: zPlanes[zi + 1],
                };
                
                newVol.volInA = cuboidsIntersect(newVol, a);
                newVol.volInB = cuboidsIntersect(newVol, b);
                newVol.state = getIntersectVolState(a.state, b.state, newVol.volInA, newVol.volInB);
                // d('newVol: %o', newVol);

                if (!newVol.volInA && !newVol.volInB) {
                    // d('in neither');
                    continue;
                } 

                if (newVol.state) {
                    volumesOn.push(newVol);
                } else {
                    volumesOff.push(newVol);
                }
            }
        }
    }

    let result;
    // we can optimise a bit here, rather than just returning [...onVolumes, ...offVolumes]

    if (a.state && b.state) {
        // d('both turned on');
        // if a and b were both on, keep the largest one intact 
        // and only take the fragments from the smallest.
        const volumeA = (a.xh - a.xl) * (a.yh - a.yl) * (a.zh - a.zl);
        const volumeB = (b.xh - b.xl) * (b.yh - b.yl) * (b.zh - b.zl);
        if (volumeA >= volumeB) {
            result = [a, ...volumesOn.filter(v => !v.volInA)];
        } else {
            result = [b, ...volumesOn.filter(v => !v.volInB)];
        }

    } else if (a.state && !b.state) {
        // d('a turned on, b turned off');
        // if a was on and b was off, keep b and the frags of a.
        result = [...volumesOn, b];
    
    } else if (!a.state && b.state) {
        // if a was off and b was on
        // d('unexpected a off b on');
        result = [...volumesOff, b];

    } else {
        // d('both off');
        // both off. Keep the largest one intact 
        // and only take the fragments from the smallest.

        const volumeA = (a.xh - a.xl) * (a.yh - a.yl) * (a.zh - a.zl);
        const volumeB = (b.xh - b.xl) * (b.yh - b.yl) * (b.zh - b.zl);
        if (volumeA >= volumeB) {
            result = [a, ...volumesOn.filter(v => !v.volInA)];
        } else {
            result = [b, ...volumesOn.filter(v => !v.volInB)];
        }
    }
    
    // d('split result: %o', result);
    return result;
}

function getIntersectVolState(aState, bState, volInA, volInB) {
    if (aState) {
        if (bState) {
            return volInA || volInB;
        } else {
            return volInA && !volInB;
        }
    } else if (bState) {
        return volInB;
    } else {
        return false;
    }
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

