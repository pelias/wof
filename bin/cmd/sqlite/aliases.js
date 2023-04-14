
// export all records
const all = 'SELECT body FROM geojson'

// export selected entries
const exportable = `
SELECT geojson.body
FROM spr
  JOIN geojson ON (geojson.id = spr.id AND geojson.is_alt != 1)
  WHERE spr.id > 0
  AND spr.is_deprecated = 0
  AND spr.is_superseded = 0
  AND NOT TRIM( IFNULL(spr.name, '') ) = ''
  AND NOT (
    spr.latitude = 0 AND
    spr.longitude = 0
  )`

module.exports = { all, exportable }
