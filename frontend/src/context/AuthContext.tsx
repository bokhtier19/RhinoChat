import { api } from "../api/api";
import { socket } from "../api/socket";
import { createContext, ReactNode, useState } from "react";
import { User } from "../types/User";

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
    login: async () => {},
    logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    const login = async (email: string, password: string) => {
        const res = await api.post("/auth/login", { email, password });

        localStorage.setItem("token", res.data.token);

        setUser(res.data.user);
        socket.connect();
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
        socket.disconnect();
    };

    return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
};
