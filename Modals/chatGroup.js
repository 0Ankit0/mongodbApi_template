import mongoose from "mongoose";

const chatGroupSchema = new mongoose.Schema({
    name: {
        type: String
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }]
}, { timestamps: true });

export const ChatGroup = mongoose.model("ChatGroup", chatGroupSchema);