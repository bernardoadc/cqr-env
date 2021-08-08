# CQr-ME

> Secured Multiple Env Files

Have multiple env files in json/js that can be encrypted and included in version control (_e.g._ git)

## Motivation

This is yet another package for loading env files. After researching for npm packages, I've found several solutions but none to my avail. They all lack some handy features (at the same time or altogether):

* have multiple env files
  * for staging purposes (production, development, testing, local, etc)
  * for modularization - a root env, a component env, some common env (motif), "external" env (for database A, for service B, for API C)
  * to segregate sensible information from non-sensible information (like credentials)
* multiple formats (raw/shell-like, json, js), preferably javascript (dynamic, interpreted at runtime)
* encrypt sensible information
  * allowing to include in version control (otherwise when sharing projects, one should send private env files separately)
  * possibility to use encrypted env file without decrypting it (decrypt on the fly)
  * if decrypted, change extension so to not commit it by mistake

> Some packages researched: [dotenv](https://www.npmjs.com/package/dotenv), [dotenvjs](https://www.npmjs.com/package/dotenvjs), [@alucarpd86/dotenv-json](https://www.npmjs.com/package/@alucarpd86/dotenv-json), [@eddiewen/dotenvjson](https://www.npmjs.com/package/@eddiewen/dotenvjson), [envdot](https://www.npmjs.com/package/envdot), [envdotjs](https://www.npmjs.com/package/envdotjs), [envdotjson](https://www.npmjs.com/package/envdotjson), [envdotenv](https://www.npmjs.com/package/envdotenv), [dotenv-expand](https://www.npmjs.com/package/dotenv-expand), [dotenv-packed](https://www.npmjs.com/package/dotenv-packed), [dotenv-extended](https://www.npmjs.com/package/dotenv-extended), [expand-dotenv](https://www.npmjs.com/package/expand-dotenv), [dotenv-defaults](https://www.npmjs.com/package/dotenv-defaults), [dotenv-flow](https://www.npmjs.com/package/dotenv-flow), [encrypt-env](https://www.npmjs.com/package/encrypt-env), [environment-crypt](https://www.npmjs.com/package/environment-crypt), [secure-env](https://www.npmjs.com/package/secure-env), [encrypted-env](https://www.npmjs.com/package/encrypted-env)

## Usage

### Loading multiple env files (js/json)

```js
📂 Project
├ 📂 modules
│ ├ 📂 x
│ │ └ 📄 x.env.js  // { mode: 'on' }
│ └ 📂 y
│   └ 📄 y.env.json  // [1, 2, 3]
└ 📄 index.js
```

```js
/* index.js */
const env = require('cqr-me')(['**/*.env.js', 'tests/A/*.env.json'])
// { x: { mode: 'on' }, y: [1, 2, 3] }
```

### Don't use filename as key / specify key name

```js
📂 Project
├ 📄 development.env.js  // { host: 'localhost' }
├ 📄 production.env.js   // { host: 'example.com' }
└ 📄 index.js
```

```js
/* index.js */
console.log(process.env.NODE_ENV) // 'production'

const env = require('cqr-me')(`${process.env.NODE_ENV}.js`, { name: false )
// { host: 'example.com' }, not { production: { host: 'example.com' }}

const env = require('cqr-me')(`${process.env.NODE_ENV}.js`, { name: 'node_env' })
// { node_env: { host: 'example.com' }}
```

### Set defaults

```js
📂 Project
├ 📄 default.env.js      // { host: 'localhost', port: 1234 }
├ 📄 development.env.js  // { host: 'localhost' }
├ 📄 production.env.js   // { host: 'example.com' }
└ 📄 index.js
```

```js
/* index.js */

// default file
process.env.NODE_ENV = ''
const env = require('cqr-me')(`tests/B/${process.env.NODE_ENV || 'default'}.env.js`, { name: false })
// { host: 'localhost', port: 1234 })

// using destructuring
process.env.NODE_ENV = 'production'
const Default = require('cqr-me')('tests/B/default.env.js', { name: false })
const env2 = { ...Default, ...pkg(`tests/B/${process.env.NODE_ENV}.env.js`, { name: false }) }
// { host: 'example.com', port: 1234})
```

### Encrypt env files

1. Add `*.exposed` to .gitignore to prevent any decrypted/unsafe files to be committed.
2. Create a file with desired name and extension + `.exposed`. Fill sensible information.
3. Set password key in environment variable. E.g.: `setx proj_key 1234` or `export proj_key=1234`
4. Encrypt file(s) using `cqr-me e "gloob" "key_name"`

## Options

**name** _(bool/string)_: don't use filename as root. Instead, destruct keys into parent (`false`) or give it a name (`string`).
