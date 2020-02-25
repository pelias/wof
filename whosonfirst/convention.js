
// default values
module.exports.default = {}
module.exports.default.collection = 'whosonfirst-data'
module.exports.default.version = 'latest'

// this is the name of the meta/xxx.csv files generated in bundles
// eg. whosonfirst-data-ocean-latest.csv
module.exports.metaFilename = (collection, placetype, version) => {
  return `${collection}-${placetype}-${version}.csv`
}
