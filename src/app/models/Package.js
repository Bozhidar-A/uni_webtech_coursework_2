import mongoose, { Schema } from "mongoose";

const PackageSchema = Schema({
    id: {
        type: String,
        required: true,
        unique: true,
    },
    recipientName: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    deliveryPrice: {
        type: Number,
        required: true,
    },
    isDelivered: {
        type: Boolean,
        required: true,
    },
}, { collection: "packages" });

mongoose.models = {};

export default mongoose.model('Package', PackageSchema);