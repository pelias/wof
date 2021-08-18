const fs = require('fs')
const path = require('path')
const shell = require('./shell')
const miss = require('./miss')
const bsdtar = require('./bsdtar')
const child = require('child_process')

module.exports.archive = (dir, tree, filterPath, args) => {
  // support both 'bare' and 'checkout' style clones
  const dotGit = path.join(dir, '.git')
  if (fs.existsSync(dotGit)) { dir = dotGit }

  // ensure that the repo contains a 'data' dir
  // as some postalcode repos are empty
  const directoryListing = `git --git-dir=${dir} ls-tree -d --name-only ${tree}`
  const topLevelDirs = child.execSync(directoryListing).toString().trim().split('\n')

  // no data dire present, return no-op stream
  if (!topLevelDirs.includes('data')) {
    console.error('directory \'data\' not found in git archive, skipping')
    return miss.through()
  }

  // else return a pipeline of the git export command
  // piped to the bsdtar extract command
  return miss.pipeline(
    shell.duplex(
      'git',
      [`--git-dir=${dir}`, 'archive', tree, filterPath]
    ),
    bsdtar.extract(...args)
  )
}

module.exports.clone_strategies = ['standard', 'shallow', 'bare']
module.exports.clone = (strategy, uri, dir, branch) => {
  const flags = [
    '--progress',
    '--branch', branch
  ]

  // limit the clone depth for all non-standard strategies
  if (strategy !== 'standard') {
    flags.push(
      '--depth', '1',
      '--single-branch'
    )
  }

  // perform a 'bare' clone (ie. no working copy of the files)
  if (strategy === 'bare') {
    flags.push('--bare')
  }

  return shell.spawn('git', ['clone', ...flags, uri, dir], { stdio: 'inherit' })
}
