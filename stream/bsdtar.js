const shell = require('./shell')

module.exports.extract = (...args) => shell.duplex(
  'bsdtar',
  ['-xOf', '-', ...args]
)

// man page: the file listing will be written to stderr rather than the usual stdout
// the bash-foo is used in order to 'switch' stderr and stderr streams
module.exports.list = (...args) => shell.duplex(
  'bash',
  ['-c', 'set -o noglob; 3>&1 1>&2 2>&3 bsdtar -tOf - ' + args.join(' ')]
)
