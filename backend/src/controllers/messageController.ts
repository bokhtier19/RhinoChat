import { Request, Response } from "express";
import { Message } from "../models/Message";

export const getMessages = async (req: Request, res: Response) => {
    try {
        const roomId = req.params.roomId;

        const messages = await Message.find({ room: roomId }).populate("sender", "username email");

        res.json(messages);
    } catch (error) {
        res.json(500).json({ message: "Error loading messages" });
    }
};
