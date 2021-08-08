const joi = require('joi')
const path = require('path')
/* modules */
const cryptor = require('./cryptor')

function load (file, encrypted, envvar) {
  let data
  if (encrypted) {
    if (!envvar) throw new Error('Envvar not informed for encrypted env file')
    data = eval(cryptor.decrypt(file, envvar)) // eslint-disable-line no-eval
  } else {
    delete require.cache[path.resolve(file)] // require cache files
    data = require(path.resolve(file))
  }

  return data
}

function loader (gloob, options) {
  const env = {}

  for (const f of gloob) {
    const encrypted = (f.slice(-10) == '.encrypted')

    if (options.name === undefined) options.name = true
    if (options.name === false) {
      const newEnv = load(f, encrypted, options.envvar)
      if (joi.object().validate(newEnv).error) throw new Error('When "name" option is false, content must be an object')
      for (const k in newEnv) {
        env[k] = newEnv[k]
      }
    } else {
      const name = (typeof options.name == 'string') ? options.name : path.basename(f).split('.')[0]
      env[name] = load(f, encrypted, options.envvar)
    }
  }

  return env
}


module.exports = loader
