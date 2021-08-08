const test = require('ava')
const pkg = require('../index')

test('multiple', function (t) {
  const env = pkg(['tests/A/*.env.js', 'tests/A/*.env.json'])
  t.deepEqual(env, { x: { mode: 'on' }, y: [1, 2, 3] })
})

test('options.name = false', function (t) {
  process.env.NODE_ENV = 'development'
  const env = pkg(`tests/B/${process.env.NODE_ENV}.env.js`, { name: false })
  t.deepEqual(env, { host: 'localhost' })
})

test('options.name = "name"', function (t) {
  process.env.NODE_ENV = 'development'
  const env = pkg(`tests/B/${process.env.NODE_ENV}.env.js`, { name: 'node_env' })
  t.deepEqual(env, { node_env: { host: 'localhost' }})
})

test('defaults', function (t) {
  process.env.NODE_ENV = ''
  const env = pkg(`tests/B/${process.env.NODE_ENV || 'default'}.env.js`, { name: false })
  t.deepEqual(env, { host: 'localhost', port: 1234 })

  process.env.NODE_ENV = 'production'
  const Default = pkg('tests/B/default.env.js', { name: false })
  const env2 = { ...Default, ...pkg(`tests/B/${process.env.NODE_ENV}.env.js`, { name: false }) }
  t.deepEqual(env2, { host: 'example.com', port: 1234})
})
