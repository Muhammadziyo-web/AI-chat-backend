import validator from "validator";
import { isEmailValid } from "../middleware/email.cheker.js";
import mongoose, { Schema, Document, model, Types } from "mongoose";
const UserChema = new Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: isEmailValid,
      message: "Invalid email address",
    },
  },
  password: {
    type: String,
    required: true,
  },
  chats: [
    {
      type: Types.ObjectId,
      ref: "Chats",
    },
  ],
});

export default model("User", UserChema);
