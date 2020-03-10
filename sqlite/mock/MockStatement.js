class MockStatement {
  constructor(sql) {
    this.sql = sql.replace(/\n/g, ' ').replace(/\s{2,}/g, ' ')
    this.action = {
      run: [],
      get: [],
      all: []
    }
  }
  run(...args) { this.action.run.push(args) }
  get(...args) { this.action.get.push(args) }
  all(...args) { this.action.all.push(args) }
}

module.exports = MockStatement
