var fs = require('fs')
var keypress = require('keypress')
var ReadStream = require('tty').ReadStream

module.exports = openTTY

function openTTY() {
    var tty = new ReadStream(fs.openSync('/dev/tty', 'r'))
    tty.setRawMode(true)
    keypress(tty)

    return tty
}
