const _ = require('lodash')
const table = {
  ancestors: require('./table/ancestors'),
  concordances: require('./table/concordances'),
  geojson: require('./table/geojson'),
  names: require('./table/names'),
  spr: require('./table/spr')
}

module.exports = (db) => {
  _.each(table, (t) => {
    t.create(db)
    t.createIndices(db)
  })
}
