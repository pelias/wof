const Tee = require('./TeeStream')

// https://gist.github.com/TooTallNate/3908775
module.exports = (...streams) => {
  const proxy = new Tee()
  streams.forEach(stream => {
    proxy.fork().pipe(stream)
  })
  return proxy
}
