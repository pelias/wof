const MockStatement = require('./MockStatement')

class MockDatabase {
  constructor () { this.stmt = [] }
  prepare (sql) {
    const stmt = new MockStatement(sql)
    this.stmt.push(stmt)
    return stmt
  }
}

module.exports = MockDatabase
