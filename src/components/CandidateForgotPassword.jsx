import React, { useState, useRef } from "react";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import img from "../assets/RecruiterLogin.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "../utils/ApiConstants";
    
const CandidateForgotPassword = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const otpRefs = [
        useRef(),
        useRef(),
        useRef(),
        useRef(),
        useRef(),
        useRef()
    ];

    const handleOtpChange = (index, value) => {
        if (value && !/^\d$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            otpRefs[index + 1].current.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            otpRefs[index - 1].current.focus();
        }
    };

    // Step 1: API Call - forgot (send OTP)
    const handleSendOtp = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await axios.post(`${baseUrl}/api/candidate-forgot/forgot`, { email });
            // console.log("res:", response.data);
            setStep(2);
        } catch (err) {
            console.log(err);
            setError(err.response?.data?.message || "Failed to send OTP");
        } finally {
            setLoading(false);
        }
    };

    // Step 2: API Call - validate-otp
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const otpValue = otp.join("");

        try {
            const response = await axios.post(`${baseUrl}/api/candidate-forgot/validate-otp`, { email, otp: otpValue });
            // console.log("OTP:", otpValue);
            // console.log("res:", response.data);
            setStep(3);
        } catch (err) {
            setError(err.response?.data?.message || "Invalid OTP");
        } finally {
            setLoading(false);
        }
    };

    // Step 3: API Call - change-password
    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(`${baseUrl}/api/candidate-forgot/change-password`, { email, newPassword: password });
            // console.log("res:", response.data);
            // console.log("New Password:", password);
            // console.log("Confirm Password:", confirmPassword);
            alert("Password Reset Done!");
            navigate("/CandidateLogin");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to change password");
        } finally {
            setLoading(false);
        }
    };

    // Resend OTP handler
    const handleResendOtp = async () => {
        setError("");
        setLoading(true);

        try {
            const response = await axios.post(`${baseUrl}/api/candidate-forgot/forgot`, { email });
            setOtp(["", "", "", "", "", ""]);
            alert("OTP resent successfully!");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to resend OTP");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FFFFFF05] flex items-center justify-center px-4">
            <div className="max-w-6xl w-full">
                <h1 className="text-3xl text-center md:text-4xl font-bold text-gray-900 mb-10">
                    Forgot Password
                </h1>
                <div className="flex flex-col md:flex-row items-center justify-between">
                    <div className="flex-1 text-center md:text-left mb-10 md:mb-0">
                        <p className="text-2xl text-[#0496FF] text-center font-medium mb-8">
                            Reset Your Password
                        </p>
                        <img
                            src={img}
                            alt="Illustration"
                            className="h-[400px] w-full md:w-auto mx-auto"
                        />
                    </div>

                    <div className="flex-1 bg-white rounded-2xl shadow-md border border-gray-100 p-8 max-w-md mx-auto">

                        {error && (
                            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-center">
                                {error}
                            </div>
                        )}

                        {step === 1 && (
                            <form onSubmit={handleSendOtp}>
                                <p className="text-gray-600 text-center mb-6">
                                    Please update your password to secure your account
                                </p>

                                <div className="mb-6">
                                    <label className="block text-gray-800 font-medium mb-1">
                                        Email ID
                                    </label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email"
                                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-blue-500 text-white py-2 rounded-md font-medium hover:bg-blue-600 mb-4 disabled:bg-blue-300 disabled:cursor-not-allowed"
                                >
                                    {loading ? "Sending..." : "Send OTP"}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => navigate("/CandidateLogin")}
                                    className="w-full flex items-center justify-center text-gray-600 hover:text-blue-600"
                                >
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Back to Login
                                </button>
                            </form>
                        )}

                        {step === 2 && (
                            <form onSubmit={handleVerifyOtp}>
                                <p className="text-gray-600 text-center mb-2">
                                    Enter the OTP sent to
                                </p>
                                <p className="text-blue-600 text-center font-medium mb-6">
                                    {email}
                                </p>

                                <div className="mb-6">
                                    <label className="block text-gray-800 font-medium mb-3 text-center">
                                        Enter OTP
                                    </label>
                                    <div className="flex justify-center gap-2">
                                        {otp.map((digit, index) => (
                                            <input
                                                key={index}
                                                ref={otpRefs[index]}
                                                type="text"
                                                value={digit}
                                                onChange={(e) => handleOtpChange(index, e.target.value)}
                                                onKeyDown={(e) => handleKeyDown(index, e)}
                                                maxLength={1}
                                                className="w-12 h-12 text-center text-xl font-semibold border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        ))}
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-blue-500 text-white py-2 rounded-md font-medium hover:bg-blue-600 mb-4 disabled:bg-blue-300 disabled:cursor-not-allowed"
                                >
                                    {loading ? "Verifying..." : "Verify OTP"}
                                </button>

                                <p className="text-center text-sm text-gray-600">
                                    Didn't receive OTP?{" "}
                                    <button
                                        type="button"
                                        onClick={handleResendOtp}
                                        disabled={loading}
                                        className="text-blue-600 hover:underline disabled:text-blue-300"
                                    >
                                        Resend
                                    </button>
                                </p>
                            </form>
                        )}

                        {step === 3 && (
                            <form onSubmit={handleResetPassword}>
                                <p className="text-gray-600 text-center mb-6">
                                    Create your new password
                                </p>

                                <div className="mb-4 relative">
                                    <label className="block text-gray-800 font-medium mb-1">
                                        New Password
                                    </label>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter new password"
                                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>

                                <div className="mb-6 relative">
                                    <label className="block text-gray-800 font-medium mb-1">
                                        Confirm Password
                                    </label>
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Confirm new password"
                                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
                                    >
                                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-blue-500 text-white py-2 rounded-md font-medium hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed"
                                >
                                    {loading ? "Resetting..." : "Reset Password"}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CandidateForgotPassword;