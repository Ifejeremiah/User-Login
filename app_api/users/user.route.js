const { Router } = require('express')
const router = Router()

const { Role } = require('../_config')
const { authorize } = require('../_middlewares')
const { getAll, getById } = require('./user.controller')

router.get('/', authorize(), getAll)

router.get('/:id', authorize(), getById)

module.exports = router