const exportify = require('../../../whosonfirst/exportify')
const stream = {
  json: require('../../../stream/json'),
  miss: require('../../../stream/miss')
}

module.exports = {
  command: 'exportify',
  describe: 'run WOF exportify tool on features',
  handler: () => {
    process.stdin
      .pipe(stream.json.parse())
      .pipe(stream.miss.through.obj((json, _, next) => {
        // run the exportify command in a docker container
        // note: unfortunately it doesn't support multiple lines
        // of json, so we need to execute the container once per feature.
        next(null, exportify(json))
      }))
      .pipe(process.stdout)
  }
}
