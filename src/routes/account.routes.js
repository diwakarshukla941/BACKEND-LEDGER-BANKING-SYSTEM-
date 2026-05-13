const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const { createAccountController, getUserAccountController, getAccountBalanceController } = require('../controllers/account.controller');


/**
 * @route POST /api/accounts
 * @desc Create a new account
 * @access Protected Route
  */

router.post('/', authMiddleware.authMiddleware, createAccountController);

/**
     * @route GET /api/accounts
     * @desc Get all accounts for the authenticated user
     * @access Protected Route
     */

router.get('/', authMiddleware.authMiddleware, getUserAccountController);


/**
 * @route GET /api/accounts/balance/:accountId
 * @desc Get the balance of a specific account
 * @access Protected Route
 */

router.get('/balance/:accountId', authMiddleware.authMiddleware, getAccountBalanceController);

module.exports = router;
