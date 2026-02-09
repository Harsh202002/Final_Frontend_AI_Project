import React, { useEffect, useState } from "react";
import img from "../img/cd.png";
import TF from "../img/TF.png";
import IF from "../img/IF.png";
import TU from "../img/TU.png";
import TA from "../img/TA.png";
import TAL from "../img/TAL.png";
import TFL from "../img/TFL.png";
import ISL from "../img/ISL.png";
import RDbanner from "../img/RD-banner.png";

import axios from "axios";
import { baseUrl } from "../utils/ApiConstants";
import IntelligentHiringHero from "./Component/IntelligentHiringAgent";

const RecruiterDashboard = () => {
    const [recentCandidates, setRecentCandidates] = useState([]);
    const [pieChartView, setPieChartView] = useState('total');
    const [user, setUser] = useState(null);
    const [assignedJDs, setAssignedJDs] = useState([]);
    const [createdJDs, setCreatedJDs] = useState([]);
    const [candidates, setCandidates] = useState([]);
    const [recentAssignedJDs, setRecentAssignedJDs] = useState([]);
    const [monthlyData, setMonthlyData] = useState([]);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [availableYears, setAvailableYears] = useState([]);
    const [hoveredBar, setHoveredBar] = useState(null);
    const [totalFiltered, setTotalFiltered] = useState(0);
    const [totalUnfiltered, setTotalUnfiltered] = useState(0);
    const [totalApplications, setTotalApplications] = useState(0);

    const stats = [
        {
            title: "Total Applicants",
            value: totalApplications,
            img: TA,
            text: "text-pink-600",
            line: TAL,
        },
        {
            title: "Total Filtered",
            value: totalFiltered,
            img: TF,
            text: "text-purple-600",
            line: TFL,
        },
        {
            title: "Total JD Created",
            value: createdJDs.length || 0,
            img: IF,
            text: "text-indigo-600",
            line: ISL,
        },
        {
            title: "Total Unfiltered",
            value: totalUnfiltered,
            img: TU,
            text: "text-pink-600",
            line: TAL,
        },
    ];

    const getAvailableYears = (assigned, created) => {
        const years = new Set();
        assigned.forEach(jd => {
            if (jd.createdAt) {
                years.add(new Date(jd.createdAt).getFullYear());
            }
        });
        created.forEach(jd => {
            if (jd.createdAt) {
                years.add(new Date(jd.createdAt).getFullYear());
            }
        });
        return Array.from(years).sort((a, b) => b - a);
    };

    const processMonthlyData = (assigned, created, year) => {
        const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
        const monthlyStats = months.map((month, index) => {
            const assignedCount = assigned.filter(jd => {
                if (!jd.createdAt) return false;
                const date = new Date(jd.createdAt);
                return date.getMonth() === index && date.getFullYear() === year;
            }).length;
            const createdCount = created.filter(jd => {
                if (!jd.createdAt) return false;
                const date = new Date(jd.createdAt);
                return date.getMonth() === index && date.getFullYear() === year;
            }).length;
            return {
                month,
                monthIndex: index,
                assigned: assignedCount,
                created: createdCount,
                year
            };
        });
        return monthlyStats;
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
    };

    const getRecentAssignedJDs = (jds) => {
        return [...jds]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 4);
    };

    const getPieChartData = () => {
        if (pieChartView === 'monthly') {
            const currentMonth = new Date().getMonth();
            const currentYear = new Date().getFullYear();

            const monthlyAssigned = assignedJDs.filter(jd => {
                if (!jd.createdAt) return false;
                const date = new Date(jd.createdAt);
                return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
            }).length;

            const monthlyCreated = createdJDs.filter(jd => {
                if (!jd.createdAt) return false;
                const date = new Date(jd.createdAt);
                return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
            }).length;

            const total = monthlyAssigned + monthlyCreated;
            if (total === 0) return { assignedPercent: 50, createdPercent: 50, total: 0 };
            const assignedPercent = Math.round((monthlyAssigned / total) * 100);
            const createdPercent = 100 - assignedPercent;
            return { assignedPercent, createdPercent, total };
        } else {
            const totalAssigned = assignedJDs.length;
            const totalCreated = createdJDs.length;
            const total = totalAssigned + totalCreated;
            if (total === 0) return { assignedPercent: 50, createdPercent: 50, total: 0 };
            const assignedPercent = Math.round((totalAssigned / total) * 100);
            const createdPercent = 100 - assignedPercent;
            return { assignedPercent, createdPercent, total };
        }
    };

    const getYearTotals = () => {
        const assignedTotal = monthlyData.reduce((sum, m) => sum + m.assigned, 0);
        const createdTotal = monthlyData.reduce((sum, m) => sum + m.created, 0);
        return { assignedTotal, createdTotal };
    };

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const token = localStorage.getItem("token");
                const [
                    candidatesRes,
                    assignedOffersRes,
                    jdByRecruiterRes
                ] = await Promise.all([
                    axios.get(`${baseUrl}/jd/all-candidates`, {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    axios.get(`${baseUrl}/jd/assigned-offers/hr`, {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    axios.get(`${baseUrl}/jd/created-by/hr`, {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                ]);

                const assignedData = assignedOffersRes.data.success ? assignedOffersRes.data.data || [] : [];
                const createdData = jdByRecruiterRes.data.success ? jdByRecruiterRes.data.data || [] : [];
                if (candidatesRes.data.success) {
                    setCandidates(candidatesRes.data.data || []);
                }
                setAssignedJDs(assignedData);
                setRecentAssignedJDs(getRecentAssignedJDs(assignedData));
                setCreatedJDs(createdData);
                const years = getAvailableYears(assignedData, createdData);
                setAvailableYears(years);
                const currentYear = new Date().getFullYear();
                const yearToSelect = years.includes(currentYear) ? currentYear : (years[0] || currentYear);
                setSelectedYear(yearToSelect);
                const monthly = processMonthlyData(assignedData, createdData, yearToSelect);
                setMonthlyData(monthly);
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            }
        };
        fetchAllData();
    }, []);

    useEffect(() => {
        if (assignedJDs.length > 0 || createdJDs.length > 0) {
            const monthly = processMonthlyData(assignedJDs, createdJDs, selectedYear);
            setMonthlyData(monthly);
        }
    }, [selectedYear, assignedJDs, createdJDs]);

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
    }, []);

    useEffect(() => {
        const fetchRecentCandidates = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get(`${baseUrl}/offer/latest-candidates`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (res.data.success) {
                    const allCandidates = res.data.data || [];

                    const recent5 = allCandidates.slice(-5);
                    setRecentCandidates(recent5);

                    setTotalApplications(allCandidates.length);
                    setTotalFiltered(allCandidates.filter(c => c.status === 'filtered').length);
                    setTotalUnfiltered(allCandidates.filter(c => c.status === 'unfiltered').length);
                }
            } catch (err) {
                console.error("Error fetching recent candidates:", err);
            }
        };
        fetchRecentCandidates();
    }, []);

    const pieData = getPieChartData();
    const yearTotals = getYearTotals();

    const pieSize = 200;
    const pieCenter = pieSize / 2;
    const outerRadius = 80;
    const innerRadius = 62;
    const strokeOuter = 10;
    const strokeInner = 10;
    const outerCircumference = 2 * Math.PI * outerRadius;
    const innerCircumference = 2 * Math.PI * innerRadius;

    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);

    const todayJDs = assignedJDs.filter(jd => {
        if (!jd.dueDate) return false;
        const d = new Date(jd.dueDate);
        d.setHours(0, 0, 0, 0);
        return d.getTime() === todayDate.getTime();
    });

    const upcomingJDs = assignedJDs
        .filter(jd => {
            if (!jd.dueDate) return false;
            const d = new Date(jd.dueDate);
            d.setHours(0, 0, 0, 0);
            return d.getTime() > todayDate.getTime();
        })
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
        .slice(0, 3);

    const renderJDItem = (jd, index, isToday = false) => {
        const colorClasses = ['bg-purple-500', 'bg-blue-500', 'bg-pink-500'];
        const colorClass = isToday ? 'bg-purple-600' : colorClasses[index % colorClasses.length];

        return (
            <div key={jd._id} className="flex gap-4 py-3 mb-2">
                <div className={`w-1.5 rounded-full ${colorClass} flex-shrink-0`}></div>
                <div className="flex items-center gap-6 flex-1">
                    <h4 className="font-medium text-gray-800 text-sm w-[180px] truncate flex-shrink-0" title={jd.jobTitle}>
                        {jd.jobTitle}
                    </h4>
                    <div className="flex-shrink-0 w-[80px]">
                        <span className="text-gray-400 text-xs block">Experience</span>
                        <span className="text-sm text-gray-600">{jd.experience || 'N/A'}</span>
                    </div>
                    <div className="flex-shrink-0">
                        <span className="text-gray-400 text-xs block">Timeline</span>
                        <span className="text-sm text-gray-600 whitespace-nowrap">
                            {formatDate(jd.createdAt)} - {formatDate(jd.dueDate)}
                        </span>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen">
            <div className="relative w-full mb-6 overflow-hidden rounded-xl shadow-sm">
                <img
                    src={RDbanner}
                    alt="Dashboard Banner"
                    className="w-full h-32 sm:h-40 md:h-48 lg:h-56 xl:h-auto object-cover"
                />
                <div className="absolute inset-0 flex flex-col justify-center px-4 sm:px-6 md:px-8 lg:px-12 text-white">
                    <p className="text-xs sm:text-sm md:text-base opacity-90 mb-0.5 sm:mb-1">
                        {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                    <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold mb-1 sm:mb-2">
                        {(() => {
                            const hour = new Date().getHours();
                            if (hour < 12) return "Good Morning";
                            if (hour < 18) return "Good Afternoon";
                            return "Good Evening";
                        })()}, {user?.name ? user.name.split(' ')[0] : 'Recruiter'}!
                    </h1>
                    <p className="text-xs sm:text-sm md:text-base opacity-90 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg leading-relaxed hidden sm:block">
                        Turn hiring chaos into high-fives with <br className="hidden md:block" />
                        smarter, faster recruiting
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <div className="flex flex-col gap-5">
                    {stats.slice(0, 2).map((item, i) => (
                        <div
                            key={i}
                            className="bg-white rounded-xl p-5 shadow-sm flex flex-col justify-between flex-1"
                        >
                            <div className="flex justify-between items-center">
                                <p className="text-gray-500 text-2xl w-30">{item.title}</p>
                                <img src={item.img} alt="" />
                            </div>
                            <div className="flex justify-between items-center mt-2">
                                <h2 className={`text-4xl font-bold ${item.text}`}>
                                    {item.value}
                                </h2>
                                <img src={item.line} alt="" className="h-10 object-contain" />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col gap-5">
                    {stats.slice(2, 4).map((item, i) => (
                        <div
                            key={i}
                            className="bg-white rounded-xl p-5 shadow-sm flex flex-col justify-between flex-1"
                        >
                            <div className="flex justify-between items-center">
                                <p className="text-gray-500 text-2xl w-30">{item.title}</p>
                                <img src={item.img} alt="" />
                            </div>
                            <div className="flex justify-between items-center mt-2">
                                <h2 className={`text-4xl font-bold ${item.text}`}>
                                    {item.value}
                                </h2>
                                <img src={item.line} alt="" className="h-10 object-contain" />
                            </div>
                        </div>
                    ))}
                </div>

                <div
                    style={{
                        width: "100%",
                        background: "#fff",
                        borderRadius: 18,
                        padding: 20,
                        boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
                        fontFamily: "Inter, sans-serif",
                    }}
                >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <h3 style={{ fontSize: 18, fontWeight: 600 }}>JD Distribution</h3>
                        <select
                            value={pieChartView}
                            onChange={(e) => setPieChartView(e.target.value)}
                            style={{
                                border: "1px solid #e5e7eb",
                                borderRadius: 10,
                                padding: "6px 14px",
                                fontSize: 13,
                                backgroundColor: "#fff",
                                cursor: "pointer",
                                outline: "none"
                            }}
                        >
                            <option value="total">Total</option>
                            <option value="monthly">This Month</option>
                        </select>
                    </div>

                    <div style={{ position: "relative", display: "flex", justifyContent: "center", margin: "30px 0" }}>
                        <svg width={pieSize} height={pieSize}>
                            <circle cx={pieCenter} cy={pieCenter} r={outerRadius} stroke="#fde6ea" strokeWidth={strokeOuter} fill="none" />
                            <circle
                                cx={pieCenter}
                                cy={pieCenter}
                                r={outerRadius}
                                stroke="#F7789B"
                                strokeWidth={strokeOuter}
                                fill="none"
                                strokeLinecap="round"
                                strokeDasharray={outerCircumference}
                                strokeDashoffset={outerCircumference - (pieData.createdPercent / 100) * outerCircumference}
                                transform={`rotate(-90 ${pieCenter} ${pieCenter})`}
                            />
                            <circle cx={pieCenter} cy={pieCenter} r={innerRadius} stroke="#e9ecff" strokeWidth={strokeInner} fill="none" />
                            <circle
                                cx={pieCenter}
                                cy={pieCenter}
                                r={innerRadius}
                                stroke="#5B6CFF"
                                strokeWidth={strokeInner}
                                fill="none"
                                strokeLinecap="round"
                                strokeDasharray={innerCircumference}
                                strokeDashoffset={innerCircumference - (pieData.assignedPercent / 100) * innerCircumference}
                                transform={`rotate(-90 ${pieCenter} ${pieCenter})`}
                            />
                        </svg>
                        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center" }}>
                            <div style={{ fontSize: 14, color: "#6b7280" }}>
                                {pieChartView === 'monthly' ? 'This Month' : 'Total JD'}
                            </div>
                            <div style={{ fontSize: 28, fontWeight: 700 }}>{pieData.total}</div>
                        </div>
                    </div>

                    <div style={{ display: "flex", justifyContent: "center", gap: 30, fontSize: 14 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span className="w-8 h-3 rounded-full bg-indigo-400"></span>

                            Others <b>{pieData.assignedPercent}%</b>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span className="w-8 h-3 rounded-full bg-rose-400"></span>
                            {user?.name || 'User'} <b>{pieData.createdPercent}%</b>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 mt-6">
                <div className="lg:col-span-3 bg-white rounded-xl p-6 shadow-sm h-[320px]">
                    <div className="flex flex-wrap justify-between items-center mb-6">
                        <div className="flex items-center gap-3">
                            <h3 className="text-lg font-semibold">All Job Descriptions</h3>
                            <select
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(Number(e.target.value))}
                                className="border rounded-md text-sm px-3 py-1.5 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                {availableYears.length > 0 ? (
                                    availableYears.map(year => (
                                        <option key={year} value={year}>{year}</option>
                                    ))
                                ) : (
                                    <option value={new Date().getFullYear()}>{new Date().getFullYear()}</option>
                                )}
                            </select>
                        </div>
                        <div className="flex gap-4 text-sm">
                            <div className="flex items-center gap-2">
                                <span className="w-6 h-2 rounded-full bg-indigo-400"></span>
                                Assigned JD ({yearTotals.assignedTotal})
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-6 h-2 rounded-full bg-rose-400"></span>
                                Created JD ({yearTotals.createdTotal})
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <div className="flex min-w-[650px]">
                            <div className="flex flex-col justify-between h-48 pr-3 text-right text-xs text-gray-400 font-medium">
                                <span className="-mt-2">100</span>
                                <span className="-mt-2">75</span>
                                <span className="-mt-2">50</span>
                                <span className="-mt-2">25</span>
                                <span className="-mb-2">0</span>
                            </div>

                            <div className="flex-1 relative h-48">
                                <div className="absolute inset-0 w-full h-full pointer-events-none">
                                    <div className="absolute bottom-0 w-full border-b border-gray-100"></div>   {/* 0% Line */}
                                    <div className="absolute bottom-[25%] w-full border-b border-gray-100"></div> {/* 25% Line */}
                                    <div className="absolute bottom-[50%] w-full border-b border-gray-100"></div> {/* 50% Line */}
                                    <div className="absolute bottom-[75%] w-full border-b border-gray-100"></div> {/* 75% Line */}
                                    <div className="absolute top-0 w-full border-b border-gray-100"></div>        {/* 100% Line */}
                                </div>

                                <div className="flex items-end justify-between h-full relative z-10 px-2">
                                    {(monthlyData.length > 0 ? monthlyData :
                                        ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"].map(month => ({ month, assigned: 0, created: 0 }))
                                    ).map((item, i) => {

                                        let assignedHeight = item.assigned;
                                        let createdHeight = item.created;

                                        if (assignedHeight > 100) assignedHeight = 100;
                                        if (createdHeight > 100) createdHeight = 100;

                                        const isHovered = hoveredBar === i;

                                        return (
                                            <div
                                                key={i}
                                                className="flex flex-col items-center gap-2 flex-1 h-full relative cursor-pointer group"
                                                onMouseEnter={() => setHoveredBar(i)}
                                                onMouseLeave={() => setHoveredBar(null)}
                                            >
                                                {/* Tooltip */}
                                                {isHovered && (
                                                    <div className="absolute bottom-full mb-2 bg-gray-800 text-white text-xs rounded-lg px-3 py-2 z-20 shadow-lg whitespace-nowrap">
                                                        <div className="font-semibold mb-1">{item.month} {selectedYear}</div>
                                                        <div>Assigned: {item.assigned}</div>
                                                        <div>Created: {item.created}</div>
                                                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                                                    </div>
                                                )}

                                                <div className="flex items-end gap-1 justify-center w-full h-full pb-[1px]"> {/* pb-1px aligns bar to 0 line visually */}
                                                    <div
                                                        style={{ height: `${assignedHeight}%` }}
                                                        className={`w-3 md:w-4 rounded-t-md transition-all duration-300 ${isHovered ? 'bg-indigo-500' : 'bg-indigo-400'}`}
                                                    ></div>

                                                    <div
                                                        style={{ height: `${createdHeight}%` }}
                                                        className={`w-3 md:w-4 rounded-t-md transition-all duration-300 ${isHovered ? 'bg-rose-500' : 'bg-rose-400'}`}
                                                    ></div>
                                                </div>

                                                <span className={`text-[10px] sm:text-xs absolute -bottom-6 ${isHovered ? 'text-gray-800 font-bold' : 'text-gray-400'}`}>
                                                    {item.month}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm h-[320px] flex flex-col">
                    <h3 className="text-lg font-semibold mb-4">Calendar</h3>
                    <div className="overflow-x-auto overflow-y-auto pb-2 flex-1">
                        <div className="min-w-[500px]">
                            {todayJDs.length > 0 && (
                                <div className="mb-4">
                                    <h4 className="text-gray-400 text-sm mb-3">Today</h4>
                                    {todayJDs.map((jd, index) => renderJDItem(jd, index, true))}
                                </div>
                            )}
                            <div>
                                <h4 className="text-gray-400 text-sm mb-3">Upcoming</h4>
                                {upcomingJDs.length > 0 ? (
                                    upcomingJDs.map((jd, index) => renderJDItem(jd, index))
                                ) : (
                                    <div className="text-gray-400 text-sm italic py-2">No upcoming JDs</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 mt-8">
                <div className="flex-shrink-0 mx-auto">
                    <IntelligentHiringHero />
                </div>

                <div className="flex-1 min-w-0 bg-white rounded-2xl shadow-sm p-4 overflow-hidden">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold">Candidates</h3>
                        <button className="text-indigo-500 text-sm hover:underline">View All</button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm min-w-[900px] table-auto border-collapse">
                            <thead>
                                <tr className="text-left text-gray-500 border-b">
                                    <th className="py-3 px-4">Name</th>
                                    <th className="py-3 px-4">Phone No.</th>
                                    <th className="py-3 px-4">Job Title</th>
                                    <th className="py-3 px-4">Skills</th>
                                    <th className="py-3 px-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {recentCandidates.length > 0 ? (
                                    recentCandidates.map((item, i) => (
                                        <tr key={item.candidateId + i} className="hover:bg-gray-50">
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0 ${i % 2 === 0 ? "bg-pink-400" : "bg-indigo-400"}`}>
                                                        {item.name?.split(" ").map(n => n[0]).join("") || "?"}
                                                    </div>
                                                    <span className="whitespace-nowrap">{item.name || "N/A"}</span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 whitespace-nowrap">{item.phone || "N/A"}</td>
                                            <td className="py-3 px-4 whitespace-nowrap">{item.jobTitle || "N/A"}</td>
                                            <td className="py-3 px-4">
                                                <div className="flex flex-wrap gap-1.5">
                                                    {item.skills && item.skills.length > 0 ? (
                                                        (() => {
                                                            const allSkills = item.skills
                                                                .flatMap(skill =>
                                                                    typeof skill === 'string'
                                                                        ? skill.split(',').map(s => s.trim()).filter(s => s.length > 0)
                                                                        : [skill]
                                                                );

                                                            return (
                                                                <>
                                                                    {allSkills.slice(0, 3).map((skill, idx) => (
                                                                        <span
                                                                            key={idx}
                                                                            className={`px-2 py-0.5 rounded-full text-xs ${i % 2 === 0 ? "bg-pink-100 text-pink-600" : "bg-indigo-100 text-indigo-600"}`}
                                                                        >
                                                                            {skill}
                                                                        </span>
                                                                    ))}
                                                                    {allSkills.length > 3 && (
                                                                        <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600">
                                                                            +{allSkills.length - 3}
                                                                        </span>
                                                                    )}
                                                                </>
                                                            );
                                                        })()
                                                    ) : (
                                                        <span className="text-gray-400">No skills</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-2 whitespace-nowrap">
                                                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${item.status === "filtered" ? "bg-green-500" : "bg-red-500"}`}></span>
                                                    <span className={`capitalize ${item.status === "filtered" ? "text-green-600" : "text-red-500"}`}>
                                                        {item.status || "Unknown"}
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="py-8 text-center text-gray-400">
                                            No recent candidates found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecruiterDashboard;