import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import RecruiterAdminSidebar from "./Component/RecruiterAdminSidebar";
import RecruiterAdminHeader from "./Component/RecruiterAdminHeader";

const RecruiterAdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex relative">
            <RecruiterAdminSidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />

            <div className="hidden lg:block w-64 flex-shrink-0" />

            <div className="flex-1 flex flex-col min-w-0">
                <div className="sticky top-0 z-[1000]">
                    <RecruiterAdminHeader onMenuToggle={toggleSidebar} />
                </div>

                <main className="p-4 lg:p-6 flex-1 relative z-0">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default RecruiterAdminLayout;