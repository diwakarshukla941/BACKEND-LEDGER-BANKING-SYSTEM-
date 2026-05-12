const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const { createAccountController } = require('../controllers/account.controller');


/**
 * @route POST /api/accounts
 * @desc Create a new account
 * @access Protected Route
  */

    router.post('/', authMiddleware,createAccountController);



module.exports = router;
