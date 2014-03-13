var EventSinks = require('event-sinks/geval')
var uuid = require('uuid')

var onKey = require('./lib/on-key.js')

/* Input takes RAW input sources and converts them to
    a set of Events

*/
module.exports = createInputs

function createInputs(stdin) {
    var events = EventSinks(uuid(), [
        'exit', 'help', 'moveForward', 'moveForwardPage'
    ])
    var sinks = events.sinks

    if (typeof stdin.setRawMode === 'function') {
        stdin.setRawMode(true)
    }

    onKey(stdin, {
        'Ctrl-c|Ctrl-d|q': onExit,
        'h|H': onHelp,
        'enter|return|e|j|Ctrl-N|Ctrl-E|Ctrl-J': onMoveForward,
        'space|f|Ctrl-V|Ctrl-F': onMoveForwardPage
    })

    return { events: events, sinks: sinks }

    function onHelp() {
        sinks.help.write({})
    }

    function onExit() {
        sinks.exit.write({})
    }

    function onMoveForward() {
        sinks.moveForward.write({})
    }

    function onMoveForwardPage() {
        sinks.moveForwardPage.write({})
    }
}
