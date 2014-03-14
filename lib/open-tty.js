var process = require('process')
var fs = require('fs')
var keypress = require('keypress')
var ReadStream = require('tty').ReadStream
var _fs = process.binding('fs')
var _constants = process.binding('constants')

module.exports = openTTY

function openTTY() {
    var fd
    // wtf hack
    if (process.platform === 'win32') {
        fd = _fs.open('CON:', _constants.O_RDONLY, 438)
    } else {
        fd = fs.openSync('/dev/tty', 'r')
    }

    var tty = new ReadStream(fd, {
        highWaterMark: 0,
        readable: true,
        writable: false
    })
    tty.setRawMode(true)
    keypress(tty)

    return tty
}
