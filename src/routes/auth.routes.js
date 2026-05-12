const express = require('express');
const router = express.Router();
const { userRegisterController,userLoginController } = require('../controllers/auth.controller.js')

/* /POST /api/auth/register */
router.post('/register', userRegisterController)

/* /POST /api/auth/login */
router.post('/login', userLoginController)


module.exports = router;