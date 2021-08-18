const _ = require('lodash')

// mapping of property paths (on the left, using lodash path syntax)
// and the corresponding key within the 'wof:concordances' object.
const mapping = {
  'qs_pg:gn_id': 'gn:id',
  'qs_pg:qs_id': 'qs:id',
  'qs:id': 'qs:id'
}

module.exports.concordances = (feat) => {
  // map other concordances which may exist within the feature
  // but only when not already present in 'wof:concordances'.
  // note: take care with underscore vs. colon delimiters
  _.each(mapping, (k, prop) => {
    const source = `properties["${prop}"]`
    const destination = `properties["wof:concordances"]["${k}"]`

    // do not overwrite existing 'wof:concordances' values
    if (_.has(feat, destination)) { return }

    // find and validate properties
    let v = _.get(feat, source)
    if (!_.isString(v) && !_.isInteger(v)) { return }
    if (_.isString(v)) { v = v.trim() }
    if (_.isInteger(v) && v < 1) { return }

    // write to 'wof:concordances'
    _.set(feat, destination, v)
  })
}
