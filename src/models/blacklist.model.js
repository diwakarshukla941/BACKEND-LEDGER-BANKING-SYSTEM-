const mongoose = require('mongoose');
const { expires } = require('mongoose/lib/utils');

const tokenBlacklistSchema = new mongoose.Schema({
    token: {
        type: String,
        required: [true, 'Token is required'],
        unique: true,
    },


},{timestamps: true});


tokenBlacklistSchema.index({ createdAt: 1 },
    {expiresAfterSeconds: 60 * 60 * 24 * 3 }// 3 days
);

const tokenBlacklistModel = mongoose.model('TokenBlacklist', tokenBlacklistSchema);

module.exports = tokenBlacklistModel;
