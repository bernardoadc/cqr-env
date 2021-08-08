const joi = require('joi')

module.exports = joi.object({
  name: joi.alternatives().try(
    joi.boolean(),
    joi.string().required()
  ).optional()
}).optional()
