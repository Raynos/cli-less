var Charm = require('charm')
var process = require('process')
var ansirecover = require('ansi-recover')
var extend = require('xtend/mutable')
var EventEmitter = require('events').EventEmitter

var render = require('./lib/charm-render.js')
var main = require('./lib/main.js')
var Input = require('./input.js')
var State = require('./state.js')
var Update = require('./update.js')
var Render = require('./render.js')

// this recovers the terminal on process.exit()
ansirecover({ cursor: true, mouse: true })

module.exports = createLess

function createLess(readStream) {
    var input = Input(readStream)
    var state = State({
        height: process.stdout.rows,
        width: process.stdout.columns
    })
    var charm = Charm()
    var less = wireUpEvents(state, input.events)

    // allow charm to be piped somewhere before we start
    // rendering to it
    process.nextTick(function () {
        // wire up state (from update) to Render
        var loop = main(state(), Render, {
            charm: charm,
            render: render,
            renderOnly: true
        })

        state(function (newState) {
            loop.update(newState)
        })
    })

    return extend(less, {
        charm: charm,
        addLine: Update.addLine.bind(null, state)
    })
}

function wireUpEvents(state, events) {
    var less = new EventEmitter()

    // wire up input to update
    events.exit(Update.exit.bind(null, state))
    events.moveForward(Update.moveForward.bind(null, state))
    events.moveForwardPage(Update.moveForwardPage.bind(null, state))
    events.help(Update.setHelp.bind(null, state))

    state.hardExit(exit)

    return less

    function exit() {
        less.emit('exit')
    }
}
