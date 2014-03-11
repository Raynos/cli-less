var test = require("tape")

var cliLess = require("../index")

test("cliLess is a function", function (assert) {
    assert.equal(typeof cliLess, "function")
    assert.end()
})
