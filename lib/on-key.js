module.exports = onKey

function onKey(stdin, context, opts) {
    var keys = Object.keys(opts).map(function (key) {
        var parts = key.split('|')

        var isCtrl = false
        parts = parts.map(function (part) {
            if (part.substr(0, 5) === 'Ctrl-') {
                isCtrl = true
                part = part.substr(5)
            }

            return part.toLowerCase()
        })

        return [parts, {
            isCtrl: isCtrl
        }, opts[key]]
    })

    stdin.on('keypress', function (ch, key) {
        if (!key) {
            return
        }

        // console.log('key', key.name)

        keys.some(function (triplet) {
            var keys = triplet[0]
            var isCtrl = triplet[1].isCtrl
            var handler = triplet[2]

            if (keys.indexOf(key.name) !== -1 &&
                isCtrl === key.ctrl
            ) {
                handler(context, ch, key)
                return true
            }
        })
    })
}
