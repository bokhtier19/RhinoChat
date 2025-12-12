import { api } from "./api";

export const createGroupRoom = async (name: string, members: string[]) => {
    return api.post("/rooms/group", { name, members });
};
