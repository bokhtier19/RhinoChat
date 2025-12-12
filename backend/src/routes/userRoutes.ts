import { Router } from "express";
import { auth } from "../middleware/auth";
import { getAllUsers } from "../controllers/userController";

const router = Router();

router.get("/", auth, getAllUsers);

export default router;
