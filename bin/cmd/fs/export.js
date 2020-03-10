const stream = { find: require('../../../stream/find') }

module.exports = {
  command: 'export <path>',
  describe: 'export features from a filesystem path',
  builder: (yargs) => {
    // mandatory params
    yargs.positional('path', {
      type: 'string',
      describe: 'Location of file/directory.'
    })

    // optional params
    yargs.option('alt', {
      type: 'boolean',
      default: true,
      describe: 'Include alt-geometries.'
    })
  },
  handler: (argv) => {
    let args = [argv.path, '-type', 'f', '-name', '*.geojson']
    if (!argv.alt) { args = [...args, '!', '-name', '*-alt-*'] }
    args = [...args, '-exec', 'cat', '{}', ';'] // print contents instead of filenames

    // create export stream
    stream.find(...args)
      .pipe(process.stdout)
  }
}
