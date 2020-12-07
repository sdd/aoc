const NOTHING = undefined;

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
    if (dxy < 0) { dxy = dxy + 4; }
    if (dxy > 3) { dxy = dxy - 4; }

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
