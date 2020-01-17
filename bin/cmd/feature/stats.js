const _ = require('lodash')
const path = require('path')
const all = require('require-all')
const stream = all(path.join(__dirname, '../../../stream'))
const feature = require('../../../whosonfirst/feature')
const geometry = require('../../../whosonfirst/geometry')

const statuses = {
  'current': feature.isCurrent,
  'deprecated': feature.isDeprecated,
  'ceased': feature.isCeased,
  'superseded': feature.isSuperseded,
  'superseding': feature.isSuperseding,
}

// convenience function for incrementing a possibly non-existent key
const increment = (stats, key) => {
  _.set(stats, key, _.get(stats, key, 0) + 1)
}

module.exports = {
  command: 'stats',
  describe: 'generate aggregate stats',
  handler: () => {
    const stats = { total: 0 }

    // generate stats
    process.stdin
      .pipe(stream.json.through((feat, enc, next) => {

        // alt geometry stats
        if (feature.isAltGeometry(feat)) {
          const label = feature.getAltLabel(feat)
          increment(stats, `alt.${label}`)
          return next()
        }

        // null id
        if (feature.getID(feat) <= 0) {
          increment(stats, 'null.id')
        }

        // sum of all non-alt records
        increment(stats, 'total')

        // placetype stats
        const placetype = feature.getPlacetype(feat)
        increment(stats, `placetype.${placetype}`)

        // source stats
        const source = feature.getSource(feat)
        increment(stats, `source.${source}`)

        // ISO stats
        const iso = feature.getISO(feat)
        increment(stats, `iso.${iso}`)

        // country stats
        const country = feature.getCountry(feat)
        increment(stats, `country.${country}`)

        // repo stats
        const repo = feature.getRepo(feat)
        increment(stats, `repo.${repo}`)

        // feature 'status' stats
        for (var label in statuses) {
          const isStatus = statuses[label]
          if (isStatus(feat)) {
            increment(stats, `status.${label}`)
          }
        }

        /* geometry stats */

        // geometry types
        const type = _.get(feat, 'geometry.type', 'unknown')
        increment(stats, `geometry.type.${type}`)

        // compute a naive aggregate bbox: [minX, minY, maxX, maxY]
        const bbox = geometry.bbox(feat)
        stats.geometry.bbox = (!stats.geometry.bbox) ? bbox : [
          Math.min(stats.geometry.bbox[0], bbox[0]),
          Math.min(stats.geometry.bbox[1], bbox[1]),
          Math.max(stats.geometry.bbox[2], bbox[2]),
          Math.max(stats.geometry.bbox[3], bbox[3])
        ];

        // null island
        if (0 === bbox.reduce((acc, cur) => acc + cur)) {
          increment(stats, 'null.geometry')
        }

        next()
      }, (done) => {
        done(null, JSON.stringify(stats, null, 2) + '\n')
      }))
      .pipe(process.stdout)
  }
}
