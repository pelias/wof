const path = require('path')
const req = require('require-all')
const all = (p) => req(path.join(__dirname, p))

// export all library modules
module.exports = {
  sqlite: all('./sqlite'),
  stream: all('./stream'),
  whosonfirst: all('./whosonfirst'),
  yargs: all('./bin/cmd')
}
