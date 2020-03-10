const _ = require('lodash')
const stream = { json: require('../../../stream/json') }

module.exports = {
  command: 'properties',
  describe: 'output feature properties',
  builder: (yargs) => {
    // optional params
    yargs.option('prefix', {
      type: 'string',
      alias: 'p',
      describe: 'Key starts with word. (multiple allowed)'
    })
    yargs.option('equals', {
      type: 'string',
      alias: 'e',
      describe: 'Key equals word. (multiple allowed)'
    })
    yargs.option('suffix', {
      type: 'string',
      alias: 's',
      describe: 'Key ends with word. (multiple allowed)'
    })
  },
  handler: (yargs) => {
    // only output feature properties
    process.stdin
      .pipe(stream.json.through((feat, enc, next) => {
        let properties = _.get(feat, 'properties', {})
        const filters = { prefix: [], equals: [], suffix: [] }

        if (yargs.prefix) {
          filters.prefix = _.isArray(yargs.prefix) ? yargs.prefix : [yargs.prefix]
        }
        if (yargs.equals) {
          filters.equals = _.isArray(yargs.equals) ? yargs.equals : [yargs.equals]
        }
        if (yargs.suffix) {
          filters.suffix = _.isArray(yargs.suffix) ? yargs.suffix : [yargs.suffix]
        }

        // filter by prefix(es)
        if ((filters.prefix.length + filters.equals.length + filters.suffix.length) > 0) {
          properties = _.pickBy(properties, (v, k) => {
            return filters.prefix.some(p => k.startsWith(p)) ||
              filters.equals.some(e => k === e) ||
              filters.suffix.some(s => k.endsWith(s))
          })
        }

        // only output non-empty objects
        if (_.size(properties)) {
          return next(null, JSON.stringify(properties))
        }

        next()
      }))
      .pipe(process.stdout)
  }
}
