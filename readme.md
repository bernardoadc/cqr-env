# CQr-env

> Secured Multiple Env Files

Have multiple env files that can be encrypted and included in version control (_e.g._ git)

## Motivation

This is yet another package for loading env files. After researching for npm packages, I've found several solutions but none to my avail. They all lack some handy features (at the same time or altogether):

* have multiple env files
  * for staging purposes (production, development, testing, local, etc)
  * for modularization - a root env, a component env, some common env (motif), "external" env (for database A, for service B, for API C)
  * to segregate sensible information from non-sensible information (like credentials)
* multiple formats (raw/shell-like, json, js), including javascript (dynamic, interpreted at runtime). JSON supported by [JSON5](https://json5.org) (comments, single-quotes, line breaks, trailing commas and more)
* special cases for raw files: multiline strings, ignore blank lines, parse as js types (numbers as numbers, objects, etc.), don't parse comments (`//`, `#`, `<!-- -->`, `/**/`) - either `//x=1` or `x=1 //2`
* encrypt sensible information
  * allowing to include in version control (otherwise when sharing projects, one should send private env files separately)
  * possibility to use encrypted env file without decrypting it (decrypt on the fly)
  * if decrypted, change extension so to not commit it by mistake

> Some packages researched: [dotenv](https://www.npmjs.com/package/dotenv), [dotenvjs](https://www.npmjs.com/package/dotenvjs), [@alucarpd86/dotenv-json](https://www.npmjs.com/package/@alucarpd86/dotenv-json), [@eddiewen/dotenvjson](https://www.npmjs.com/package/@eddiewen/dotenvjson), [envdot](https://www.npmjs.com/package/envdot), [envdotjs](https://www.npmjs.com/package/envdotjs), [envdotjson](https://www.npmjs.com/package/envdotjson), [envdotenv](https://www.npmjs.com/package/envdotenv), [dotenv-expand](https://www.npmjs.com/package/dotenv-expand), [dotenv-packed](https://www.npmjs.com/package/dotenv-packed), [dotenv-extended](https://www.npmjs.com/package/dotenv-extended), [expand-dotenv](https://www.npmjs.com/package/expand-dotenv), [dotenv-defaults](https://www.npmjs.com/package/dotenv-defaults), [dotenv-flow](https://www.npmjs.com/package/dotenv-flow), [encrypt-env](https://www.npmjs.com/package/encrypt-env), [environment-crypt](https://www.npmjs.com/package/environment-crypt), [secure-env](https://www.npmjs.com/package/secure-env), [encrypted-env](https://www.npmjs.com/package/encrypted-env)

## Usage

### Loading multiple env files (.js, .json, raw)

```js
📂 Project
├ 📂 modules
│ ├ 📂 x
│ │ └ 📄 x.env.js  // { mode: 'on' }
│ ├ 📂 y
│ │ └ 📄 y.env.json  // [1, 2, 3]
│ └ 📂 z
│   └ 📄 z.env  // url=example.com
└ 📄 index.js
```

```js
/* index.js */
const env = require('cqr-env')(['**/*.env.js', '**/*.env.json', '**/*.env'])
// { x: { mode: 'on' }, y: [1, 2, 3], url: 'example.com' }
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

const env = require('cqr-env')(`${process.env.NODE_ENV}.js`, { name: false })
// { host: 'example.com' }, not { production: { host: 'example.com' }}

const env = require('cqr-env')(`${process.env.NODE_ENV}.js`, { name: 'node_env' })
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
const env = require('cqr-env')(`${process.env.NODE_ENV || 'default'}.env.js`, { name: false })
// { host: 'localhost', port: 1234 })

// using destructuring
process.env.NODE_ENV = 'production'
const secureEnv = require('cqr-env')
const Default = secureEnv('default.env.js', { name: false })
const env2 = { ...Default, ...secureEnv(`${process.env.NODE_ENV}.env.js`, { name: false }) }
// { host: 'example.com', port: 1234})
```

### Encrypt env files

1. Add `*.exposed` to .gitignore to prevent any decrypted/unsafe files to be committed.
2. Create a file with desired name and extension + `.exposed`. Fill sensible information.
3. Set password key in environment variable. _E.g._: `setx proj_key 1234` or `export proj_key=1234`. You can use multiple password keys as you like - just create one env var for each.
4. Encrypt file(s) using `cqr-env -e "gloob" -v "key_name"`

> Execute cqr-env via npx, [npm exec or npm x](https://docs.npmjs.com/cli/v7/commands/npm-exec), or simply via npm scripts (_e.g._ `npm run command` with command in `package.json` scripts)

### Decrypt env files (for editing)

1. Decrypt file(s) using `cqr-env -d "gloob" -v "key_name"` (files must end with .encrypted)

### Decrypt and load env files on-the-fly

```js
📂 Project
├ 📄 production.env.js.encrypted   // 790ffd1b2e51f77aa5621331dfd4dbec586d4276076c2129562cd2baef4fbb937574ab2b9416b9e06b5bf9d273f7a5f8P7PhoZco+zGRQJnddS7VwmTxZr6gd+4jwCsp1yLG0ck+RzoRXgExT/3tvMgwGp0AVJ8MFtcsybRNbuv6dq0RM4HmAIwQCDi5con96O8YjyAmKlsBj2G1nDb1GZ7iBD2EWX8w9GlRop6b12H5FyxxLB9BUGYcdg83vTW5s3+PgNZ9Mlx2LFLZiApn4DR91GOsB13wgCoy/7CZa+6wOiguIOtw+H1pGWunmJmi8NR3HGhbJp7Gmj4b6URAFuUgg0FGKUY2JCLQfLM4ogSE3QbSZwlzQZ5mawRrNm8PhPrG0+RXozyClYo3e0SsZeqdVimL
└ 📄 index.js
```

```js
/* index.js */
console.log(process.env.NODE_ENV) // 'production'

const env = require('cqr-env')(`${process.env.NODE_ENV}.env.js.encrypted`, { name: false, envvar: 'key_name' })
// { host: 'example.com', pw: 'abcde' }
```

### Storing keys in files instead of environment variables

While this is discouraged, sometimes the environment variables aren't acessible and thus this provides an alternative method.

1. Create a file with password key inside
2. Add to .gitignore to prevent to be committed.
3. Encrypt file(s) using `cqr-env -e "gloob" -f path/to/file`
4. Decrypt file(s) using `cqr-env -d "gloob" -f path/to/file` (for editing)
5. To decrypt and load env files on-the-fly, do:

```js
/* index.js */
console.log(process.env.NODE_ENV) // 'production'

const env = require('cqr-env')(`${process.env.NODE_ENV}.env.js.encrypted`, { name: false, pwfile: 'path/to/file' })
// { host: 'example.com', pw: 'abcde' }
```


## Options

**envvar** _(string)_: name of the environment variable that contains the password/key to decrypt a protected file. If options is a string, it will be considered to be the envvar.

**name** _(bool/string)_: don't use filename as key. Instead, destruct keys into parent (`false`) or give it a name (`string`). If options is boolean (`false`), it will be considered to be `name: false`.

**pwfile** _(string)_: path of the file that contains the password/key to decrypt a protected file.
