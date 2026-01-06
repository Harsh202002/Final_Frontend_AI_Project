import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import img from "../assets/RecruiterLogin.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "../utils/ApiConstants";
 
const UniversalLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
 
    const decodeToken = (token) => {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split('')
                    .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                    .join('')
            );
 
            const decodedToken = JSON.parse(jsonPayload);
            return decodedToken;
        } catch (error) {
            console.error("Error decoding token:", error);
            return null;
        }
    };
 
    const navigateBasedOnRole = (role) => {
        console.log("User Role:", role);
 
        switch (role?.toLowerCase()) {
            case 'admin':
                navigate("/Admin-Dashboard");
                break;
            case 'hr':
                navigate("/RecruiterAdmin-Dashboard");
                break;
            case 'rmg':
                navigate("/RMGAdmin-Dashboard");
                break;
            default:
                console.warn("Unknown role:", role);
                setError("Invalid user role. Please contact administrator.");
                break;
        }
    };
 
    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
 
        if (!email || !password) {
            setError("Please provide email and password");
            setLoading(false);
            return;
        }
 
        try {
            const response = await axios.post(
                `${baseUrl}/api/auth/login`,
                { email, password },
                { withCredentials: true }
            );
            console.log(response.data);
 
            if (response.data.success) {
                const token = response.data.token;
                const user = response.data.user;
 
                localStorage.setItem("token", token);
                console.log("Check paasword",user);
                if (!user.ispasswordchanged) {
                    // console.log("Password not changed, redirecting to change password page");
                    navigate("/ForgotPassword", {
                        state: {
                            email: user.email,
                            message: "Please change your password before continuing",
                            isFirstLogin: true
                        }
                    });
                } else {
                    const decoded = decodeToken(token);
 
                    if (!decoded || !decoded.role) {
                        setError("Invalid token received");
                        setLoading(false);
                        return;
                    }
 
                    navigateBasedOnRole(decoded.role);
                }
            }
 
        } catch (err) {
            console.error("Login Error:", err);
            setError(err.response?.data?.message || "Invalid email or password");
        }
 
        setLoading(false);
    };
 
    return (
        <div className="min-h-screen bg-[#FFFFFF05] flex items-center justify-center px-4">
            <div className="max-w-6xl w-full">
                <h1 className="text-3xl text-center md:text-4xl font-bold text-gray-900 mb-10">
                    Welcome Back
                </h1>
                <div className="flex flex-col md:flex-row items-center justify-between">
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
 
                    <div className="flex-1 bg-white rounded-2xl shadow-md border border-gray-100 p-8 max-w-md mx-auto">
                        <form onSubmit={handleLogin}>
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
                                    required
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
                                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>

                            <div className="mb-4 text-right">
    <span
        onClick={() => navigate("/ForgotPassword")}
        className="text-blue-600 cursor-pointer text-sm hover:underline"
    >
        Forgot Password?
    </span>
</div>
 
                            {error && (
                                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
                                    {error}
                                </div>
                            )}
 
                            {/* <div className="mb-4">
                                <span onClick={() => navigate("/ForgotPassword")} className="text-blue-600 cursor-pointer text-sm">
                                    Forgot Password?
                                </span>
                            </div> */}
 
                            <div className="flex justify-center">
                                <button 
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-blue-500 text-white py-2 rounded-md font-medium hover:bg-blue-600 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Logging in...
                                        </span>
                                    ) : (
                                        "Login"
                                    )}
                                </button>
                            </div>
 
                            {/* <p className="text-center text-sm text-gray-600 mt-4">
                                Don't have an account?{" "}
                                <a href="/signup" className="text-blue-600 hover:underline">
                                    Sign Up
                                </a>
                            </p> */}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};
 
export default UniversalLogin;