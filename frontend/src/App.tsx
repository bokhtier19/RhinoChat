import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Chat from "./pages/Chat";
import Login from "./pages/Login";
import Register from "./pages/Register";

const App = () => {
    const token = localStorage.getItem("token");

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={!token ? <Login /> : <Navigate to={"/"} />} />

                <Route path="/register" element={!token ? <Register /> : <Navigate to={"/"} />} />

                <Route path="/" element={token ? <Chat /> : <Navigate to={"/login"} />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
