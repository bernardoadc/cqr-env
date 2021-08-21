/* imports */
const globby = require('globby')
/* lib */
const checkErrors = require('./pkg/lib/checkErrors')
const posix = require('./pkg/lib/posix')
/* modules */
const loader = require('./pkg/loader')


function initialize (gloob, options = {}) {
  checkErrors(require('./pkg/schemas/gloob.schema').validate(gloob), 'gloob')
  checkErrors(require('./pkg/schemas/options.schema').validate(options), 'options')

  let files
  if (typeof gloob === 'string') files = globby.sync(posix(gloob))
  else files = globby.sync(gloob.map(g => posix(g)))
  if (!files.length) throw new Error('No files were matched')

  if (typeof options == 'string') options = { envvar: options }
  if (typeof options == 'boolean') options = { name: options }
  if (options.name === undefined) options.name = true


  return loader(files, options)
}


module.exports = initialize
