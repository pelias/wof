const _ = require('lodash')
const LanguageTag = require('rfc5646')
const feature = require('../../whosonfirst/feature')
const privateUseRegex = /^(.*)[_-]x[_-]([a-z]*(_abbreviation)?)$/

module.exports.create = (db) => {
  db.prepare(`
    CREATE TABLE IF NOT EXISTS names (
      id INTEGER NOT NULL,
      placetype TEXT,
      country TEXT,
      language TEXT,
      extlang TEXT,
      script TEXT,
      region TEXT,
      variant TEXT,
      extension TEXT,
      privateuse TEXT,
      name TEXT,
      lastmodified INTEGER
  )`).run()
}

module.exports.insert = (db) => {
  const stmt = db.prepare(`
    INSERT OR IGNORE
    INTO names (
      id, placetype, country, language, extlang, script, region,
      variant, extension, privateuse, name, lastmodified
    )
    VALUES (
      :id, :placetype, :country, :language, :extlang, :script, :region,
      :variant, :extension, :privateuse, :name, :lastmodified
    )
  `)

  return (feat) => {
    // table does not support alt geometries
    if (feature.isAltGeometry(feat)) { return }

    const properties = _.get(feat, 'properties', {})

    const common = {
      id: feature.getID(feat),
      placetype: feature.getPlacetype(feat),
      country: feature.getCountry(feat),
      lastmodified: feature.getLastModified(feat)
    }

    _.each(properties, (names, key) => {
      if (!key.startsWith('name:')) { return }
      const tag = new LanguageTag(key.replace('name:', ''))

      // @todo: check this is correct
      // @todo: move common functionality to lib
      _.each(names, (name) => {
        stmt.run(_.extend({
          language: tag.language,
          extlang: '',
          script: tag.script,
          region: tag.region,
          variant: tag.variant,
          extension: '',
          privateuse: privateUseRegex.test(key) ? key.replace(privateUseRegex, '$2') : '',
          name: name
        }, common))
      })
    })
  }
}

module.exports.drop = (db) => {
  db.prepare('DROP TABLE IF EXISTS names').run()
}

module.exports.createIndices = (db) => {
  db.prepare('CREATE INDEX IF NOT EXISTS names_by_lastmod ON names (lastmodified)').run()
  db.prepare('CREATE INDEX IF NOT EXISTS names_by_country ON names (country, privateuse, placetype)').run()
  db.prepare('CREATE INDEX IF NOT EXISTS names_by_language ON names (language, privateuse, placetype)').run()
  db.prepare('CREATE INDEX IF NOT EXISTS names_by_placetype ON names (placetype, country, privateuse)').run()
  db.prepare('CREATE INDEX IF NOT EXISTS names_by_name ON names (name, placetype, country)').run()
  db.prepare('CREATE INDEX IF NOT EXISTS names_by_name_private ON names (name, privateuse, placetype, country)').run()
  db.prepare('CREATE INDEX IF NOT EXISTS names_by_wofid ON names (id)').run()
}
