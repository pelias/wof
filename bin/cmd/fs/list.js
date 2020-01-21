const path = require('path')
const all = require('require-all')
const stream = all(path.join(__dirname, '../../../stream'))

module.exports = {
  command: 'list <path>',
  describe: 'list features in a filesystem path',
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
    yargs.option('normalization', {
      type: 'string',
      alias: 'n',
      default: 'realpath',
      describe: 'Normalize paths using [none|realpath|basename].'
    })
    yargs.option('all', {
      type: 'boolean',
      default: false,
      describe: 'List all files (not only *.geojson files).'
    })
  },
  handler: (argv) => {
    const extension = argv.all ? '*.*' : '*.geojson'
    let args = [argv.path, '-type', 'f', '-name', extension]
    if (!argv.alt) { args = [...args, '!', '-name', '*-alt-*'] }

    // path normalization
    if (argv.normalization === 'realpath') {
      args = [...args, '-exec', 'realpath', '--relative-to', argv.path, '{}', ';']
    } else if (argv.normalization === 'basename') {
      args = [...args, '-exec', 'basename', '{}', ';']
    }

    // create export stream
    stream.find(...args)
      .pipe(process.stdout)
  }
}
