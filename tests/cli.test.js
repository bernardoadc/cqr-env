const test = require('ava')
const { spawnSync } = require('child_process')
const fs = require('fs')


test.before(function (t) {
  // set key in environment variable
  process.env.cqr_key = '1234'
})

test.serial('glob sanitization', function (t) {
  const file = 'tests/C/password.env.js.exposed'

  fs.writeFileSync(file, 'a=b')
  t.notThrows(() => spawnSync('node', ['./cli.js', '-e', 'tests/C/password.env.js.exposed', 'cqr_key']))
  fs.unlinkSync(file.replace('.exposed', '.encrypted'))

  fs.writeFileSync(file, 'a=b')
  t.notThrows(() => spawnSync('node', ['./cli.js', '-e', 'tests\\C\\password.env.js.exposed', 'cqr_key']))
  fs.unlinkSync(file.replace('.exposed', '.encrypted'))

  fs.writeFileSync(file, 'a=b')
  t.notThrows(() => spawnSync('node', ['./cli.js', '-e', 'tests\\C/password.env.js.exposed', 'cqr_key']))
  fs.unlinkSync(file.replace('.exposed', '.encrypted'))
})
