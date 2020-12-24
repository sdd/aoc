const d = require('debug')('aoc:maze');

const NOTHING = undefined;

// Definitions:
// RC:   RowColumn. an absolute position in the form of [row, column].
// RCD:  RowColumnDelta. Change in RowColumn to move in a specific direction
// D4:   Dir4. Integer from 0-3 representing a cardinal direction
// D6:   Dir6. Integer from 0-5 representing a direction on a hex grid
// D8:   Dir8. Integer from 0-7 representing cardinal or diagonal direction
// D / DIST: Integer representing a multiplier of RCD over which to move

const D4_TO_RCD = Object.freeze([
    [-1, 0], // N / U
    [0, 1],  // E / R
    [1, 0],  // S / D
    [0, -1], // W / L
]);

const D6_TO_RCD = Object.freeze([
    [-1, 1],   // NE
    [0, 1],    // E
    [1, 0],    // SE
    [1, -1],   // SW
    [0, -1],   // W
    [-1, 0],   // NW
]);

const D8_TO_RCD = Object.freeze([
    [-1, 0],  // N / U
    [-1, 1],  // NE
    [0, 1],   // E / R
    [1, 1],   // SE
    [1, 0],   // S / D
    [1, -1],  // SW
    [0, -1],  // W / L
    [-1, -1], // NW
]);

const S8_TO_D8 = Object.freeze({
    ne: 0,
    e: 1,
    se: 2,
    sw: 3,
    w: 4,
    nw: 5,
});

module.exports = {
    newState,
    setDir,
    turnDir,
    moveForward,
    taxiDist,
};

function newState(x = 0, y = 0, dxy = 0) {
    return {
        x,
        y,
        dxy,
        beforeEnter: () => NOTHING
    };
}

function setDir(state, dxy) {
    state.dxy = dxy;
    return state;
}

function turnDir(state, deltaDxy) {
    let dxy = state.dxy + deltaDxy;
    dxy = ((dxy % 4) + 4) % 4;

    state.dxy = dxy;
    d('new dir: %d', dxy);

    return state;
}

function moveForward(state, dist) {
    let xy = DXY_TO_XY[state.dxy];

    for(i = 0; i < Math.abs(dist); i += Math.sign(dist)) {
        const newPos = [state.pos[0] + xy[0], state.pos[1] + xy[1]];
        const action = state.beforeEnter(newPos);
        if (action === NOTHING) {
            state.pos = newPos;
        } else if (action === STOP) {
            return false;
        }
    }
    return true;
}

function taxiDist(xy, xy2 = [0, 0]) {
    return Math.abs(xy[0] - xy2[0]) + Math.abs(xy[1] - xy2[1]);
}
