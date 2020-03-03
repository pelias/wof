const path = require('path')
const all = require('require-all')
const stream = all(path.join(__dirname, '../../../stream'))

module.exports = {
  command: 'list <repo>',
  describe: 'list paths in a git repo',
  builder: (yargs) => {
    // mandatory params
    yargs.positional('repo', {
      type: 'string',
      describe: 'Location of git repository.'
    })

    // optional params
    yargs.option('tree', {
      type: 'string',
      default: 'HEAD',
      describe: 'The tree or commit to produce an archive for. eg: \'HEAD\' or \'master\'.'
    })
    yargs.option('path', {
      type: 'string',
      default: 'data',
      describe: 'Without an optional path parameter, all files and subdirectories of the current working directory are included in the archive. If one or more paths are specified, only these are included.'
    })
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
    let args = ['--include', extension]
    if (!argv.alt) { args = [...args, '--exclude', '*-alt-*'] }

    // create export stream
    stream.git.archive(argv.repo, argv.tree, argv.path, args)
      .pipe(process.stdout)
  }
}
