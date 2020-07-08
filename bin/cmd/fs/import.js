const fs = require('fs')
const path = require('path')
const filePath = require('../../../whosonfirst/file').path
const exportify = require('../../../whosonfirst/exportify')
const stream = {
  json: require('../../../stream/json'),
  miss: require('../../../stream/miss')
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
  },
  handler: (argv) => {
    process.stdin
      .pipe(stream.json.parse())
      .pipe(stream.miss.through.obj((feat, enc, next) => {
        // ensure path exists
        const fullpath = path.join(argv.path, filePath.fromFeature(feat))
        fs.mkdirSync(path.dirname(fullpath), { recursive: true })

        // optionally 'exportify' the record
        if (argv.exportify) { feat = exportify(feat) }

        if (argv.verbose) { console.error(`write ${fullpath}`) }
        fs.writeFileSync(fullpath, feat)

        next()
      }))
  }
}
