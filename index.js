var Charm = require('charm')
var process = require('process')
var ansirecover = require('ansi-recover')
var extend = require('xtend/mutable')
var EventEmitter = require('events').EventEmitter
var raf = require('raf').polyfill

var Input = require('./input.js')
var State = require('./state.js')
var Update = require('./update.js')
var Render = require('./render.js')

// this recovers the terminal on process.exit()
ansirecover({ cursor: true, mouse: true })

module.exports = createLess

function createLess(readStrean) {
    var input = Input(readStrean)
    var events = input.events
    var state = State({
        height: process.stdout.rows,
        width: process.stdout.columns
    })
    var charm = Charm()
    var less = new EventEmitter()

    // render initial and render on change
    var loop = main(state, Render, charm)

    events.exit(Update.exit.bind(null, state))
    events.moveForward(Update.moveForward.bind(null, state))
    events.moveForwardPage(Update.moveForwardPage.bind(null, state))
    events.help(Update.setHelp.bind(null, state))

    state.hardExit(exit)

    less.stream = charm
    less.addLine = Update.addLine.bind(null, state)

    return extend(less, {
        stream: charm,
        addLine: Update.addLine.bind(null, state),
        destroy: destroy
    })

    // reset charm in win32 but not linux
    // the ansirecover full screen mode hack only
    // works in linux, so dont need to reset linux
    function destroy() {
        if (process.platform === 'win32') {
            charm.reset()
        }

        loop.destroy()
    }

    function exit() {
        less.emit('exit')
    }
}

function main(state, render, target) {
    var dirty = false
    var terminate = false
    var currentState = state()

    process.nextTick(function () {
        render(target, currentState)
    })

    function markDirty() {
        if (!dirty) {
            dirty = true
        }
    }

    state(function (state) {
        markDirty()
        currentState = state
    })

    raf(redraw)

    return { destroy: destroy }

    function destroy() {
        terminate = true
    }

    function redraw() {
        if (terminate) {
            return
        }

        if (!dirty) {
            return raf(redraw)
        }

        render(target, currentState)

        dirty = false
        raf(redraw)
    }
}
