const _ = require('lodash')
const feature = require('../feature')

// standard params filters
function params (feat, params) {
  const placetypes = [feature.getPlacetype(feat), ...feature.getAltPlacetypes(feat)]
  if (!contains(_.get(params, 'placetype'), placetypes)) return false
  if (!regex(_.get(params, 'geom'), _.get(feat, 'geometry.type'))) return false

  return true
}

// equivalent of internal SQL 'view' of the same name
function exportable (feat, spr) {
  if (feature.isAltGeometry(feat)) return false
  if (spr.id <= 0) return false
  if (spr.is_deprecated) return false
  if (spr.is_superseded) return false
  if (spr.latitude === 0.0 && spr.longitude === 0.0) return false

  return true
}

function regex (pattern, match) {
  if (!pattern) return true
  return new RegExp(`^${pattern}$`, 'i').test(match)
}

function contains (needle, valid) {
  if (!needle) return true
  return valid.includes(needle)
}

module.exports = { params, regex, contains, exportable }
