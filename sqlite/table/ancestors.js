const _ = require('lodash')
const feature = require('../../whosonfirst/feature')

module.exports.create = (db) => {
  db.prepare(`
    CREATE TABLE IF NOT EXISTS ancestors (
      id INTEGER NOT NULL,
      ancestor_id INTEGER NOT NULL,
      ancestor_placetype TEXT,
      lastmodified INTEGER
  )`).run()
}

module.exports.insert = (db) => {
  const stmt = db.prepare(`
    INSERT OR IGNORE
    INTO ancestors (id, ancestor_id, ancestor_placetype, lastmodified)
    VALUES (:id, :ancestor_id, :ancestor_placetype, :lastmodified)
  `)

  return (feat) => {
    const hierarchies = _.get(feat, 'properties.wof:hierarchy', [])

    const common = {
      id: feature.getID(feat),
      lastmodified: feature.getLastModified(feat)
    }

    _.each(hierarchies, (hierarchy, branch) => {
      _.each(hierarchy, (wofID, key) => {
        stmt.run(_.extend({
          ancestor_id: wofID,
          ancestor_placetype: key.replace(/_id$/, '')
        }, common))
      })
    })
  }
}

module.exports.drop = (db) => {
  db.prepare('DROP TABLE IF EXISTS ancestors').run()
}

module.exports.createIndices = (db) => {
  db.prepare('CREATE INDEX IF NOT EXISTS ancestors_by_id ON ancestors (id, ancestor_placetype, lastmodified)').run()
  db.prepare('CREATE INDEX IF NOT EXISTS ancestors_by_ancestor ON ancestors (ancestor_id, ancestor_placetype, lastmodified)').run()
  db.prepare('CREATE INDEX IF NOT EXISTS ancestors_by_lastmod ON ancestors (lastmodified)').run()
}
