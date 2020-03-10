const names = require('./names')
const MockDatabase = require('../mock/MockDatabase')

module.exports.interface = (test) => {
  test('create', (t) => {
    t.true(typeof names.create === 'function')
    t.equals(names.create.length, 1)
    t.end()
  })
  test('insert', (t) => {
    t.true(typeof names.insert === 'function')
    t.equals(names.insert.length, 1)
    t.end()
  })
  test('drop', (t) => {
    t.true(typeof names.drop === 'function')
    t.equals(names.drop.length, 1)
    t.end()
  })
  test('createIndices', (t) => {
    t.true(typeof names.createIndices === 'function')
    t.equals(names.createIndices.length, 1)
    t.end()
  })
}

module.exports.create = (test) => {
  test('create', (t) => {
    const db = new MockDatabase()
    names.create(db)

    t.equals(db.stmt.length, 1)
    t.true(db.stmt[0].sql.includes('CREATE TABLE IF NOT EXISTS names'))
    t.deepEquals(db.stmt[0].action.run[0], [])

    t.end()
  })
}

module.exports.insert = (test) => {
  test('insert', (t) => {
    const db = new MockDatabase()
    const insert = names.insert(db)

    t.equals(typeof insert, 'function')
    t.equals(db.stmt.length, 1)
    t.true(db.stmt[0].sql.includes('INSERT OR IGNORE INTO names'))

    t.end()
  })
  test('insert - feature', (t) => {
    const db = new MockDatabase()
    const insert = names.insert(db)

    insert({
      type: 'Feature',
      properties: {
        'name:ara_x_preferred': ['سانت جوليا دي لوريا'],
        'name:arg_x_variant': ['Sant Julià de Lòria'],
        'name:bul_x_colloquial': ['Сан Джулия де Лория']
      },
      geometry: {
        type: 'Point',
        coordinates: [0, 0]
      }
    })

    t.equals(db.stmt[0].action.run.length, 3)
    t.deepEquals(db.stmt[0].action.run[0], [{
      language: 'ara',
      extlang: '',
      script: undefined,
      region: undefined,
      variant: undefined,
      extension: '',
      privateuse: 'preferred',
      name: 'سانت جوليا دي لوريا',
      id: -1,
      placetype: 'unknown',
      country: 'XX',
      lastmodified: -1
    }])
    t.deepEquals(db.stmt[0].action.run[1], [{
      language: 'arg',
      extlang: '',
      script: undefined,
      region: undefined,
      variant: undefined,
      extension: '',
      privateuse: 'variant',
      name: 'Sant Julià de Lòria',
      id: -1,
      placetype: 'unknown',
      country: 'XX',
      lastmodified: -1
    }])
    t.deepEquals(db.stmt[0].action.run[2], [{
      language: 'bul',
      extlang: '',
      script: undefined,
      region: undefined,
      variant: undefined,
      extension: '',
      privateuse: 'colloquial',
      name: 'Сан Джулия де Лория',
      id: -1,
      placetype: 'unknown',
      country: 'XX',
      lastmodified: -1
    }])

    t.end()
  })
  test('insert - do not insert alt geometries', (t) => {
    const db = new MockDatabase()
    const insert = names.insert(db)

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
    names.drop(db)

    t.equals(db.stmt.length, 1)
    t.true(db.stmt[0].sql.includes('DROP TABLE IF EXISTS names'))
    t.deepEquals(db.stmt[0].action.run[0], [])

    t.end()
  })
}

module.exports.createIndices = (test) => {
  test('createIndices', (t) => {
    const db = new MockDatabase()
    names.createIndices(db)

    t.equals(db.stmt.length, 7)
    db.stmt.forEach(stmt => {
      t.true(stmt.sql.includes('CREATE INDEX IF NOT EXISTS names_'))
      t.deepEquals(stmt.action.run[0], [])
    })

    t.end()
  })
}
