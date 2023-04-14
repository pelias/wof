const _spr = require('../spr')
const ok = require('./_filters')

/**
 * This is a semi-official view of the data used for generating ogr2ogr extracts.
 */

module.exports = (feat, params) => {
  // run filters
  if (!ok(feat, params)) return null

  // flatten properties to only SPR
  feat.properties = _spr(feat)

  return feat
}
