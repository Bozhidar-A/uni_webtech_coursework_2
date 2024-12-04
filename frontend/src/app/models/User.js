import mongoose, { Schema } from "mongoose";

var UserSchema = Schema({
    username: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    }
}, { collection: "users" });

mongoose.models = {};

export default mongoose.model('User', UserSchema);