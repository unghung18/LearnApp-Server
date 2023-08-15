const mongoose = require('mongoose');

const refreshTokenSchema = mongoose.Schema({
    token: {
        type: String,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
    }
})

module.exports = mongoose.model('refreshTokens', refreshTokenSchema);