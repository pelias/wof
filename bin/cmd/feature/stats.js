const path = require('path')
const all = require('require-all')
const stream = all(path.join(__dirname, '../../../stream'))
const feature = require('../../../whosonfirst/feature')

module.exports = {
  command: 'stats',
  describe: 'generate aggregate stats',
  handler: () => {
    const memo = {}

    // generate stats
    process.stdin
      .pipe(stream.json.through((feat, enc, next) => {
        // skip alt geometries
        if (feature.isAltGeometry(feat)) { return next() }

        // keep stack of placetype stats
        const placetype = feature.getPlacetype(feat)
        if (!memo[placetype]) { memo[placetype] = 0 }
        memo[placetype]++

        next()
      }, (done) => {
        done(null, JSON.stringify(memo) + '\n')
      }))
      .pipe(process.stderr)
  }
}
