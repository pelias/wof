const feature = require('../../whosonfirst/feature')
const codec = { encode: JSON.stringify, decode: JSON.parse }

module.exports.create = (db) => {
  db.prepare(`
    CREATE TABLE IF NOT EXISTS geojson (
      id INTEGER NOT NULL,
      body TEXT,
      source TEXT,
      alt_label TEXT,
      is_alt BOOLEAN,
      lastmodified INTEGER
  )`).run()
}

module.exports.insert = (db) => {
  const stmt = db.prepare(`
    INSERT OR IGNORE
    INTO geojson (id, body, source, alt_label, is_alt, lastmodified)
    VALUES (:id, :body, :source, :alt_label, :is_alt, :lastmodified)
  `)

  return (feat) => {
    stmt.run({
      id: feature.getID(feat),
      body: codec.encode(feat),
      source: feature.getSource(feat),
      alt_label: feature.getAltLabel(feat),
      is_alt: feature.isAltGeometry(feat) ? 1 : 0,
      lastmodified: feature.getLastModified(feat)
    })
  }
}

module.exports.drop = (db) => {
  db.prepare('DROP TABLE IF EXISTS geojson').run()
}

module.exports.createIndices = (db) => {
  db.prepare('CREATE UNIQUE INDEX IF NOT EXISTS geojson_by_id ON geojson (id, source, alt_label)').run()
  db.prepare('CREATE INDEX IF NOT EXISTS geojson_by_alt ON geojson (id, is_alt)').run()
  db.prepare('CREATE INDEX IF NOT EXISTS geojson_by_lastmod ON geojson (lastmodified)').run()
}
