const _ = require('lodash')
const path = require('path')
const stream = {
  json: require('../../../stream/json'),
  miss: require('../../../stream/miss')
}

module.exports = {
  command: 'map <script>',
  describe: 'apply user-provided map function to features',
  builder: (yargs) => {
    // mandatory params
    yargs.positional('script', {
      type: 'string',
      describe: 'Location of javascript which exports a function.'
    })
    // optional params
    yargs.option('param', {
      type: 'array',
      describe: 'Key/value pair of params in the format `key=value`.'
    })
    yargs.option('params', {
      type: 'string',
      describe: 'JSON encoded params to pass into map function.'
    })
  },
  handler: (argv) => {
    let script
    let map

    // locate script
    if (argv.script.startsWith('view://')) {
      script = path.resolve(__dirname, '../../../whosonfirst/view', argv.script.substr('view://'.length))
    } else {
      script = path.resolve(process.cwd(), argv.script)
    }

    // load script
    try {
      map = require(script)
    } catch (e) {
      console.error(`failed to open mapping script: ${script}`)
      console.error(e)
    }
    if (typeof map !== 'function') {
      console.error(`mapping script must export a function: ${script}`)
      process.exit(1)
    }

    process.stdin
      .pipe(stream.json.parse())
      .pipe(stream.miss.through.obj((feat, enc, next) => {
        const mapped = map(feat, params(argv))
        const drop = (mapped === null || typeof mapped !== 'object')
        next(null, drop ? undefined : JSON.stringify(mapped))
      }))
      .pipe(process.stdout)
  }
}

// parse params
function params (argv) {
  let params = {}

  // json params
  if (_.isString(argv.params)) {
    try {
      params = JSON.parse(argv.params)
      if (!_.isPlainObject(params)) { throw new Error('json not of type object') }
    } catch (e) {
      console.error(`failed to parse JSON: ${argv.params}`)
      console.error(e)
      process.exit(1)
    }
  }

  // string params
  if (_.isArray(argv.param)) {
    argv.param.forEach(v => {
      const s = v.trim().split('=')
      if (s.length !== 2 || !s[0] || !s[1]) {
        console.error(`invalid param: ${v}`)
        process.exit(1)
      }
      params[s[0]] = s[1]
    })
  }

  return params
}
