var fs = require('fs');
var process = require('process');

var _fs = process.binding('fs');
var _constants = process.binding('constants');
var _TTY = process.binding('tty_wrap').TTY;

module.exports = restoreTTY;

function restoreTTY(rs) {
    var fd;

    if (process.platform === 'win32') {
        fd = _fs.open('CONIN$', _constants.O_RDWR, 438);
    } else {
        fd = fs.openSync('/dev/tty', 'r');
    }

    // force raw mode off
    var tty = new _TTY(fd, false);
    tty.setRawMode(false);
}
