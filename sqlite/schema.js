const _ = require('lodash')
const path = require('path')
const table = require('require-all')(path.join(__dirname, 'table'))

module.exports = (db) => {
  _.each(table, (t) => {
    t.create(db)
    t.createIndices(db)
  })
}
