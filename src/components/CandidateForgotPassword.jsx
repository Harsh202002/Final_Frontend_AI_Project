import React, { useMemo, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import img from "../img/login.png";
import logo from "../img/loginlogo.png";
import { baseUrl } from "../utils/ApiConstants";

const OTP_LENGTH = 6;

export default function CandidateForgotPassword() {
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");

    const [otp, setOtp] = useState(Array.from({ length: OTP_LENGTH }, () => ""));
    const otpRefs = useMemo(
        () => Array.from({ length: OTP_LENGTH }, () => React.createRef()),
        []
    );

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const otpValue = otp.join("");

    const setOtpAt = (index, value) => {
        if (value && !/^\d$/.test(value)) return;

        const next = [...otp];
        next[index] = value;
        setOtp(next);

        if (value && index < OTP_LENGTH - 1) {
            otpRefs[index + 1]?.current?.focus?.();
        }
    };

    const onOtpKeyDown = (index, e) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            otpRefs[index - 1]?.current?.focus?.();
        }
    };

    const onOtpPaste = (e) => {
        const text = e.clipboardData.getData("text").trim();
        if (!/^\d+$/.test(text)) return;

        const digits = text.slice(0, OTP_LENGTH).split("");
        if (!digits.length) return;

        e.preventDefault();
        const next = Array.from({ length: OTP_LENGTH }, (_, i) => digits[i] || "");
        setOtp(next);

        const lastIndex = Math.min(digits.length, OTP_LENGTH) - 1;
        setTimeout(() => otpRefs[lastIndex]?.current?.focus?.(), 0);
    };

    const validatePassword = (pw) => {
        if (pw.length < 8) return "Password must be at least 8 characters";
        if (!/[0-9]/.test(pw)) return "Password must contain at least one number";
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(pw))
            return "Password must contain at least one special character";
        if (!/[a-z]/.test(pw))
            return "Password must contain at least one lowercase letter";
        if (!/[A-Z]/.test(pw))
            return "Password must contain at least one uppercase letter";
        return "";
    };

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setError("");

        if (!email.trim()) {
            setError("Please enter your email");
            return;
        }

        setLoading(true);
        try {
            await axios.post(`${baseUrl}/candidate-forgot/forgot`, { email });
            setStep(2);
            setOtp(Array.from({ length: OTP_LENGTH }, () => ""));
            setTimeout(() => otpRefs[0]?.current?.focus?.(), 50);
        } catch (err) {
            setError(err?.response?.data?.message || "Failed to send OTP");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError("");

        if (otpValue.length !== OTP_LENGTH || otp.includes("")) {
            setError("Please enter the complete OTP");
            return;
        }

        setLoading(true);
        try {
            await axios.post(`${baseUrl}/candidate-forgot/validate-otp`, {
                email,
                otp: otpValue,
            });
            setStep(3);
        } catch (err) {
            setError(err?.response?.data?.message || "Invalid OTP");
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        setError("");
        setLoading(true);
        try {
            await axios.post(`${baseUrl}/candidate-forgot/forgot`, { email });
            setOtp(Array.from({ length: OTP_LENGTH }, () => ""));
            setTimeout(() => otpRefs[0]?.current?.focus?.(), 50);
        } catch (err) {
            setError(err?.response?.data?.message || "Failed to resend OTP");
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        const pwErr = validatePassword(password);
        if (pwErr) {
            setError(pwErr);
            return;
        }

        setLoading(true);
        try {
            await axios.post(`${baseUrl}/candidate-forgot/change-password`, {
                email,
                newPassword: password,
            });
            alert("Password Reset Done!");
            navigate("/CandidateLogin");
        } catch (err) {
            setError(err?.response?.data?.message || "Failed to change password");
        } finally {
            setLoading(false);
        }
    };

    const ProgressDots = ({ active = 1 }) => (
        <div className="mt-6 flex items-center justify-center gap-2">
            {[1, 2, 3].map((i) => (
                <span
                    key={i}
                    className={[
                        "h-2 w-2 rounded-full transition",
                        i === active ? "bg-[#7A1FA2]" : "bg-[#E6E6EA]",
                    ].join(" ")}
                />
            ))}
        </div>
    );

    return (
        <div className="min-h-screen">
            <div className="mx-auto flex min-h-screen max-w-[1200px] items-stretch gap-6 p-6">
                <div className="flex w-full flex-col rounded-md bg-white px-10 pb-8 md:w-1/2">
                    <div className="flex items-center gap-2 pt-8">
                        <div className="flex h-8 w-8 items-center justify-center">
                            <img src={logo} alt="logo" />
                        </div>
                        <span className="text-2xl font-bold tracking-tight text-[#6A2767]">
                            RecruterAI
                        </span>
                    </div>

                    <div className="flex flex-1 flex-col items-center justify-center">
                        {error ? (
                            <div className="mb-6 w-full max-w-[360px] rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-center text-sm text-red-700">
                                {error}
                            </div>
                        ) : null}

                        {step === 1 && (
                            <form onSubmit={handleSendOtp} className="w-full max-w-[360px]">
                                <h1 className="text-center text-2xl font-semibold text-[#111]">
                                    Forgot Password?
                                </h1>
                                <p className="mt-2 text-center text-sm text-gray-500">
                                    We will send you reset instructions
                                </p>

                                <div className="mt-10">
                                    <label className="mb-2 block text-xs font-semibold text-gray-700">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email"
                                        className="h-11 w-full rounded-lg border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-200"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="mt-6 h-11 w-full rounded-lg bg-gradient-to-r from-[#8F2AD1] to-[#4B135D] text-sm font-semibold text-white shadow-[0_10px_25px_rgba(143,42,209,0.25)] disabled:cursor-not-allowed disabled:opacity-70"
                                >
                                    {loading ? "Please wait..." : "Send OTP"}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => navigate("/CandidateLogin")}
                                    className="mt-5 flex w-full items-center justify-center gap-2 text-sm text-gray-600 hover:text-gray-900"
                                >
                                    <span className="text-base leading-none">←</span>
                                    <span>
                                        Back to <span className="text-[#7A1FA2]">Login</span>
                                    </span>
                                </button>

                                <ProgressDots active={1} />
                            </form>
                        )}

                        {step === 2 && (
                            <form onSubmit={handleVerifyOtp} className="w-full max-w-[360px]">
                                <h1 className="text-center text-2xl font-semibold text-[#111]">
                                    Password Reset
                                </h1>
                                <p className="mt-2 text-center text-sm text-gray-500">
                                    We have sent a code to{" "}
                                    <span className="text-gray-700">{email}</span>
                                </p>

                                <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                                    {otp.map((digit, idx) => (
                                        <input
                                            key={idx}
                                            ref={otpRefs[idx]}
                                            value={digit}
                                            onChange={(e) => setOtpAt(idx, e.target.value)}
                                            onKeyDown={(e) => onOtpKeyDown(idx, e)}
                                            onPaste={onOtpPaste}
                                            maxLength={1}
                                            inputMode="numeric"
                                            autoComplete="one-time-code"
                                            className="h-12 w-12 rounded-lg border border-gray-200 text-center text-xl font-semibold text-gray-900 outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-200"
                                        />
                                    ))}
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="mt-8 h-11 w-full rounded-lg bg-gradient-to-r from-[#8F2AD1] to-[#4B135D] text-sm font-semibold text-white shadow-[0_10px_25px_rgba(143,42,209,0.25)] disabled:cursor-not-allowed disabled:opacity-70"
                                >
                                    {loading ? "Verifying..." : "Verify OTP"}
                                </button>

                                <div className="mt-4 text-center text-sm text-gray-600">
                                    Didn't receive OTP?{" "}
                                    <button
                                        type="button"
                                        onClick={handleResendOtp}
                                        disabled={loading}
                                        className="font-medium text-[#7A1FA2] hover:underline disabled:opacity-60"
                                    >
                                        Resend
                                    </button>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => navigate("/CandidateLogin")}
                                    className="mt-5 flex w-full items-center justify-center gap-2 text-sm text-gray-600 hover:text-gray-900"
                                >
                                    <span className="text-base leading-none">←</span>
                                    <span>
                                        Back to <span className="text-[#7A1FA2]">Login</span>
                                    </span>
                                </button>

                                <ProgressDots active={2} />
                            </form>
                        )}

                        {step === 3 && (
                            <form
                                onSubmit={handleChangePassword}
                                className="w-full max-w-[360px]"
                            >
                                <h1 className="text-center text-2xl font-semibold text-[#111]">
                                    Set New Password
                                </h1>
                                <p className="mt-2 text-center text-sm text-gray-500">
                                    Must be at least 8 characters
                                </p>

                                <div className="mt-10 relative">
                                    <label className="mb-2 block text-xs font-semibold text-gray-700">
                                        New Password
                                    </label>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter New Password"
                                        className="h-11 w-full rounded-lg border border-gray-200 bg-white px-4 pr-12 text-sm text-gray-900 outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-200"
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
                                </div>

                                <div className="mt-5 relative">
                                    <label className="mb-2 block text-xs font-semibold text-gray-700">
                                        Confirm Password
                                    </label>
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Confirm Your Password"
                                        className="h-11 w-full rounded-lg border border-gray-200 bg-white px-4 pr-12 text-sm text-gray-900 outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-200"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-4 top-[34px] text-gray-500 hover:text-gray-700 transition"
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="mt-7 h-11 w-full rounded-lg bg-gradient-to-r from-[#8F2AD1] to-[#4B135D] text-sm font-semibold text-white shadow-[0_10px_25px_rgba(143,42,209,0.25)] disabled:cursor-not-allowed disabled:opacity-70"
                                >
                                    {loading ? "Changing..." : "Change Password"}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => navigate("/CandidateLogin")}
                                    className="mt-5 flex w-full items-center justify-center gap-2 text-sm text-gray-600 hover:text-gray-900"
                                >
                                    <span className="text-base leading-none">←</span>
                                    <span>
                                        Back to <span className="text-[#7A1FA2]">Login</span>
                                    </span>
                                </button>

                                <ProgressDots active={3} />
                            </form>
                        )}
                    </div>
                </div>

                <div className="hidden w-1/2 md:block">
                    <div className="relative h-full w-full overflow-hidden rounded-2xl">
                        <div className="relative flex h-full w-full items-center justify-center">
                            <img
                                src={img}
                                alt="Dashboard preview"
                                className="h-full w-full object-contain drop-shadow-[0_18px_40px_rgba(0,0,0,0.35)]"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}