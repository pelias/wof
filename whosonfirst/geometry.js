const _ = require('lodash')
const feature = require('./feature')
const bounds = require('@turf/bbox').default
const nullIsland = [0, 0, 0, 0]

// [minX, minY, maxX, maxY]
function bbox (feat, useGeometry) {
  // parse 'geom:bbox' property (fast)
  let bbox = feature.get(feat, 'properties.geom:bbox', '').split(',').map(parseFloat).filter(_.isFinite)

  // use geometry bounds when property not available
  if (bbox.length !== 4) { useGeometry = true }

  // calculate bounds from geometry (slow)
  if (useGeometry === true) { bbox = bounds(feat) }

  // valid bbox
  if (bbox.filter(_.isFinite).length === 4) { return bbox }

  // invalid bbox
  console.error(`invalid bbox for feature ${feature.getID(feat)}: ${bbox}`)
  return nullIsland
}

// compute center of bbox
// note: this is really inacurate for anything crossing the antimeridian, avoid using it
// function centroidFromBbox (feat) {
//   const bounds = bbox(feat)
//   return {
//     lon: (bounds[0] + ((bounds[2] - bounds[0]) / 2)),
//     lat: (bounds[1] + ((bounds[3] - bounds[1]) / 2))
//   }
// }

// search properties for a valid centroid, returning the first one found
function centroidProperty (feat, namespaces) {
  for (var i = 0; i < namespaces.length; i++) {
    const lon = parseFloat(feature.get(feat, `properties.${namespaces[i]}:longitude`))
    const lat = parseFloat(feature.get(feat, `properties.${namespaces[i]}:latitude`))
    if (!isNaN(lon) && !isNaN(lat)) {
      return { lon, lat }
    }
  }
}

// https://github.com/whosonfirst/go-whosonfirst-geojson-v2/blob/master/properties/whosonfirst/whosonfirst.go#L71
function centroid (feat) {
  return centroidProperty(feat, ['lbl', 'reversegeo', 'geom']) || { lon: 0, lat: 0 }
}

module.exports = { bbox, centroid }
