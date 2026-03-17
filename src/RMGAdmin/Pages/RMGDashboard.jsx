import heroImage from "../../assets/Frame.png";
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar
} from 'recharts';
import ISL from "../../img/ISL.png"
import TFL from "../../img/TFL.png"
import TAL from "../../img/TAL.png"
import TA from "../../img/TA.png"
import TC from "../../img/TC.png"
import MS from "../../img/MS.png"
import PO from "../../img/PO.png"
import { baseUrl } from "../../utils/ApiConstants";
import axios from "axios";
import React, { useEffect, useState } from "react";

function RMGDashboard() {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const now = new Date();

    const [stats, setStats] = useState([
        { title: "Total Requisition", value: 0, line: TAL, img: TA, text: "text-green-600" },
        { title: "Total JDs Created", value: 0, line: ISL, img: TC, text: "text-red-600" },
        { title: "Monthly Recruiter Assigned", value: 0, line: TFL, img: MS, text: "text-green-600" },
        { title: "Pending Offers", value: 0, line: TAL, img: PO, text: "text-green-600" },
    ]);

    const [trendData, setTrendData] = useState([]);
    const [trendTotals, setTrendTotals] = useState({ candidates: 0, jd: 0, allHr: 0 });
    const [jdAssignedCreatedData, setJdAssignedCreatedData] = useState([]);
    const [priorityData, setPriorityData] = useState([
        { priority_level: "Low", count: 0, color: "bg-indigo-200" },
        { priority_level: "Medium", count: 0, color: "bg-indigo-300" },
        { priority_level: "High", count: 0, color: "bg-indigo-400" },
        { priority_level: "Critical", count: 0, color: "bg-indigo-500" },
    ]);

    const [jdGenerationData, setJdGenerationData] = useState({ roles: [], data: [] });
    const [allOffersData, setAllOffersData] = useState([]);
    const [allCandidatesData, setAllCandidatesData] = useState([]);
    const [allRecentJobsData, setAllRecentJobsData] = useState([]);

    const [jdGenerationMonthFilter, setJdGenerationMonthFilter] = useState("all");
    const [priorityMonthFilter, setPriorityMonthFilter] = useState("all");
    const [user, setUser] = useState({ name: "", role: "RMG" });

    const formatDate = (date) => date ? new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "N/A";

    const getGreeting = () => {
        const hour = now.getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 17) return "Good Afternoon";
        return "Good Evening";
    };

    const getColor = (count) => {
        if (count >= 10) return "bg-cyan-600";
        if (count >= 7) return "bg-cyan-500";
        if (count >= 5) return "bg-cyan-400";
        if (count >= 3) return "bg-cyan-300";
        if (count > 0) return "bg-cyan-200";
        return "bg-gray-100";
    };

    const filterFor2026 = (dateString) => {
        const date = new Date(dateString);
        return date.getFullYear() === 2026;
    };

    const getMonthFromDate = (dateString) => {
        const date = new Date(dateString);
        return date.getMonth() + 1;
    };

    const processJdGenerationData = (offers, monthFilter) => {
        const offers2026 = offers.filter(offer => filterFor2026(offer.createdAt));
        const filteredOffers = monthFilter === "all"
            ? offers2026
            : offers2026.filter(offer => getMonthFromDate(offer.createdAt) === parseInt(monthFilter));

        const jobTitleMonthMap = {};
        filteredOffers.forEach(offer => {
            if (offer.isJDCreated) {
                const title = offer.jobTitle;
                const month = getMonthFromDate(offer.createdAt);
                if (!jobTitleMonthMap[title]) {
                    jobTitleMonthMap[title] = {};
                    months.forEach((_, idx) => {
                        jobTitleMonthMap[title][idx + 1] = 0;
                    });
                }
                jobTitleMonthMap[title][month]++;
            }
        });

        const sortedTitles = Object.entries(jobTitleMonthMap)
            .map(([title, monthData]) => ({
                title,
                monthData,
                total: Object.values(monthData).reduce((a, b) => a + b, 0)
            }))
            .sort((a, b) => b.total - a.total)
            .slice(0, 5);

        const roles = sortedTitles.map(item => item.title);
        const data = sortedTitles.map(item => ({
            monthlyData: months.map((month, idx) => ({
                month,
                count: item.monthData[idx + 1] || 0
            }))
        }));

        return { roles, data };
    };

    const processTrendData = (offersData, candidateData) => {
        const monthlyTrendMap = {};
        months.forEach((month, index) => {
            monthlyTrendMap[index + 1] = { name: month.toUpperCase(), candidates: 0, jd: 0, allHr: 0 };
        });

        const offers2026 = offersData.filter(offer => filterFor2026(offer.createdAt));
        offers2026.forEach(offer => {
            const month = getMonthFromDate(offer.createdAt);
            if (monthlyTrendMap[month]) {
                monthlyTrendMap[month].candidates += 1;
            }
        });

        offers2026.filter(o => o.isJDCreated).forEach(offer => {
            const month = getMonthFromDate(offer.createdAt);
            if (monthlyTrendMap[month]) {
                monthlyTrendMap[month].jd += 1;
            }
        });

        const candidates2026 = candidateData.filter(c => filterFor2026(c.createdAt));
        candidates2026.forEach(candidate => {
            const month = getMonthFromDate(candidate.createdAt);
            if (monthlyTrendMap[month]) {
                monthlyTrendMap[month].allHr += 1;
            }
        });

        const trendDataArray = Object.values(monthlyTrendMap);
        const totals = trendDataArray.reduce((acc, item) => {
            acc.candidates += item.candidates;
            acc.jd += item.jd;
            acc.allHr += item.allHr;
            return acc;
        }, { candidates: 0, jd: 0, allHr: 0 });

        return { trendDataArray, totals };
    };

    const processJdAssignedCreated = (currentOffersData, recentJobsData) => {
        const jdAssignedCreatedMap = {};
        months.forEach((month, index) => {
            jdAssignedCreatedMap[index + 1] = { name: month.substring(0, 3).toUpperCase(), Assigned: 0, Created: 0 };
        });

        const offers2026 = currentOffersData.filter(offer => filterFor2026(offer.createdAt));
        offers2026.forEach(offer => {
            const month = getMonthFromDate(offer.createdAt);
            if (jdAssignedCreatedMap[month]) {
                jdAssignedCreatedMap[month].Assigned += 1;
            }
        });

        const jobs2026 = recentJobsData.filter(job => filterFor2026(job.createdAt));
        jobs2026.forEach(job => {
            const month = getMonthFromDate(job.createdAt);
            if (jdAssignedCreatedMap[month]) {
                jdAssignedCreatedMap[month].Created += 1;
            }
        });

        return Object.values(jdAssignedCreatedMap);
    };

    const processPriorityData = (offersData, monthFilter) => {
        const offers2026 = offersData.filter(offer => filterFor2026(offer.createdAt));
        const filteredOffers = monthFilter === "all"
            ? offers2026
            : offers2026.filter(offer => getMonthFromDate(offer.createdAt) === parseInt(monthFilter));

        const priorityCounts = { Low: 0, Medium: 0, High: 0, Critical: 0 };
        filteredOffers.forEach(offer => {
            const priority = offer.priority;
            if (priorityCounts.hasOwnProperty(priority)) {
                priorityCounts[priority]++;
            }
        });

        return [
            { priority_level: "Low", count: priorityCounts.Low, color: "bg-indigo-200" },
            { priority_level: "Medium", count: priorityCounts.Medium, color: "bg-indigo-300" },
            { priority_level: "High", count: priorityCounts.High, color: "bg-indigo-400" },
            { priority_level: "Critical", count: priorityCounts.Critical, color: "bg-indigo-500" },
        ];
    };

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const token = localStorage.getItem("token");

                const [
                    offersRes,
                    currentOffersRes,
                    recentJobsRes,
                    recruitersClosedRes,
                    candidatelistRes
                ] = await Promise.all([
                    axios.get(`${baseUrl}/dashboard/total-offers`, { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get(`${baseUrl}/dashboard/current-offers`, { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get(`${baseUrl}/dashboard/HR-jobs`, { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get(`${baseUrl}/dashboard/getAll-recruiters-closed`, { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get(`${baseUrl}/jd/all-candidates`, { headers: { Authorization: `Bearer ${token}` } }),
                ]);

                const offers = currentOffersRes.data.offers || [];
                const recentJobsList = recentJobsRes.data.allJobs || [];
                const candidatesList = candidatelistRes.data.data || [];

                setAllOffersData(offers);
                setAllCandidatesData(candidatesList);
                setAllRecentJobsData(recentJobsList);

                const totalRecruitersAssigned = recruitersClosedRes.data.recruiterData?.length || 0;
                const totalJDsCreated = offersRes.data.totalOffers || 0;
                const totalJDsAssigned = offers.length;
                const pendingOffers = Math.max(0, totalJDsAssigned - totalJDsCreated);

                setStats([
                    { title: "Total Requisition", value: totalJDsAssigned, line: TAL, img: TA, text: "text-green-600" },
                    { title: "Total JDs Created", value: totalJDsCreated, line: ISL, img: TC, text: "text-red-600" },
                    { title: "Monthly Recruiter Assigned", value: totalRecruitersAssigned, line: TFL, img: MS, text: "text-green-600" },
                    { title: "Pending Requisitions", value: pendingOffers, line: TAL, img: PO, text: "text-green-600" },
                ]);

                setPriorityData(processPriorityData(offers, "all"));

                const { trendDataArray, totals } = processTrendData(offers, candidatesList);
                setTrendData(trendDataArray);
                setTrendTotals(totals);

                setJdAssignedCreatedData(processJdAssignedCreated(offers, recentJobsList));
                setJdGenerationData(processJdGenerationData(offers, "all"));

            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            }
        };

        fetchAllData();
    }, []);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get(`${baseUrl}/auth/meAll`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (res.data.success && res.data.data) {
                    setUser({
                        name: res.data.data.name || "",
                        role: res.data.data.role || "RMG"
                    });
                }
            } catch (err) {
                console.error("Error fetching user:", err);
            }
        };
        fetchUser();
    }, []);

    useEffect(() => {
        if (allOffersData.length > 0) {
            setJdGenerationData(processJdGenerationData(allOffersData, jdGenerationMonthFilter));
        }
    }, [jdGenerationMonthFilter, allOffersData]);

    useEffect(() => {
        if (allOffersData.length > 0) {
            setPriorityData(processPriorityData(allOffersData, priorityMonthFilter));
        }
    }, [priorityMonthFilter, allOffersData]);

    const MonthDropdown = ({ value, onChange }) => (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="text-xs border border-gray-200 rounded-full px-3 py-1.5 text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200"
        >
            <option value="all">All Months</option>
            {months.map((month, index) => (
                <option key={index} value={index + 1}>{month} 2026</option>
            ))}
        </select>
    );

    const getInitialsColor = (index) => {
        const colors = ["bg-blue-500", "bg-pink-500", "bg-purple-500", "bg-indigo-500", "bg-teal-500"];
        return colors[index % colors.length];
    };

    return (
        <div className="min-h-screen text-black space-y-6">
            <div className="grid gap-4 sm:gap-6 lg:grid-cols-5">

                {/* Banner */}
                <div className="relative h-40 sm:h-48 lg:h-60 w-full overflow-hidden rounded-xl sm:rounded-2xl lg:col-span-3">
                    <img src={heroImage} alt="Dashboard Banner" className="h-full w-full object-cover" />
                    <div className="absolute inset-0 flex flex-col p-4 sm:p-6 md:p-8">
                        <p className="mb-1 text-[10px] sm:text-xl text-black">{formatDate(now)}</p>
                        <h1 className=" text-xl font-bold text-black sm:text-4xl lg:text-5xl">
                            {getGreeting()}, {user?.name}!
                        </h1>
                        <p className="mt-1 max-w-[200px] text-[10px] text-black sm:max-w-xs sm:text-sm">
                            Run the show effortlessly with smarter controls and happy workflows
                        </p>

                        <button className=" m-2 px-2 w-52 py-2 bg-[#59459F] rounded-sm"> See All Job Requisitions</button>
                    </div>
                </div>


                {/* JD */}
                <div className="lg:col-span-2 bg-white rounded-xl sm:rounded-2xl p-2 sm:p-2 shadow-sm border border-gray-100 h-full flex flex-col">
                    <div className="flex flex-row justify-between items-center mb-8">
                        <h3 className="text-xl font-bold text-gray-900">JD Priority</h3>
                        <MonthDropdown value={priorityMonthFilter} onChange={setPriorityMonthFilter} />
                    </div>

                    <div className="flex-1 flex gap-4 h-64">
                        {/* Y-Axis Labels */}
                        <div className="flex flex-col justify-between text-gray-400 text-xs sm:text-sm pb-8 pt-2">
                            <span>100</span>
                            <span>80</span>
                            <span>60</span>
                            <span>40</span>
                            <span>20</span>
                            <span>0</span>
                        </div>

                        {/* Bars Container */}
                        <div className="flex-1 flex items-end justify-around gap-2 sm:gap-6 px-2">
                            {priorityData.map((item, index) => {
                                const maxCount = Math.max(...priorityData.map((d) => d.count), 1);
                                const heightPercentage = maxCount > 0 ? (item.count / maxCount) * 100 : 0;

                                // Color mapping based on design gradients
                                const gradients = {
                                    low: "bg-gradient-to-t from-[#B6A1FF] to-[#9D85FF]",
                                    medium: "bg-gradient-to-t from-[#A6D9FF] to-[#7DB9FF]",
                                    high: "bg-gradient-to-t from-[#FF9ECB] to-[#FF7EB3]",
                                    critical: "bg-gradient-to-t from-[#FFE1A8] to-[#FFAC6B]",
                                };

                                const level = item.priority_level.toLowerCase();

                                return (
                                    <div key={index} className="flex-1 flex flex-col items-center gap-4 h-full">
                                        <div className="w-full flex-1 flex items-end justify-center group pt-6">
                                            <div className="relative w-full h-full flex items-end justify-center" style={{ maxWidth: "50px" }}>
                                                {/* Background Striped Bar (The 'Track') */}
                                                <div
                                                    className="absolute inset-0 w-full h-full rounded-2xl opacity-[0.05]"
                                                    style={{
                                                        backgroundColor: '#000',
                                                        backgroundImage: 'linear-gradient(45deg, #000 25%, transparent 25%, transparent 50%, #000 50%, #000 75%, transparent 75%, transparent)',
                                                        backgroundSize: '10px 10px',
                                                    }}
                                                />

                                                {/* Actual Progress Bar */}
                                                <div
                                                    className={`w-full ${gradients[level] || gradients.low} rounded-2xl transition-all duration-500 relative z-10`}
                                                    style={{
                                                        height: `${heightPercentage}%`,
                                                    }}
                                                >
                                                    {/* Hover Tooltip */}
                                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-2 py-1 rounded opacity-0 flex group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">
                                                        {item.count} Jobs
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Label */}
                                        <span className="text-xs sm:text-sm text-gray-500 font-medium h-6 text-center capitalize">
                                            {item.priority_level}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>


            </div>


            {/* //middle banners */}
            <div className="grid grid-cols-1 min-[480px]:grid-cols-4 gap-4 lg:col-span-2">
                {stats.map((stat, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-[1rem] p-5 md:p-6 shadow-sm border border-gray-50 flex flex-col justify-between min-h-[140px] transition-all hover:shadow-md"
                    >
                        {/* Top Row: Title */}
                        <div className="flex justify-between items-start">
                            <p className="text-gray-500 text-sm md:text-base lg:text-lg font-medium leading-tight">
                                {stat.title}
                            </p>
                            {stat.img && (
                                <img src={stat.img} alt="" className="h-8 w-8 object-contain flex-shrink-0" />
                            )}
                        </div>

                        {/* Bottom Row: Value and Trend Line */}
                        <div className="flex justify-between items-end mt-4">
                            <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight ${stat.text}`}>
                                {stat.value}
                            </h2>

                            {/* Trend Line / Graph Area */}
                            <div className="flex-shrink-0">
                                <img
                                    src={stat.line}
                                    alt=""
                                    className="h-8 md:h-10 w-auto object-contain opacity-80"
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">





                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
                    <div className="flex justify-between items-center mb-6 flex-wrap gap-3 max-lg:flex-col">
                        <h3 className="text-lg font-bold text-gray-800">Create Job Description</h3>
                        <div className="flex items-center gap-3 max-lg:flex-col max-lg:items-start">
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                <span>0</span>
                                <div className="w-12 h-1.5 bg-gradient-to-r from-cyan-100 to-cyan-600 rounded-full"></div>
                                <span>10+</span>
                            </div>
                            <MonthDropdown value={jdGenerationMonthFilter} onChange={setJdGenerationMonthFilter} />
                        </div>
                    </div>

                    <div className="flex-1 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                        {jdGenerationData.roles.length > 0 ? (
                            <div className="grid grid-cols-[140px_1fr] gap-2 min-w-[500px]">
                                <div></div>
                                <div className="grid grid-cols-12 gap-1">
                                    {months.map((m, i) => (
                                        <div key={i} className="text-center text-[10px] text-gray-400 font-medium">
                                            {m}
                                        </div>
                                    ))}
                                </div>

                                {jdGenerationData.data.map((roleRow, i) => (
                                    <React.Fragment key={i}>
                                        <div className="pr-3 flex items-center">
                                            <span
                                                className="text-[11px] text-gray-600 font-medium truncate block"
                                                title={jdGenerationData.roles[i]}
                                            >
                                                {jdGenerationData.roles[i]}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-12 gap-1">
                                            {roleRow.monthlyData.map((m, j) => (
                                                <div
                                                    key={j}
                                                    className={`h-8 rounded-md transition-all duration-200 hover:scale-105 cursor-pointer ${getColor(m.count)} relative group flex items-center justify-center`}
                                                    title={`${m.count} JDs`}
                                                >
                                                    <span className="text-[10px] text-gray-600 opacity-0 group-hover:opacity-100 font-bold transition-opacity">
                                                        {m.count > 0 ? m.count : ''}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </React.Fragment>
                                ))}
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                                No JD data available for 2026
                            </div>
                        )}
                    </div>


                </div>



                <div className="lg:col-span-3 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
                        <h3 className="text-xl font-bold text-slate-900">Requisition Volume - Created Vs Assigned</h3>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-3 rounded-full bg-pink-100"></div>
                                <span className="text-sm text-gray-600">Requisition Assigned</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-3 rounded-full bg-rose-500"></div>
                                <span className="text-sm text-gray-600">Created</span>
                            </div>
                        </div>
                    </div>

                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={jdAssignedCreatedData} barSize={12}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: '#9CA3AF' }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: '#9CA3AF' }}
                                />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{
                                        backgroundColor: 'white',
                                        borderRadius: '8px',
                                        border: 'none',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                    }}
                                />
                                <Bar
                                    dataKey="Created"
                                    stackId="a"
                                    fill="#F43F5E"
                                    radius={[10, 10, 10, 10]}
                                />
                                <Bar
                                    dataKey="Assigned"
                                    stackId="a"
                                    fill="#FCE7F3"
                                    radius={[10, 10, 10, 10]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full overflow-hidden">
                <div className="flex justify-between items-center px-6 py-4">
                    <h3 className="text-xl font-bold text-[#05004E]">Current Job Openings</h3>
                    <a href="#" className="text-sm text-blue-600 underline hover:text-blue-700">View All</a>
                </div>
                <div className="overflow-x-auto w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    <table className="w-full min-w-[900px] text-sm text-left">
                        <thead className="text-xs text-gray-900 font-bold uppercase bg-[#F5F5F5]">
                            <tr>
                                <th className="py-4 px-4">Job Title</th>
                                <th className="py-4 px-4">Employment Type</th>
                                <th className="py-4 px-4">Company</th>
                                <th className="py-4 px-4">Due Date</th>
                                <th className="py-4 px-4">Priority</th>
                                <th className="py-4 px-4">Status</th>
                                <th className="py-4 px-4">Work Mode</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allOffersData
                                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                                .slice(0, 5)
                                .map((job, index) => (
                                    <tr key={job._id || index} className="border-b border-[#ede6e6] hover:bg-gray-50 last:border-0">
                                        <td className="py-4 px-4 flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-full ${getInitialsColor(index)} flex items-center justify-center text-white shrink-0 shadow-sm`}>
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                                    <path fillRule="evenodd" d="M7.5 6v.75H5.513c-.96 0-1.764.724-1.865 1.679l-1.263 12A1.875 1.875 0 0 0 4.25 22.5h15.5a1.875 1.875 0 0 0 1.865-2.071l-1.263-12a1.875 1.875 0 0 0-1.865-1.679H16.5V6a4.5 4.5 0 1 0-9 0ZM12 3a3 3 0 0 0-3 3v.75h6V6a3 3 0 0 0-3-3Zm-3 8.25a3 3 0 1 0 6 0v-.75a.75.75 0 0 1 1.5 0v.75a4.5 4.5 0 1 1-9 0v-.75a.75.75 0 0 1 1.5 0v.75Z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <span className="font-semibold text-gray-800 whitespace-nowrap">{job.jobTitle}</span>
                                        </td>
                                        <td className="py-4 px-4 text-gray-600 font-medium whitespace-nowrap">{job.employmentType}</td>
                                        <td className="py-4 px-4 text-gray-800 font-medium whitespace-nowrap">{job.companyName}</td>
                                        <td className="py-4 px-4 text-gray-600 whitespace-nowrap">{formatDate(job.dueDate)}</td>
                                        <td className="py-4 px-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${job.priority === "Critical" ? "bg-red-100 text-red-600" :
                                                job.priority === "High" ? "bg-orange-100 text-orange-600" :
                                                    "bg-blue-100 text-blue-600"
                                                }`}>
                                                {job.priority}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${job.status.toLowerCase().includes("pending") || job.status.toLowerCase().includes("not") ? "bg-red-50 text-red-500" : "bg-green-50 text-green-600"
                                                }`}>
                                                {job.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 whitespace-nowrap">
                                            <div className="flex items-center gap-1.5 text-gray-600 font-medium">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-gray-400">
                                                    <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                                                </svg>
                                                {job.workMode}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-5 bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-sm h-[400px] flex flex-col">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4 sm:mb-6">
                        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Monthly Trends 2026</h2>
                        <div className="flex flex-wrap items-center gap-4">
                            <div className="flex items-center gap-4 text-xs">
                                <div className="flex items-center gap-1">
                                    <div className="w-3 h-3 rounded-full bg-[#ff8a9a]"></div>
                                    <span>Current <br />Requisitions</span>
                                    <span className="font-bold text-gray-800">({trendTotals.candidates})</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className="w-3 h-3 rounded-full bg-[#8280ff]"></div>
                                    <span>JD <br />Created</span>
                                    <span className="font-bold text-gray-800">({trendTotals.jd})</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className="w-3 h-3 rounded-full bg-[#c58fff]"></div>
                                    <span>Total <br />Candidates</span>
                                    <span className="font-bold text-gray-800">({trendTotals.allHr})</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 w-full overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                        <div className="min-w-[700px] h-full min-h-[250px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={trendData} margin={{ top: 5, right: 30, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorCand" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#ff8a9a" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#ff8a9a" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorJd" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8280ff" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#8280ff" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorAllHr" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#c58fff" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#c58fff" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={false} stroke="#f0f0f0" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9e9e9e', fontSize: 12 }} dy={5} />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#9e9e9e', fontSize: 12 }}
                                        ticks={[0, 25, 50, 75, 100]}
                                        domain={[0, 100]}
                                        interval={0}
                                    />
                                    <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                                    <Area type="monotone" dataKey="candidates" stroke="#ff8a9a" strokeWidth={2} fillOpacity={1} fill="url(#colorCand)" dot={{ r: 4, fill: '#fff', stroke: '#ff8a9a', strokeWidth: 2 }} name="Current Requisitions" />
                                    <Area type="monotone" dataKey="jd" stroke="#8280ff" strokeWidth={2} fillOpacity={1} fill="url(#colorJd)" dot={{ r: 4, fill: '#fff', stroke: '#8280ff', strokeWidth: 2 }} name="JD Created" />
                                    <Area type="monotone" dataKey="allHr" stroke="#c58fff" strokeWidth={2} fillOpacity={1} fill="url(#colorAllHr)" dot={{ r: 4, fill: '#fff', stroke: '#c58fff', strokeWidth: 2 }} name="Total Candidates" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>


            </div>
        </div>
    );
}

export default RMGDashboard;