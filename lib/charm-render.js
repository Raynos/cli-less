var globalCharm = require('charm')

module.exports = render

function render(tree, opts) {
    opts = opts || {}

    var charm = opts.charm || globalCharm

    treeWalker(tree, function (node) {
        if (node.tagName === 'line') {
            renderLine(charm, node)
        } else if (node.tagName === 'cursor') {
            renderCursor(charm, node)
        }
    })
}

function renderLine(charm, node) {
    var text = (node.children[0] && node.children[0].text) || ''

    charm.push()
    charm.cursor(false)

    charm.position(node.properties.x, node.properties.y)
    charm.erase('end')

    if (node.properties.foreground) {
        charm.foreground(node.properties.foreground)
    }
    if (node.properties.background) {
        charm.background(node.properties.background)
    }

    charm.write(text)

    if (node.properties.foreground ||
        node.properties.background
    ) {
        charm.display('reset')
    }

    charm.cursor(true)
    charm.pop()
}

function renderCursor(charm, node) {
    charm.position(node.properties.x, node.properties.y)
}

function treeWalker(tree, fn) {
    fn(tree)

    if (tree.children) {
        tree.children.forEach(function (child) {
            treeWalker(child, fn)
        })
    }
}
