class MockStatement {
  constructor(sql) {
    this.sql = sql
    this.action = 'none'
  }
  run() { this.action = 'run' }
  get() { this.action = 'get' }
}

module.exports = MockStatement
