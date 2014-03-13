var keypress = require('keypress')

module.exports = onKey

function onKey(stdin, opts) {
    keypress(stdin)

    var keys = Object.keys(opts).map(function (key) {
        var parts = key.split('|')

        var isCtrls = []
        parts = parts.map(function (part, index) {
            if (part.substr(0, 5) === 'Ctrl-') {
                isCtrls[index] = true
                part = part.substr(5)
            } else {
                isCtrls[index] = false
            }

            return part.toLowerCase()
        })

        return [parts, {
            isCtrls: isCtrls
        }, opts[key]]
    })

    stdin.on('keypress', function (ch, key) {
        if (!key) {
            return
        }

        // console.log('key', key.name)

        keys.some(function (triplet) {
            var keys = triplet[0]
            var isCtrls = triplet[1].isCtrls
            var handler = triplet[2]
            var index = keys.indexOf(key.name)

            if (index !== -1 && isCtrls[index] === key.ctrl) {
                handler(ch, key)
                return true
            }
        })
    })
}
