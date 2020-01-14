const miss = require('mississippi2')
const tar = require('tar-stream')
const options = { objectMode: true, autoDestroy: true }

module.exports.createReadStream = (filter) => {
  const proxy = miss.through(options)
  const extract = tar.extract()

  // for each entry in tar file
  extract.on('entry', (header, stream, next) => {
    // ready for next entry
    stream.on('end', () => { next() })

    try {
      if (filter(header)) {
        // pipe entry to proxy
        stream.on('end', () => stream.unpipe(proxy))
        stream.pipe(proxy, { end: false })
      } else {
        // ensure unpiped stream is drained
        stream.resume()
      }
    } catch (e) {
      console.error(e)
    }
  })

  // finished extracting entries
  extract.on('finish', () => proxy.end())

  // return duplex stream
  return miss.duplex(extract, proxy, options)
}
