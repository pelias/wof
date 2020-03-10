const spr = require('./spr')
const MockDatabase = require('../mock/MockDatabase')

module.exports.interface = (test) => {
  test('create', (t) => {
    t.true(typeof spr.create === 'function')
    t.equals(spr.create.length, 1)
    t.end()
  })
  test('insert', (t) => {
    t.true(typeof spr.insert === 'function')
    t.equals(spr.insert.length, 1)
    t.end()
  })
  test('drop', (t) => {
    t.true(typeof spr.drop === 'function')
    t.equals(spr.drop.length, 1)
    t.end()
  })
  test('createIndices', (t) => {
    t.true(typeof spr.createIndices === 'function')
    t.equals(spr.createIndices.length, 1)
    t.end()
  })
}

module.exports.create = (test) => {
  test('create', (t) => {
    const db = new MockDatabase()
    spr.create(db)

    t.equals(db.stmt.length, 1)
    t.true(db.stmt[0].sql.includes('CREATE TABLE IF NOT EXISTS spr'))
    t.deepEquals(db.stmt[0].action.run[0], [])

    t.end()
  })
}

module.exports.insert = (test) => {
  test('insert', (t) => {
    const db = new MockDatabase()
    const insert = spr.insert(db)

    t.equals(typeof insert, 'function')
    t.equals(db.stmt.length, 1)
    t.true(db.stmt[0].sql.includes('INSERT OR IGNORE INTO spr'))

    t.end()
  })
  test('insert - feature', (t) => {
    const db = new MockDatabase()
    const insert = spr.insert(db)

    insert({
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Point',
        coordinates: [0, 0]
      }
    })

    t.deepEquals(db.stmt[0].action.run[0], [{
      id: -1,
      parent_id: -1,
      name: '',
      placetype: 'unknown',
      country: 'XX',
      repo: 'whosonfirst-data-xx',
      latitude: 0,
      longitude: 0,
      min_latitude: 0,
      min_longitude: 0,
      max_latitude: 0,
      max_longitude: 0,
      is_current: 1,
      is_deprecated: 0,
      is_ceased: 0,
      is_superseded: 0,
      is_superseding: 0,
      superseded_by: '',
      supersedes: '',
      lastmodified: -1
    }])

    t.end()
  })
  test('insert - do not insert alt geometries', (t) => {
    const db = new MockDatabase()
    const insert = spr.insert(db)

    insert({
      properties: {
        'src:alt_label': 'test'
      }
    })

    t.false(db.stmt[0].action.run.length)

    t.end()
  })
}

module.exports.drop = (test) => {
  test('drop', (t) => {
    const db = new MockDatabase()
    spr.drop(db)

    t.equals(db.stmt.length, 1)
    t.true(db.stmt[0].sql.includes('DROP TABLE IF EXISTS spr'))
    t.deepEquals(db.stmt[0].action.run[0], [])

    t.end()
  })
}

module.exports.createIndices = (test) => {
  test('createIndices', (t) => {
    const db = new MockDatabase()
    spr.createIndices(db)

    t.equals(db.stmt.length, 14)
    db.stmt.forEach(stmt => {
      t.true(stmt.sql.includes('CREATE INDEX IF NOT EXISTS spr_'))
      t.deepEquals(stmt.action.run[0], [])
    })

    t.end()
  })
}
