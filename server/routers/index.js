const express = require('express')
const router = express.Router()
const UserController = require('../controllers/userController')


router.post('/enter', UserController.enter)

module.exports = router