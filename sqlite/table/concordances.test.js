const concordances = require('./concordances')
const MockDatabase = require('../mock/MockDatabase')

module.exports.interface = (test) => {
  test('create', (t) => {
    t.true(typeof concordances.create === 'function')
    t.equals(concordances.create.length, 1)
    t.end()
  })
  test('insert', (t) => {
    t.true(typeof concordances.insert === 'function')
    t.equals(concordances.insert.length, 1)
    t.end()
  })
  test('drop', (t) => {
    t.true(typeof concordances.drop === 'function')
    t.equals(concordances.drop.length, 1)
    t.end()
  })
  test('createIndices', (t) => {
    t.true(typeof concordances.createIndices === 'function')
    t.equals(concordances.createIndices.length, 1)
    t.end()
  })
}

module.exports.create = (test) => {
  test('create', (t) => {
    const db = new MockDatabase()
    concordances.create(db)

    t.equals(db.stmt.length, 1)
    t.true(db.stmt[0].sql.includes('CREATE TABLE IF NOT EXISTS concordances'))
    t.deepEquals(db.stmt[0].action.run[0], [])

    t.end()
  })
}

module.exports.insert = (test) => {
  test('insert', (t) => {
    const db = new MockDatabase()
    const insert = concordances.insert(db)

    t.equals(typeof insert, 'function')
    t.equals(db.stmt.length, 1)
    t.true(db.stmt[0].sql.includes('INSERT OR IGNORE INTO concordances'))

    t.end()
  })
  test('insert - feature', (t) => {
    const db = new MockDatabase()
    const insert = concordances.insert(db)

    insert({
      type: 'Feature',
      properties: {
        'wof:concordances': {
          'fct:id': '030c3e4c-8f76-11e1-848f-cfd5bf3ef515',
          'gn:id': 3039163
        }
      },
      geometry: {
        type: 'Point',
        coordinates: [0, 0]
      }
    })

    t.deepEquals(db.stmt[0].action.run[0], [{
      other_id: '030c3e4c-8f76-11e1-848f-cfd5bf3ef515',
      other_source: 'fct:id',
      id: -1,
      lastmodified: -1
    }])

    t.deepEquals(db.stmt[0].action.run[1], [{
      other_id: 3039163,
      other_source: 'gn:id',
      id: -1,
      lastmodified: -1
    }])

    t.end()
  })
  test('insert - do not insert alt geometries', (t) => {
    const db = new MockDatabase()
    const insert = concordances.insert(db)

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
    concordances.drop(db)

    t.equals(db.stmt.length, 1)
    t.true(db.stmt[0].sql.includes('DROP TABLE IF EXISTS concordances'))
    t.deepEquals(db.stmt[0].action.run[0], [])

    t.end()
  })
}

module.exports.createIndices = (test) => {
  test('createIndices', (t) => {
    const db = new MockDatabase()
    concordances.createIndices(db)

    t.equals(db.stmt.length, 4)
    db.stmt.forEach(stmt => {
      t.true(stmt.sql.includes('CREATE INDEX IF NOT EXISTS concordances_'))
      t.deepEquals(stmt.action.run[0], [])
    })

    t.end()
  })
}
