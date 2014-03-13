var ObservHash = require('observ-hash')
var ObservArray = require('observ-array')
var Observ = require('observ')

module.exports = freshState

function freshState(opts) {
    opts = opts || {}

    return ObservHash({
        index: Observ(opts.index || 0),
        height: Observ(opts.height || 24),
        width: Observ(opts.width || 80),
        lines: ObservArray(opts.lines || []),
        footer: Observ(opts.footer || '')
    })
}
