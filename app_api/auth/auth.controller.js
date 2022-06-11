const userService = require('./auth.service')
const Role = require('../_config/roles')
const { Response: { successResponse, errorResponse } } = require('../_middlewares')

module.exports = {
  authenticate,
  register,
  refreshToken,
  revokeToken,
  getRefreshTokens,
  logout
}

function authenticate(req, res, next) {
  const { email, password } = req.body;
  const ipAddress = req.ip;
  userService.authenticate({ email, password, ipAddress })
    .then(({ refreshToken, ...user }) => {
      setTokenCookie(res, refreshToken);
      successResponse(res, 'Login successful', user)
    })
    .catch(next);
}

function register(req, res, next) {
  req.body.ipAddress = req.id
  userService.register(req.body)
    .then(({ refreshToken, ...user }) => {
      setTokenCookie(res, refreshToken);
      successResponse(res, 'Registered successful', user)
    })
    .catch(next)
}

function refreshToken(req, res, next) {
  const token = req.cookies.refreshToken;
  const ipAddress = req.ip;
  userService.refreshToken({ token, ipAddress })
    .then(({ refreshToken, ...user }) => {
      setTokenCookie(res, refreshToken);
      successResponse(res, 'Refresh token successful', user)
    })
    .catch(next);
}

function revokeToken(req, res, next) {
  // accept token from request body or cookie
  const token = req.body.token || req.cookies.refreshToken;
  const ipAddress = req.ip;

  if (!token) return errorResponse(res, 'Token is required', 400)

  // users can revoke their own tokens and admins can revoke any tokens
  if (!req.user.ownsToken(token) && req.user.role !== Role.Admin) {
    return errorResponse(res, 'Unauthorized', 401)
  }

  userService.revokeToken({ token, ipAddress })
    .then(() => successResponse(res, 'Token revoked'))
    .catch(next);
}

function getRefreshTokens(req, res, next) {
  // users can get their own refresh tokens and admins can get any user's refresh tokens
  if (req.params.id !== req.user.id && req.user.role !== Role.Admin) {
    return errorResponse(res, 'Unauthorized', 401)
  }

  userService.getRefreshTokens(req.params.id)
    .then(tokens => successResponse(res, 'Fetched refresh tokens', tokens))
    .catch(next);
}

function logout(req, res, next) {
  // accept token from request body or cookie
  const token = req.body.token || req.cookies.refreshToken;

  if (!token) return errorResponse(res, 'Token is required', 400)

  // users can logout with their own tokens and admins can logout with any tokens
  if (!req.user.ownsToken(token) && req.user.role !== Role.Admin) {
    return errorResponse(res, 'Unauthorized', 401)
  }

  userService.logout({ token })
    .then(() => successResponse(res, 'Logout successful'))
    .catch(next);
}

function setTokenCookie(res, token) {
  // create http only cookie with refresh token that expires in 7 days
  const cookieOptions = {
    httpOnly: true,
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  };
  res.cookie('refreshToken', token, cookieOptions);
}
