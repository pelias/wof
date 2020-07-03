const _ = require('lodash')
const table = {
  geojson: require('./table/geojson'),
  ancestors: require('./table/ancestors'),
  spr: require('./table/spr')
}

// return a map where the key is the ID of a superseded
// record and the value is the replacement ID
function findSuperseded (db) {
  const stmt = db.prepare(`
    SELECT
      id,
      json_extract(geojson.body, '$.properties."wof:supersedes"') AS supersedes
    FROM geojson
    WHERE json_array_length(supersedes) > 0
  `)

  const superseded = new Map()
  for (const row of stmt.iterate()) {
    const supersedes = JSON.parse(row.supersedes)
    if (!_.isArray(supersedes) || _.isEmpty(supersedes)) { continue }
    supersedes.forEach(id => superseded.set(id, row.id))
  }

  return superseded
}

function findIdsToFix (db, superseded) {
  // use a temp table to avoid memory issues
  // create temp table
  db.prepare('CREATE TEMP TABLE tmp_superseded_ids (id INTEGER PRIMARY KEY)').run()

  // populate table with superseded IDs
  const insert = db.prepare('INSERT INTO tmp_superseded_ids (id) VALUES (:id)')
  for (const id of superseded.keys()) {
    insert.run({ id })
  }

  // find all documents parented by a superseded ID
  const stmt = db.prepare(`
    SELECT DISTINCT(id)
    FROM ancestors
    WHERE id != ancestor_id
    AND EXISTS (
      SELECT 1
      FROM tmp_superseded_ids
      WHERE ancestor_id = tmp_superseded_ids.id
      LIMIT 1
    )
  `)

  // create a Set containing the IDs of all records which need to be fixed
  const fixes = new Set()
  for (const row of stmt.iterate()) {
    fixes.add(row.id)
  }

  // clean up temp table
  db.prepare('DROP TABLE tmp_superseded_ids').run()

  return fixes
}

// fix orphaned hierarchies
module.exports.hierarchies = (db) => {
  const fetchOne = db.prepare(`
    SELECT body
    FROM geojson
    WHERE id = :id
    AND is_alt = 0
    LIMIT 1
  `)

  const superseded = findSuperseded(db)
  const idsToFix = findIdsToFix(db, superseded)

  idsToFix.forEach(id => {
    const row = fetchOne.get({ id })
    const feat = JSON.parse(row.body)
    let reindex = false

    // fix parent id
    const parentID = _.get(feat, 'properties.wof:parent_id', -1)
    if (superseded.has(parentID)) {
      const replacement = superseded.get(parentID)
      console.info(`${id} has an incorrect parent_id, replacing ${id} with ${replacement}`)
      _.set(feat, 'properties.wof:parent_id', replacement)
      reindex = true
    }

    // fix orphaned hierarchies
    const hierarchies = _.get(feat, 'properties.wof:hierarchy', [])
    _.forEach(hierarchies, (hierarchy, branch) => {
      _.forEach(hierarchy, (id, key) => {
        if (superseded.has(id)) {
          const replacement = superseded.get(id)
          console.info(`${id} has an incorrect ${key}, replacing ${id} with ${replacement}`)
          _.set(feat, `properties.wof:hierarchy[${branch}][${key}]`, replacement)
          reindex = true
        }
      })
    })

    // delete record and reimport it
    if (reindex) {
      db.prepare('DELETE FROM geojson WHERE is_alt = 0 AND id = :id').run({ id })
      table.geojson.insert(db)(feat)

      db.prepare('DELETE FROM ancestors WHERE id = :id').run({ id })
      table.ancestors.insert(db)(feat)

      db.prepare('DELETE FROM spr WHERE id = :id').run({ id })
      table.spr.insert(db)(feat)
    }
  })
}
