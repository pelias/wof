const _ = require('lodash')

// deduplicate hierarchies
// remove any hierarchies which are duplicates of, or a subset of another hierarchy
module.exports.deduplicate = (hierarchies) => {
  return _.uniqWith(hierarchies, _.isEqual).filter(h1 => {
    return !hierarchies.some(h2 => !_.isEqual(h1, h2) && _.isMatch(h2, h1))
  })
}
