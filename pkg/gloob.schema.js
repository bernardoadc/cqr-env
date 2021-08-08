const joi = require('joi')

module.exports = joi.alternatives().try(
  joi.array().items(joi.string().required()),
  joi.string().required()
)
