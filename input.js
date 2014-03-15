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

    onKey(stdin, {
        'Ctrl-c|Ctrl-d|q': onExit,
        'h|H': onHelp,
        'enter|return|e|j|Ctrl-N|Ctrl-E|Ctrl-J|down': onMoveForward,
        'y|Ctrl+Y|Ctrl+P|l|Ctrl+K|up': onMoveBackward,
        'space|f|Ctrl-V|Ctrl-F': onMoveForwardPage,
        'b|Ctrl+B': onMoveBackwardPage
    })

    return { events: events, sinks: sinks }

    function onHelp() {
        sinks.help.write({})
    }

    function onExit() {
        sinks.exit.write({})
    }

    function onMoveForward() {
        sinks.moveForward.write(1)
    }

    function onMoveForwardPage() {
        sinks.moveForwardPage.write(1)
    }

    function onMoveBackward() {
        sinks.moveForward.write(-1)
    }

    function onMoveBackwardPage() {
        sinks.moveForwardPage.write(-1)
    }
}
