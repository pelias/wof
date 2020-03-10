const geojson = require('./geojson')
const MockDatabase = require('../mock/MockDatabase')

module.exports.interface = (test) => {
  test('create', (t) => {
    t.true(typeof geojson.create === 'function')
    t.equals(geojson.create.length, 1)
    t.end()
  })
  test('insert', (t) => {
    t.true(typeof geojson.insert === 'function')
    t.equals(geojson.insert.length, 1)
    t.end()
  })
  test('drop', (t) => {
    t.true(typeof geojson.drop === 'function')
    t.equals(geojson.drop.length, 1)
    t.end()
  })
  test('createIndices', (t) => {
    t.true(typeof geojson.createIndices === 'function')
    t.equals(geojson.createIndices.length, 1)
    t.end()
  })
}

module.exports.create = (test) => {
  test('create', (t) => {
    const db = new MockDatabase()
    geojson.create(db)

    t.equals(db.stmt.length, 1)
    t.true(db.stmt[0].sql.includes('CREATE TABLE IF NOT EXISTS geojson'))
    t.deepEquals(db.stmt[0].action.run[0], [])

    t.end()
  })
}

module.exports.insert = (test) => {
  test('insert', (t) => {
    const db = new MockDatabase()
    const insert = geojson.insert(db)

    t.equals(typeof insert, 'function')
    t.equals(db.stmt.length, 1)
    t.true(db.stmt[0].sql.includes('INSERT OR IGNORE INTO geojson'))

    t.end()
  })
  test('insert - feature', (t) => {
    const db = new MockDatabase()
    const insert = geojson.insert(db)

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
      body: '{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[0,0]}}',
      source: 'unknown',
      is_alt: 0,
      lastmodified: -1
    }])

    t.end()
  })
  test('insert - do insert alt geometries', (t) => {
    const db = new MockDatabase()
    const insert = geojson.insert(db)

    insert({
      type: 'Feature',
      properties: {
        'src:alt_label': 'test'
      },
      geometry: {
        type: 'Point',
        coordinates: [0, 0]
      }
    })

    t.deepEquals(db.stmt[0].action.run[0], [{
      id: -1,
      body: '{"type":"Feature","properties":{"src:alt_label":"test"},"geometry":{"type":"Point","coordinates":[0,0]}}',
      source: 'unknown',
      is_alt: 1,
      lastmodified: -1
    }])

    t.end()
  })
}

module.exports.drop = (test) => {
  test('drop', (t) => {
    const db = new MockDatabase()
    geojson.drop(db)

    t.equals(db.stmt.length, 1)
    t.true(db.stmt[0].sql.includes('DROP TABLE IF EXISTS geojson'))
    t.deepEquals(db.stmt[0].action.run[0], [])

    t.end()
  })
}

module.exports.createIndices = (test) => {
  test('createIndices', (t) => {
    const db = new MockDatabase()
    geojson.createIndices(db)

    t.equals(db.stmt.length, 3)
    db.stmt.forEach(stmt => {
      t.true(stmt.sql.match(/CREATE (UNIQUE )?INDEX IF NOT EXISTS geojson_/))
      t.deepEquals(stmt.action.run[0], [])
    })

    t.end()
  })
}
