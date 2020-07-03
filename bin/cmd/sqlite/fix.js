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
    yargs.option('hierarchies', {
      type: 'boolean',
      default: true,
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
      sqlite.fix.hierarchies(db)
    }
  }
}
