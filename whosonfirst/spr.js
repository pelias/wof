const feature = require('./feature')
const geometry = require('./geometry')

// see: https://github.com/whosonfirst/go-whosonfirst-geojson-v2/blob/master/feature/whosonfirst.go
// see: https://github.com/whosonfirst/go-whosonfirst-sqlite-features/blob/master/tables/spr.go

// see: https://github.com/whosonfirst/go-whosonfirst-geojson-v2/blob/881e9e222a1752b169081adc7a40718f310da96a/feature/geojson.go#L136
module.exports = (feat) => {
  return {
    id: feature.getID(feat),
    parent_id: feature.getParentId(feat),
    name: feature.getName(feat),
    placetype: feature.getPlacetype(feat),
    country: feature.getCountry(feat),
    repo: feature.getRepo(feat),
    ...coordinates(feat),
    is_current: feature.isCurrent(feat) ? 1 : 0,
    is_deprecated: feature.isDeprecated(feat) ? 1 : 0,
    is_ceased: feature.isCeased(feat) ? 1 : 0,
    is_superseded: feature.isSuperseded(feat) ? 1 : 0,
    is_superseding: feature.isSuperseding(feat) ? 1 : 0,
    superseded_by: feature.getSupersededBy(feat).join(','),
    supersedes: feature.getSupersedes(feat).join(','),
    lastmodified: feature.getLastModified(feat)
  }
}

function coordinates (feat) {
  // [minX, minY, maxX, maxY]
  const bbox = geometry.bbox(feat)
  const centroid = geometry.centroid(feat)
  return {
    latitude: centroid.lat,
    longitude: centroid.lon,
    min_latitude: bbox[1],
    min_longitude: bbox[0],
    max_latitude: bbox[3],
    max_longitude: bbox[2]
  }
}
