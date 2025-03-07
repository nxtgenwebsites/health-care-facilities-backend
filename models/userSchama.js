import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: true
    },
    last_name: {
        type: String, 
        required: true
    },
    country: {
        type: String, 
        required: true
    },
    state: {
        type: String, 
        required: true
    },
    city: {
        type: String, 
        required: true
    },
    phone: {
        type: String, 
        required: true
    },
    email: {
        type: String, 
        required: true
    },
    password: {
        type: String, 
        required: true
    },
    role: {
        type: String, 
        required: true
    },
    isBlocked: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

const userModel = mongoose.model('users', userSchema);

export default userModel;