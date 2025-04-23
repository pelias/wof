const _ = require('lodash')
const feature = {}

// convenience functions
feature.has = _.has
feature.get = _.get

// see: https://github.com/whosonfirst/go-whosonfirst-geojson-v2/blob/master/properties/whosonfirst/whosonfirst.go

feature.getID = (feat) => _.get(feat, 'properties.wof:id', -1)
feature.getPlacetype = (feat) => _.get(feat, 'properties.wof:placetype', 'unknown')
feature.getSource = (feat) => feature.getGeomSource(feat)
feature.getParentId = (feat) => _.get(feat, 'properties.wof:parent_id', -1)
feature.getName = (feat) => _.get(feat, 'properties.wof:name', '')
feature.getCountry = (feat) => _.get(feat, 'properties.wof:country', 'XX')
feature.getISO = (feat) => _.get(feat, 'properties.iso:country', 'XX')
feature.getRepo = (feat) => _.get(feat, 'properties.wof:repo', 'whosonfirst-data-xx')
feature.getAltLabel = (feat) => _.get(feat, 'properties.src:alt_label')
feature.getGeomSource = (feat) => _.get(feat, 'properties.src:geom', 'unknown')

feature.getIsCurrent = (feat) => _.get(feat, 'properties.mz:is_current', -1)
feature.getDeprecated = (feat) => _.get(feat, 'properties.edtf:deprecated', 'uuuu')
feature.getCessation = (feat) => _.get(feat, 'properties.edtf:cessation', 'uuuu')
feature.getInception = (feat) => _.get(feat, 'properties.edtf:inception', 'uuuu')
feature.getSupersededBy = (feat) => _.get(feat, 'properties.wof:superseded_by', [])
feature.getSupersedes = (feat) => _.get(feat, 'properties.wof:supersedes', [])
feature.getLastModified = (feat) => _.get(feat, 'properties.wof:lastmodified', -1)

// boolean funcs
feature.isAltGeometry = (feat) => !!feature.getAltLabel(feat)
feature.isCurrent = (feat) => feature.getIsCurrent(feat) !== 0
feature.isDeprecated = (feat) => /\d/.test(feature.getDeprecated(feat))
feature.isCeased = (feat) => /\d/.test(feature.getCessation(feat))
feature.isSuperseded = (feat) => !!feature.getSupersededBy(feat).length
feature.isSuperseding = (feat) => !!feature.getSupersedes(feat).length

// features may provide additional alternative placetypes
// see: https://github.com/whosonfirst-data/whosonfirst-data/issues/2152
feature.getAltPlacetypes = (feat) => _.castArray(_.get(feat, 'properties.wof:placetype_alt', []))

// return a list of local language codes used at this location
// the second arguments may be 'official' (default), or 'spoken'
feature.getLocalLanguages = (feat, type = 'official') => {
  return _.castArray(_.get(feat, `properties.wof:lang_x_${type}`, []))
    .filter(l => (_.isString(l) && l.length === 3))
    .map(l => l.toLowerCase())
}

// the local name for this placetype (ie. 'state' in the USA instead of 'region')
// see: https://github.com/whosonfirst-data/whosonfirst-data/issues/2154
feature.getPlacetypeLocal = (feat) => _.flatten(
  feature.getLocalLanguages(feat, 'official')
    .concat(['eng']) // fallback to English when no other languages are available
    .map(lang => {
      const endonym = _.get(feat, `properties.label:${lang}_x_preferred_placetype`)

      // When a localized placetype isn't in a latin char set then WOF often provides
      // a transliteration we can include in a parenthetical, like: مقاطعة (muhafazah)
      const latinized = _.get(feat, `properties.label:${lang}_latn_x_preferred_placetype`)
      return (endonym && latinized) ? endonym + ` (${latinized})` : endonym
    })
).filter(val => _.isString(val) && !_.isEmpty(val))

module.exports = feature
