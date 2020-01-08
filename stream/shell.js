const _ = require('lodash')
const child = require('child_process')
const miss = require('mississippi2')
const defaults = { env: process.env }

module.exports.spawn = (cmd, args, options) => {
  return child.spawn(
    cmd,
    _.isArray(args) ? args : [],
    _.defaults({}, defaults, options)
  )
}

// module.exports.duplex = (cmd, args, options) => miss.child.spawn(cmd, args)

module.exports.duplex = (cmd, args, options) => {
  const proc = module.exports.spawn(cmd, args, _.defaults({
    stdio: ['pipe', 'pipe', 'inherit']
  }, options))

  // handle close event
  proc.stdin.once('close', () => proc.stdin.end())

  return miss.duplex(proc.stdin, proc.stdout)
}

// same as above but output is on stderr instead of stdout
module.exports.duplexStderr = (cmd, args, options) => {
  const proc = module.exports.spawn(cmd, args, _.defaults({
    stdio: ['pipe', 'inherit', 'pipe']
  }, options))

  // handle close event
  proc.stdin.once('close', () => proc.stdin.end())

  return miss.duplex(proc.stdin, proc.stderr)
}
