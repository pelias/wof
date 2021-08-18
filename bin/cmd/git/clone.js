const stream = { git: require('../../../stream/git') }

module.exports = {
  command: 'clone <uri> <repo>',
  describe: 'clone a remote git repository',
  builder: (yargs) => {
    // mandatory params
    yargs.positional('uri', {
      type: 'string',
      describe: 'Address of the remote git repository.'
    })
    yargs.positional('repo', {
      type: 'string',
      describe: 'Local path to write git repository.'
    })

    // optional params
    yargs.option('strategy', {
      type: 'string',
      default: 'shallow',
      choices: stream.git.clone_strategies
    })
    yargs.option('branch', {
      type: 'string',
      default: 'master',
      describe: 'The remote branch to clone.'
    })
    yargs.option('base', {
      type: 'string',
      default: 'https://github.com/whosonfirst-data/',
      describe: 'The base URL to resolve against if uri is not absolute.'
    })
  },
  handler: (argv) => {
    // parse & validate remote uri
    // note: apply github defaults to the URI which allow users to
    // completely omit the default scheme, domain name and org name.
    const uri = new URL(argv.uri, argv.base).toString()

    console.error(`Cloning [${argv.strategy}] ${uri}`)
    stream.git.clone(argv.strategy, uri, argv.repo, argv.branch)
  }
}
