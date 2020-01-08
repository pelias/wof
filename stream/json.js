const miss = require('./miss')
module.exports = require('jsonstream2')

// convenience function to parse json and create object stream
module.exports.through = (options, tranform, flush) => miss.pipeline(
  module.exports.parse(),
  miss.through.obj(options, tranform, flush)
)
