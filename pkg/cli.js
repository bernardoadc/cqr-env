#! /usr/bin/env node
const cryptor = require('./cryptor')
const globby = require('globby')


function checkErrors (validationResult, name) {
  if (validationResult.error) {
    const namify = (m) => name ? m.replace(/"value"/g, name) : m
    throw new Error(validationResult.error.details.map(e => namify(e.message)).join('; '))
  }
}

function initialize (argv) {
  const [node, script, mode, gloob, envvar] = process.argv

  checkErrors(require('./gloob.schema').validate(gloob), 'gloob')
  checkErrors(require('./envvar.schema').validate(envvar), 'envvar')

  const files = globby.sync(gloob)
  if (!files.length) throw new Error('No files were matched')

  if (mode == 'e') cryptor.encryptFiles(files, envvar)
  else if (mode == 'd') cryptor.decryptFiles(files, envvar)
  else throw new Error('Invalid mode')
}

initialize(process.argv)
