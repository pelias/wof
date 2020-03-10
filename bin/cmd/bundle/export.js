const stream = { bsdtar: require('../../../stream/bsdtar') }

module.exports = {
  command: 'export <file>',
  describe: 'export features from a bundle file',
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
  },
  handler: (argv) => {
    let args = ['-f', argv.file, '--include', '*.geojson']
    if (!argv.alt) { args = [...args, '--exclude', '*-alt-*'] }

    // create export stream
    stream.bsdtar.extract(...args)
      .pipe(process.stdout)
  }
}
