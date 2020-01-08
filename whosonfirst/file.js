const path = require('path')
const feature = require('./feature')

const file = { path: {} }

file.path.fromID = (id, alt) => path.join(...idToPathComponents(id), alt ? `${id}-alt-${alt}.geojson` : `${id}.geojson`)
file.path.fromFeature = (feat) => file.path.fromID(feature.getID(feat), feature.getAltLabel(feat))

module.exports = file

// convert wofid integer to array of path components
function idToPathComponents (id) {
  let strId = id.toString()
  const parts = []
  while (strId.length) {
    const part = strId.substr(0, 3)
    parts.push(part)
    strId = strId.substr(3)
  }
  return parts
}
