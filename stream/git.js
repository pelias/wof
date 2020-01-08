const fs = require('fs')
const path = require('path')
const shell = require('./shell')

module.exports.archive = (dir, tree, ...paths) => {
  // support both 'bare' and 'checkout' style clones
  const dotGit = path.join(dir, '.git')
  if (fs.existsSync(dotGit)) { dir = dotGit }

  return shell.duplex(
    'git',
    [`--git-dir=${dir}`, 'archive', tree, ...paths],
    { stdio: ['ignore', 'pipe', 'inherit'] }
  )
}
