const test = require('ava')
const fs = require('fs')
const { spawn } = require('child_process')


test.before(function (t) {
  // set key in environment variable
  process.env.cqr_key = '1234'
})

test.serial.cb('encrypt new sensible env file', function (t) {
  // create new file
  fs.writeFileSync('tests/C/password.env.js.exposed', 'module.exports = "secret password!"')
  // encrypt file via CLI
  const s = spawn('node', ['./cli.js', '-e', 'tests/C/password.env.js.exposed', '-v', 'cqr_key'])

  s.on('close', function (code) {
    t.false(fs.existsSync('tests/C/password.env.js.exposed'))
    t.true(fs.existsSync('tests/C/password.env.js.encrypted'))
    // t.is(Buffer.from(fs.readFileSync('tests/C/password.env.js.encrypted')).toString(), '3d831f9789c7741974f54cc4e73cea2aaa7ab7cd98ce8f708d3f6dbaca4d9358d025be6542f0602c771b59e9e41685d9MrK9z4b9MxZ1ubgtJRLN5JJzQowl5rvYKoeOTtG3UowcR2jjAHxFG4hzbWXBdrOKf2Mn9CemZ4KxU6QPwzDIYBRXtkKT7+b2stPDnh0daDHXVB93AR4BPxIfdELODrCPeau6/CT74GpvyWmJjjZlN2HHoLYg8y6o9A2UkgVc984sJ8zCTouSOLakpGzGuol97Nhq3BIXc6tJazOZFgarpw==')
    t.end()
  })
})

test.serial.cb('decrypt env file', function (t) {
  // decrypt file via CLI
  const s = spawn('node', ['./cli.js', '-d', 'tests/C/password.env.js.encrypted', '-v', 'cqr_key'])

  s.on('close', function (code) {
    t.false(fs.existsSync('tests/C/password.env.js.encrypted'))
    t.true(fs.existsSync('tests/C/password.env.js.exposed'))
    t.is(Buffer.from(fs.readFileSync('tests/C/password.env.js.exposed')).toString(), 'module.exports = "secret password!"')
    fs.unlinkSync('tests/C/password.env.js.exposed')
    t.end()
  })
})

test('use secret env file', function (t) {
  const pkg = require('../index')
  const env = pkg('tests/D/production.env.js.encrypted', { envvar: 'cqr_key' })
  t.deepEqual(env, { production: { host: 'example.com', pw: 'abcde' }})
})

test('use secret env file, options as string', function (t) {
  const pkg = require('../index')
  const env = pkg('tests/D/production.env.js.encrypted', 'cqr_key')
  t.deepEqual(env, { production: { host: 'example.com', pw: 'abcde' }})
})

test.serial.cb('encrypt new sensible env file with pwfile', function (t) {
  // create new file
  fs.writeFileSync('tests/C/password.env.js.exposed', 'module.exports = "secret password!"')
  // encrypt file via CLI
  const s = spawn('node', ['./cli.js', '-e', 'tests/C/password.env.js.exposed', '-f', 'tests/F/pw'])

  s.on('close', function (code) {
    t.false(fs.existsSync('tests/C/password.env.js.exposed'))
    t.true(fs.existsSync('tests/C/password.env.js.encrypted'))
    // t.is(Buffer.from(fs.readFileSync('tests/C/password.env.js.encrypted')).toString(), '3d831f9789c7741974f54cc4e73cea2aaa7ab7cd98ce8f708d3f6dbaca4d9358d025be6542f0602c771b59e9e41685d9MrK9z4b9MxZ1ubgtJRLN5JJzQowl5rvYKoeOTtG3UowcR2jjAHxFG4hzbWXBdrOKf2Mn9CemZ4KxU6QPwzDIYBRXtkKT7+b2stPDnh0daDHXVB93AR4BPxIfdELODrCPeau6/CT74GpvyWmJjjZlN2HHoLYg8y6o9A2UkgVc984sJ8zCTouSOLakpGzGuol97Nhq3BIXc6tJazOZFgarpw==')
    t.end()
  })
})

test.serial.cb('decrypt env file with pwfile', function (t) {
  // decrypt file via CLI
  const s = spawn('node', ['./cli.js', '-d', 'tests/C/password.env.js.encrypted', '-f', 'tests/F/pw'])

  s.on('close', function (code) {
    t.false(fs.existsSync('tests/C/password.env.js.encrypted'))
    t.true(fs.existsSync('tests/C/password.env.js.exposed'))
    t.is(Buffer.from(fs.readFileSync('tests/C/password.env.js.exposed')).toString(), 'module.exports = "secret password!"')
    fs.unlinkSync('tests/C/password.env.js.exposed')
    t.end()
  })
})

test('use secret env file with pwfile', function (t) {
  const pkg = require('../index')
  const env = pkg('tests/D/development.env.js.encrypted', { pwfile: 'tests/F/pw' })
  t.deepEqual(env, { development: { host: 'localhost' }})
})
