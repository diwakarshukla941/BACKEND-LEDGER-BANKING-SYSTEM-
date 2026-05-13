const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const { createTransaction, createInitialFundsTransaction } = require('../controllers/transaction.controller');

/**
 * @route POST /api/transactions
 * @desc Create a new transaction
 * @access Protected Route
 */
router.post('/', authMiddleware.authMiddleware, createTransaction);


/**
 * @route POST /api/transactions/system/initial-funds
 * @desc Initialize system funds for testing
 * @access Private (System User Only)
 */
router.post('/system/initial-funds', authMiddleware.systemAuthMiddleware, createInitialFundsTransaction);

module.exports = router;
