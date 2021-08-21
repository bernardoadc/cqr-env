const test = require('ava')
const pkg = require('../index')


test('glob sanitization', function (t) {
  t.notThrows(() => pkg('tests/A/*.env.json'))
  t.notThrows(() => pkg('tests\\A\\*.env.json'))
  t.notThrows(() => pkg('tests\\A/*.env.json'))
})
