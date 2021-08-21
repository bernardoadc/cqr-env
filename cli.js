#! /usr/bin/env node
/* imports */
const globby = require('globby')
/* lib */
const checkErrors = require('./pkg/lib/checkErrors')
const posix = require('./pkg/lib/posix')
/* modules */
const cryptor = require('./pkg/cryptor')


function initialize (argv) {
  const [node, script, mode, gloob, envvar] = process.argv
  if (!mode || !gloob || !envvar) throw new Error('Invalid usage')


  checkErrors(require('./pkg/schemas/gloob.schema').validate(gloob), 'gloob')
  checkErrors(require('./pkg/schemas/envvar.schema').validate(envvar), 'envvar')

  let files
  if (typeof gloob === 'string') files = globby.sync(posix(gloob))
  else files = globby.sync(gloob.map(g => posix(g)))
  if (!files.length) throw new Error('No files were matched')

  if (mode == '-e') cryptor.encryptFiles(files, envvar)
  else if (mode == '-d') cryptor.decryptFiles(files, envvar)
  else throw new Error('Invalid mode')
}

initialize(process.argv)
