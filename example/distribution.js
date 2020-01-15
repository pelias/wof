/**
 * WIP - distibution builder
 */

const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const child = require('child_process')
const stream = require('@whosonfirst/wof').stream

// config
const DATADIR = '/data/wofbare'
const config = {
  force: false,
  dir: {
    repo: `${DATADIR}/repo`,
    sqlite: `${DATADIR}/sqlite`,
    bundle: `${DATADIR}/bundle`
  }
}

function generateDistPerCountry(pattern){
  const repos = fs.readdirSync(config.dir.repo).filter(r => r.includes(pattern))
  repos.sort()

  repos.forEach(repo => {
    const paths = {
      repo: path.join(config.dir.repo, repo),
      database: path.join(config.dir.sqlite, `${repo}.db`),
      bundle: path.join(config.dir.bundle, `${repo}.tar.gz`),
    }
    const extra = {
      repo: repo,
      commit: fs.readFileSync(path.join(paths.repo, 'shallow')).toString().trim(),
      last_updated: new Date(child.execSync(`git --git-dir="${paths.repo}" log -1 --format=%cd`).toString())
    }

    // check if this repo can be skipped
    if (!config.force && fs.existsSync(`${paths.database}.json`)) {
      const previous = require(`${paths.database}.json`)
      if (previous.commit === extra.commit) {
        return console.error(`skip ${repo}`)
      }
    }

    stream.miss.pipe(
      stream.wof('git', 'export', paths.repo, 'HEAD', 'data'),
      stream.miss.pipeline(
        stream.shell.duplex('pv', ['-fN', repo]),
        stream.tee(
          stream.wof('sqlite', 'import', '--rm', paths.database)
            .on('finish', inventory.bind(null, paths.database, extra)),
          stream.wof('bundle', 'import', '--rm', paths.bundle)
            .on('finish', inventory.bind(null, paths.bundle, extra))
        )
      )
    )
  })
}

function generateCombinedDist(pattern) {
  const repos = fs.readdirSync(config.dir.repo).filter(r => r.includes(pattern))
  repos.sort()

  const paths = {
    database: path.join(config.dir.sqlite, `${pattern}.db`),
    bundle: path.join(config.dir.bundle, `${pattern}.tar.gz`),
  }

  // generate a stable combined hash for the combined distribution
  const hash = crypto.createHash('sha256')
  let utime = new Date()
  repos.forEach(repo => {
    const repoPath = path.join(config.dir.repo, repo)
    const commit = fs.readFileSync(path.join(repoPath, 'shallow')).toString().trim()
    utime = new Date(child.execSync(`git --git-dir="${repoPath}" log -1 --format=%cd`).toString())
    hash.update(commit, 'utf8')
  })

  let extra = {
    repo: pattern,
    commit: hash.digest('hex'),
    last_updated: utime
  }

  // check if this repo can be skipped
  if (!config.force && fs.existsSync(`${paths.database}.json`)) {
    const previous = require(`${paths.database}.json`)
    if (previous.commit === extra.commit) {
      return console.error(`skip combined ${pattern}`)
    }
  }

  // create a combined stream of all the matching repos
  const combined = stream.combined()
  repos.forEach(repo => {
    combined.append(cb => {
      cb(null, stream.wof('git', 'export', path.join(config.dir.repo, repo), 'HEAD', 'data'))
    })
  })
  combined.append(null)

  stream.miss.pipe(
    combined,
    stream.miss.pipeline(
      stream.shell.duplex('pv', ['-fN', extra.repo]),
      stream.tee(
        stream.wof('sqlite', 'import', '--rm', paths.database)
          .on('finish', inventory.bind(null, paths.database, extra)),
        stream.wof('bundle', 'import', '--rm', paths.bundle)
          .on('finish', inventory.bind(null, paths.bundle, extra))
      )
    )
  )
}

// generate per-country dist files
generateDistPerCountry('whosonfirst-data-admin');
generateCombinedDist('whosonfirst-data-admin');

// generate inventory file
function inventory(filepath, extra, err) {
  if (err) { return console.error(`error ${filepath}`, err) }

  // file stats
  const stat = fs.statSync(filepath)
  const sha256 = child.execSync(`shasum -a 256 ${filepath}`).toString().substr(0, 64)
  const isCompressed = /(bz2|gz)$/.test(filepath)

  // write inventory file to disk
  fs.writeFileSync(`${filepath}.json`, JSON.stringify({
    name: path.basename(filepath),
    last_modified: new Date(stat.mtime),
    [isCompressed ? 'size_compressed' : 'size']: stat.size,
    [isCompressed ? 'sha256_compressed' : 'sha256']: sha256,
    ...extra,
  }, null, 2))
}
