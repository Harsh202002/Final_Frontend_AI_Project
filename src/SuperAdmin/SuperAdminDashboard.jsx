import React, { useEffect, useState } from "react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    RadialBarChart,
    RadialBar,
} from "recharts";
import { MoreHorizontal, FileText, BarChart2 } from "lucide-react";
import tal from "../img/TAL.png"
import isl from "../img/ISL.png"
import ta from "../img/TA.png"
import te from "../img/TE.png"
import RobotHeroAnimation from "./Component/RobotHeroAnimation";
import { superAdminBaseUrl } from "../utils/ApiConstants";
import axios from "axios";
import { Link } from "react-router-dom";

export default function SuperAdminDashboard() {
    const [companies, setCompanies] = useState([]);
    const [enquiries, setEnquiries] = useState([]);
    const [tickets, setTickets] = useState([]);
    const [admins, setAdmins] = useState([]);
    const [totalCompanies, setTotalCompanies] = useState(0);
    const [totalEnquiries, setTotalEnquiries] = useState(0);
    const [totalTickets, setTotalTickets] = useState(0);
    const [distributionData, setDistributionData] = useState([]);
    const [performanceData, setPerformanceData] = useState([]);
    const [availableYears, setAvailableYears] = useState([]);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [allCompaniesData, setAllCompaniesData] = useState([]);
    const [allEnquiriesData, setAllEnquiriesData] = useState([]);
    const [allTicketsData, setAllTicketsData] = useState([]);

    const [distributionYear, setDistributionYear] = useState(new Date().getFullYear());
    const [distributionAvailableYears, setDistributionAvailableYears] = useState([]);

    const [trendTotals, setTrendTotals] = useState({ enquiries: 0, tickets: 0, companies: 0 });

    const [userName, setUserName] = useState("User");
    const [currentDate, setCurrentDate] = useState("");

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 17) return "Good Afternoon";
        return "Good Evening";
    };

    const getCompanyTypeColor = (type) => {
        const typeColors = {
            "Product": "bg-blue-100 text-blue-600",
            "product": "bg-blue-100 text-blue-600",
            "IT": "bg-red-100 text-red-600",
            "Non Tech": "bg-pink-100 text-pink-600",
        };
        return typeColors[type] || "bg-gray-100 text-gray-600";
    };

    const getInitials = (name) => {
        if (!name) return "NA";
        return name
            .split(" ")
            .map((word) => word[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        const options = { day: "2-digit", month: "short", year: "numeric" };
        return date.toLocaleDateString("en-GB", options).replace(/ /g, "-");
    };

    const getAvailableYears = (companiesData, enquiriesData, ticketsData) => {
        const yearsSet = new Set();

        companiesData.forEach((company) => {
            if (company.createdAt) {
                const year = new Date(company.createdAt).getFullYear();
                yearsSet.add(year);
            }
        });

        enquiriesData.forEach((enquiry) => {
            if (enquiry.createdAt) {
                const year = new Date(enquiry.createdAt).getFullYear();
                yearsSet.add(year);
            }
        });

        ticketsData.forEach((ticket) => {
            if (ticket.createdAt) {
                const year = new Date(ticket.createdAt).getFullYear();
                yearsSet.add(year);
            }
        });

        return Array.from(yearsSet).sort((a, b) => b - a);
    };

    const calculateMonthlyTrends = (companiesData, enquiriesData, ticketsData, year) => {
        const months = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];

        const monthlyData = months.map((month, index) => ({
            name: month,
            monthIndex: index,
            enquiries: 0,
            companies: 0,
            tickets: 0
        }));

        companiesData.forEach((company) => {
            if (company.createdAt) {
                const date = new Date(company.createdAt);
                const companyYear = date.getFullYear();
                if (companyYear === year) {
                    const monthIndex = date.getMonth();
                    monthlyData[monthIndex].companies += 1;
                }
            }
        });

        enquiriesData.forEach((enquiry) => {
            if (enquiry.createdAt) {
                const date = new Date(enquiry.createdAt);
                const enquiryYear = date.getFullYear();
                if (enquiryYear === year) {
                    const monthIndex = date.getMonth();
                    monthlyData[monthIndex].enquiries += 1;
                }
            }
        });

        ticketsData.forEach((ticket) => {
            if (ticket.createdAt) {
                const date = new Date(ticket.createdAt);
                const ticketYear = date.getFullYear();
                if (ticketYear === year) {
                    const monthIndex = date.getMonth();
                    monthlyData[monthIndex].tickets += 1;
                }
            }
        });

        return monthlyData;
    };

    const calculateTrendTotals = (monthlyData) => {
        let totalEnquiries = 0;
        let totalTickets = 0;
        let totalCompanies = 0;

        monthlyData.forEach((month) => {
            totalEnquiries += month.enquiries;
            totalTickets += month.tickets;
            totalCompanies += month.companies;
        });

        return { enquiries: totalEnquiries, tickets: totalTickets, companies: totalCompanies };
    };

    const calculateDistributionData = (companiesData, enquiriesData, ticketsData, year) => {
        let enquiryCount = 0;
        let ticketCount = 0;
        let companyCount = 0;

        enquiriesData.forEach((enquiry) => {
            if (enquiry.createdAt) {
                const enquiryYear = new Date(enquiry.createdAt).getFullYear();
                if (enquiryYear === year) {
                    enquiryCount += 1;
                }
            }
        });

        ticketsData.forEach((ticket) => {
            if (ticket.createdAt) {
                const ticketYear = new Date(ticket.createdAt).getFullYear();
                if (ticketYear === year) {
                    ticketCount += 1;
                }
            }
        });

        companiesData.forEach((company) => {
            if (company.createdAt) {
                const companyYear = new Date(company.createdAt).getFullYear();
                if (companyYear === year) {
                    companyCount += 1;
                }
            }
        });

        const distribution = [
            { name: "Enquiries", value: enquiryCount, fill: "#3b82f6" },
            { name: "Tickets", value: ticketCount, fill: "#f59e0b" },
            { name: "Companies", value: companyCount, fill: "#d946ef" },
        ];

        return distribution;
    };

    const handleYearChange = (e) => {
        const year = parseInt(e.target.value);
        setSelectedYear(year);
        const monthlyTrends = calculateMonthlyTrends(allCompaniesData, allEnquiriesData, allTicketsData, year);
        setPerformanceData(monthlyTrends);
        const totals = calculateTrendTotals(monthlyTrends);
        setTrendTotals(totals);
    };

    const handleDistributionYearChange = (e) => {
        const year = parseInt(e.target.value);
        setDistributionYear(year);
        const distribution = calculateDistributionData(allCompaniesData, allEnquiriesData, allTicketsData, year);
        setDistributionData(distribution);
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(`${superAdminBaseUrl}/superadmin/profile`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (response.data.status === 'success') {
                    setUserName(response.data.data.name);
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUserData();
    }, []);

    useEffect(() => {
        const updateDate = () => {
            const now = new Date();
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            setCurrentDate(now.toLocaleDateString('en-US', options));
        };

        updateDate();

        const interval = setInterval(updateDate, 60000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const token = localStorage.getItem("token");
                const [
                    allCompanies,
                    allEnquiries,
                    allTickets,
                    allAdmins
                ] = await Promise.all([
                    axios.get(`${superAdminBaseUrl}/company/`, {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    axios.get(`${superAdminBaseUrl}/enquiry/all`, {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    axios.get(`${superAdminBaseUrl}/superadmin/allTickets`, {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    axios.get(`${superAdminBaseUrl}/superadmin/getAllAdmins`, {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                ]);
                console.log("companies", allCompanies.data);
                console.log("enquiry", allEnquiries.data);
                console.log("tickets", allTickets.data);
                console.log("admins", allAdmins.data);


                const companiesData = allCompanies.data.companies || [];
                setCompanies(companiesData);
                setAllCompaniesData(companiesData);
                setTotalCompanies(companiesData.length);

                const enquiriesData = allEnquiries.data.data || [];
                setEnquiries(enquiriesData);
                setAllEnquiriesData(enquiriesData);
                setTotalEnquiries(allEnquiries.data.results || enquiriesData.length);

                const ticketsData = allTickets.data.tickets || [];
                setTickets(ticketsData);
                setAllTicketsData(ticketsData);
                setTotalTickets(ticketsData.length);

                const adminsData = allAdmins.data.data || [];
                setAdmins(adminsData);

                const years = getAvailableYears(companiesData, enquiriesData, ticketsData);
                setAvailableYears(years);
                setDistributionAvailableYears(years);

                const defaultYear = years.length > 0 ? years[0] : new Date().getFullYear();
                setSelectedYear(defaultYear);
                setDistributionYear(defaultYear);

                const distribution = calculateDistributionData(companiesData, enquiriesData, ticketsData, defaultYear);
                setDistributionData(distribution);

                const monthlyTrends = calculateMonthlyTrends(companiesData, enquiriesData, ticketsData, defaultYear);
                setPerformanceData(monthlyTrends);

                const totals = calculateTrendTotals(monthlyTrends);
                setTrendTotals(totals);
            }
            catch (error) {
                console.error("Error fetching dashboard data:", error);
            }
        };

        fetchAllData();
    }, []);

    const distributionTotal = distributionData.reduce((sum, item) => sum + item.value, 0);

    return (
        <div className="min-h-screen">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
                {/* UPDATED BANNER with real-time date and name */}
                <div className="lg:col-span-2 bg-[#b936ee] rounded-2xl p-8 text-white flex flex-col justify-center relative overflow-hidden shadow-lg">
                    <div className="relative z-10">
                        <p className="text-sm font-medium opacity-90 mb-2">{currentDate}</p>
                        <h1 className="text-3xl font-bold mb-2">{getGreeting()}, {userName}</h1>
                        <p className="text-sm opacity-80 max-w-md">
                            Control everything effortlessly using superpowers, smart tools, and stress-free efficiency.
                        </p>
                    </div>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full translate-x-10 -translate-y-10"></div>
                    <div className="absolute bottom-0 right-10 w-24 h-24 bg-white opacity-10 rounded-full translate-y-10"></div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between relative">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Total</p>
                            <p className="text-gray-500 text-sm font-medium">Companies</p>
                        </div>
                        <div className="">
                            <img src={ta} alt="" />
                        </div>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                        <h2 className="text-4xl font-bold text-pink-500">{totalCompanies}</h2>
                        <img src={tal} alt="" className="w-24 h-10" />
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between relative">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Total</p>
                            <p className="text-gray-500 text-sm font-medium">Enquiries</p>
                        </div>
                        <div className="">
                            <img src={te} alt="" />
                        </div>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                        <h2 className="text-4xl font-bold text-blue-500">{totalEnquiries}</h2>
                        <img src={isl} alt="" className="w-24 h-10" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-blue-900">Overall Distribution</h3>
                        <select
                            value={distributionYear}
                            onChange={handleDistributionYearChange}
                            className="bg-gray-50 border border-gray-200 text-xs text-gray-700 rounded-full px-3 py-1 outline-none focus:ring-2 focus:ring-purple-300 cursor-pointer"
                        >
                            {distributionAvailableYears.map((year) => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex-1 relative flex justify-center items-center">
                        <div className="w-full h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadialBarChart
                                    cx="50%" cy="50%"
                                    innerRadius="40%" outerRadius="100%"
                                    barSize={12}
                                    data={distributionData}
                                    startAngle={90} endAngle={450}
                                >
                                    <RadialBar background clockWise dataKey="value" cornerRadius={10} />
                                </RadialBarChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none">
                                <p className="text-gray-400 text-xs">Total</p>
                                <p className="text-gray-400 text-xs">Records</p>
                                <p className="text-2xl font-bold text-gray-800">{distributionTotal}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center gap-4 mt-2 flex-wrap">
                        {distributionData.map((entry, index) => (
                            <div key={index} className="flex items-center gap-1">
                                <div className="w-8 h-2 rounded-full" style={{ backgroundColor: entry.fill }}></div>
                                <span className="text-xs text-gray-600 font-medium">
                                    {entry.name} <span className="font-bold text-gray-800">{entry.value}</span>
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 w-full overflow-x-auto">
                    <div className="flex justify-between items-center px-4 py-2">
                        <h3 className="text-lg font-bold text-[#05004E]">Latest Companies</h3>
                        <Link to="/SuperAdmin-Dashboard/RejisteredRecruiters" className="text-sm text-blue-600 underline">View All</Link>
                    </div>
                    <div className="overflow-x-auto w-full">
                        <table className="w-full min-w-[650px] text-sm text-left">
                            <thead className="text-xs text-gray-900 font-bold uppercase bg-[#F5F5F5]">
                                <tr>
                                    <th className="py-3 px-2">Company</th>
                                    <th className="py-3 px-2">Type</th>
                                    <th className="py-3 px-2">Email</th>
                                    <th className="py-3 px-2">State</th>
                                </tr>
                            </thead>
                            <tbody>
                                {companies.slice(0, 5).map((company, index) => (
                                    <tr key={company._id || index} className="border-b border-gray-50 hover:bg-gray-50">
                                        <td className="py-3 px-2 flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-[10px] font-bold">
                                                {getInitials(company.companyName)}
                                            </div>
                                            <span className="font-medium text-gray-800">{company.companyName}</span>
                                        </td>
                                        <td className="py-3 px-2">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${getCompanyTypeColor(company.companyType)}`}>
                                                {company.companyType}
                                            </span>
                                        </td>
                                        <td className="py-3 px-2 text-gray-600">{company.email}</td>
                                        <td className="py-3 px-2 text-gray-600">{company.state}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6 overflow-hidden">
                <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                    <h3 className="text-lg font-bold text-[#05004E]">Performance Trends</h3>
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-2 rounded-full bg-pink-400"></div>
                            <span className="text-xs text-gray-500">Enquiries</span>
                            <span className="text-xs font-bold text-gray-800">{trendTotals.enquiries}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-2 rounded-full bg-amber-400"></div>
                            <span className="text-xs text-gray-500">Tickets</span>
                            <span className="text-xs font-bold text-gray-800">{trendTotals.tickets}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-2 rounded-full bg-blue-400"></div>
                            <span className="text-xs text-gray-500">Companies</span>
                            <span className="text-xs font-bold text-gray-800">{trendTotals.companies}</span>
                        </div>
                        <select
                            value={selectedYear}
                            onChange={handleYearChange}
                            className="bg-gray-50 border border-gray-200 text-sm text-gray-700 rounded-full px-4 py-1.5 outline-none focus:ring-2 focus:ring-purple-300 cursor-pointer"
                        >
                            {availableYears.map((year) => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <div className="min-w-[650px] h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={performanceData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorEnquiries" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f472b6" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#f472b6" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorTickets" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorCompanies" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid vertical={true} horizontal={false} stroke="#f0f0f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}
                                    itemStyle={{ fontSize: '12px' }}
                                    labelFormatter={(label) => `${label} ${selectedYear}`}
                                />
                                <Area type="monotone" dataKey="enquiries" stroke="#f472b6" strokeWidth={2} fillOpacity={1} fill="url(#colorEnquiries)" />
                                <Area type="monotone" dataKey="tickets" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#colorTickets)" />
                                <Area type="monotone" dataKey="companies" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorCompanies)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="grid justify-between grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-gray-100 w-full overflow-x-auto">
                    <div className="flex justify-between items-center px-4 py-2">
                        <h3 className="text-lg font-bold text-[#05004E]">Latest Enquiries</h3>
                        <Link to="/SuperAdmin-Dashboard/EnquiryMessages" className="text-sm text-blue-600 underline">View All</Link>
                    </div>
                    <div className="overflow-x-auto w-full">
                        <table className="w-full min-w-[650px] text-sm text-left">
                            <thead className="text-xs text-gray-900 font-bold uppercase bg-[#F5F5F5]">
                                <tr>
                                    <th className="py-3 px-2">Company</th>
                                    <th className="py-3 px-2">Phone</th>
                                    <th className="py-3 px-2">Email</th>
                                    <th className="py-3 px-2">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {enquiries.slice(0, 5).map((enquiry, index) => (
                                    <tr key={enquiry._id || index} className="border-b border-[#ede6e6] hover:bg-gray-50">
                                        <td className="py-3 px-2 flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                                                {getInitials(enquiry.companyName)}
                                            </div>
                                            <span className="font-medium text-gray-800 whitespace-nowrap">{enquiry.companyName}</span>
                                        </td>
                                        <td className="py-3 px-2 text-gray-600 whitespace-nowrap">{enquiry.phone}</td>
                                        <td className="py-3 px-2 text-gray-600 whitespace-nowrap">{enquiry.emailid}</td>
                                        <td className="py-3 px-2 text-gray-600 whitespace-nowrap">{formatDate(enquiry.createdAt)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="lg:col-span-2 w-full h-full rounded-2xl overflow-hidden min-h-[300px] flex flex-row-reverse sm:min-h-[350px] md:min-h-[400px] lg:min-h-full">
                    <RobotHeroAnimation />
                </div>
            </div>
        </div>
    );
}