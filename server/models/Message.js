import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
    },
    username: {
        type: String, // For public messages
    },
    from: {
        type: String, // For private messages
    },
    to: {
        type: String, // For private messages
    },
    room: {
        type: String, // Only for private messages
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model("Message", messageSchema);
