const fs = require('fs')
const path = require('path')
const all = require('require-all')
const stream = all(path.join(__dirname, '../../../stream'))

module.exports = {
  command: 'import <file>',
  describe: 'import features into a bundle file',
  builder: (yargs) => {
    // mandatory params
    yargs.positional('file', {
      type: 'string',
      describe: 'Location of bundle file.'
    })

    // optional params
    yargs.option('unlink', {
      type: 'boolean',
      default: false,
      alias: 'rm',
      describe: 'Delete db file before import if it already exists.'
    })
    yargs.option('collection', {
      type: 'string',
      default: undefined,
      describe: `Name of the collection, such as 'whosonfirst-data' or 'whosonfirst-data-macroregion'`
    })
    yargs.option('vintage', {
      type: 'string',
      default: undefined,
      describe: `Name of the vintage, such as 'latest' or '1535390738'`
    })
  },
  handler: (argv) => {
    // auto-detect format
    let compressor
    // @todo add support for lbzip2 and pigz
    if (argv.file.endsWith('tar.bz2')) { compressor = 'bzip2' }
    if (argv.file.endsWith('tar.gz')) { compressor = 'gzip' }
    if (argv.file.endsWith('tar')) { compressor = 'cat' }
    if (!compressor) {
      console.error(`unsupported file extension: ${argv.file}`)
      process.exit(1)
    }

    // log info about selected compressor
    if (argv.verbose) { console.error(`compressor ${compressor}`) }

    // unlink file
    if (argv.unlink) {
      if (argv.verbose) { console.error(`unlink ${argv.file}`) }
      fs.existsSync(argv.file) && fs.unlinkSync(argv.file)
    }

    // create import stream
    process.stdin
      .pipe(stream.json.parse())
      .pipe(stream.bundle.createWriteStream({ collection: argv.collection, vintage: argv.vintage }))
      .pipe(stream.shell.duplex(compressor))
      .pipe(fs.createWriteStream(argv.file))
  }
}
