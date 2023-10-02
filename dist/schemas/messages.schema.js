import { Schema, model } from "mongoose";
const UserChema = new Schema({
    text: {
        type: String,
        required: true,
    },
    sender: { type: String, enum: ["user", "bot"], required: true },
    createdAt: { type: Date, default: Date.now },
});
export default model("Messages", UserChema);
