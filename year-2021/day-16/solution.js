/* eslint-disable prefer-destructuring */
const d = require('debug')('solution');
const _ = require('lodash');

const util = require('../../utils');
const imp = require('../../imp');
const parsers = require('../../parse');

// First example and expected answers for each part.
// Ignored if empty strings.
const ex1 = `D2FE28`;
const ex1expectedP1 = 6;
const ex1expectedP2 = 2021;

// Second example and expected answers for each part.
// Ignored if empty strings.
const ex2 = `9C0141080250320F1802104A08`;
const ex2expectedP1 = 20;
const ex2expectedP2 = 1;

/**
 * Input parser.
 * @param {raw} raw unmodified input string from input-01.txt
 * @param {line} raw split on newlines, empty items removed, items trimmed
 * @param {comma} raw split on commas, empty items removed, items trimmed
 * @param {space} raw split on spaces, empty lines removed, items trimmed
 * @param {multi} raw, split on double newlines, empty items removed, split again on newlines, items trimmed
 */
function parse({ raw, line, comma, space, multi }) {
    return line[0];
}

const HEX_MAP = {
    '0': '0000',
    '1': '0001',
    '2': '0010',
    '3': '0011',
    '4': '0100',
    '5': '0101',
    '6': '0110',
    '7': '0111',
    '8': '1000',
    '9': '1001',
    'A': '1010',
    'B': '1011',
    'C': '1100',
    'D': '1101',
    'E': '1110',
    'F': '1111',
};

const TYPE_MAP = {
    0: 'SUM',
    1: 'PRODUCT',
    2: 'MIN',
    3: 'MAX',
    4: 'LITERAL',
    5: 'GT',
    6: 'LT',
    7: 'EQ'
};

const LITERAL = 4;

function part1(input) {
    input = input.slice();
    const chars = input.split('');

    let binary = chars.map(x => HEX_MAP[x]).join('').split('');
    const packets = [];
    while(binary.length) {
        const [packet, remainingBinary] = parsePacket(binary);
        packets.push(packet);
        binary = remainingBinary;
    }

    return sumVersion(packets);
}

function sumVersion(packets) {
    let sum = 0;
    for (const packet of packets) {
        sum += packet.version;
        if (packet.subPackets) {
            sum += sumVersion(packet.subPackets);
        }
    }
    return sum;
}

function parsePacket(binary) {
    // d('parsePacket start: %o', binary);
    const packet = {};
    packet.version = parseInt(binary.splice(0, 3).join(''), 2);
    packet.type = parseInt(binary.splice(0, 3).join(''), 2);
    // d('version: %o, type: %o (%o)', packet.version, packet.type, TYPE_MAP[packet.type]);
    if (Number.isNaN(packet.version) || Number.isNaN(packet.type)) {
        d('bad header');
        return [packet, binary];
    }

    switch (packet.type) {
        case LITERAL:
            const digits = [];
            while(binary.splice(0, 1)[0] === '1') {
                digits.push(binary.splice(0, 4));
            }
            digits.push(binary.splice(0, 4));
            packet.digits = digits;
            packet.value = parseInt(_.flatten(digits).join(''), 2);
            break;
        
        default:
            // OPERATOR
            packet.lengthType = binary.splice(0, 1)[0];
            // d('lengthtype: %o', packet.lengthType);

            if (packet.lengthType === '0') {
                // 15 bit length
                const rawLen = binary.splice(0, 15).join('');
                packet.length = parseInt(rawLen, 2);
                if (Number.isNaN(packet.length)) {
                    d('could not parse length %o', packet.length);
                    return [packet, binary];
                }
                // d('parsing subpackets of length %o', packet.length);
                let subBinary = binary.splice(0, packet.length);
                packet.subPackets = [];
                while(subBinary.length) {
                    const [subPacket, remainingBinary] = parsePacket(subBinary);
                    packet.subPackets.push(subPacket);
                    subBinary = remainingBinary;
                }
            } else if (packet.lengthType === '1') { 
                // 11 bit packet quantity
                const rawNum = binary.splice(0, 11).join('');
                packet.numSubpackets = parseInt(rawNum, 2);
                if (Number.isNaN(packet.numSubpackets)) {
                    d('could not parse numSubpackets %o', rawNum);
                    return [packet, binary];
                }
                // d('parsing %o subpackets', packet.numSubpackets);
                let packetsLeft = packet.numSubpackets;
                packet.subPackets = [];
                while(packetsLeft-- > 0) {
                    const [subPacket, remainingBinary] = parsePacket(binary);
                    packet.subPackets.push(subPacket);
                    binary = remainingBinary;
                }
            } else {
                d('bad packet length type');
            }
    }
    return [packet, binary];
}

function part2(input) {
    input = input.slice();
    const chars = input.split('');

    let binary = chars.map(x => HEX_MAP[x]).join('').split('');
    const packets = [];
    while(binary.length) {
        const [packet, remainingBinary] = parsePacket(binary);
        packets.push(packet);
        binary = remainingBinary;
    }

    return evalPacket(packets[0]);
}

function evalPacket(packet) {
    switch (packet.type) {
        case 0:  // SUM
            return _.sum(packet.subPackets.map(evalPacket));

        case 1: // PRODUCT
            const [first, ...rest] = packet.subPackets;
            return rest.reduce(
                (acc, val) => (acc * evalPacket(val)),
                evalPacket(first)
            );

        case 2: // MIN
            return _.min(packet.subPackets.map(evalPacket));

        case 3: // MAX
            return _.max(packet.subPackets.map(evalPacket));

        case 4: // LITERAL
            return packet.value;

        case 5: // GT
            const [a, b] = packet.subPackets.map(evalPacket);
            return a > b ? 1 : 0;

        case 6: // LT
            const [c, dd] = packet.subPackets.map(evalPacket);
            return c < dd ? 1 : 0;

        case 7: // EQ
            const [e, f] = packet.subPackets.map(evalPacket);
            return e === f ? 1 : 0;

        default:
            d('unknown packet type');
            return 0;
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

