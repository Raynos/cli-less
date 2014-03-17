#!/usr/bin/env node

var ansirecover = require('ansi-recover')
var process = require('process')
var path = require('path')
var parseArgs = require('minimist')
var opentty = require('opentty')
var restoretty = require('restoretty')

var readLines = require('../lib/read-lines.js')
var LessCLI = require('../index.js')

module.exports = runLess

if (require.main === module) {
    main(parseArgs(process.argv.slice(2)))
}

function main(argv) {
    var less = runLess()

    if (argv.help) {
        var loc = path.join(__dirname, '..', 'docs.txt')
        readLines(loc, less.addLine)
    } else if (argv._[0]) {
        readLines(argv._[0], less.addLine)
    }

    if (!process.stdin.isTTY) {
        readLines(process.stdin, less.addLine)
    }
}

function runLess() {
    // this recovers the terminal on process.exit()
    ansirecover({ cursor: true, mouse: true })

    var inputStream = opentty()
    var less = LessCLI(inputStream)
    less.charm.pipe(process.stdout)

    less.once('exit', function () {
        // reset charm in win32 but not linux
        // the ansirecover full screen mode hack only
        // works in linux, so dont need to reset linux
        if (process.platform === 'win32') {
            less.charm.reset()
        }

        console.log('')
        restoretty()

        // delayed exit otherwise ansirecover doesn't work
        setTimeout(function () {
            process.exit();
        }, 5)
    })

    return less
}
