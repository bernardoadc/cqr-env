const fs = require('fs')
const joi = require('joi')
const JSON5 = require('json5')
const path = require('path')
/* modules */
const cryptor = require('./cryptor')


function loadJs (data) {
  return eval(data) // eslint-disable-line no-eval
}

function loadJSON (data) {
  return JSON5.parse(data)
}

function loadRaw (data) {
  let lastKey

  /* skip multiline comments */
  data = data.replace(/<!-- (.+?\r*\n*)+ -->/gm, '')
  data = data.replace(/\/\*(.+?\r*\n*)+\*\//gm, '')

  return data.split(/(?:\r?\n)+/).reduce(function (r, line) {
    /* skip singleline comments */
    line = line.replace(/[ \t]*\/\/.*$/g, '') // this allows "x=1 // 2"
    line = line.replace(/[ \t]*#.*$/g, '')
    if (!line.length) return r // skip blank

    const match = line.match(/[ \t]*(.+?)[ \t]*=[ \t]*(.+?)$/)
    if (match) {
      const [m, key, value] = match
      try {
        r[key] = JSON.parse(value)
      } catch (e) {
        r[key] = value
      }
      lastKey = key
    } else {
      r[lastKey] += '\n' + line
    }

    return r
  }, {})
}

function load (file, ext, encrypted, key) {
  let data

  if (encrypted) {
    if (!key.value) throw new Error('Envvar not informed for encrypted env file')
    data = cryptor.decrypt(file, key.medium, key.value)
  } else {
    data = Buffer.from(fs.readFileSync(file)).toString()
  }

  switch (ext) {
    case '.js': return loadJs(data)
    case '.json': return loadJSON(data)
    default: return { ...loadRaw(data) }
  }
}

function getKey (options) {
  if (options.envvar) {
    return {
      medium: 'var',
      value: options.envvar
    }
  } else if (options.pwfile) {
    return {
      medium: 'file',
      value: options.pwfile
    }
  }
}

function loader (gloob, options) {
  const env = {}

  for (const f of gloob) {
    const encrypted = (f.slice(-10) == '.encrypted')
    const ext = encrypted ? path.parse(f.replace('.env', '').replace('.encrypted', '')).ext : path.parse(f.replace('.env', '')).ext
    const key = getKey(options)

    if (options.name === false || ext == '') {
      const newEnv = load(f, ext, encrypted, key)
      if (joi.object().validate(newEnv).error) throw new Error('When "name" option is false, content must be an object')
      for (const k in newEnv) {
        env[k] = newEnv[k]
      }
    } else {
      const name = (typeof options.name == 'string') ? options.name : path.basename(f).split('.')[0]
      env[name] = load(f, ext, encrypted, key)
    }
  }

  return env
}


module.exports = loader
