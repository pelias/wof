const path = require('path')
const req = require('require-all')
const all = (p) => req({
  dirname: path.join(__dirname, p),
  filter: (name) => {
    if (!name.endsWith('.js')) { return false }
    if (name.endsWith('.test.js')) { return false }
    return path.basename(name, '.js')
  },
  recursive: true
})

// export all library modules
module.exports = {
  sqlite: all('./sqlite'),
  stream: all('./stream'),
  whosonfirst: all('./whosonfirst'),
  yargs: all('./bin/cmd')
}
