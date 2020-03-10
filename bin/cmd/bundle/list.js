const stream = { bsdtar: require('../../../stream/bsdtar') }

module.exports = {
  command: 'list <file>',
  describe: 'list features in a bundle file',
  builder: (yargs) => {
    // mandatory params
    yargs.positional('file', {
      type: 'string',
      describe: 'Location of bundle file.'
    })

    // optional params
    yargs.option('alt', {
      type: 'boolean',
      default: true,
      describe: 'Include alt-geometries.'
    })
    yargs.option('all', {
      type: 'boolean',
      default: false,
      describe: 'List all files (not only *.geojson files).'
    })
  },
  handler: (argv) => {
    const extension = argv.all ? '*.*' : '*.geojson'
    let args = ['-f', argv.file, '--include', extension]
    if (!argv.alt) { args = [...args, '--exclude', '*-alt-*'] }

    // create export stream
    stream.bsdtar.list(...args)
      .pipe(process.stdout)
  }
}
