const express = require('express')
const router = express.Router()
// const { verifyToken } = require('../helpers')

// const userRoutes = require('./user')
const chatRoutes = require('./chat')

// router.use('/user', userRoutes)
router.use('/chat', chatRoutes)

module.exports = router