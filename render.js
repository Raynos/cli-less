module.exports = Render

function Render(charm, state) {
    charm.push()
    charm.cursor(false)
    for (var i = 0; i < state.height; i++) {
        charm.position(1, i)
        charm.erase('end')
        charm.write(state.lines[state.index + i] || '')
    }
    charm.cursor(true)
    charm.pop()

    charm.push()
    charm.position(1, state.height)
    charm.foreground('black')
    charm.background('white')
    charm.write(state.footer)

    charm.pop()
    charm.position(state.footer.length + 1, state.height)
    charm.display('reset')
}
