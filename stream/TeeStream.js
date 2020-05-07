// modified from:
// https://gist.github.com/TooTallNate/3908775

/**
 * Module dependencies.
 */

var stream = require('stream')
var Writable = stream.Writable
var PassThrough = stream.PassThrough
var inherits = require('util').inherits
var debug = require('debug')('stream:tee')

/**
 * Module exports.
 */

module.exports = Tee

/**
 * The `Tee` class is a writable stream that you write data to. Then when you want
 * to read that data from another stream just call the `.fork()` function which
 * will return a new PassThrough stream instance that outputs the same data written
 * to the Tee instance. You can call `fork()` as many times as necessary to fork
 * off the data multiple times.
 *
 * @api public
 */

function Tee (opts) {
  if (!(this instanceof Tee)) return new Tee(opts)
  Writable.call(this, opts)
  this.streams = []
}
inherits(Tee, Writable)

/**
 * Creates and returns a new PassThrough stream instance for this Tee instance.
 *
 * @param {Object} opts optional "options" to instantiate the PassThrough with
 * @return {Stream} a new PassThrough stream instance
 * @api public
 */

Tee.prototype.fork = function (opts) {
  var stream = new PassThrough(opts)
  this.streams.push(stream)
  this.on('finish', () => stream.end())
  return stream
}

/**
 * The base Writable class' `_write()` implementation.
 */

Tee.prototype._write = function (chunk, enc, done) {
  var count = this.streams.length
  debug('_write() (%d bytes, %d streams)', chunk.length, count)
  this.streams.forEach((stream, i) => {
    if (stream.write(chunk, enc) === false) {
      debug('need to wait for "drain" for stream %d', i)
      stream.once('drain', function () {
        debug('got "drain" event for stream %d', i)
        --count || done()
      })
    } else {
      --count
    }
  })
  if (count === 0) done()
}
