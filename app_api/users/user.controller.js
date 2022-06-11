const userService = require('./user.service')
const { Response: { successResponse: success, errorResponse: error } } = require('../_middlewares')
const { Role } = require('../_config')

module.exports = { getAll, getById }

function getAll(req, res, next) {
  userService.getAll()
    .then(users => success(res, 'Users fetched successful', users))
    .catch(next);
}

function getById(req, res, next) {
  if (req.params.id !== req.user.id && req.user.role !== Role.Admin) {
    return error(res, 'Unauthorized', 401)
  }

  userService.getUserById(req.params.id)
    .then(user => success(res, 'Fetched user data successful', user))
    .catch(next);
}
