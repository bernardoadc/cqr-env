const joi = require('joi')

module.exports = joi.alternatives().try(
  joi.string().required(),
  joi.object().min(1)
)
