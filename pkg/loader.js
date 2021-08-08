const joi = require('joi')
const path = require('path')


function loader (gloob, options) {
  const env = {}

  for (const f of gloob) {
    delete require.cache[path.resolve(f)] // require cache files

    if (options.name === undefined) options.name = true
    if (options.name === false) {
      const newEnv = require(path.resolve(f))
      if (joi.object().validate(newEnv).error) throw Error('When "name" option is false, content must be an object')
      for (const k in newEnv) {
        env[k] = newEnv[k]
      }
    } else {
      const name = (typeof options.name == 'string') ? options.name : path.basename(f).split('.')[0]
      env[name] = require(path.resolve(f))
    }
  }

  return env
}


module.exports = loader
