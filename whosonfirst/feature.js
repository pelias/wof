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
feature.isDeprecated = (feat) => feature.getDeprecated(feat) !== 'uuuu'
feature.isCeased = (feat) => feature.getCessation(feat) !== 'uuuu'
feature.isSuperseded = (feat) => !!feature.getSupersededBy(feat).length
feature.isSuperseding = (feat) => !!feature.getSupersedes(feat).length

// features may provide additional alternative placetypes
// see: https://github.com/whosonfirst-data/whosonfirst-data/issues/2152
feature.getAltPlacetypes = (feat) => _.castArray(_.get(feat, 'properties.wof:placetype_alt', []))

module.exports = feature
