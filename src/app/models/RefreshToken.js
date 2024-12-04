import mongoose, { Schema } from 'mongoose';

// Refresh Token Model
const RefreshTokenSchema = Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    token: String,
    expiresAt: Date,
    createdAt: { type: Date, default: Date.now }
});

mongoose.models = {};

export default mongoose.model('RefreshToken', RefreshTokenSchema);