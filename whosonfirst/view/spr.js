const _spr = require('../spr')
const filters = require('./_filters')

/**
 * This is a semi-official view of the data used for generating ogr2ogr extracts.
 */

module.exports = (feat, params) => {
  // param filters
  if (!filters.params(feat, params)) return null

  const spr = _spr(feat)

  // exportable filters
  if (!filters.exportable(feat, spr)) return null

  // flatten properties to only SPR
  feat.properties = spr

  return feat
}
