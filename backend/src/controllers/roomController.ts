import { Request, Response } from "express";
import Room from "../models/Room";

// Create or get a direct 1:1 room

export const DirectRoom = async (req: any, res: Response) => {
    try {
        const user1 = req.user.id;
        const { user2 } = req.body;

        // 1. Check if room already exists
        let room = await Room.findOne({
            isGroup: false,
            members: { $all: [user1, user2], $size: 2 },
        });

        // 2. If not, create
        if (!room) {
            room = await Room.create({
                isGroup: false,
                members: [user1, user2],
            });
        }

        res.json(room);
    } catch {
        res.status(500).json({ message: "Unable to create/find DM room" });
    }
};

// Get all rooms for logged-in user

export const GetUserRooms = async (req: any, res: Response) => {
    try {
        const userId = req.user.id;

        const rooms = await Room.find({ members: userId }).populate("members", "username email");

        res.json(rooms);
    } catch (err) {
        res.status(500).json({ message: "Error fetching rooms" });
    }
};

// Create a group chat

export const createGroup = async (req: any, res: Response) => {
    try {
        const { name, members } = req.body;
        const admin = req.user.id;

        if (!name || !members || members.length < 2) {
            return res.status(400).json({ message: "Group needs a name and two plus members" });
        }

        // Include the creator automatically
        if (!members.includes(admin)) {
            members.push(admin);
        }

        const room = await Room.create({
            isGroup: true,
            name,
            members,
        });

        const populated = await room.populate("members");

        res.status(201).json(populated);
    } catch (err) {
        res.status(500).json({ message: "Error creating group" });
    }
};
