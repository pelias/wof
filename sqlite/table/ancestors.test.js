const ancestors = require('./ancestors')
const MockDatabase = require('../mock/MockDatabase')

module.exports.interface = (test) => {
  test('create', (t) => {
    t.true(typeof ancestors.create === 'function')
    t.equals(ancestors.create.length, 1)
    t.end()
  })
  test('insert', (t) => {
    t.true(typeof ancestors.insert === 'function')
    t.equals(ancestors.insert.length, 1)
    t.end()
  })
  test('drop', (t) => {
    t.true(typeof ancestors.drop === 'function')
    t.equals(ancestors.drop.length, 1)
    t.end()
  })
  test('createIndices', (t) => {
    t.true(typeof ancestors.createIndices === 'function')
    t.equals(ancestors.createIndices.length, 1)
    t.end()
  })
}

module.exports.create = (test) => {
  test('create', (t) => {
    const db = new MockDatabase()
    ancestors.create(db)

    t.equals(db.stmt.length, 1)
    t.true(db.stmt[0].sql.includes('CREATE TABLE IF NOT EXISTS ancestors'))
    t.deepEquals(db.stmt[0].action.run[0], [])

    t.end()
  })
}

module.exports.insert = (test) => {
  test('insert', (t) => {
    const db = new MockDatabase()
    const insert = ancestors.insert(db)

    t.equals(typeof insert, 'function')
    t.equals(db.stmt.length, 1)
    t.true(db.stmt[0].sql.includes('INSERT OR IGNORE INTO ancestors'))

    t.end()
  })
  test('insert - feature', (t) => {
    const db = new MockDatabase()
    const insert = ancestors.insert(db)

    insert({
      type: 'Feature',
      properties: {
        'wof:hierarchy': [
          {
            continent_id: 102191581,
            country_id: 85632343,
            locality_id: 101851343,
            region_id: 85667945
          }
        ]
      },
      geometry: {
        type: 'Point',
        coordinates: [0, 0]
      }
    })

    t.deepEquals(db.stmt[0].action.run[0], [{
      ancestor_id: 102191581,
      ancestor_placetype: 'continent',
      id: -1,
      lastmodified: -1
    }])

    t.deepEquals(db.stmt[0].action.run[1], [{
      ancestor_id: 85632343,
      ancestor_placetype: 'country',
      id: -1,
      lastmodified: -1
    }])

    t.deepEquals(db.stmt[0].action.run[2], [{
      ancestor_id: 101851343,
      ancestor_placetype: 'locality',
      id: -1,
      lastmodified: -1
    }])

    t.deepEquals(db.stmt[0].action.run[3], [{
      ancestor_id: 85667945,
      ancestor_placetype: 'region',
      id: -1,
      lastmodified: -1
    }])

    t.end()
  })
  test('insert - do not insert alt geometries', (t) => {
    const db = new MockDatabase()
    const insert = ancestors.insert(db)

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
    ancestors.drop(db)

    t.equals(db.stmt.length, 1)
    t.true(db.stmt[0].sql.includes('DROP TABLE IF EXISTS ancestors'))
    t.deepEquals(db.stmt[0].action.run[0], [])

    t.end()
  })
}

module.exports.createIndices = (test) => {
  test('createIndices', (t) => {
    const db = new MockDatabase()
    ancestors.createIndices(db)

    t.equals(db.stmt.length, 3)
    db.stmt.forEach(stmt => {
      t.true(stmt.sql.includes('CREATE INDEX IF NOT EXISTS ancestors_'))
      t.deepEquals(stmt.action.run[0], [])
    })

    t.end()
  })
}
