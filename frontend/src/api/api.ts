import axios from "axios";

export const api = axios.create({
    baseURL: "http://localhost:5000/api",
});

// Attach token on every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

// Handle expired or invalid token globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem("token");
            localStorage.removeItem("user");

            // Redirect to login (session-like behavior)
            window.location.href = "/login";
        }

        return Promise.reject(error);
    }
);
