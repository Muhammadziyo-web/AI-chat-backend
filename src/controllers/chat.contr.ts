import { Request, Response } from "express";
import mongoose from "mongoose";
import Chat from "../schemas/chats.schema.js";
import userSchema from "../schemas/user.schema.js";
import { JWT } from "../utils/jwt.js";

export default {
  async addChat(req: Request, res: Response) {
    try {
      const token = req.headers.token as string;
      const userId = JWT.VERIFY(token).id;

      const { name } = req.body;
      const chat = new Chat({ name });
      await chat.save();
      await userSchema.findByIdAndUpdate(userId, {
        $push: {
          chats: chat._id,
        },
      });

      res.status(201).json({ message: "Chat created", data: chat });
    } catch (error:any) {
            res
              .status(500)
              .json({ message: "Server error", error: error.message });

    }
  },
  async getByToken(req: Request, res: Response) {
    try {
      const token = req.headers.token as string;
      const userId = JWT.VERIFY(token).id;

      let user = await userSchema.findById(userId).populate("chats");

      res.json({
        data: user?.chats || [],
      });
    } catch (error:any) {
           res
             .status(500)
             .json({ message: "Server error", error: error.message });

    }
  },
  async getById(req: Request, res: Response) {
    try {
      let chatId = req.params.id;

      let data = await Chat.findById(chatId).populate("messages");

      res.json({
        data: data || [],
      });
    } catch (error:any) {
            res
              .status(500)
              .json({ message: "Server error", error: error.message });

    }
  },
  async put(req: Request, res: Response) {
    try {
      let chatId = req.params.id;
      const { name } = req.body;
      if (!mongoose.isValidObjectId(chatId))
        return res.status(400).json({ message: "Invalid chat id" });
      if (!name) return res.status(400).json({ message: "Invalid data" });
        await Chat.findByIdAndUpdate(chatId, { name });
        const chat = await Chat.findById(chatId)
            res.status(201)
          .json({ message: "Chat updated", data: chat });
    } catch (error: any) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
    },
  async delete(req: Request, res: Response) {
    try {
      let chatId = req.params.id;
      if (!mongoose.isValidObjectId(chatId))
        return res.status(400).json({ message: "Invalid chat id" });
      
      const chat = Chat.findByIdAndDelete(chatId);
      res.status(201).json({ message: "Chat deleted"});
    } catch (error:any) {
      res.status(500).json({ message: "Server error",error:error.message });
    }
    },
  
};
