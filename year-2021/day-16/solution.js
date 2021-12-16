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

/**
 * Input parser.
 * @param {raw} raw unmodified input string from input-01.txt
 * @param {line} raw split on newlines, empty items removed, items trimmed
 * @param {comma} raw split on commas, empty items removed, items trimmed
 * @param {space} raw split on spaces, empty lines removed, items trimmed
 * @param {multi} raw, split on double newlines, empty items removed, split again on newlines, items trimmed
 */
function parse({ raw, line, comma, space, multi }) {
    const chars = line[0].slice().split('');
    return chars.map(x => HEX_MAP[x]).join('').split('');
}

function part1(binary) {
    binary = binary.slice();
    const packets = [];
    let packet;
    while(binary.length) {
        ([packet, binary] = parsePacket(binary));
        packets.push(packet);
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

function binTakeInt(binary, digits) {
    return parseInt(binary.splice(0, digits).join(''), 2);
}

function parsePacket(binary) {
    const packet = {
        subPackets: [],
        version: binTakeInt(binary, 3),
        type: binTakeInt(binary, 3)
    };
    let subPacket;

    switch (packet.type) {
        case 4: // LITERAL
            let digits = [];
            while(binary.splice(0, 1)[0] === '1') {
                digits = digits.concat(binary.splice(0, 4));
            }
            digits = digits.concat(binary.splice(0, 4));
            packet.value = binTakeInt(digits, digits.length);
            break;
        
        default: // OPERATOR
            packet.lengthType = binary.splice(0, 1)[0];

            if (packet.lengthType === '0') { // 15 bit length
                packet.length = binTakeInt(binary, 15);
                
                let subBinary = binary.splice(0, packet.length);
                while(subBinary.length) {
                    ([subPacket, subBinary] = parsePacket(subBinary));
                    packet.subPackets.push(subPacket);
                }

            } else { // 11 bit packet quantity
                packet.numSubpackets = binTakeInt(binary, 11);
                
                let packetsLeft = packet.numSubpackets;
                while(packetsLeft-- > 0) {
                    ([subPacket, binary] = parsePacket(binary));
                    packet.subPackets.push(subPacket);
                }
            }
    }
    return [packet, binary];
}

function part2(input) {
    return evalPacket(parsePacket(input)[0]);
}

function evalPacket(packet) {
    if (packet.type === 4) {
        return packet.value;
    }

    const subPacketVals = packet.subPackets.map(evalPacket);

    switch (packet.type) {
        case 0:  // SUM
            return _.sum(subPacketVals);

        case 1: // PRODUCT
            return _.reduce(subPacketVals, _.multiply);

        case 2: // MIN
            return _.min(subPacketVals);

        case 3: // MAX
            return _.max(subPacketVals);

        case 5: // GT
            return subPacketVals[0] > subPacketVals[1] ? 1 : 0;

        case 6: // LT
            return subPacketVals[0] < subPacketVals[1] ? 1 : 0;

        case 7: // EQ
            return subPacketVals[0] === subPacketVals[1] ? 1 : 0;

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

