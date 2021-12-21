/* eslint-disable no-restricted-syntax */
const d = require('debug')('solution');
const _ = require('lodash');

const util = require('../../utils');
const imp = require('../../imp');
const parsers = require('../../parse');

// First example and expected answers for each part.
// Ignored if empty strings.
const ex1 = `--- scanner 0 ---
404,-588,-901
528,-643,409
-838,591,734
390,-675,-793
-537,-823,-458
-485,-357,347
-345,-311,381
-661,-816,-575
-876,649,763
-618,-824,-621
553,345,-567
474,580,667
-447,-329,318
-584,868,-557
544,-627,-890
564,392,-477
455,729,728
-892,524,684
-689,845,-530
423,-701,434
7,-33,-71
630,319,-379
443,580,662
-789,900,-551
459,-707,401

--- scanner 1 ---
686,422,578
605,423,415
515,917,-361
-336,658,858
95,138,22
-476,619,847
-340,-569,-846
567,-361,727
-460,603,-452
669,-402,600
729,430,532
-500,-761,534
-322,571,750
-466,-666,-811
-429,-592,574
-355,545,-477
703,-491,-529
-328,-685,520
413,935,-424
-391,539,-444
586,-435,557
-364,-763,-893
807,-499,-711
755,-354,-619
553,889,-390

--- scanner 2 ---
649,640,665
682,-795,504
-784,533,-524
-644,584,-595
-588,-843,648
-30,6,44
-674,560,763
500,723,-460
609,671,-379
-555,-800,653
-675,-892,-343
697,-426,-610
578,704,681
493,664,-388
-671,-858,530
-667,343,800
571,-461,-707
-138,-166,112
-889,563,-600
646,-828,498
640,759,510
-630,509,768
-681,-892,-333
673,-379,-804
-742,-814,-386
577,-820,562

--- scanner 3 ---
-589,542,597
605,-692,669
-500,565,-823
-660,373,557
-458,-679,-417
-488,449,543
-626,468,-788
338,-750,-386
528,-832,-391
562,-778,733
-938,-730,414
543,643,-506
-524,371,-870
407,773,750
-104,29,83
378,-903,-323
-778,-728,485
426,699,580
-438,-605,-362
-469,-447,-387
509,732,623
647,635,-688
-868,-804,481
614,-800,639
595,780,-596

--- scanner 4 ---
727,592,562
-293,-554,779
441,611,-461
-714,465,-776
-743,427,-804
-660,-479,-426
832,-632,460
927,-485,-438
408,393,-506
466,436,-512
110,16,151
-258,-428,682
-393,719,612
-211,-452,876
808,-476,-593
-575,615,604
-485,667,467
-680,325,-822
-627,-443,-432
872,-547,-609
833,512,582
807,604,487
839,-516,451
891,-625,532
-652,-548,-490
30,-46,-14`;
const ex1expectedP1 = 79;
const ex1expectedP2 = 3621;

// Second example and expected answers for each part.
// Ignored if empty strings.
const ex2 = ``;
const ex2expectedP1 = ``;
const ex2expectedP2 = ``;

// took 27 mins to work all these out :-O
const AXIS_PERMS = [
    // assume RH coord sys, thumb=x, index=y, middle=z. middle=facing, index=down, thumb=right
    // correct = +x = right, +y = down, +z = fwd

    // mf pointing fwds
    [ 1,  2,  3],
    [ 2, -1,  3],
    [-1, -2,  3],
    [-2,  1,  3],

    // mf pointing right
    [-3,  2,  1],
    [ 2,  3,  1],
    [ 3, -2,  1],
    [-2, -3,  1],

    // mf pointing back
    [-1,  2, -3],
    [ 2,  1, -3],
    [ 1, -2, -3],
    [-2, -1, -3],

    // mf pointing left
    [ 3,  2, -1],
    [ 2, -3, -1],
    [-3, -2, -1],
    [-2,  3, -1],

    // mf pointing down
    [ 1, -3,  2],
    [-3, -1,  2],
    [-1,  3,  2],
    [ 3,  1,  2],

    // mf pointing up
    [ 1,  3, -2],
    [ 3, -1, -2],
    [-1, -3, -2],
    [-3,  1, -2],
];

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
    return multi.map(block => block.slice(1).map(line => line.split(',').map(Number)));
}

