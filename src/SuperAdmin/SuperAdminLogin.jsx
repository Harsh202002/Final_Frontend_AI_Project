import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import img from "../assets/SALogin.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { superAdminBaseUrl } from "../utils/ApiConstants";

const SuperAdminLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        setLoading(true);
        setError("");

        try {
            const response = await axios.post(
                `${superAdminBaseUrl}/api/superadmin/login`, 
                { 
                    email, 
                    password 
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );

            console.log("Login success:", response.data);
            
            if (response.data.status === "success") {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('superadmin', JSON.stringify(response.data.data));
                
                navigate("/SuperAdmin-Dashboard");
            }
        } catch (err) {
            console.error("Login failed:", err.response?.data || err.message);
            setError(err.response?.data?.message || "Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FFFFFF05]">
            <h1 className="text-3xl text-center md:text-4xl font-bold text-gray-900 mb-10 mt-5">
                Welcome Back
            </h1>
            <div className="flex flex-col md:flex-row items-center justify-between max-w-6xl w-full">
                <div className="flex-1 text-center md:text-left mb-10 md:mb-0 ">
                    <p className="text-2xl text-[#0496FF] text-center font-medium mb-8">
                        Login to Your AIRecruiter
                    </p>
                    <img
                        src={img}
                        alt="Illustration"
                        className="h-[400px] w-full md:w-auto mx-auto"
                    />
                </div>

                <div className="flex-1 bg-white rounded-2xl shadow-md border border-gray-100 p-8 max-w-md mx-auto">
                    <div className="mb-4">
                        <label className="block text-gray-800 font-medium mb-1">
                            Email ID
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter Email ID"
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="mb-6 relative">
                        <label className="block text-gray-800 font-medium mb-1">
                            Password
                        </label>
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter Password"
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
                        >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>

                    {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

                    <div className="flex justify-center">
                        <button
                            onClick={handleLogin}
                            disabled={loading}
                            className="w-[150px] bg-blue-500 text-white py-2 rounded-md font-medium hover:bg-blue-600 transition-colors mb-2 disabled:bg-blue-300"
                        >
                            {loading ? "Logging in..." : "Login"}
                        </button>
                    </div>

                    <div className="flex items-center justify-center mb-2">
                        <hr className="w-1/3 border-gray-300" />
                        <span className="mx-2 text-gray-500">OR</span>
                        <hr className="w-1/3 border-gray-300" />
                    </div>

                    <button className="flex items-center justify-center w-full border border-gray-300 py-2 rounded-md hover:bg-gray-50 transition-colors mb-2">
                        Sign in with Google
                    </button>

                    <p className="text-center text-sm text-gray-600">
                        Already have an account?{" "}
                        <a href="#" className="text-blue-600 hover:underline">
                            Sign In
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SuperAdminLogin;