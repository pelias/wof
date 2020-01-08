const index = require('./index')

module.exports.interface = (test) => {
  test('interface', (t) => {
    t.true(index.sqlite)
    t.true(index.stream)
    t.true(index.whosonfirst)
    t.true(index.yargs)
    t.end()
  })
}
