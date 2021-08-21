const path = require('path')

// Globby only works with posix style; path.posix.normalize doesn't convert from win32 separators
module.exports = p => path.posix.normalize(p.replace(/\\/g, path.posix.sep))
