const MockStatement = require('./MockStatement')

class MockDatabase {
  constructor() { this.pragmas = [] }
  prepare(sql) {
    const stmt = new MockStatement(sql)
    this.pragmas.push(stmt)
    return stmt
  }
}

module.exports = MockDatabase
