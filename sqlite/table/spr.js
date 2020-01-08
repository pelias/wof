const spr = require('../../whosonfirst/spr')

module.exports.create = (db) => {
  db.prepare(`
    CREATE TABLE IF NOT EXISTS spr (
      id INTEGER NOT NULL PRIMARY KEY,
      parent_id INTEGER,
      name TEXT,
      placetype TEXT,
      country TEXT,
      repo TEXT,
      latitude REAL,
      longitude REAL,
      min_latitude REAL,
      min_longitude REAL,
      max_latitude REAL,
      max_longitude REAL,
      is_current INTEGER,
      is_deprecated INTEGER,
      is_ceased INTEGER,
      is_superseded INTEGER,
      is_superseding INTEGER,
      superseded_by TEXT,
      supersedes TEXT,
      lastmodified INTEGER
    )`).run()
}

module.exports.insert = (db) => {
  const stmt = db.prepare(`
    INSERT OR IGNORE
    INTO spr (
      id, parent_id, name, placetype, country, repo, latitude, longitude,
      min_latitude, min_longitude, max_latitude, max_longitude,
      is_current, is_deprecated, is_ceased, is_superseded, is_superseding,
      superseded_by, supersedes, lastmodified
    )
    VALUES (
      :id, :parent_id, :name, :placetype, :country, :repo, :latitude, :longitude,
      :min_latitude, :min_longitude, :max_latitude, :max_longitude,
      :is_current, :is_deprecated, :is_ceased, :is_superseded, :is_superseding,
      :superseded_by, :supersedes, :lastmodified
    )
  `)

  return (feat) => {
    stmt.run(spr(feat))
  }
}

module.exports.drop = (db) => {
  db.prepare('DROP TABLE IF EXISTS spr').run()
}

module.exports.createIndices = (db) => {
  db.prepare('CREATE INDEX IF NOT EXISTS spr_by_lastmod ON spr (lastmodified)').run()
  db.prepare('CREATE INDEX IF NOT EXISTS spr_by_parent ON spr (parent_id, is_current, lastmodified)').run()
  db.prepare('CREATE INDEX IF NOT EXISTS spr_by_placetype ON spr (placetype, is_current, lastmodified)').run()
  db.prepare('CREATE INDEX IF NOT EXISTS spr_by_country ON spr (country, placetype, is_current, lastmodified)').run()
  db.prepare('CREATE INDEX IF NOT EXISTS spr_by_name ON spr (name, placetype, is_current, lastmodified)').run()
  db.prepare('CREATE INDEX IF NOT EXISTS spr_by_centroid ON spr (latitude, longitude, is_current, lastmodified)').run()
  db.prepare('CREATE INDEX IF NOT EXISTS spr_by_bbox ON spr (min_latitude, min_longitude, max_latitude, max_longitude, placetype, is_current, lastmodified)').run()
  db.prepare('CREATE INDEX IF NOT EXISTS spr_by_repo ON spr (repo, lastmodified)').run()
  db.prepare('CREATE INDEX IF NOT EXISTS spr_by_current ON spr (is_current, lastmodified)').run()
  db.prepare('CREATE INDEX IF NOT EXISTS spr_by_deprecated ON spr (is_deprecated, lastmodified)').run()
  db.prepare('CREATE INDEX IF NOT EXISTS spr_by_ceased ON spr (is_ceased, lastmodified)').run()
  db.prepare('CREATE INDEX IF NOT EXISTS spr_by_superseded ON spr (is_superseded, lastmodified)').run()
  db.prepare('CREATE INDEX IF NOT EXISTS spr_by_superseding ON spr (is_superseding, lastmodified)').run()
  db.prepare('CREATE INDEX IF NOT EXISTS spr_obsolete ON spr (is_deprecated, is_superseded)').run()
}
