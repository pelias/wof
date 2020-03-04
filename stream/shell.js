const _ = require('lodash')
const child = require('child_process')
const spawnDuplex = require('./spawnDuplex')

module.exports.spawn = (cmd, args, options) => {
  return child.spawn(
    cmd,
    _.isArray(args) ? args : [],
    _.defaults({}, options)
  )
}

module.exports.duplex = (cmd, args) => spawnDuplex(cmd, args)
