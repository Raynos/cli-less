var fs = require('fs')
var split = require('split')
var through = require('through')

module.exports = readLines

function readLines(fileName, fn) {
    fs.createReadStream(fileName, 'utf8')
        .pipe(split())
        .pipe(through(fn))
}
