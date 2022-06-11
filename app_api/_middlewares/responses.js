module.exports = {
  successResponse,
  errorResponse
}


function successResponse(res, message = 'Done successfully', data = null, statusCode = null) {
  const body = {
    success: true,
    message,
    data,
  }

  return res.status(statusCode | 200).json(body);
}


function errorResponse(res, message = 'Sorry, there is an error', statusCode, data = null) {
  const body = {
    success: false,
    message,
    data,
  }

  return res.status(statusCode | 400).json(body);
}