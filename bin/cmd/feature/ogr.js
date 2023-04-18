const Stream = require('stream')
const stream = {
  json: require('../../../stream/json'),
  shell: require('../../../stream/shell')
}

module.exports = {
  command: 'ogr <dst>',
  describe: 'export features using ogr2ogr',
  builder: (yargs) => {
    yargs.positional('dst', {
      type: 'string',
      required: true,
      describe: 'ogr2ogr `dst_datasource_name` argument. see: https://gdal.org/programs/ogr2ogr.html'
    })
    yargs.option('format', {
      type: 'string',
      required: true,
      describe: 'ogr2ogr `-f` argument. see: https://gdal.org/programs/ogr2ogr.html#cmdoption-ogr2ogr-f'
    })
    yargs.option('unlink', {
      type: 'boolean',
      default: false,
      alias: 'rm',
      describe: 'ogr2ogr `-overwrite` argument. see: https://gdal.org/programs/ogr2ogr.html#cmdoption-ogr2ogr-overwrite'
    })
  },
  handler: (argv) => {
    const tap = new Stream.PassThrough()
    process.stdin.once('data', () => { // avoid empty stdin
      tap.pipe(stream.shell.duplex('ogr2ogr', [
        '-f', argv.format,
        '-a_srs', 'EPSG:4326',
        ...(argv.unlink ? ['-overwrite'] : []),
        ...formatSpecificArgs(argv.format.toLowerCase()),
        argv.dst, '/vsistdin?buffer_limit=-1/'
      ]))
        .pipe(process.stdout)
    })
      .pipe(stream.json.parse())
      .pipe(stream.json.stringify('', '\n', '')) // add a newline between features
      .pipe(tap)
  }
}

function formatSpecificArgs (format) {
  if (format.includes('shapefile')) return ['-lco', 'ENCODING=UTF-8']
  return []
}
