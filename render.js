var h = require('virtual-dom/h')

module.exports = Render

function Render(state) {
    var buffer = state.helpMode ?
        state.helpBuffer : state.mainBuffer
    var footerLoc = buffer.lines.length < state.height ?
        buffer.lines.length : state.height

    return h('screen', [
        h('section', textLines(state, buffer)),
        footer(buffer, footerLoc),
        h('cursor', {
            x: buffer.footer.length + 1,
            y: footerLoc
        })
    ])

    /*
    charm.push()
    charm.cursor(false)
    for (var i = 0; i < state.height; i++) {
        charm.position(1, i)
        charm.erase('end')
        charm.write(buffer.lines[buffer.index + i - 1] || '')
    }
    charm.cursor(true)
    charm.pop()
    */

    /*
    charm.push()
    charm.position(1, state.height)
    charm.erase('end')
    charm.pop()
    */

    /*
    charm.push()
    charm.position(1, footerLoc)
    charm.erase('end')
    charm.foreground('black')
    charm.background('white')
    charm.write(buffer.footer)
    */

    /*
    charm.pop()
    charm.position(buffer.footer.length + 1, footerLoc)
    charm.display('reset')
    */
}

function footer(buffer, footerLoc) {
    return h('line', {
        x: 1,
        y: footerLoc,
        foreground: 'black',
        background: 'white'
    }, buffer.footer)
}

function textLines(state, buffer) {
    var index = buffer.index
    var lines = buffer.lines.slice(index, index + state.height - 1)

    return lines.map(function (text, index) {
        return h('line', {
            x: 1, y: index
        }, text || '')
    })
}
