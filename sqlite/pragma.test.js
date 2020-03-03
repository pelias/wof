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

    t.equals(db.pragmas.length, 9)
    t.equals(db.pragmas[0].sql, 'PRAGMA journal_mode=MEMORY')
    t.equals(db.pragmas[0].action, 'run')
    t.equals(db.pragmas[1].sql, 'PRAGMA locking_mode=NORMAL')
    t.equals(db.pragmas[1].action, 'get')
    t.equals(db.pragmas[2].sql, 'PRAGMA default_cache_size=2000')
    t.equals(db.pragmas[2].action, 'run')
    t.equals(db.pragmas[3].sql, 'PRAGMA synchronous=OFF')
    t.equals(db.pragmas[3].action, 'run')
    t.equals(db.pragmas[4].sql, 'PRAGMA foreign_keys=OFF')
    t.equals(db.pragmas[4].action, 'run')
    t.equals(db.pragmas[5].sql, 'PRAGMA temp_store=MEMORY')
    t.equals(db.pragmas[5].action, 'run')
    t.equals(db.pragmas[6].sql, 'PRAGMA page_size=4096')
    t.equals(db.pragmas[6].action, 'run')
    t.equals(db.pragmas[7].sql, 'PRAGMA cache_size=2000')
    t.equals(db.pragmas[7].action, 'run')
    t.equals(db.pragmas[8].sql, 'PRAGMA recursive_triggers=OFF')
    t.equals(db.pragmas[8].action, 'run')

    t.end()
  })
}

module.exports.read = (test) => {
  test('read', (t) => {
    const db = new MockDatabase()
    pragma.read(db)

    t.equals(db.pragmas.length, 5)
    t.equals(db.pragmas[0].sql, 'PRAGMA journal_mode=OFF')
    t.equals(db.pragmas[0].action, 'run')
    t.equals(db.pragmas[1].sql, 'PRAGMA locking_mode=NORMAL')
    t.equals(db.pragmas[1].action, 'get')
    t.equals(db.pragmas[2].sql, 'PRAGMA synchronous=OFF')
    t.equals(db.pragmas[2].action, 'run')
    t.equals(db.pragmas[3].sql, 'PRAGMA mmap_size=268435456')
    t.equals(db.pragmas[3].action, 'get')
    t.equals(db.pragmas[4].sql, 'PRAGMA recursive_triggers=OFF')
    t.equals(db.pragmas[4].action, 'run')

    t.end()
  })
}
