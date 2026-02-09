import React, { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import axios from "axios";
import { baseUrl } from "../../utils/ApiConstants";
import NotificationBell from '../../components/NotificationBell';

const RMGHeader = ({ onMenuToggle }) => {
    const [user, setUser] = useState(null);
    const [dateTime, setDateTime] = useState("");

    const formatDateTime = () => {
        const now = new Date();

        const date = now.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });

        const time = now.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });

        return `${date} | ${time}`;
    };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get(`${baseUrl}/auth/meAll`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUser(res.data.data);
            } catch (err) {
                console.error("Error fetching user:", err);
            }
        };

        fetchUser();
        setDateTime(formatDateTime());
    }, []);

    return (
        <header className="bg-white border-b border-gray-200 px-2 sm:px-4 py-2 sm:py-3">
            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
                    <button
                        onClick={onMenuToggle}
                        className="lg:hidden p-1.5 sm:p-2 rounded hover:bg-gray-100 flex-shrink-0"
                    >
                        <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>

                    <div className="min-w-0">
                        <h2 className="text-xs sm:text-lg font-semibold text-gray-800 truncate">
                            Welcome, {user?.name?.split(' ')[0] || "..."}
                        </h2>
                        <p className="text-[9px] sm:text-sm text-gray-500">
                            {dateTime}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-1 sm:gap-4 flex-shrink-0">
                    <div className="scale-[0.8] sm:scale-100 origin-right">
                        {user && user._id && <NotificationBell userId={user._id} />}
                    </div>

                    <div className="border border-gray-200 rounded-lg p-1 sm:p-2 flex items-center gap-1 sm:gap-3 cursor-pointer hover:bg-gray-50">
                        <div className="w-6 h-6 sm:w-9 sm:h-9 bg-purple-500 rounded-full flex items-center justify-center text-white text-[10px] sm:text-sm font-semibold flex-shrink-0">
                            {user?.name ? user.name[0].toUpperCase() : "?"}
                        </div>

                        <div className="hidden min-[380px]:block min-w-0 max-w-[80px] sm:max-w-[120px]">
                            <span className="text-[10px] sm:text-sm font-medium text-gray-800 truncate block">
                                {user?.name || "Loading..."}
                            </span>
                            <span className="text-[8px] sm:text-xs text-gray-500 block">
                                {user?.role || "RMG"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default RMGHeader;