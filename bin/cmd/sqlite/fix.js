const sqlite = { fix: require('../../../sqlite/fix') }
const Database = require('better-sqlite3')

module.exports = {
  command: 'fix <database>',
  describe: 'attempt to fix features in a SQLite database',
  builder: (yargs) => {
    // mandatory params
    yargs.positional('database', {
      type: 'string',
      describe: 'Location of database file.'
    })

    // optional params
    yargs.option('dryrun', {
      type: 'boolean',
      default: false,
      describe: 'Do not modify database.'
    })
    yargs.option('cat', {
      type: 'boolean',
      default: false,
      describe: 'Print updated records to stdout.'
    })
    yargs.option('hierarchies', {
      type: 'boolean',
      default: false,
      describe: 'Fix broken hierarchies.'
    })
  },
  handler: (argv) => {
    // connect to database
    if (argv.verbose) { console.error(`open ${argv.database}`) }
    const db = Database(argv.database, { readonly: false })

    // hierarchies
    if (argv.hierarchies) {
      if (argv.verbose) { console.error('fixing orphaned hierarchies') }
      sqlite.fix.hierarchies(db, argv)
    }
  }
}
