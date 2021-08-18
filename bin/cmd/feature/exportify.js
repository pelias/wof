const _ = require('lodash')
const stream = {
  json: require('../../../stream/json'),
  miss: require('../../../stream/miss'),
  marshaller: require('../../../stream/marshaller')
}

module.exports = {
  command: 'exportify',
  describe: 'run WOF exportify tool on features',
  builder: (yargs) => {
    // optional params
    yargs.option('exportify-host', {
      type: 'string',
      describe: 'Specify the URI of a running wof-exportify-www instance (including scheme and port).'
    })
  },
  handler: (argv) => {
    process.stdin
      .pipe(stream.json.parse())
      .pipe(stream.marshaller({
        verbose: (argv.verbose === true),
        exportify: {
          enabled: true,
          host: _.get(argv, 'exportify-host')
        }
      }))
      .pipe(process.stdout)
  }
}
