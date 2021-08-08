const globby = require('globby')
const joi = require('joi')
/* modules */
const loader = require('./loader')


function checkErrors (validationResult, name) {
  if (validationResult.error) {
    const namify = (m) => name ? m.replace(/"value"/g, name) : m
    throw new Error(validationResult.error.details.map(e => namify(e.message)).join('; '))
  }
}

function initialize (gloob, options = {}) {
  const gloobSchema = joi.alternatives().try(
    joi.array().items(joi.string().required()),
    joi.string().required()
  )
  checkErrors(gloobSchema.validate(gloob), 'gloob')

  const optionsSchema = require('./options.schema')
  checkErrors(optionsSchema.validate(options), 'options') // .min(1).allow(null)

  return loader(globby.sync(gloob), options)
}


module.exports = initialize
