const _ = require('lodash')

// standard view filters
module.exports = (feat, params) => {
  if (!regex(_.get(params, 'placetype'), _.get(feat, 'properties.wof:placetype'))) return false
  if (!regex(_.get(params, 'geom'), _.get(feat, 'geometry.type'))) return false

  return true
}

function regex (pattern, match) {
  if (!pattern) return true
  return new RegExp(`^${pattern}$`, 'i').test(match)
}
