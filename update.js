var path = require('path')

var readLines = require('./lib/read-lines.js')

module.exports = {
    addLine: addLine,
    moveForward: moveForward,
    moveForwardPage: moveForwardPage,
    setHelp: setHelp,
    exit: exit
}

function addLine(state, line) {
    state.mainBuffer.lines.push(line)
}

function moveForward(state, direction) {
    var buffer = getBuffer(state)
    var diff = direction * (state.height() - 1)

    setIndex(state, buffer.index() + diff)
}

function moveForwardPage(state, direction) {
    setIndex(state, getBuffer(state).index() + direction)
}

function exit(state) {
    if (state.helpMode()) {
        state.helpBuffer.index.set(0)
        return state.helpMode.set(false)
    }

    state.hardExit.set(true)
}

function setHelp(state) {
    if (state.helpMode()) {
        return
    }

    state.helpMode.set(true)
    var buffer = getBuffer(state)

    buffer.footer.set('HELP -- press RETURN for ' +
        'more, or q when done')

    if (buffer.lines().length > 0) {
        return
    }

    var loc = path.join(__dirname, 'docs.txt')
    readLines(loc, function (line) {
        buffer.lines.push(line)
    })
}

function setIndex(state, index) {
    var bounded = index
    var buffer = getBuffer(state)

    if (index < 0) {
        bounded = 0
    } else if (index > buffer.lines().length) {
        bounded = buffer.lines().length
    }

    buffer.index.set(bounded)
}

function getBuffer(state) {
    return state.helpMode() ? state.helpBuffer : state.mainBuffer
}
