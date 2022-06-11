module.exports = {
  validateBody,
  validateParams
};

const options = {
  abortEarly: false, // include all errors
  allowUnknown: true, // ignore unknown props
  stripUnknown: true // remove unknown props
};

function validateBody(req, next, schema) {
  const { error, value } = schema.validate(req.body, options);
  if (error) {
    next(`Validation error: ${error.details.map(x => x.message).join(', ')}`);
  } else {
    req.body = value;
    next();
  }
}

function validateParams(req, next, schema) {
  const { error, value } = schema.validate(req.params, options);
  if (error) {
    next(`Validation error: ${error.details.map(x => x.message).join(', ')}`);
  } else {
    req.params = value;
    next();
  }
}