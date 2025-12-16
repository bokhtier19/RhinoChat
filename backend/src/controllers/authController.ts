import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { User } from "../models/User";

export const register = async (req: Request, res: Response) => {
    try {
        const { username, email, password } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) return res.status(400).json({ message: "Email Already Exists!" });

        const hashed = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            username,
            email,
            password: hashed,
        });

        // CREATE TOKEN
        const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET!, {
            expiresIn: "1h",
        });

        res.status(201).json({
            message: "User created",
            token,
            user: {
                _id: newUser._id,
                username: newUser.username,
                email: newUser.email,
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Error Creating User" });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ message: "No user found!" });

        const isMatching = await bcrypt.compare(password, user.password);
        if (!isMatching) {
            return res.status(400).json({ message: "Invalid Credentials!" });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
            expiresIn: "1h",
        });

        res.json({
            message: "Logged In successfully!",
            token,
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
            },
        });
    } catch (err) {
        res.status(500).json({ message: "Error login!" });
    }
};
