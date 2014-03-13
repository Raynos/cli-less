#!/usr/bin/env node

var process = require('process')
var path = require('path')
var parseArgs = require('minimist')

var readLines = require('../lib/read-lines.js')
var LessCLI = require('../index.js')
var openTTY = require('../lib/open-tty.js')

var argv = parseArgs(process.argv.slice(2))
var less = runLess()

if (argv.help) {
    var loc = path.join(__dirname, '..', 'docs.txt')
    readLines(loc, less.addLine)
} else if (argv._[0]) {
    readLines(argv._[0], less.addLine)
}

if (!process.stdin.isTTY) {
    readLines(process.stdin, less.addLine)
    // process.stdin.resume()
}

function runLess() {
    var inputStream = process.stdin.isTTY ?
        process.stdin : openTTY()
    var less = LessCLI(inputStream)
    less.stream.pipe(process.stdout)

    inputStream.resume()

    return less
}
