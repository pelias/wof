const _ = require('lodash')
const fs = require('fs')
const path = require('path')
const filePath = require('../../../whosonfirst/file').path
const stream = {
  json: require('../../../stream/json'),
  miss: require('../../../stream/miss'),
  marshaller: require('../../../stream/marshaller')
}

module.exports = {
  command: 'import <path>',
  describe: 'import (write) features to a filesystem path',
  builder: (yargs) => {
    // mandatory params
    yargs.positional('path', {
      type: 'string',
      describe: 'Location of file/directory.'
    })

    // optional params
    yargs.option('exportify', {
      type: 'boolean',
      default: false,
      describe: 'Run WOF exportify tool before writing files to disk.'
    })
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
          enabled: (argv.exportify === true),
          host: _.get(argv, 'exportify-host')
        }
      }))
      .pipe(stream.miss.through((bytes, enc, next) => {
        // re-parse feature to find correct filepath
        // @todo: can we avoid this?
        const feat = JSON.parse(bytes.toString('utf8'))

        // ensure path exists
        const fullpath = path.join(argv.path, filePath.fromFeature(feat))
        fs.mkdirSync(path.dirname(fullpath), { recursive: true })

        if (argv.verbose) { console.error(`write ${fullpath}`) }
        fs.writeFileSync(fullpath, bytes)

        next()
      }))
  }
}
