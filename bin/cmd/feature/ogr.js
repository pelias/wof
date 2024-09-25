const path = require('path')
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
    yargs.option('docker', {
      type: 'boolean',
      default: false,
      describe: 'use a docker image for ogr2ogr'
    })
    yargs.option('image', {
      type: 'string',
      default: 'ghcr.io/osgeo/gdal:alpine-normal-latest',
      describe: 'docker image to use'
    })
  },
  handler: (argv) => {
    const tap = new Stream.PassThrough()
    process.stdin.once('data', () => { // avoid empty stdin
      tap.pipe(argv.docker ? docker(argv) : local(argv)).pipe(process.stdout)
    })
      .pipe(stream.json.parse())
      .pipe(stream.json.stringify('', '\n', '')) // add a newline between features
      .pipe(tap)
  }
}

function formatSpecificArgs (format) {
  // https://gdal.org/drivers/vector/shapefile.html
  if (format.includes('shapefile')) {
    return [
      '-lco', 'ENCODING=UTF-8',
      '-lco', 'RESIZE=YES'
    ]
  }
  return []
}

function flags (argv) {
  return [
    '-f', argv.format,
    '-a_srs', 'EPSG:4326',
    ...(argv.unlink ? ['-overwrite'] : []),
    ...formatSpecificArgs(argv.format.toLowerCase())
  ]
}

function local (argv) {
  return stream.shell.duplex('ogr2ogr', [
    ...flags(argv),
    argv.dst,
    '/vsistdin?buffer_limit=-1/'
  ])
}

function docker (argv) {
  return stream.shell.duplex('docker', [
    'run', '-i', '--rm',
    '-v', `${path.dirname(path.resolve(process.cwd(), argv.dst))}:/work`,
    argv.image,
    'ogr2ogr',
    ...flags(argv),
    `/work/${path.basename(argv.dst)}`,
    '/vsistdin?buffer_limit=-1/'
  ])
}
