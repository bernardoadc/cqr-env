const joi = require('joi')

module.exports = joi.alternatives().try(
  joi.object({
    name: joi.alternatives().try(
      joi.boolean(),
      joi.string().required()
    ).optional(),
    envvar: require('./envvar.schema').optional()
  }), // .optional().min(1)
  joi.string().required(), // envvar
  joi.boolean() // name
).optional()
