const path = require('path')
const modulePath = path.join(__dirname, '/..')
const shell = require('./shell')

module.exports = (...args) => {
  return shell.duplex(
    'node',
    [`--max_old_space_size=8192`, `${modulePath}/bin/wof.js`, ...args]
  )
}
