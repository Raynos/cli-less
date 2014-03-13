var path = require('path')

var readLines = require('./lib/read-lines.js')

module.exports = {
    addLine: addLine,
    moveForward: moveForward,
    moveForwardPage: moveForwardPage,
    setHelp: setHelp
}

function addLine(state, line) {
    state.lines.push(line)
}

function moveForward(state) {
    setIndex(state, state.index() + state.height() - 1)
}

function moveForwardPage(state) {
    setIndex(state, state.index() + 1)
}

function setIndex(state, index) {
    var bounded = index

    if (index < 0) {
        bounded = 0
    } else if (index > state.lines().length) {
        bounded = state.lines().length
    }

    state.index.set(bounded)
}

function setHelp(state) {
    state.footer.set('HELP -- press RETURN for more, ' +
        'or q when done')

    if (state.lines().length > 0) {
        throw new Error('help only works in empty buffer')
    }

    var loc = path.join(__dirname, 'docs.txt')
    readLines(loc, function (line) {
        addLine(state,line)
    })
}
