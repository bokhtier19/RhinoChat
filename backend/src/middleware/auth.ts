import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const auth = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) return res.status(401).json({ message: "No Token found!" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };

        (req as any).user = decoded.id;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid Token!" });
    }
};
