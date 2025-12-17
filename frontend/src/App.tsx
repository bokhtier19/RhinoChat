import React from "react";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import Chat from "./pages/Chat";
import Login from "./pages/Login";
import Register from "./pages/Register";

const App = () => {
    const token = localStorage.getItem("token");

    return (
        <div className="h-screen overflow-hidden">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={token ? <Navigate to={"/chat"} /> : <Navigate to={"/login"} />} />
                    <Route path="/chat" element={token ? <Chat /> : <Navigate to={"/login"} />} />
                    <Route path="/login" element={!token ? <Login /> : <Navigate to={"/chat"} />} />
                    <Route path="/register" element={!token ? <Register /> : <Navigate to={"/chat"} />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
};

export default App;
