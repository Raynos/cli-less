var h = require('virtual-dom/h')

module.exports = Render

function Render(state) {
    var buffer = state.helpMode ?
        state.helpBuffer : state.mainBuffer

    var footerLoc = buffer.lines.length - buffer.index
    footerLoc = footerLoc < state.height ?
        footerLoc : state.height

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
    var offset = buffer.index

    return range(state.height + 1).map(function (index) {
        if (index === 0 || index === state.height) {
            return h('line', { x: 1, y: index }, '')
        } else {
            var text = buffer.lines[offset + index - 1] || ''
            return h('line', { x: 1, y: index }, text)
        }
    })
}

function range(end) {
    var arr = []
    for (var i = 0; i < end; i++) {
        arr[i] = i;
    }
    return arr
}
