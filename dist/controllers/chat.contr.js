var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import mongoose from "mongoose";
import Chat from "../schemas/chats.schema.js";
import userSchema from "../schemas/user.schema.js";
import { JWT } from "../utils/jwt.js";
export default {
    addChat(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.headers.token;
                const userId = JWT.VERIFY(token).id;
                const { name } = req.body;
                const chat = new Chat({ name });
                yield chat.save();
                yield userSchema.findByIdAndUpdate(userId, {
                    $push: {
                        chats: chat._id,
                    },
                });
                res.status(201).json({ message: "Chat created", data: chat });
            }
            catch (error) {
                res
                    .status(500)
                    .json({ message: "Server error", error: error.message });
            }
        });
    },
    getByToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.headers.token;
                const userId = JWT.VERIFY(token).id;
                let user = yield userSchema.findById(userId).populate("chats");
                res.json({
                    data: (user === null || user === void 0 ? void 0 : user.chats) || [],
                });
            }
            catch (error) {
                res
                    .status(500)
                    .json({ message: "Server error", error: error.message });
            }
        });
    },
    getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let chatId = req.params.id;
                let data = yield Chat.findById(chatId).populate("messages");
                res.json({
                    data: data || [],
                });
            }
            catch (error) {
                res
                    .status(500)
                    .json({ message: "Server error", error: error.message });
            }
        });
    },
    put(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let chatId = req.params.id;
                const { name } = req.body;
                if (!mongoose.isValidObjectId(chatId))
                    return res.status(400).json({ message: "Invalid chat id" });
                if (!name)
                    return res.status(400).json({ message: "Invalid data" });
                yield Chat.findByIdAndUpdate(chatId, { name });
                const chat = yield Chat.findById(chatId);
                res.status(201)
                    .json({ message: "Chat updated", data: chat });
            }
            catch (error) {
                res.status(500).json({ message: "Server error", error: error.message });
            }
        });
    },
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let chatId = req.params.id;
                if (!mongoose.isValidObjectId(chatId))
                    return res.status(400).json({ message: "Invalid chat id" });
                const chat = Chat.findByIdAndDelete(chatId);
                res.status(201).json({ message: "Chat deleted" });
            }
            catch (error) {
                res.status(500).json({ message: "Server error", error: error.message });
            }
        });
    },
};
