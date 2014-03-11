var process = require('process')
var fs = require('fs')
var path = require('path')
var parseArgs = require('minimist')

var less = require('../index.js')

var argv = parseArgs(process.argv.slice(2))

var s = runLess()

process.stdin.resume()

if (argv.help) {
    var loc = path.join(__dirname, '..', 'docs.txt')
    fs.createReadStream(loc).pipe(s, {
        end: false
    })
}

function runLess() {
    var stream = less(process.stdin)
    stream.pipe(process.stdout)

    return stream
}
