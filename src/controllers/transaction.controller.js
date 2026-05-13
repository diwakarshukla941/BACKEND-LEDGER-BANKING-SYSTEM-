const transactionModel = require('../models/transaction.model');
const ledgerModel = require('../models/ledger.model');
const accountModel = require('../models/account.model');
const emailService = require('../services/email.service');
const mongoose = require('mongoose');


async function createTransaction(req, res) {
    try {
        // Validate request body

        const { fromAccount, toAccount, amount, idempotencyKey } = req.body;

        if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
            return res.status(400).json({ error: 'fromAccount, toAccount, amount, and idempotencyKey are required fields' });
        }

        // Convert string IDs to ObjectIds
        const fromAccountId = new mongoose.Types.ObjectId(fromAccount);
        const toAccountId = new mongoose.Types.ObjectId(toAccount);

        const fromUserAccount = await accountModel.findById(fromAccountId).populate('user');
        const toUserAccount = await accountModel.findById(toAccountId).populate('user');

        if (!fromUserAccount || !toUserAccount) {
            return res.status(404).json({ error: 'Invalid fromAccount or toAccount' });
        }

        if (!fromUserAccount.user || !toUserAccount.user) {
            return res.status(404).json({ error: 'User not found for accounts' });
        }

        // validate idempotency key
        const existingTransaction = await transactionModel.findOne({ idempotencyKey });
        if (existingTransaction) {
            if (existingTransaction.status === 'COMPLETED') {
                return res.status(409).json({ error: 'Transaction Already Processed' });
            } else if (existingTransaction.status === 'PENDING') {
                return res.status(409).json({ error: 'Transaction is still pending' });
            } else if (existingTransaction.status === 'FAILED') {
                return res.status(409).json({ error: 'Previous transaction with this idempotency key failed. Please try again.' });
            } else if (existingTransaction.status === 'REVERSED') {
                return res.status(409).json({ error: 'Previous transaction with this idempotency key was reversed. Please try again.' });
            }
        }


        // check account status
        if (fromUserAccount.status !== 'ACTIVE' || toUserAccount.status !== 'ACTIVE') {
            return res.status(400).json({ error: 'Both accounts must be active to process the transaction' });
        }


        // derive sender balance from ledger entries
        const balance = await fromUserAccount.getBalance();

        if (balance < amount) {
            return res.status(400).json({ error: `Insufficient balance.Current balance is ${balance} requested amount is ${amount}` });
        }

        let transaction;
        try {
            //  create transaction (PENDING)

            transaction = await transactionModel.create({
                fromAccount: fromAccountId,
                toAccount: toAccountId,
                amount,
                idempotencyKey,
                status: 'PENDING'
            });

            console.log('Transaction created:', transaction._id);

            const debitEntry = await ledgerModel.create({
                account: fromAccountId,
                amount: amount,
                transaction: transaction._id,
                type: 'DEBIT'
            });

            console.log('Debit entry created:', debitEntry._id);

            const creditEntry = await ledgerModel.create({
                account: toAccountId,
                amount: amount,
                transaction: transaction._id,
                type: 'CREDIT'
            });

            console.log('Credit entry created:', creditEntry._id);

            transaction.status = 'COMPLETED';
            await transaction.save();
            console.log('Transaction status updated to COMPLETED');
        } catch (error) {
            return res.status(400).json({ error: 'Transaction is pending due to some issue please try again later.' });
        }
        // send email notification to both sender and receiver
        try {
            await emailService.sendTransactionEmail(fromUserAccount.user.email, fromUserAccount.user.name, amount, toAccountId);
            await emailService.sendTransactionEmail(toUserAccount.user.email, toUserAccount.user.name, amount, fromAccountId);
        } catch (emailError) {
            console.error('Email sending failed:', emailError.message);
        }

        return res.status(201).json({
            success: true,
            message: 'Transaction completed successfully',
            transaction
        });
    } catch (error) {
        console.error('Transaction error:', error.message);
        return res.status(500).json({ error: 'Transaction failed: ' + error.message });
    }
}


async function createInitialFundsTransaction(req, res) {
    const { toAccount, amount, idempotencyKey } = req.body;

    if (!toAccount || !amount || !idempotencyKey) {
        return res.status(400).json({ error: 'toAccount, amount, and idempotencyKey are required fields' });
    }

    const toUserAccount = await accountModel.findById({ _id: toAccount });

    if (!toUserAccount) {
        return res.status(404).json({ error: 'Invalid toAccount' });
    }

    const fromUserAccount = await accountModel.findOne({ user: req.user._id });

    if (!fromUserAccount) {
        return res.status(404).json({ error: 'System account not found for the authenticated user' });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    const transaction = (await transactionModel([{
        fromAccount: fromUserAccount._id,
        toAccount,
        amount,
        idempotencyKey,
        status: 'PENDING'
    }], { session }))[0];

    const debitLedgerEntry = await ledgerModel.create([{
        account: fromUserAccount._id,
        amount: amount,
        transaction: transaction._id,
        type: 'DEBIT'
    }], { session });

    const creditLedgerEntry = await ledgerModel.create([{
        account: toAccount,
        amount: amount,
        transaction: transaction._id,
        type: 'CREDIT'
    }], { session });

    await transactionModel.findByIdAndUpdate({ _id: transaction._id }, { status: 'COMPLETED' }, { session });
    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
        message: 'Initial funds transaction completed successfully',
        transaction
    })

}

module.exports = {
    createTransaction,
    createInitialFundsTransaction
}