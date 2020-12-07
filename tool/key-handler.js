module.exports = {
    initialise,
    update
}

const keyHandlers = {};

function initialise(keyMap) {
    Object.assign(keyHandlers, keyMap);
    
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.on('data', function(keyBuf) {
        keyBuf.toString().split('').forEach(key => {
            keyHandlers[key] && keyHandlers[key]();
        });
    });
}

function update(map) {
    Object.assign(keyHandlers, map);
}
