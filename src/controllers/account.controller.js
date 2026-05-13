const accountModel = require('../models/account.model');


/** 
 * @route POST /api/accounts
 * @desc Create a new account
 * @access Protected Route  
 
 */

async function createAccountController(req, res) {
    const user = req.user;
    const accountExist = await accountModel.findOne({ user: user._id });

    if (accountExist) {
        return res.status(409).json({
            success: false,
            message: "Account already exists for this user"
        })
    }


    const account = await accountModel.create({
        user: user._id,
    })
    res.status(201).json({
        success: true,
        message: "Account created successfully",
        account
    })
}

async function getUserAccountController(req, res) {
    const accounts = await accountModel.find({ user: req.user._id });
    res.status(200).json({
        success: true,
        message: "Accounts retrieved successfully",
        accounts
    })
}

async function getAccountBalanceController(req, res) {
    const { accountId } = req.params;
    const account = await accountModel.findOne({ _id: accountId, user: req.user._id });

    if (!account) {
        return res.status(404).json({
            success: false,
            message: "Account not found"
        })
    }

    const balance = await account.getBalance();
    res.status(200).json({
        success: true,
        message: "Account balance retrieved successfully",
        balance
    })

}

module.exports = {
    createAccountController,
    getUserAccountController,
    getAccountBalanceController
}