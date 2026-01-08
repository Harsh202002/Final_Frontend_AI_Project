import React, { useState } from "react";
import img from "../assets/CandidateLogin.png";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "../utils/ApiConstants";
import CandidateRegister from "./CandidateRegister";

const CandidateLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        setLoading(true);
        setError("");

        if (!email || !password) {
            setError("Email and password are required");
            setLoading(false);
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError("Please enter a valid email");
            setLoading(false);
            return;
        }

        try {
            const { data } = await axios.post(
                `${baseUrl}/api/candidate/login`,
                { email, password }
            );

            const cleanCandidate = {
                id: data.candidate._id,
                name: data.candidate.name,
                email: data.candidate.email,
                phone: data.candidate.phone,
                hasLoggedIn: data.candidate.hasLoggedIn
            };

            localStorage.setItem("candidateToken", data.token);
            localStorage.setItem("candidate", JSON.stringify(cleanCandidate));
            sessionStorage.setItem(
                "candidateData",
                JSON.stringify(cleanCandidate)
            );

            setLoading(false);

            // First login → Chatbot, else Dashboard
            if (!data.candidate.hasLoggedIn) {
                navigate("/Candidate-Chatbot");
            } else {
                navigate("/Candidate-Dashboard");
            }
        } catch (err) {
            setError(err.response?.data?.error || "Invalid credentials");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FFFFFF05]">
            <h1 className="text-3xl text-center md:text-4xl font-bold text-gray-900 mb-10 mt-5">
                Welcome Back
            </h1>

            <div className="flex flex-col md:flex-row items-center justify-between max-w-6xl w-full mx-auto">
                {/* Left Section */}
                <div className="flex-1 text-center md:text-left mb-10 md:mb-0">
                    <p className="text-2xl text-[#0496FF] text-center font-medium mb-8">
                        Login to Your AIRecruiter
                    </p>
                    <img
                        src={img}
                        alt="Illustration"
                        className="h-[400px] w-full md:w-auto mx-auto"
                    />
                </div>

                {/* Right Section */}
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

                    <div className="mb-2">
                        <label className="block text-gray-800 font-medium mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter Password"
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="mb-4 flex flex-row-reverse">
                        <span
                            onClick={() => navigate("/CandidateForgotPassword")}
                            className="text-blue-600 cursor-pointer text-sm hover:underline"
                        >
                            Forgot Password?
                        </span>
                    </div>

                    {error && (
                        <p className="text-red-500 text-sm mb-2">{error}</p>
                    )}

                    <div className="flex justify-center">
                        <button
                            onClick={handleLogin}
                            disabled={loading}
                            className="w-[150px] bg-blue-500 text-white py-2 rounded-md font-medium hover:bg-blue-600 transition-colors mb-2 disabled:bg-blue-300"
                        >
                            {loading ? "Logging in..." : "Login"}
                        </button>
                    </div>

                    <p className="text-center text-sm text-gray-600">
                        Don't have an account?{" "}
                        <Link
                            to="/CandidateRegister"
                            className="text-blue-600 hover:underline"
                        >
                            Sign Up
                        </Link>
                    </p>
                </div>
            </div>
        </div >
    );
};

export default CandidateLogin;
