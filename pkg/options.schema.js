const joi = require('joi')

module.exports = joi.object({ // .min(1).allow(null)
  name: joi.alternatives().try(
    joi.boolean(),
    joi.string().required()
  ).optional(),
  envvar: require('./envvar.schema').optional()
}).optional()
