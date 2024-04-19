import mongoose from "mongoose";
const users = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
})
export const User = mongoose.model('User', users)