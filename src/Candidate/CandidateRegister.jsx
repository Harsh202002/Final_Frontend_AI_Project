import React, { useState } from "react";
import { Eye, EyeOff, AlertCircle, Loader2, CheckCircle, X, Upload, FileText } from "lucide-react";
import img from "../img/login.png";
import logo from "../img/loginlogo.png";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "../utils/ApiConstants";

const CandidateRegister = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: ""
    });
    const [resumeFile, setResumeFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "phone") {
            const numericValue = value.replace(/[^0-9]/g, "");
            setFormData(prev => ({
                ...prev,
                [name]: numericValue
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }

        if (error) setError("");
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            if (!allowedTypes.includes(file.type)) {
                setError("Only PDF, DOC, and DOCX files are allowed");
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                setError("File size must be less than 5MB");
                return;
            }

            setResumeFile(file);
            if (error) setError("");
        }
    };

    const removeResume = () => {
        setResumeFile(null);
    };

    const validateForm = () => {
        const { name, email, phone, password } = formData;

        if (!name || !email || !phone || !password) {
            setError("All fields are required");
            return false;
        }

        if (phone.length !== 10) {
            setError("Phone number must be 10 digits");
            return false;
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters");
            return false;
        }

        const hasNumber = /[0-9]/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        const hasSmallLetter = /[a-z]/.test(password);
        const hasCapitalLetter = /[A-Z]/.test(password);

        if (!hasNumber || !hasSpecialChar || !hasSmallLetter || !hasCapitalLetter) {
            setError("Password must contain at least one number, special character, uppercase and lowercase letter");
            return false;
        }

        return true;
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        setError("");

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('email', formData.email);
            formDataToSend.append('phone', formData.phone);
            formDataToSend.append('password', formData.password);

            if (resumeFile) {
                formDataToSend.append('resume', resumeFile);
            }

            const { data } = await axios.post(
                `${baseUrl}/candidate/register`,
                formDataToSend,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            // console.log("data here", data);

            alert("Account successfully created!");
            navigate("/CandidateLogin");
        } catch (err) {
            if (err.response?.data?.error === "Email already exists") {
                alert("Email already registered! Please login.");
            } else {
                setError(err.response?.data?.error || "Registration failed");
            }
        } finally {
            setLoading(false);
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    return (
        <div className="min-h-screen">
            <div className="mx-auto flex min-h-screen max-w-[1100px] items-stretch gap-6 p-6">
                <div className="flex w-full flex-col rounded-md bg-white px-10 md:w-1/2">

                    <div className="flex flex-1 flex-col justify-center">
                        <h1 className="text-center text-2xl font-bold tracking-wide text-black">
                            Create Your Account
                        </h1>
                        <p className="mt-3 text-center text-sm text-gray-500">
                            Join us today! Please enter your details.
                        </p>

                        <form onSubmit={handleRegister} className="mt-8 space-y-4">
                            <div>
                                <label className="mb-2 block text-xs font-semibold text-gray-700">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter your full name"
                                    className="h-11 w-full rounded-lg border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-200"
                                    required
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-xs font-semibold text-gray-700">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Enter your email"
                                    className="h-11 w-full rounded-lg border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-200"
                                    required
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-xs font-semibold text-gray-700">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="Enter 10-digit phone number"
                                    maxLength="10"
                                    className="h-11 w-full rounded-lg border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-200"
                                    required
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-xs font-semibold text-gray-700">
                                    Resume
                                </label>

                                {!resumeFile ? (
                                    <div className="relative">
                                        <input
                                            type="file"
                                            accept=".pdf,.doc,.docx"
                                            onChange={handleFileChange}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        />
                                        <div className="h-11 w-full rounded-lg border border-gray-200 bg-white px-4 flex items-center gap-2 hover:border-purple-400 cursor-pointer transition">
                                            <Upload className="w-4 h-4 text-gray-400" />
                                            <span className="text-sm text-gray-400">Click to upload (PDF, DOC, DOCX)</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="h-11 w-full rounded-lg border border-green-300 bg-green-50 px-4 flex items-center justify-between">
                                        <div className="flex items-center gap-2 min-w-0">
                                            <FileText className="w-4 h-4 text-green-600 flex-shrink-0" />
                                            <span className="text-sm text-gray-700 truncate">
                                                {resumeFile.name}
                                            </span>
                                            <span className="text-xs text-gray-400 flex-shrink-0">
                                                ({formatFileSize(resumeFile.size)})
                                            </span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={removeResume}
                                            className="text-red-500 hover:text-red-700 transition flex-shrink-0 ml-2"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="relative">
                                <label className="mb-2 block text-xs font-semibold text-gray-700">
                                    Password
                                </label>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Create a password"
                                    className="h-11 w-full rounded-lg border border-gray-200 bg-white px-4 pr-12 text-sm text-gray-900 outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-200"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-[34px] text-gray-500 hover:text-gray-700 transition"
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                                <p className="text-[10px] text-gray-400 mt-1">
                                    Min 8 chars, 1 number, 1 special char, 1 uppercase & 1 lowercase
                                </p>
                            </div>

                            {error && (
                                <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="h-11 w-full rounded-lg bg-gradient-to-r from-[#322071] to-[#1B1138] text-sm font-semibold text-white shadow-[0_10px_25px_rgba(143,42,209,0.25)] disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg
                                            className="animate-spin h-5 w-5"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            />
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                            />
                                        </svg>
                                        Creating Account...
                                    </span>
                                ) : (
                                    "Create Account"
                                )}
                            </button>

                            <p className="text-center text-sm text-gray-600 pt-2">
                                Already have an account?{" "}
                                <Link
                                    to="/CandidateLogin"
                                    className="text-[#6A2767] hover:underline font-semibold"
                                >
                                    Sign In
                                </Link>
                            </p>
                        </form>
                    </div>
                </div>

                <div className="hidden w-1/2 md:block">
                    <div className="relative h-full w-full overflow-hidden">
                        <div className="relative flex h-full w-full items-center justify-center">
                            <img
                                src={img}
                                alt="Dashboard preview"
                                className="h-full w-full object-contain"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CandidateRegister;