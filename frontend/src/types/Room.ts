import { User } from "./User";

export interface Room {
    _id: string;
    name?: string;
    isGroup: boolean;
    members: User[];
}
