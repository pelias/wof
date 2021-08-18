const fix = require('../../../whosonfirst/fix')
const stream = {
  json: require('../../../stream/json'),
  miss: require('../../../stream/miss')
}

module.exports = {
  command: 'fix',
  describe: 'attempt to fix features in a stream',
  builder: (yargs) => {
    // optional params
    yargs.option('concordances', {
      type: 'boolean',
      default: false,
      describe: 'Fix missing concordances.'
    })
  },
  handler: (argv) => {
    let fixes = 0

    // concordances fixes
    if (argv.concordances) {
      if (argv.verbose) { console.error('fixing missing concordances') }
      fixes++
    }

    // ensure at least one fix is enabled
    if (fixes < 1) {
      console.error('you must enable at least one fix, see --help')
      process.exit(1)
    }

    // process stream
    process.stdin
      .pipe(stream.json.parse())
      .pipe(stream.miss.through.obj((feat, enc, next) => {
        if (argv.concordances) { fix.concordances(feat) }
        next(null, JSON.stringify(feat))
      }))
      .pipe(process.stdout)
  }
}
