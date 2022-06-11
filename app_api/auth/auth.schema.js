const Joi = require('@hapi/joi')
const { validateRequest: { validateBody } } = require('../_middlewares')

module.exports = {
  authenticateSchema,
  registerSchema,
  revokeTokenSchema
}

function authenticateSchema(req, res, next) {
  const schema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required()
  });
  validateBody(req, next, schema);
}

function registerSchema(req, res, next) {
  const schema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().required().custom(password),
    password2: Joi.string().valid(Joi.ref('password')).required()
  });
  validateBody(req, next, schema);
}

function revokeTokenSchema(req, res, next) {
  const schema = Joi.object({
    token: Joi.string().empty('')
  });
  validateBody(req, next, schema);
}

function password(value, helpers) {
  if (value.length < 8) {
    return helpers.message('Password must be at least 8 characters');
  }

  return value;
};