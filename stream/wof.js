const path = require('path')
const modulePath = path.join(__dirname, '/..')
const shell = require('./shell')

module.exports = (...args) => {
  return shell.duplex(
    'node',
    [`${modulePath}/bin/wof.js`, ...args]
  )
}