let found;
function part1(input) {
    // prepopulate data structures with contents of scanner[0] and build from there
    const unique = new Set(input[0].map(x => x.join(',')));
    found = _.times(input.length, () => null);
    found[0] = { offset: [0, 0, 0], orientation: 0, pivot: 0, transformed: _.cloneDeep(input[0]) };

    let foundOne;
    do {
        foundOne = false;
        scanner: for(const indexA of [0]/* foundIndexes */) {
            for(let pivotIndexA = found[indexA].transformed.length - 1; pivotIndexA > 0; pivotIndexA--) {

                // the beacons detected by scanner a, transformed into world space 
                const worldA = found[indexA].transformed;

                // the chosen origin in local pivot space of scanner a
                const pivotPointWorldA = worldA[pivotIndexA];

                // the beacons of scanner a, transformed into local pivot space
                const pivotSpaceA = worldA.map(([x, y, z]) => [
                    x - pivotPointWorldA[0],
                    y - pivotPointWorldA[1],
                    z - pivotPointWorldA[2]
                ]);

                for(let bIndex = 0; bIndex < input.length; bIndex++) {
                    if (found[bIndex]) { continue; }
                    for(let bPivot = 0; bPivot < input[bIndex].length; bPivot++) {
                        // the beacons detected by beacon b, in beacon b local space
                        const b = input[bIndex];
                        for(let orientationIndexB = 0; orientationIndexB < AXIS_PERMS.length; orientationIndexB++) {
                            
                            // the chosen orientation of scanner b to check
                            const orientationB = AXIS_PERMS[orientationIndexB];

                            // the pivot point of b in b local space
                            const pivotPointLocalB = b[bPivot];

                            // the beacons of scanner b translated to local pivot space
                            const pivotTranslatedB = b.map(([x, y, z]) => [
                                x - pivotPointLocalB[0],
                                y - pivotPointLocalB[1],
                                z - pivotPointLocalB[2]
                            ]);
                            
                            // the beacons of scanner b translated to pivot space and rotated by orientation b
                            const transformedB = pivotTranslatedB.map(point => [
                                0 + Math.sign(orientationB[0]) * point[Math.abs(orientationB[0]) - 1],
                                0 + Math.sign(orientationB[1]) * point[Math.abs(orientationB[1]) - 1],
                                0 + Math.sign(orientationB[2]) * point[Math.abs(orientationB[2]) - 1]
                            ]);

                            // the points that are in common between transformedB and pivotSpaceA
                            const inter = _.intersection(pivotSpaceA.map(x => x.join(',')), transformedB.map(x => x.join(',')));

                            if (inter.length >= 12) {
                                foundOne = true;

                                const offset = [
                                    found[indexA].transformed[pivotIndexA][0] - (Math.sign(orientationB[0]) * b[bPivot][Math.abs(orientationB[0]) - 1]),
                                    found[indexA].transformed[pivotIndexA][1] - (Math.sign(orientationB[1]) * b[bPivot][Math.abs(orientationB[1]) - 1]),
                                    found[indexA].transformed[pivotIndexA][2] - (Math.sign(orientationB[2]) * b[bPivot][Math.abs(orientationB[2]) - 1])
                                ];

                                const transformed = b.map(point => ([
                                    offset[0] + (Math.sign(orientationB[0]) * point[Math.abs(orientationB[0]) - 1]),
                                    offset[1] + (Math.sign(orientationB[1]) * point[Math.abs(orientationB[1]) - 1]),
                                    offset[2] + (Math.sign(orientationB[2]) * point[Math.abs(orientationB[2]) - 1])
                                ]));

                                // add the transformed beacon locations to the set of beacons and scanner[0]'s points
                                for(const point of transformed) {
                                    const stringified = point.join(',');
                                    if (!unique.has(stringified)) {
                                        unique.add(stringified);
                                        found[0].transformed.push(point);
                                    }
                                }

                                found[bIndex] = {
                                    offset,
                                    orientation: orientationIndexB,
                                    pivot: bPivot,
                                    transformed,
                                };
                                d('found: %o out of %o (matched scanner %o to %o: offset %o, orientation %o, aPivot %o, bPivot %o)', found.filter(x => x).length, input.length, indexA, bIndex, offset, orientationIndexB, pivotIndexA, bPivot);
                                break scanner;
                            }
                        }
                    }
                }
            }
        }
    } while(foundOne)

    d('found: %o out of %o', found.filter(x => x).length, input.length);
    return unique.size;
}

function part2(input) {
    let maxManhattan = 0;

    for(const a of found) {
        for (const b of found) {
            const distx = a.offset[0] - b.offset[0];
            const disty = a.offset[1] - b.offset[1];
            const distz = a.offset[2] - b.offset[2];
            maxManhattan = Math.max(maxManhattan, distx + disty + distz);
        }
    }

    return maxManhattan;
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

