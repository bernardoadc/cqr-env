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

Consider the following project structure:

```js
📂 Project
├ 📂 modules
│ ├ 📂 x
│ │ └ 📄 x.env.js  // { mode: 'on' }
│ └ 📂 y
│   └ 📄 y.env.js  // [1, 2, 3]
└ 📄 index.js
```

Then,

```js
/* index.js */
const env = require('cqr-me')('**/*.env.js')
// { x: { mode: 'on' }, y: [1, 2, 3] }
```
