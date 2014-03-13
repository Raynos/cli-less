module.exports = Render

function Render(charm, state) {
    var buffer = state.helpMode ?
        state.helpBuffer : state.mainBuffer

    charm.push()
    charm.cursor(false)
    for (var i = 0; i < state.height; i++) {
        charm.position(1, i)
        charm.erase('end')
        charm.write(buffer.lines[buffer.index + i - 1] || '')
    }
    charm.cursor(true)
    charm.pop()

    charm.push()
    charm.position(1, state.height)
    charm.erase('end')
    charm.foreground('black')
    charm.background('white')
    charm.write(buffer.footer)

    charm.pop()
    charm.position(buffer.footer.length + 1, state.height)
    charm.display('reset')
}
