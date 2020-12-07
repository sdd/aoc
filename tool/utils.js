const path = require('path');
const chokidar = require('chokidar');

const fileAccess = require('./file-access');

module.exports = {
    createWatcher,
    gracefulExit,
};

function gracefulExit(state) {
    console.log('exiting...');
    // TODO: save history
    state.watcher && state.watcher.close().then(() => console.log('file watcher stopped'));
    process.exit(0);
}

function createWatcher(state, fn) {
    return chokidar.watch([
        path.join(fileAccess.getDayFolderPath(state)),
        path.join(state.pkgDir, '*.js')
    ]).on('change', fn);
}
