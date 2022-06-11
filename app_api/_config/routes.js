const { Router } = require('express')
const router = Router()

const routes = [
  {
    route: '/auth',
    path: require('../auth/auth.route')
  }, {
    route: '/users',
    path: require('../users/user.route')
  }
]

routes.forEach(x => router.use(x.route, x.path))

module.exports = router
