const _ = require('lodash')
const path = require('path')
const miss = require('mississippi2')
const tar = require('tar-stream')
const csv = require('convert-array-to-csv')
const feature = require('../whosonfirst/feature')
const file = require('../whosonfirst/file')
const wofmeta = require('../whosonfirst/meta')
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

module.exports.createWriteStream = (meta = true) => {
  const pack = tar.pack()
  const metadata = {}

  // called once per feature
  const xform = (feat, enc, next) => {
    // find last modified time (not available for alt geometries)
    const lastmodified = feature.getLastModified(feat)

    // see: https://github.com/mafintosh/tar-stream#headers
    const header = { name: path.join('data', file.path.fromFeature(feat)) }
    if (lastmodified > 0) { header.mtime = new Date(feature.getLastModified(feat) * 1000) }

    // add file to archive
    pack.entry(header, JSON.stringify(feat))

    // generate meta file(s)
    // @todo: is it safe to store this in RAM?
    if (meta === true) {
      const placetype = feature.getPlacetype(feat)

      // alt geometries have no placetype
      if (placetype) {
        if (!metadata[placetype]) { metadata[placetype] = [] }
        metadata[placetype].push(wofmeta(feat))
      }
    }

    next()
  }

  // called at the end
  const flush = (done) => {
    // write meta file(s)
    if (meta === true) {
      _.each(metadata, (rows, placetype) => {
        // skip empty files
        if (!_.isArray(rows) || _.isEmpty(rows)) { return }

        // write CSV meta files
        // @todo: in a more memory efficient way
        const header = { name: path.join('meta', `${placetype}.csv`) }
        pack.entry(header, csv.convertArrayToCSV(rows))
      })
    }

    pack.finalize()
    done()
  }

  // create tranform proxy
  const proxy = miss.through(options, xform, flush)

  // return duplex stream
  return miss.duplex(proxy, pack, options)
}
