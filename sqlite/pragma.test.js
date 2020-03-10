const pragma = require('./pragma')
const MockDatabase = require('./mock/MockDatabase')

module.exports.interface = (test) => {
  test('write', (t) => {
    t.true(typeof pragma.write === 'function')
    t.equals(pragma.write.length, 1)
    t.end()
  })
  test('read', (t) => {
    t.true(typeof pragma.read === 'function')
    t.equals(pragma.read.length, 1)
    t.end()
  })
}

module.exports.write = (test) => {
  test('write', (t) => {
    const db = new MockDatabase()
    pragma.write(db)

    t.equals(db.stmt.length, 9)
    t.equals(db.stmt[0].sql, 'PRAGMA journal_mode=MEMORY')
    t.deepEquals(db.stmt[0].action.run[0], [])
    t.equals(db.stmt[1].sql, 'PRAGMA locking_mode=NORMAL')
    t.deepEquals(db.stmt[1].action.get[0], [])
    t.equals(db.stmt[2].sql, 'PRAGMA default_cache_size=2000')
    t.deepEquals(db.stmt[2].action.run[0], [])
    t.equals(db.stmt[3].sql, 'PRAGMA foreign_keys=OFF')
    t.deepEquals(db.stmt[3].action.run[0], [])
    t.equals(db.stmt[4].sql, 'PRAGMA temp_store=MEMORY')
    t.deepEquals(db.stmt[4].action.run[0], [])
    t.equals(db.stmt[5].sql, 'PRAGMA page_size=4096')
    t.deepEquals(db.stmt[5].action.run[0], [])
    t.equals(db.stmt[6].sql, 'PRAGMA cache_size=2000')
    t.deepEquals(db.stmt[6].action.run[0], [])
    t.equals(db.stmt[7].sql, 'PRAGMA recursive_triggers=OFF')
    t.deepEquals(db.stmt[7].action.run[0], [])

    t.equals(db.stmt[8].sql, 'PRAGMA synchronous=OFF')
    t.deepEquals(db.stmt[8].action.run[0], [])

    t.end()
  })
}

module.exports.read = (test) => {
  test('read', (t) => {
    const db = new MockDatabase()
    pragma.read(db)

    t.equals(db.stmt.length, 4)
    t.equals(db.stmt[0].sql, 'PRAGMA journal_mode=OFF')
    t.deepEquals(db.stmt[0].action.run[0], [])
    t.equals(db.stmt[1].sql, 'PRAGMA locking_mode=NORMAL')
    t.deepEquals(db.stmt[1].action.get[0], [])
    t.equals(db.stmt[2].sql, 'PRAGMA recursive_triggers=OFF')
    t.deepEquals(db.stmt[2].action.run[0], [])

    t.equals(db.stmt[3].sql, 'PRAGMA synchronous=OFF')
    t.deepEquals(db.stmt[3].action.run[0], [])

    t.end()
  })
}

module.exports.synchronous = (test) => {
  test('synchronous - default', (t) => {
    const db = new MockDatabase()
    pragma.synchronous(db)

    t.equals(db.stmt.length, 1)
    t.equals(db.stmt[0].sql, 'PRAGMA synchronous=OFF')
    t.deepEquals(db.stmt[0].action.run[0], [])

    t.end()
  })
  test('synchronous - custom', (t) => {
    const db = new MockDatabase()
    pragma.synchronous(db, 'NORMAL')

    t.equals(db.stmt.length, 1)
    t.equals(db.stmt[0].sql, 'PRAGMA synchronous=NORMAL')
    t.deepEquals(db.stmt[0].action.run[0], [])

    t.end()
  })
}

module.exports.mmap = (test) => {
  test('mmap', (t) => {
    const db = new MockDatabase()
    pragma.mmap(db)

    t.equals(db.stmt.length, 1)
    t.equals(db.stmt[0].sql, 'PRAGMA mmap_size=268435456')
    t.deepEquals(db.stmt[0].action.get[0], [])

    t.end()
  })
}
