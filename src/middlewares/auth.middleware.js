const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const tokenBlacklistModel = require('../models/blacklist.model');
require('dotenv').config();

async function authMiddleware(req, res, next) {
    try {
        const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized: No token provided' });
        }
        
        const isBlacklisted = await tokenBlacklistModel.findOne({ token });
        
        if (isBlacklisted) {
            return res.status(401).json({ message: 'Unauthorized: Token is Invalid ' });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await userModel.findById(decoded.userId);
            req.user = user;
            next();
        } catch (err) {
            return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }

    } catch (err) {
        console.error('Error in auth middleware:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

async function systemAuthMiddleware(req, res, next) {
    try {
        const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized: No token provided' });
        }

        const isBlacklisted = await tokenBlacklistModel.findOne({ token });
        if (isBlacklisted) {
            return res.status(401).json({ message: 'Unauthorized: Token is Invalid ' });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await userModel.findById(decoded.userId).select('+systemUser');
            if (!user.systemUser) {
                return res.status(403).json({ message: 'Forbidden: Access is denied' });
            }
            req.user = user;
            return next();

        } catch (err) {
            return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }

    } catch (err) {
        console.error('Error in system auth middleware:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {
    authMiddleware,
    systemAuthMiddleware
};