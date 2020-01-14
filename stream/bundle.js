const _ = require('lodash')
const fs = require('fs')
const path = require('path')
const tmp = require('tmp')
const miss = require('mississippi2')
const tar = require('tar-stream')
const csv = require('csv-write-stream')
const feature = require('../whosonfirst/feature')
const file = require('../whosonfirst/file')
const wofmeta = require('../whosonfirst/meta')
const options = { objectMode: true, autoDestroy: true }

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
    // note: temp files are used to avoid storing in RAM
    if (meta === true) {
      const placetype = feature.getPlacetype(feat)

      // note: alt geometries have no placetype
      if (placetype && placetype !== 'unknown') {
        // create a new tempfile for this placetype
        if (!_.has(metadata, placetype)) {
          const tmpFileName = tmp.tmpNameSync()
          const store = {
            path: tmpFileName,
            writable: miss.pipeline.obj(
              csv(),
              fs.createWriteStream(tmpFileName)
            )
          }
          metadata[placetype] = store
        }
        // write a row to the tempfile
        metadata[placetype].writable.write(wofmeta(feat))
      }
    }

    next()
  }

  // called at the end
  const flush = (done) => {

    // write meta file(s)
    if (meta === true) {
      _.each(metadata, (store, placetype) => {

        // end writing to file
        store.writable.end()

        // write CSV meta files
        // @todo: try getting this to work with pure streams?
        const header = { name: path.join('meta', `${placetype}.csv`) }
        pack.entry(header, fs.readFileSync(store.path))

        // remove temp file
        fs.unlinkSync(store.path)
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
