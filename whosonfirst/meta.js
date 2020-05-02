const _ = require('lodash')
const crypto = require('crypto')
const feature = require('./feature')
const geometry = require('./geometry')
const file = require('./file')

module.exports = (feat) => {
  return {
    bbox: geometry.bbox(feat).join(','),
    cessation: feature.getCessation(feat),
    country_id: getHierarchyID(feat, 'country'),
    deprecated: feature.getDeprecated(feat),
    file_hash: md5(feat),
    fullname: '', // @todo: this seems to be intentionally blank?
    geom_hash: feature.get(feat, 'properties.geom:hash') || md5(feat.geometry),
    geom_latitude: feature.get(feat, 'properties.geom:latitude', 0),
    geom_longitude: feature.get(feat, 'properties.geom:longitude', 0),
    id: feature.getID(feat),
    inception: feature.getInception(feat),
    iso: feature.getISO(feat),
    iso_country: feature.getISO(feat),
    lastmodified: feature.getLastModified(feat),
    lbl_latitude: feature.get(feat, 'properties.lbl:latitude', 0),
    lbl_longitude: feature.get(feat, 'properties.lbl:longitude', 0),
    locality_id: getHierarchyID(feat, 'locality'),
    name: feature.getName(feat),
    parent_id: feature.getParentId(feat),
    path: file.path.fromFeature(feat),
    placetype: feature.getPlacetype(feat),
    region_id: getHierarchyID(feat, 'region'),
    source: feature.getGeomSource(feat),
    superseded_by: feature.getSupersededBy(feat).join(','),
    supersedes: feature.getSupersedes(feat).join(','),
    wof_country: feature.getCountry(feat)
  }
}

function getHierarchyID (feat, placetype) {
  let id = 0
  const hierarchies = _.get(feat, 'properties.wof:hierarchy', [])

  _.each(hierarchies, hierarchy => {
    _.each(hierarchy, (wofID, key) => {
      if (key.replace(/_id$/, '') === placetype) {
        id = wofID
      }
    })
  })

  return id
}

function md5 (obj) {
  return crypto.createHash('md5')
    .update(JSON.stringify(obj))
    .digest('hex')
}
