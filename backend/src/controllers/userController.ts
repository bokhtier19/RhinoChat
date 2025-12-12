import { User } from "../models/User";
import { Request, Response } from "express";

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find().select("_id username email");
        res.json(users);
    } catch {
        res.status(500).json({ message: "Failed to fetch users" });
    }
};
