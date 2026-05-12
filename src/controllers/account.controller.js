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

module.exports = {
    createAccountController
}