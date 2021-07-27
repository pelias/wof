const geojson = require('./geojson')
const Database = require('better-sqlite3')
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
      alt_label: undefined,
      is_alt: 0,
      lastmodified: -1
    }])

    t.end()
  })
  test('insert - insert alt geometries', (t) => {
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
      alt_label: 'test',
      is_alt: 1,
      lastmodified: -1
    }])

    t.end()
  })
  // https://github.com/whosonfirst-data/whosonfirst-data/issues/1834
  test('insert - prefer the src:alt_label over src:geom when both available', (t) => {
    const db = new MockDatabase()
    const insert = geojson.insert(db)

    insert({
      type: 'Feature',
      properties: {
        'src:alt_label': 'test2',
        'src:geom': 'test'
      },
      geometry: {
        type: 'Point',
        coordinates: [0, 0]
      }
    })

    t.deepEquals(db.stmt[0].action.run[0], [{
      id: -1,
      body: '{"type":"Feature","properties":{"src:alt_label":"test2","src:geom":"test"},"geometry":{"type":"Point","coordinates":[0,0]}}',
      source: 'test',
      alt_label: 'test2',
      is_alt: 1,
      lastmodified: -1
    }])

    t.end()
  })
  // https://github.com/whosonfirst/go-whosonfirst-sqlite-features/issues/7
  test('insert - improved unique constraint', (t) => {
    const db = new Database(':memory:')
    geojson.create(db)
    geojson.createIndices(db)

    const insert = geojson.insert(db)

    insert({
      type: 'Feature',
      properties: {
        'src:alt_label': 'whosonfirst',
        'src:geom': 'whosonfirst'
      },
      geometry: {
        type: 'Point',
        coordinates: [0, 0]
      }
    })

    insert({
      type: 'Feature',
      properties: {
        'src:geom': 'whosonfirst'
      },
      geometry: {
        type: 'Point',
        coordinates: [0, 0]
      }
    })

    t.equals(2, db.prepare('SELECT COUNT(*) AS count FROM geojson').get().count)
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
