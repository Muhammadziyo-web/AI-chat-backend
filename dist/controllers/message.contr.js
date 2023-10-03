var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import chatsSchema from "../schemas/chats.schema.js";
import messagesSchema from "../schemas/messages.schema.js";
import { JWT } from "../utils/jwt.js";
export default {
    post(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.headers.token;
                const userId = JWT.VERIFY(token).id;
                let { chatId, text } = req.body;
                let newMessage = new messagesSchema({ text, sender: "user" });
                newMessage.save();
                yield chatsSchema.findByIdAndUpdate(chatId, {
                    $push: {
                        messages: newMessage._id,
                    },
                });
                let flowiseUrl = process.env.Flurl;
                let FLres = yield fetch(flowiseUrl, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        question: text,
                        overrideConfig: {
                            sessionId: chatId,
                        },
                    }),
                });
                const FLresponse = yield FLres.json();
                let newBotMessage = new messagesSchema({ text: FLresponse, sender: "bot" });
                newBotMessage.save();
                yield chatsSchema.findByIdAndUpdate(chatId, {
                    $push: {
                        messages: newBotMessage._id,
                    },
                });
                res.json({
                    text: FLresponse
                });
            }
            catch (error) {
                res.status(500).json({ message: "Server error" });
            }
        });
    },
};
