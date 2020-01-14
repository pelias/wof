const _ = require('lodash')
const feature = require('./feature')
const bounds = require('@turf/bbox').default
const nullIsland = [0, 0, 0, 0]

// [minX, minY, maxX, maxY]
module.exports.bbox = (feat, useGeometry) => {
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
