import { Request, Response } from "express";
import chatsSchema from "../schemas/chats.schema.js";
import messagesSchema from "../schemas/messages.schema.js";
import { JWT } from "../utils/jwt.js";
 
export default {
  async post(req: Request, res: Response) {
    try {
      const token = req.headers.token as string;
      const userId = JWT.VERIFY(token).id;
      let { chatId, text } = req.body;
      let newMessage = new messagesSchema({ text, sender: "user" });
        newMessage.save();
        await chatsSchema.findByIdAndUpdate(chatId, {
          $push: {
            messages: newMessage._id,
          },
        });

      let flowiseUrl: any = process.env.Flurl;
      let FLres = await fetch(flowiseUrl, {
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
        const FLresponse = await FLres.json();

         let newBotMessage = new messagesSchema({text: FLresponse, sender: "bot" });
         newBotMessage.save();
         await chatsSchema.findByIdAndUpdate(chatId, {
           $push: {
             messages: newBotMessage._id,
           },
         });
        
        res.json({
            text:FLresponse
        })
    } catch (error:any) {
        res.status(500).json({ message: "Server error" });

    }
  },
};
