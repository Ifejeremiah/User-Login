module.exports = errorHandler;

const { errorResponse } = require('./responses')

function errorHandler(err, req, res, next) {
  switch (true) {
    case typeof err === 'string':
      // custom application error
      const is404 = err.toLowerCase().endsWith('not found');
      const statusCode = is404 ? 404 : 400;
      console.log(err)
      return errorResponse(res, err, statusCode)
    case err.name === 'ValidationError':
      // mongoose validation error
      console.log(err)
      return errorResponse(res, err.message, 400)
    case err.name === 'UnauthorizedError':
      // jwt authentication error
      console.log(err)
      return errorResponse(res, err.message, 401)
    default:
      console.log(err)
      return errorResponse(res, err.message, 500)
  }
}