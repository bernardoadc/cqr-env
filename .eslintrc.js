module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true
  },
  extends: [
    'standard'
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parserOptions: {
    ecmaVersion: next,
    sourceType: 'module'
  },
  rules: {
    curly: ['off'],
    'dot-notation': ['off'],
    eqeqeq: ['off'],
    'no-debugger': ['off'],
    'no-extra-boolean-cast': ['off'],
    'no-mixed-operators': ['off'],
    'no-multiple-empty-lines': ['off'],
    'no-throw-literal': ['off'],
    'no-unused-vars': ['off'],
    'object-curly-spacing': ['off'],
    'one-var': ['off'],
    'spaced-comment': ['off']
  }
}

