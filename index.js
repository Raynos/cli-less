var Charm = require('charm')
var process = require('process')
var ansirecover = require('ansi-recover')
var raf = require('raf').polyfill

var Input = require('./input.js')
var State = require('./state.js')
var Update = require('./update.js')
var Render = require('./render.js')

// this recovers the terminal on process.exit()
ansirecover({ cursor: true, mouse: true })

module.exports = less

function less(tty) {
    var input = Input(tty)
    var events = input.events
    var state = State({
        height: process.stdout.rows,
        width: process.stdout.columns
    })
    var charm = Charm()

    // render initial and render on change
    var loop = main(state, Render, charm)

    events.exit(Update.exit.bind(null, state))
    events.moveForward(Update.moveForward.bind(null, state))
    events.moveForwardPage(Update.moveForwardPage.bind(null, state))
    events.help(Update.setHelp.bind(null, state))

    state.hardExit(exit)

    return {
        stream: charm,
        addLine: Update.addLine.bind(null, state)
    }

    function exit() {
        if (typeof tty.setRawMode === 'function') {
            tty.setRawMode(false)
        }

        charm.reset()
        tty.destroy()
        loop.destroy()
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
