const shell = require('./shell')

module.exports = (...args) => shell.duplex('find', args)
