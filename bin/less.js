var process = require('process')
var path = require('path')
var parseArgs = require('minimist')

var readLines = require('../lib/read-lines.js')
var LessCLI = require('../index.js')

var argv = parseArgs(process.argv.slice(2))
var less = runLess()
process.stdin.resume()

if (argv.help) {
    var loc = path.join(__dirname, '..', 'docs.txt')
    readLines(loc, less.addLine)
} else if (argv._[0]) {
    readLines(loc, less.addLine)
}

function runLess() {
    var less = LessCLI(process.stdin)
    less.stream.pipe(process.stdout)

    return less
}
