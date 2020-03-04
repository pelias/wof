// improve index-time performance
module.exports.write = (db) => {
  db.prepare('PRAGMA journal_mode=MEMORY').run()
  db.prepare('PRAGMA locking_mode=NORMAL').get()
  db.prepare('PRAGMA default_cache_size=2000').run()
  db.prepare('PRAGMA foreign_keys=OFF').run()
  db.prepare('PRAGMA temp_store=MEMORY').run()
  db.prepare('PRAGMA page_size=4096').run()
  db.prepare('PRAGMA cache_size=2000').run()
  db.prepare('PRAGMA recursive_triggers=OFF').run()

  module.exports.synchronous(db, 'OFF')
}

// this setting is proplematic as the data may or
// may not be written to the disk when the process exits.
// The advantage is in increased import speed.
// This is generally safe to use if you don't need
// to access the database in another thread
// immediately after creating it.
module.exports.synchronous = (db, value) => {
  db.prepare(`PRAGMA synchronous=${value || 'OFF'}`).run()
}

// improve query-time performance
module.exports.read = (db) => {
  db.prepare('PRAGMA journal_mode=OFF').run()
  db.prepare('PRAGMA locking_mode=NORMAL').get()
  db.prepare('PRAGMA recursive_triggers=OFF').run()

  module.exports.synchronous(db, 'OFF')
}

// enable mmap mode (read caching in RAM via the kernel)
module.exports.mmap = (db) => {
  db.prepare('PRAGMA mmap_size=268435456').get()
}
