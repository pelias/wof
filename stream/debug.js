const miss = require('mississippi2')

const debug = (chunk) => {
  const isObject = (typeof chunk) === 'object'
  const isBuffer = Buffer.isBuffer(chunk)

  let str = chunk
  if (isBuffer) { str = chunk.toString() } else if (isObject) { str = JSON.stringify(chunk) }

  if ((typeof str) === 'string') {
    process.stderr.write(str)
  } else {
    process.stderr.write('[debug error]')
  }
}

module.exports.sink = () => {
  return miss.through((chunk, enc, next) => {
    debug(chunk)
    next()
  })
}

module.exports.passthrough = () => {
  return miss.through((chunk, enc, next) => {
    debug(chunk)
    next(null, chunk)
  })
}
