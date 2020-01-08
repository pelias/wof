const shell = require('./shell')

module.exports.extract = (...args) => shell.duplex(
  'bsdtar',
  ['-xO', ...args]
)

// man page: the file listing will be written to stderr rather than the usual stdout
module.exports.list = (...args) => shell.duplexStderr(
  'bsdtar',
  ['-tO', ...args]
)
