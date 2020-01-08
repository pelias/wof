/**
 * WIP - distibution builder
 */

const path = require('path')
const all = require('require-all')
const modulePath = path.resolve(__dirname, '/../')
const stream = all(path.join(modulePath, 'stream'))

// input variables
const repo = '/data/wof/clone_test/bare'
const prefix = 'new_zealand'

stream.miss.pipe(
  stream.git.archive(repo, 'HEAD', 'data'),
  stream.miss.pipeline(
    stream.bsdtar.extract('--include', '*.geojson', '--exclude', '*-alt-*'),
    stream.tee(
      stream.shell.duplex(
        'node',
        [`${modulePath}/bin/whosonfirst.js`, 'sqlite', 'import', '--rm', `${prefix}.db`],
        { stdio: ['pipe', 'ignore', 'inherit'] }
      ),
      stream.shell.duplex(
        'node',
        [`${modulePath}/bin/whosonfirst.js`, 'bundle', 'import', '--rm', `${prefix}.tar.bz2`],
        { stdio: ['pipe', 'ignore', 'inherit'] }
      ),
      stream.shell.duplex(
        'node',
        [`${modulePath}/bin/whosonfirst.js`, 'bundle', 'import', '--rm', `${prefix}.tar.gz`],
        { stdio: ['pipe', 'ignore', 'inherit'] }
      ),
      stream.shell.duplex(
        'node',
        [`${modulePath}/bin/whosonfirst.js`, 'feature', 'stats'],
        { stdio: ['pipe', 'inherit', 'inherit'] }
      )
    )
  )
)
