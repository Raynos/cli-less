var Charm = require('charm')
var process = require('process')
var duplexer = require('duplexer')
var ansirecover = require('ansi-recover')
var split = require('split')
//var encode = require('charm/lib/encode')
var keypress = require('keypress')
var fs = require('fs')
var path = require('path')
var through = require('through')

var onKey = require('./lib/on-key.js')

// this recovers the terminal on process.exit()
ansirecover({ cursor: true, mouse: true })

module.exports = less

function less(stdin) {
    keypress(stdin)

    if (typeof stdin.setRawMode === 'function') {
        stdin.setRawMode(true)
    }

    var charm = Charm()
    var stream = split()
    var height = process.stdout.rows || 24
    var width = process.stdout.columns || 80
    var context = {
        charm: charm,
        stream: stream,
        stdin: stdin,
        lines: [],
        index: 0,
        height: height,
        width: width,
        footer: ''
    }

    stream.pipe(through(write))

    onKey(stdin, context, {
        'Ctrl-c|Ctrl-d|q': exit,
        'h|H': help,
        'enter|return|e|j': moveForward,
        'Ctrl-N|Ctrl-E|Ctrl-J': moveForward,
        'space|f': moveForwardPage,
        'Ctrl-V|Ctrl-F': moveForwardPage,
        't': function () {
            // setIndex(context, context.index + 1)
        }
    })

    return duplexer(stream, charm)

    function write(line) {
        context.lines.push(line)

        var currIndex = context.lines.length - 1
        if (currIndex < (context.index + height - 1)) {
            // console.log('line', line.length)
            // console.log('currIndex', currIndex, index + height)
            charm.push()
            charm.position(1, currIndex)
            charm.write(line + '\n')
            charm.pop()
        }
    }
}

function moveForwardPage(context) {
    setIndex(context, context.index + context.height - 1)
}

function moveForward(context) {
    setIndex(context, context.index + 1)
}

function setIndex(context, index) {
    if (index < 0 || index > context.lines.length) {
        throw new Error('Out of bounds rendering')
    }

    var charm = context.charm

    // forward path
    var diff = index - context.index
    // diff is positive number
    if (diff > 0) {
        charm.push()
        charm.cursor(false)
        for (var j = 0; j < context.height; j++) {
            charm.position(1, j)
            charm.erase('end')
            charm.write(context.lines[index + j])
        }
        charm.cursor(true)
        charm.pop()
        printFooter(context, context.footer)
    }

    context.index = index
}

function help(context) {
    var loc = path.join(__dirname, 'docs.txt')

    printFooter(context, 'HELP -- press RETURN for more, ' +
        'or q when done')

    fs.createReadStream(loc, {
        encoding: 'utf8'
    }).pipe(context.stream, {
        end: false
    })
}

function exit(context) {
    var stdin = context.stdin
    if (typeof stdin.setRawMode === 'function') {
        stdin.setRawMode(false)
    }
    stdin.pause()
}

function printFooter(context, text) {
    var charm = context.charm

    context.footer = text

    charm.push()
    charm.position(1, context.height)
    charm.foreground('black')
    charm.background('white')
    charm.write(text)

    charm.pop()
    charm.position(text.length + 1, context.height)
    charm.display('reset')
}
