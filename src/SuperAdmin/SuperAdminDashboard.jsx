import React, { useEffect, useState } from "react";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line, PieChart, Pie, Cell, Legend, AreaChart, Area, RadialBarChart, RadialBar
} from "recharts";
import img2 from '../assets/SADashImg1.png'
import img1 from '../assets/SADashImg2.png'
import img3 from '../assets/SADashImg3.png'
import axios from "axios";
import { superAdminBaseUrl } from "../utils/ApiConstants";

export default function SuperAdminDashboard() {
    const [companies, setCompanies] = useState([]);
    const [enquiries, setEnquiries] = useState([]);
    const [tickets, setTickets] = useState([]);
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const token = localStorage.getItem("token");
                const [allCompany, allEnquiry, allTickets, getAllAdmins] = await Promise.all([
                    axios.get(`${superAdminBaseUrl}/api/company/`, { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get(`${superAdminBaseUrl}/api/enquiry/all`, { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get(`${superAdminBaseUrl}/api/superadmin/allTickets`, { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get(`${superAdminBaseUrl}/api/superadmin/getAllAdmins`, { headers: { Authorization: `Bearer ${token}` } }),
                ]);
                setCompanies(allCompany.data.companies || allCompany.data || []);
                setEnquiries(allEnquiry.data.data || allEnquiry.data || []);
                setTickets(allTickets.data.tickets || allTickets.data || []);
                const adminData = getAllAdmins.data.admins || getAllAdmins.data.data || getAllAdmins.data.users || getAllAdmins.data;
                setAdmins(Array.isArray(adminData) ? adminData : []);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
                setLoading(false);
            }
        };
        fetchAllData();
    }, []);

    const getDateFromObjectId = (objectId) => {
        if (!objectId || typeof objectId !== 'string' || objectId.length !== 24) return null;
        try {
            return new Date(parseInt(objectId.substring(0, 8), 16) * 1000);
        } catch (e) {
            return null;
        }
    };

    const getItemDate = (item) => {
        if (item.createdAt) return new Date(item.createdAt);
        if (item._id) return getDateFromObjectId(item._id);
        return null;
    };

    const getWeeklyGrowthData = () => {
        const weeks = [];
        const today = new Date();
        for (let i = 7; i >= 0; i--) {
            const weekStart = new Date(today);
            weekStart.setDate(weekStart.getDate() - (i * 7));
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekEnd.getDate() + 6);
            let enquiryCount = 0, companyCount = 0, ticketCount = 0;
            enquiries.forEach(enquiry => {
                const date = getItemDate(enquiry);
                if (date && date >= weekStart && date <= weekEnd) enquiryCount += 1;
            });
            companies.forEach(company => {
                const date = getItemDate(company);
                if (date && date >= weekStart && date <= weekEnd) companyCount += 1;
            });
            tickets.forEach(ticket => {
                const date = getItemDate(ticket);
                if (date && date >= weekStart && date <= weekEnd) ticketCount += 1;
            });
            weeks.push({
                week: `W${8 - i}`,
                fullDate: weekStart.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
                enquiries: enquiryCount,
                companies: companyCount,
                tickets: ticketCount
            });
        }
        return weeks;
    };

    const getCompanyTypesData = () => {
        const typeCount = {};
        let totalEmployees = 0;
        companies.forEach(company => {
            const type = company.companyType?.toLowerCase() || 'unknown';
            typeCount[type] = (typeCount[type] || 0) + 1;
            totalEmployees += company.numberOfEmployees || 0;
        });
        const colors = ["#3b82f6", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];
        const typeData = Object.entries(typeCount).map(([name, value], index) => ({
            name: name.charAt(0).toUpperCase() + name.slice(1),
            value,
            color: colors[index % colors.length],
            fill: colors[index % colors.length]
        }));
        return {
            typeData,
            totalEmployees,
            avgEmployees: companies.length > 0 ? Math.round(totalEmployees / companies.length) : 0
        };
    };

    const getOverallDistributionData = () => {
        return [
            { name: "Enquiries", value: enquiries.length, color: "#3b82f6" },
            { name: "Tickets", value: tickets.length, color: "#f87171" },
            { name: "Companies", value: companies.length, color: "#22c55e" },
        ].filter(item => item.value > 0);
    };

    const getMonthlyData = () => {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const monthlyData = months.map(month => ({ name: month, enquiries: 0, companies: 0, tickets: 0 }));
        enquiries.forEach(enquiry => {
            const date = getItemDate(enquiry);
            if (date) monthlyData[date.getMonth()].enquiries += 1;
        });
        companies.forEach(company => {
            const date = getItemDate(company);
            if (date) monthlyData[date.getMonth()].companies += 1;
        });
        tickets.forEach(ticket => {
            const date = getItemDate(ticket);
            if (date) monthlyData[date.getMonth()].tickets += 1;
        });
        return monthlyData;
    };

    const getDailyTestData = () => {
        const last14Days = [];
        const today = new Date();
        for (let i = 13; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            let enquiryCount = 0, ticketCount = 0, companyCount = 0;
            enquiries.forEach(enquiry => {
                const itemDate = getItemDate(enquiry);
                if (itemDate && itemDate.toISOString().split('T')[0] === dateStr) enquiryCount += 1;
            });
            tickets.forEach(ticket => {
                const itemDate = getItemDate(ticket);
                if (itemDate && itemDate.toISOString().split('T')[0] === dateStr) ticketCount += 1;
            });
            companies.forEach(company => {
                const itemDate = getItemDate(company);
                if (itemDate && itemDate.toISOString().split('T')[0] === dateStr) companyCount += 1;
            });
            last14Days.push({
                day: date.getDate(),
                date: date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
                enquiries: enquiryCount,
                tickets: ticketCount,
                companies: companyCount
            });
        }
        return last14Days;
    };

    const getWeeklyDailyTotals = () => {
        const today = new Date();
        const oneWeekAgo = new Date(today);
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const todayStr = today.toISOString().split('T')[0];
        let weeklyTotal = 0, dailyTotal = 0;
        [...enquiries, ...tickets, ...companies].forEach(item => {
            const itemDate = getItemDate(item);
            if (itemDate) {
                if (itemDate >= oneWeekAgo) weeklyTotal += 1;
                if (itemDate.toISOString().split('T')[0] === todayStr) dailyTotal += 1;
            }
        });
        return { weeklyTotal, dailyTotal };
    };

    const weeklyGrowthData = getWeeklyGrowthData();
    const companyTypesInfo = getCompanyTypesData();
    const overallPieData = getOverallDistributionData().length > 0 ? getOverallDistributionData() : [{ name: "No Data", value: 1, color: "#e5e7eb" }];
    const dailyTestData = getDailyTestData();
    const { weeklyTotal, dailyTotal } = getWeeklyDailyTotals();
    const lineData = getMonthlyData();
    const adminCount = Array.isArray(admins) ? admins.length : (typeof admins === 'object' && admins !== null) ? Object.keys(admins).length : 0;

    const statsCards = [
        { title: "Total Companies", value: companies.length, color: "bg-yellow-100" },
        { title: "Total Enquiries", value: enquiries.length, color: "bg-blue-100" },
        { title: "Total Tickets", value: tickets.length, color: "bg-green-100" },
        { title: "Total Admins", value: adminCount, color: "bg-red-100" },
    ];

    const latestCompanies = [...companies].reverse().slice(0, 5);
    const latestEnquiries = [...enquiries].slice(0, 5);
    const latestTickets = [...tickets].reverse().slice(0, 5);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    const truncateText = (text, maxLength = 30) => {
        if (!text) return 'N/A';
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };

    return (
        <div className="min-h-screen p-4 overflow-x-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
                <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="w-full">
                        <img src={img1} alt="AI Bot" className="w-full h-full object-cover rounded-lg" />
                    </div>
                    <div className="w-full">
                        <img src={img2} alt="Dashboard Image" className="w-full h-full object-cover rounded-lg" />
                    </div>
                </div>
                <div className="lg:col-span-2 grid grid-cols-2 gap-3">
                    {statsCards.map((item, i) => (
                        <div key={i} className={`rounded-xl shadow-md p-3 sm:p-4 ${item.color} transition-all hover:shadow-lg`}>
                            <h3 className="text-xs sm:text-sm lg:text-base text-gray-700 font-semibold">{item.title}</h3>
                            <p className="text-xl sm:text-2xl lg:text-3xl font-bold mt-1">{loading ? '...' : item.value}</p>
                            <p className="text-xs sm:text-sm text-gray-500 mt-1">{item.change}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 mb-6">
                <div className="bg-white rounded-xl shadow-[0px_0px_6px_0px_rgba(0,_0,_0,_0.35)] p-4 lg:col-span-7">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-lg">Weekly Growth Trends</h3>
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Last 8 Weeks</span>
                    </div>
                    <div className="h-48 sm:h-56 lg:h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={weeklyGrowthData} margin={{ left: 0, right: 0, top: 10, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorEnquiries" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                                    </linearGradient>
                                    <linearGradient id="colorCompanies" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0.1}/>
                                    </linearGradient>
                                    <linearGradient id="colorTickets" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="week" tick={{ fontSize: 11 }} axisLine={{ stroke: '#e5e7eb' }} />
                                <YAxis tick={{ fontSize: 11 }} axisLine={{ stroke: '#e5e7eb' }} />
                                <Tooltip content={({ active, payload, label }) => {
                                    if (active && payload && payload.length) {
                                        const data = weeklyGrowthData.find(d => d.week === label);
                                        return (
                                            <div className="bg-white p-3 shadow-lg rounded-lg border text-xs">
                                                <p className="font-semibold text-gray-700 mb-2">{label} - {data?.fullDate}</p>
                                                <div className="space-y-1">
                                                    <p className="flex items-center gap-2">
                                                        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                                        <span className="text-gray-600">Enquiries:</span>
                                                        <span className="font-medium">{data?.enquiries}</span>
                                                    </p>
                                                    <p className="flex items-center gap-2">
                                                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                                        <span className="text-gray-600">Companies:</span>
                                                        <span className="font-medium">{data?.companies}</span>
                                                    </p>
                                                    <p className="flex items-center gap-2">
                                                        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                                                        <span className="text-gray-600">Tickets:</span>
                                                        <span className="font-medium">{data?.tickets}</span>
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    }
                                    return null;
                                }} />
                                <Area type="monotone" dataKey="enquiries" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorEnquiries)" />
                                <Area type="monotone" dataKey="companies" stroke="#22c55e" strokeWidth={2} fillOpacity={1} fill="url(#colorCompanies)" />
                                <Area type="monotone" dataKey="tickets" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#colorTickets)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex justify-center gap-6 mt-3">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                            <span className="text-xs text-gray-600">Enquiries</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            <span className="text-xs text-gray-600">Companies</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                            <span className="text-xs text-gray-600">Tickets</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-[0px_0px_6px_0px_rgba(0,_0,_0,_0.35)] p-4 lg:col-span-3 flex flex-col items-center justify-center">
                    <h3 className="font-semibold text-lg mb-4">Overall Distribution</h3>
                    <div className="h-48 sm:h-56 lg:h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart margin={{ left: 0, right: 0 }}>
                                <Pie data={overallPieData} dataKey="value" outerRadius="80%" innerRadius="50%" paddingAngle={4} cx="50%" cy="50%" label={({ value }) => `${value}`}>
                                    {overallPieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex flex-wrap justify-center gap-3 mt-2">
                        {overallPieData.map((item, index) => (
                            <div key={index} className="flex items-center gap-1">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                <span className="text-xs sm:text-sm">{item.name}: {item.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 mb-6">
                <div className="bg-white rounded-xl shadow-[0px_0px_6px_0px_rgba(0,_0,_0,_0.35)] p-4 w-full">
                    <h3 className="font-semibold text-lg mb-4">Performance Trends</h3>
                    <div className="h-48 sm:h-56 lg:h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={lineData} margin={{ left: 0, right: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={'preserveStartEnd'} />
                                <YAxis tick={{ fontSize: 12 }} />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="enquiries" stroke="#3b82f6" strokeWidth={3} dot={{ r: 3 }} name="Enquiries" />
                                <Line type="monotone" dataKey="tickets" stroke="#f87171" strokeWidth={3} dot={{ r: 3 }} name="Tickets" />
                                <Line type="monotone" dataKey="companies" stroke="#22c55e" strokeWidth={3} dot={{ r: 3 }} name="Companies" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="bg-white rounded-xl shadow-[0px_0px_6px_0px_rgba(0,_0,_0,_0.35)] p-4">
                    <h3 className="font-semibold text-lg mb-4 text-gray-800">Latest Companies</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="px-3 py-2 text-left font-semibold text-gray-600">Company</th>
                                    <th className="px-3 py-2 text-left font-semibold text-gray-600">Type</th>
                                    <th className="px-3 py-2 text-left font-semibold text-gray-600">Email</th>
                                    <th className="px-3 py-2 text-left font-semibold text-gray-600">State</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="4" className="px-3 py-4 text-center text-gray-500">Loading...</td></tr>
                                ) : latestCompanies.length > 0 ? (
                                    latestCompanies.map((company, index) => (
                                        <tr key={company._id || index} className="border-b hover:bg-gray-50">
                                            <td className="px-3 py-2 font-medium text-gray-800">{truncateText(company.companyName, 20)}</td>
                                            <td className="px-3 py-2">
                                                <span className={`px-2 py-1 rounded-full text-xs ${company.companyType?.toLowerCase() === 'tech' ? 'bg-blue-100 text-blue-700' : company.companyType?.toLowerCase() === 'non tech' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-700'}`}>
                                                    {company.companyType || 'N/A'}
                                                </span>
                                            </td>
                                            <td className="px-3 py-2 text-gray-600">{truncateText(company.email, 25)}</td>
                                            <td className="px-3 py-2 text-gray-600">{company.state || 'N/A'}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="4" className="px-3 py-4 text-center text-gray-500">No companies found</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-[0px_0px_6px_0px_rgba(0,_0,_0,_0.35)] p-4">
                    <h3 className="font-semibold text-lg mb-4 text-gray-800">Latest Enquiries</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="px-3 py-2 text-left font-semibold text-gray-600">Company</th>
                                    <th className="px-3 py-2 text-left font-semibold text-gray-600">Email</th>
                                    <th className="px-3 py-2 text-left font-semibold text-gray-600">Phone</th>
                                    <th className="px-3 py-2 text-left font-semibold text-gray-600">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="4" className="px-3 py-4 text-center text-gray-500">Loading...</td></tr>
                                ) : latestEnquiries.length > 0 ? (
                                    latestEnquiries.map((enquiry, index) => (
                                        <tr key={enquiry._id || index} className="border-b hover:bg-gray-50">
                                            <td className="px-3 py-2 font-medium text-gray-800">{truncateText(enquiry.companyName, 20)}</td>
                                            <td className="px-3 py-2 text-gray-600">{truncateText(enquiry.emailid, 25)}</td>
                                            <td className="px-3 py-2 text-gray-600">{enquiry.phone || 'N/A'}</td>
                                            <td className="px-3 py-2 text-gray-600">{formatDate(enquiry.createdAt)}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="4" className="px-3 py-4 text-center text-gray-500">No enquiries found</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div className="bg-white rounded-xl shadow-[0px_0px_6px_0px_rgba(0,_0,_0,_0.35)] p-4 lg:col-span-2">
                    <h3 className="font-semibold text-lg mb-4 text-gray-800">Latest Tickets</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="px-3 py-2 text-left font-semibold text-gray-600">Subject</th>
                                    <th className="px-3 py-2 text-left font-semibold text-gray-600">Admin</th>
                                    <th className="px-3 py-2 text-left font-semibold text-gray-600">Status</th>
                                    <th className="px-3 py-2 text-left font-semibold text-gray-600">Replies</th>
                                    <th className="px-3 py-2 text-left font-semibold text-gray-600">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="5" className="px-3 py-4 text-center text-gray-500">Loading...</td></tr>
                                ) : latestTickets.length > 0 ? (
                                    latestTickets.map((ticket, index) => (
                                        <tr key={ticket._id || index} className="border-b hover:bg-gray-50">
                                            <td className="px-3 py-2 font-medium text-gray-800">{truncateText(ticket.subject, 25)}</td>
                                            <td className="px-3 py-2 text-gray-600">{truncateText(ticket.adminName, 20)}</td>
                                            <td className="px-3 py-2">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${ticket.status?.toLowerCase() === 'open' ? 'bg-red-100 text-red-700' : ticket.status?.toLowerCase() === 'closed' ? 'bg-green-100 text-green-700' : ticket.status?.toLowerCase() === 'resolved' ? 'bg-purple-100 text-purple-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                    {ticket.status || 'Open'}
                                                </span>
                                            </td>
                                            <td className="px-3 py-2 text-gray-600">{ticket.replies?.length || 0}</td>
                                            <td className="px-3 py-2 text-gray-600">{formatDate(ticket.createdAt)}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="5" className="px-3 py-4 text-center text-gray-500">No tickets found</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-[0px_0px_6px_0px_rgba(0,_0,_0,_0.35)] p-4 flex flex-col">
                    <h3 className="font-semibold text-lg mb-3 text-center">Company Insights</h3>
                    <div className="h-36 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadialBarChart cx="50%" cy="50%" innerRadius="30%" outerRadius="90%" barSize={10} data={companyTypesInfo.typeData} startAngle={180} endAngle={0}>
                                <RadialBar minAngle={15} background clockWise dataKey="value" cornerRadius={5} />
                                <Tooltip content={({ payload }) => {
                                    if (payload && payload.length) {
                                        return (
                                            <div className="bg-white px-3 py-2 shadow-lg rounded border text-xs">
                                                <p className="font-medium">{payload[0].payload.name}</p>
                                                <p className="text-gray-600">{payload[0].value} companies</p>
                                            </div>
                                        );
                                    }
                                    return null;
                                }} />
                            </RadialBarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex flex-wrap justify-center gap-2 mb-3">
                        {companyTypesInfo.typeData.map((item, index) => (
                            <div key={index} className="flex items-center gap-1 px-2 py-1 rounded-full" style={{ backgroundColor: `${item.color}15` }}>
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                                <span className="text-xs font-medium" style={{ color: item.color }}>{item.name}: {item.value}</span>
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-auto">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-2 text-center">
                            <p className="text-xs text-blue-600 font-medium">Total Employees</p>
                            <p className="text-lg font-bold text-blue-700">{companyTypesInfo.totalEmployees}</p>
                        </div>
                        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-2 text-center">
                            <p className="text-xs text-green-600 font-medium">Avg/Company</p>
                            <p className="text-lg font-bold text-green-700">{companyTypesInfo.avgEmployees}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl shadow-[0px_0px_6px_0px_rgba(0,_0,_0,_0.35)] p-6 flex flex-col justify-between">
                    <h2 className="text-gray-800 font-semibold text-lg mb-4">Daily Activity (Last 14 Days)</h2>
                    <div className="flex flex-wrap items-baseline gap-6">
                        <div>
                            <p className="text-4xl font-bold text-blue-600">{weeklyTotal}</p>
                            <p className="text-gray-500 text-sm">This Week</p>
                        </div>
                        <div>
                            <p className="text-4xl font-bold text-green-600">{dailyTotal}</p>
                            <p className="text-gray-500 text-sm">Today</p>
                        </div>
                    </div>
                    <div className="mt-6 w-full h-36">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={dailyTestData} margin={{ left: 0, right: 0 }}>
                                <Tooltip content={({ active, payload, label }) => {
                                    if (active && payload && payload.length) {
                                        const data = dailyTestData.find(d => d.day === label);
                                        return (
                                            <div className="bg-white p-2 shadow-lg rounded border text-xs">
                                                <p className="font-medium mb-1">{data?.date}</p>
                                                <p className="text-blue-600">Enquiries: {payload[0]?.value || 0}</p>
                                                <p className="text-red-500">Tickets: {payload[1]?.value || 0}</p>
                                                <p className="text-green-600">Companies: {payload[2]?.value || 0}</p>
                                            </div>
                                        );
                                    }
                                    return null;
                                }} />
                                <Bar dataKey="enquiries" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                                <Bar dataKey="tickets" fill="#f87171" radius={[6, 6, 0, 0]} />
                                <Bar dataKey="companies" fill="#22c55e" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex justify-center gap-4 mt-3">
                        <div className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                            <span className="text-xs">Enquiries</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-full bg-red-400"></div>
                            <span className="text-xs">Tickets</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            <span className="text-xs">Companies</span>
                        </div>
                    </div>
                </div>

                <div className="w-full">
                    <img src={img3} alt="AI Robot" className="w-full h-auto object-cover rounded-lg" />
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                        <div className="bg-white rounded-2xl shadow-[0px_0px_6px_0px_rgba(0,_0,_0,_0.35)] p-4 text-center">
                            <p className="text-gray-400 text-sm mb-1">Top month</p>
                            <h3 className="text-lg font-semibold text-orange-600">{new Date().toLocaleString('default', { month: 'long' })}</h3>
                            <p className="text-gray-500 text-sm">{new Date().getFullYear()}</p>
                        </div>
                        <div className="bg-white rounded-2xl shadow-[0px_0px_6px_0px_rgba(0,_0,_0,_0.35)] p-4 text-center">
                            <p className="text-gray-400 text-sm mb-1">Top year</p>
                            <h3 className="text-lg font-semibold text-gray-800">{new Date().getFullYear()}</h3>
                        </div>
                        <div className="bg-white rounded-2xl shadow-[0px_0px_6px_0px_rgba(0,_0,_0,_0.35)] p-4 text-center sm:col-span-2">
                            <p className="text-gray-400 text-sm mb-1">Top Companies</p>
                            <div className="flex justify-center items-center gap-3">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png" alt="Company" className="w-8 h-8 rounded-full" />
                                <span className="text-gray-800 font-medium text-sm sm:text-base">{latestCompanies[0]?.companyName || 'Netfotech Solutions'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}