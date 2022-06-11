const { Router } = require('express')
const router = Router()

const { authorize } = require('../_middlewares')

const {
  authenticate, register,
  refreshToken, revokeToken, logout
} = require('./auth.controller')
const {
  authenticateSchema, registerSchema
} = require('./auth.schema')

router.post('/authenticate', authenticateSchema, authenticate)

router.post('/register', registerSchema, register)

router.post('/refresh-token', refreshToken)

router.post('/revoke-token', authorize(), revokeToken)

router.post('/logout', authorize(), logout)

module.exports = router