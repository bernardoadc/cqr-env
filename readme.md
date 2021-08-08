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

<style>
/*
.example {
  column-count: 2;
  column-rule: 1px dotted #e0e0e0
}
*/

.folders {
  float: left;
  width: 40%;
  margin-right: 10px;
}

.usage {
  float: left;
  width: 50%;
}

.example:after {
  content: "";
  display: table;
  clear: both;
}
</style>

### Loading multiple env files (js/json)

<div class="example">
  <div class="folders">

  ```js
  📂 Project
  ├ 📂 modules
  │ ├ 📂 x
  │ │ └ 📄 x.env.js  // { mode: 'on' }
  │ └ 📂 y
  │   └ 📄 y.env.json  // [1, 2, 3]
  └ 📄 index.js
  ```

  </div>
  <div class="usage">

  ```js
  /* index.js */
  const env = require('cqr-me')(['**/*.env.js', 'tests/A/*.env.json'])
  // { x: { mode: 'on' }, y: [1, 2, 3] }
  ```

  </div>
</div>

### Don't use filename as key

<div class="example">
  <div class="folders">

  ```js
  📂 Project
  ├ 📄 development.env.js  // { host: 'localhost' }
  ├ 📄 production.env.js   // { host: 'example.com' }
  └ 📄 index.js
  ```

  </div>
  <div class="usage">

  ```js
  /* index.js */
  console.log(process.env.NODE_ENV)
  // 'production'
  const env = require('cqr-me')(`${process.env.NODE_ENV}.js`, { name: false )
  // { host: 'example.com' }, not { production: { host: 'example.com' }}

  const env = require('cqr-me')(`${process.env.NODE_ENV}.js`, { name: 'node_env' })
  // { node_env: { host: 'example.com' }}
  ```

  </div>
</div>

## Options

**name** _(bool/string)_: don't use filename as root. Instead, destruct keys into parent (`false`) or give it a name (`string`).
