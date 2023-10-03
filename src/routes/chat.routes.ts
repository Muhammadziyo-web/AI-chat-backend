import { Router } from "express";
import chatContr from "../controllers/chat.contr.js";
import userMiddleware from "../middleware/user.middleware.js";
let { tokenChecker } = userMiddleware;
const router = Router();
let { addChat: post, getByToken,getById ,put,delete:del} = chatContr;
router.get("/", tokenChecker, getByToken);
router.get("/:id", tokenChecker, getById);
router.post("/",tokenChecker, post);
router.put("/:id",tokenChecker, put);
router.delete("/:id",tokenChecker, del);

export default router;
