const _ = require('lodash')
const child = require('child_process')

const cmd = [
  'docker', 'run', '-i', '--rm',
  'whosonfirst-exportify',
  '/usr/local/bin/wof-exportify',
  '--exporter=stdout',
  '--stdin'
].join(' ')

function exportify (feat) {
  // serialize objects to JSON strings
  if (_.isObject(feat)) { feat = JSON.stringify(feat) }

  // run the exportify command in a docker container
  return child.execSync(cmd, { input: feat }).toString('utf8')
}

module.exports = exportify
