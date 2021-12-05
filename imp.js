const fs = require('fs');

module.exports = {
    commaStr: importSepParse(',', s => s.trim()),
    spaceStr: importSepParse(' ', s => s.trim()),
    lineStr: importSepParse('\n', s=> s.trim()),
    multiLineStr: importSepParse('\n\n', s=> s.trim()),
    commaNum: importSepParse(',', Number),
    spaceNum: importSepParse(' ', Number),
    lineNum: importSepParse('\n', Number),
    arrCommaSep,
    arrLineSep,
    importSepParse,
};

function arrLineSep(filename) {
    return fs.readFileSync(filename, 'utf8').split('\n');
}

function arrCommaSep(filename) {
    return fs.readFileSync(filename, 'utf8').split(',');
}

function importSepParse(sep, parse, filterEmptyLines = true) {
    return function importer(filename) {
        return strSepParse(fs.readFileSync(filename, 'utf8'), filterEmptyLines);
    };
}

function strSepParse(sep, parse, filterEmptyLines = true) {
    return function strParser(str) {
        return str
            .split(sep)
            .filter(x => (x !== '' || !filterEmptyLines))
            .map(parse);
    };
}


