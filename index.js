const globby = require('globby')
/* modules */
const loader = require('./pkg/loader')


function checkErrors (validationResult, name) {
  if (validationResult.error) {
    const namify = (m) => name ? m.replace(/"value"/g, name) : m
    throw new Error(validationResult.error.details.map(e => namify(e.message)).join('; '))
  }
}

function initialize (gloob, options = {}) {
  checkErrors(require('./schemas/gloob.schema').validate(gloob), 'gloob')
  checkErrors(require('./schemas/options.schema').validate(options), 'options')

  const files = globby.sync(gloob)
  if (!files.length) throw new Error('No files were matched')

  if (typeof options == 'string') options = { envvar: options }
  if (typeof options == 'boolean') options = { name: options }

  return loader(files, options)
}


module.exports = initialize
