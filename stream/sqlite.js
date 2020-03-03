const _ = require('lodash')
const path = require('path')
const miss = require('mississippi2')
const feature = require('../whosonfirst/feature')
const table = require('require-all')(path.join(__dirname, '../sqlite/table'))

const options = {
  write: { objectMode: true, autoDestroy: true },
  read: { autoDestroy: true }
}

module.exports.createWriteStream = (db, opts) => {
  _.defaults(opts, { alt: true })

  // generate insert statements for each table
  const stmts = _.map(table, t => t.insert(db))

  return miss.through(options.write, (feat, enc, next) => {
    // skip alt geometries
    if (!opts.alt && feature.isAltGeometry(feat)) { return next() }

    try {
      // insert document in each table
      _.each(stmts, insert => insert(feat))
    } catch (e) {
      return next(e)
    }

    next()
  })
}

module.exports.createReadStream = (db, opts) => {
  _.defaults(opts, { sql: 'SELECT body FROM geojson' })

  const stmt = db.prepare(opts.sql)
  const iterator = stmt.iterate()

  return miss.from(options.read, (size, next) => {
    var ok = true
    while (ok) {
      const elt = iterator.next()
      if (!elt.done) { ok = next(null, elt.value.body) } else { next(null, null); break }
    }
  })
}
