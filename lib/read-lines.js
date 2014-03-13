var fs = require('fs')
var split = require('split')
var through = require('through')

module.exports = readLines

function readLines(stream, fn) {
    if (typeof stream === 'string') {
        stream = fs.createReadStream(stream, 'utf8')
    }

    return stream
        .pipe(split())
        .pipe(through(fn))
}
