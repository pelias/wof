const _ = require('lodash')
const feature = require('../../whosonfirst/feature')

module.exports.create = (db) => {
  db.prepare(`
    CREATE TABLE IF NOT EXISTS concordances (
      id INTEGER NOT NULL,
      other_id INTEGER NOT NULL,
      other_source TEXT,
      lastmodified INTEGER
  )`).run()
}

module.exports.insert = (db) => {
  const stmt = db.prepare(`
    INSERT OR IGNORE
    INTO concordances (id, other_id, other_source, lastmodified)
    VALUES (:id, :other_id, :other_source, :lastmodified)
  `)

  return (feat) => {
    const concordances = _.get(feat, 'properties.wof:concordances', [])

    const common = {
      id: feature.getID(feat),
      lastmodified: feature.getLastModified(feat)
    }

    _.each(concordances, (id, key) => {
      stmt.run(_.extend({
        other_id: id,
        other_source: key
      }, common))
    })
  }
}

module.exports.drop = (db) => {
  db.prepare('DROP TABLE IF EXISTS concordances').run()
}

module.exports.createIndices = (db) => {
  db.prepare('CREATE INDEX IF NOT EXISTS concordances_by_id ON concordances (id,lastmodified)').run()
  db.prepare('CREATE INDEX IF NOT EXISTS concordances_by_other_id ON concordances (other_source,other_id)').run()
  db.prepare('CREATE INDEX IF NOT EXISTS concordances_by_other_lastmod ON concordances (other_source,other_id,lastmodified)').run()
  db.prepare('CREATE INDEX IF NOT EXISTS concordances_by_lastmod ON concordances (lastmodified)').run()
}
