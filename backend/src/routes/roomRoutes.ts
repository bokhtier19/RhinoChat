import { Router } from "express";
import { auth } from "../middleware/auth";
import { createGroup, DirectRoom, GetUserRooms } from "../controllers/roomController";

const router = Router();

// GET all rooms for logged-in user
router.get("/", auth, GetUserRooms);

// Create or fetch a direct 1:1 room
router.post("/direct", auth, DirectRoom);
router.post("/group", auth, createGroup);

export default router;
