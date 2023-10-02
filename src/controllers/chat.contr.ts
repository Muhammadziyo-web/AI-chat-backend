import { Request, Response } from "express";
import Chat from "../schemas/chats.schema";

export default {
async  addChat(req: Request, res: Response) {
    try {
      const { name } = req.body;
      const chat = new Chat({ name });
      await chat.save();
      res.status(201).json({ message: "Chat created", data: chat });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  },
};
