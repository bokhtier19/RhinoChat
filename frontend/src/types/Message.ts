import { User } from "./User";

export interface Message {
    _id: string;
    text: string;
    room: string;
    sender: User;
    createdAt: string;
}
