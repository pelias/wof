// improve index-time performance
module.exports.write = (db) => {
  db.prepare('PRAGMA journal_mode=MEMORY').run()
  db.prepare('PRAGMA locking_mode=NORMAL').get()
  db.prepare('PRAGMA default_cache_size=2000').run()
  db.prepare('PRAGMA synchronous=OFF').run()
  db.prepare('PRAGMA foreign_keys=OFF').run()
  db.prepare('PRAGMA temp_store=MEMORY').run()
  db.prepare('PRAGMA page_size=4096').run()
  db.prepare('PRAGMA cache_size=2000').run()
  db.prepare('PRAGMA recursive_triggers=OFF').run()
}

// improve query-time performance
module.exports.read = (db) => {
  db.prepare('PRAGMA journal_mode=OFF').run()
  db.prepare('PRAGMA locking_mode=NORMAL').get()
  db.prepare('PRAGMA synchronous=OFF').run()
  db.prepare('PRAGMA mmap_size=268435456').get()
  db.prepare('PRAGMA recursive_triggers=OFF').run()
}
