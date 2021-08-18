const _ = require('lodash')
const axios = require('axios')
const miss = require('./miss')
const child = require('child_process')
const adapters = {}

_.set(adapters, 'stringify', () => {
  return miss.through.obj((feat, enc, next) => {
    try {
      next(null, JSON.stringify(feat, null, 2))
    } catch (e) {
      return next(e)
    }
  })
})

_.set(adapters, 'exportify.www', ({ host }) => {
  const options = {
    transformRequest: [], // disable axios json encoding
    transformResponse: [], // disable axios json decoding
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  }

  return miss.through.obj((feat, enc, next) => {
    // serialize objects to JSON strings
    const input = _.isString(feat) ? feat : JSON.stringify(feat)

    // perform HTTP request
    axios.post(host, input, options)
      .then((res) => { next(null, res.data) })
      .catch((e) => { next(e) })
  })
})

_.set(adapters, 'exportify.docker', () => {
  const cmd = [
    'docker', 'run', '-i', '--rm',
    'whosonfirst-exportify',
    '/usr/local/bin/wof-exportify',
    '--exporter=stdout',
    '--stdin'
  ].join(' ')

  return miss.through.obj((feat, enc, next) => {
    try {
      // serialize objects to JSON strings
      const input = _.isString(feat) ? feat : JSON.stringify(feat)

      // run the exportify command in a docker container
      next(null, child.execSync(cmd, { input }).toString('utf8'))
    } catch (e) {
      return next(e)
    }
  })
})

module.exports = (options) => {
  // use WOF exportify tooling
  const exportify = _.get(options, 'exportify.enabled')
  if (exportify === true) {
    // network exportify (wof-exportify-www)
    let host = _.get(options, 'exportify.host')
    if (_.isString(host) && !_.isEmpty(host)) {
      // add a default scheme to host if missing
      // see: https://github.com/axios/axios/issues/3509
      if (!/^https?:\/\//.test(host)) { host = `http://${host}` }

      if (options.verbose) { console.error(`marshaller: wof-exportify-www (${host})`) }
      return adapters.exportify.www({ host })
    }

    // docker exportify (wof-exportify-docker)
    if (options.verbose) { console.error('marshaller: wof-exportify-docker') }
    return adapters.exportify.docker()
  }

  // standard marshaller (JSON stringify)
  if (options.verbose) { console.error('marshaller: json-stringify') }
  return adapters.stringify()
}
