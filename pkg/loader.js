const path = require('path')


function loader (gloob) {
  const env = {}

  for (let f of gloob) {
    let name = path.basename(f).split('.')[0]
    delete require.cache[path.resolve(f)] // require cache files
    env[name] = require(path.resolve(f))
  }

  return env
}


module.exports = loader
