
// default values
module.exports.default = {}
module.exports.default.collection = 'whosonfirst-data'
module.exports.default.vintage = 'latest'

// this is the name of the meta/xxx.csv files generated in bundles
// eg. whosonfirst-data-ocean-latest.csv
module.exports.metaFilename = (collection, placetype, vintage) => {
  return `${collection}-${placetype}-${vintage}.csv`
}
