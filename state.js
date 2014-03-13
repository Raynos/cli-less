var ObservHash = require('observ-hash')
var ObservArray = require('observ-array')
var Observ = require('observ')

/*
    mainBuffer: {
        index: index in the main buffer,
        lines: lines in the main buffer,
        footer: footer text of main buffer
    },
    helpBuffer: {
        index: index in help buffer,
        lines: lines in help buffer,
        footer: footer text of help buffer
    },
    height: height of screen,
    width: width of screen
    hardExit: if true then terminate pager,
    helpMode: if true then helpBuffer active else mainBuffer active
*/
module.exports = freshState

function freshState(opts) {
    opts = opts || {}

    return ObservHash({
        mainBuffer: ObservHash({
            index: Observ(opts.index || 0),
            lines: ObservArray(opts.lines || []),
            footer: Observ(opts.footer || '')
        }),
        helpBuffer: ObservHash({
            index: Observ(0),
            lines: ObservArray([]),
            footer: Observ('')
        }),
        height: Observ(opts.height || 24),
        width: Observ(opts.width || 80),
        hardExit: Observ(false),
        helpMode: Observ(false)
    })
}
