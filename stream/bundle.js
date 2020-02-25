const _ = require('lodash')
const fs = require('fs')
const path = require('path')
const tmp = require('tmp')
const miss = require('mississippi2')
const tar = require('tar-stream')
const csv = require('csv-write-stream')
const feature = require('../whosonfirst/feature')
const file = require('../whosonfirst/file')
const meta = require('../whosonfirst/meta')
const convention = require('../whosonfirst/convention')
const streamOptions = { objectMode: true, autoDestroy: true }

/**
* options:
* - 'collection' name of the collection, such as 'whosonfirst-data' or 'whosonfirst-data-macroregion'
* - 'version' name of the version, such as 'latest' or '1535390738'
* - 'nometa' set to true to disable generation of meta files (default: false)
*/
module.exports.createWriteStream = (options) => {
  // assign default options
  _.defaults(options, {
    collection: convention.default.collection,
    version: convention.default.version,
    nometa: false
  })

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
    if (options.nometa !== true) {
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
        metadata[placetype].writable.write(meta(feat))
      }
    }

    next()
  }

  // called at the end
  const flush = (done) => {

    // write meta file(s)
    if (options.nometa !== true) {
      _.each(metadata, (store, placetype) => {

        // end writing to file
        store.writable.end()

        // write CSV meta files
        // @todo: try getting this to work with pure streams?
        const metaFilename = convention.metaFilename(options.collection, placetype, options.version)
        const header = { name: path.join('meta', metaFilename) }
        pack.entry(header, fs.readFileSync(store.path))

        // remove temp file
        fs.unlinkSync(store.path)
      })
    }

    pack.finalize()
    done()
  }

  // create tranform proxy
  const proxy = miss.through(streamOptions, xform, flush)

  // return duplex stream
  return miss.duplex(proxy, pack, streamOptions)
}
