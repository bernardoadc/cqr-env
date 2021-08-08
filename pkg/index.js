const globby = require("globby")
const joi = require("joi")
/* modules */
const loader = require('./loader')


function notValid (validationResult, name) {
  if (validationResult.error) {
    const plural = (xx.details.length > 1) ? 's' : ''
    namify = (m) => name ? m.replace(/"value"/g, name) : m
    console.log(`Error${plural}: ${validationResult.error.details.map(e => namify(e.message)).join('; ')}`);
    return true
  } else return false
}

function initialize (gloob, options) {
  const schema = joi.alternatives().try(
    joi.array().items(joi.string().required()),
    joi.string().required()
  )
  if (notValid(schema.validate(gloob), 'gloob')) return false
  if (notValid(joi.object().optional().validate(options), 'options')) return false // .min(1).allow(null)

  return loader(globby.sync(gloob), options)
}


module.exports = initialize
