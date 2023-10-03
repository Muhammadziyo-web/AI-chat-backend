import { Router } from "express";
import messageContr from "../controllers/message.contr.js";
import userMiddleware from "../middleware/user.middleware.js";
let { tokenChecker } = userMiddleware;
const router = Router();

let { post } = messageContr;
router.post("/", post);

export default router;
