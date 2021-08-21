#! /usr/bin/env node
/* imports */
const globby = require('globby')
/* lib */
const checkErrors = require('./pkg/lib/checkErrors')
const posix = require('./pkg/lib/posix')
/* modules */
const cryptor = require('./pkg/cryptor')


function initialize (argv) {
  const [node, script, mode, gloob, medium, envvarOrPwfile] = process.argv
  if (!mode || !gloob || !envvarOrPwfile) throw new Error('Invalid usage')


  checkErrors(require('./pkg/schemas/gloob.schema').validate(gloob), 'gloob')
  checkErrors(require('./pkg/schemas/envvar.schema').validate(envvarOrPwfile), 'envvar') // same schema

  let files
  if (typeof gloob === 'string') files = globby.sync(posix(gloob))
  else files = globby.sync(gloob.map(g => posix(g)))
  if (!files.length) throw new Error('No files were matched')

  let m
  switch (medium) {
    case '-v': m = 'var'; break
    case '-f': m = 'file'
  }

  if (mode == '-e') cryptor.encryptFiles(files, m, envvarOrPwfile)
  else if (mode == '-d') cryptor.decryptFiles(files, m, envvarOrPwfile)
  else throw new Error('Invalid mode')
}

initialize(process.argv)
