const shell = require('./shell')
const miss = require('./miss')
const baseio = ['pipe', 'ignore', 'inherit']

module.exports = (...streams) => {
  // create an additional file descriptor for each stream
  const files = streams.map((s, i) => `/dev/fd/${i + baseio.length}`)
  const stdio = baseio.concat(streams.map(() => 'pipe'))

  // spawn a tee process
  const proc = shell.spawn('tee', files, { stdio: stdio })

  // pipe each new fd to a stream
  streams.forEach((stream, i) => {
    // match fd id to stream
    const fd = proc.stdio[i + baseio.length]

    // pipe fd to stream
    miss.pipe(fd, stream, (err) => {
      if (err) {
        console.error(`[tee pipe ${i}]`, err)
      }
    })
  })

  // return stdin (stdout is ignored)
  return proc.stdin
}
