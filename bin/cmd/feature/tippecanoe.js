const _ = require('lodash')
const path = require('path')
const Stream = require('stream')
const feature = require('../../../whosonfirst/feature')
const stream = {
  json: require('../../../stream/json'),
  shell: require('../../../stream/shell'),
  miss: require('../../../stream/miss')
}

module.exports = {
  command: 'tippecanoe <dst>',
  describe: 'export features using tippecanoe',
  builder: (yargs) => {
    yargs.positional('dst', {
      type: 'string',
      required: true,
      describe: 'tippecanoe `--output` argument.'
    })
    yargs.option('docker', {
      type: 'boolean',
      default: false,
      describe: 'use a docker image for tippecanoe'
    })
    yargs.option('unlink', {
      type: 'boolean',
      default: false,
      alias: 'rm',
      describe: 'tippecanoe `--force` argument.'
    })
    yargs.option('image', {
      type: 'string',
      default: 'versatiles/versatiles-tippecanoe',
      describe: 'docker image to use'
    })
  },
  handler: (argv) => {
    const tap = new Stream.PassThrough()
    process.stdin.once('data', () => { // avoid empty stdin
      tap.pipe(argv.docker ? docker(argv) : local(argv)).pipe(process.stdout)
    })
      .pipe(stream.json.parse())
      .pipe(stream.miss.through.obj((feat, enc, next) => {
        // add tippecanoe config
        let layer = feature.getPlacetype(feat)
        if (feature.isAltGeometry(feat)) { layer = `alt-${feature.getAltLabel(feat)}` }
        _.set(feat, 'tippecanoe.layer', layer)
        next(null, feat)
      }))
      .pipe(stream.json.stringify('', '\n', '')) // add a newline between features
      .pipe(tap)
  }
}

function flags (argv) {
  return [
    '-zg', // automatically choose maxzoom
    '--projection=EPSG:4326',
    ...(argv.unlink ? ['--force'] : [])
  ]
}

function local (argv) {
  return stream.shell.duplex('tippecanoe', [
    ...flags(argv),
    '--output',
    argv.dst
  ])
}

function docker (argv) {
  return stream.shell.duplex('docker', [
    'run', '-i', '--rm',
    '-v', `${path.dirname(path.resolve(process.cwd(), argv.dst))}:/work`,
    argv.image,
    ...flags(argv),
    '--output',
    `/work/${path.basename(argv.dst)}`
  ])
}
