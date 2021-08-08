const globby = require('globby')
/* modules */
const loader = require('./loader')


function checkErrors (validationResult, name) {
  if (validationResult.error) {
    const namify = (m) => name ? m.replace(/"value"/g, name) : m
    throw new Error(validationResult.error.details.map(e => namify(e.message)).join('; '))
  }
}

function initialize (gloob, options = {}) {
  checkErrors(require('./gloob.schema').validate(gloob), 'gloob')
  checkErrors(require('./options.schema').validate(options), 'options')

  return loader(globby.sync(gloob), options)
}


module.exports = initialize
