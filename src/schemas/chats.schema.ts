import validator from "validator";
import { isEmailValid } from "../middleware/email.cheker.js";
import mongoose, { Schema, Document, model, Types } from "mongoose";
const UserChema = new Schema({
  name: {
    type: String,
    default: "New chat",
  },
  messages: [
    {
      type: Types.ObjectId,
      ref: "Messages",
    },
  ],
  createdAt: { type: Date, default: Date.now }
});

export default model("Chats", UserChema);
