const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
dotenv = require('dotenv');

async function authMiddleware(req, res, next) {
    try {
        const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized: No token provided' });
        }

        try{
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await userModel.findById(decoded.userId);
            req.user = user;
            next();
        }catch(err){
            return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }
    
    } catch (err) {
        console.error('Error in auth middleware:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = authMiddleware;