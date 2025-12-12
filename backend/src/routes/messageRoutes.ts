import { Router } from "express";
import { auth } from "../middleware/auth";
import { getMessages } from "../controllers/messageController";

const router = Router();

router.get("/:roomId", auth, getMessages);

export default router;
