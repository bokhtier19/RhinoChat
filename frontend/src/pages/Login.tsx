import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api/auth";

const Login = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await loginUser(form);
            localStorage.setItem("token", res.token);
            localStorage.setItem("user", JSON.stringify(res.user));
            navigate("/");
        } catch (err: any) {
            setError(err.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-white p-6 rounded-xl shadow">
                <h2 className="text-2xl font-bold mb-4 text-center">Welcome Back</h2>

                {error && <p className="text-red-500 text-sm mb-3 text-center">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-sm">Email</label>
                        <input type="email" name="email" value={form.email} onChange={handleChange} className="w-full border p-2 rounded mt-1" required />
                    </div>

                    <div>
                        <label className="text-sm">Password</label>
                        <input type="password" name="password" value={form.password} onChange={handleChange} className="w-full border p-2 rounded mt-1" required />
                    </div>

                    <button type="submit" disabled={loading} className="w-full bg-black text-white py-2 rounded mt-2">
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <p className="text-sm text-center mt-4">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-blue-600">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
