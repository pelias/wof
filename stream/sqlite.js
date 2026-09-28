const _ = require('lodash')
const miss = require('mississippi2')
const feature = require('../whosonfirst/feature')

const table = {
  ancestors: require('../sqlite/table/ancestors'),
  concordances: require('../sqlite/table/concordances'),
  geojson: require('../sqlite/table/geojson'),
  names: require('../sqlite/table/names'),
  spr: require('../sqlite/table/spr')
}

const options = {
  write: { objectMode: true, autoDestroy: true },
  read: { autoDestroy: true }
}

module.exports.createWriteStream = (db, opts) => {
  _.defaults(opts, { alt: true, clean: false })

  // generate insert statements for each table
  const stmts = _.map(table, t => t.insert(db))

  return miss.through(options.write, (feat, enc, next) => {
    // skip alt geometries
    if (!opts.alt && feature.isAltGeometry(feat)) { return next() }

    try {
      // insert document in each table
      _.each(stmts, insert => insert(feat, opts.clean === true))
    } catch (e) {
      return next(e)
    }

    next()
  })
}

module.exports.createReadStream = (db, opts) => {
  _.defaults(opts, { sql: 'SELECT body FROM geojson' })

  // the export SQL always selects a single column; pluck mode has
  // better-sqlite3 hand back that column's value directly instead of a
  // row object, avoiding a per-row object allocation and lookup
  const stmt = db.prepare(opts.sql).pluck(true)
  const iterator = stmt.iterate()

  return miss.from(options.read, (size, next) => {
    var ok = true
    while (ok) {
      const elt = iterator.next()
      if (!elt.done) { ok = next(null, elt.value) } else { next(null, null); break }
    }
  })
}
