// https://github.com/junosuarez/exec-stream/pull/2

const Stream = require('stream')
const spawn = require('child_process').spawn

// optionally increase the internal buffer (up from 64KB)
// this is a tradeoff between using more RAM for the
// buffer and having more frequent stop/starts of
// the subprocess due to back-pressure.
// note: my testing showed no benefit in increasing this
const streamOptions = {
  // highWaterMark: 1e+6 // 1MB
}

function spawnDuplex(cmd, args, options) {

  const AB = new Stream.Duplex(streamOptions)
  const A = new Stream.PassThrough(streamOptions)
  const B = new Stream.PassThrough(streamOptions)

  // keep track of signal state
  // see: https://github.com/junosuarez/exec-stream/pull/2
  let SIGSTOP = false

  AB._write = (chunk, encoding, cb) => {
    return A.write(chunk, encoding, cb)
  }

  AB.once('finish', () => {
    A.end()
  })

  AB._read = function (n) {
    // send SIGCONT to continue
    if (SIGSTOP) {
      SIGSTOP = false
      proc.kill('SIGCONT')
    }
  }

  B.on('readable', () => {
    // send SIGSTOP to handle backpressure
    if (!AB.push(B.read()) && !SIGSTOP) {
      SIGSTOP = true
      proc.kill('SIGSTOP')
    }
  })

  B.once('end', () => {
    AB.push(null)
  })

  B.on('error', (err) => {
    AB.emit('error', err)
  })

  A.on('error', (err) => {
    AB.emit('error', err)
  })

  // spawn the child process
  const proc = spawn(cmd, args, options)

  // connect pipes
  A.pipe(proc.stdin)
  proc.stdout.pipe(B)

  // do not discard stderr stream, send to process
  proc.stderr.pipe(process.stderr)

  proc.on('error', (err) => {
    AB.emit('error', err)
  })

  return AB
}

module.exports = spawnDuplex
