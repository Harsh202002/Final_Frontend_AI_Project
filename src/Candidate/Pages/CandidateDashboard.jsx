import React, { useEffect, useState } from "react";
import img from "../../img/Candidate-Dashboard.png"
import TF from "../../img/TF.png";
import IF from "../../img/IF.png";
import TU from "../../img/TU.png";
import TA from "../../img/TA.png";
import TAL from "../../img/TAL.png";
import TFL from "../../img/TFL.png";
import ISL from "../../img/ISL.png";
import { Bookmark, Briefcase, User2 } from "lucide-react";
import { baseUrl } from "../../utils/ApiConstants";
import axios from "axios";
import { Link } from "react-router-dom";

const CandidateDashboard = () => {
    const [totalJdsCount, setTotalJdsCount] = useState(0);
    const [tooltipData, setTooltipData] = useState({ show: false, x: 0, y: 0, name: '' });
    const [user, setUser] = useState(null);
    const [currentDateTime, setCurrentDateTime] = useState(new Date());
    const [jdCounts, setJdCounts] = useState({
        totalAppliedJds: 0,
        filteredJds: 0,
        unfilteredJds: 0
    });
    const [latestFiveJds, setLatestFiveJds] = useState([]);
    const [applicationDistribution, setApplicationDistribution] = useState({
        total: 0,
        pending: 0,
        filtered: 0
    });
    const [allApplicationsData, setAllApplicationsData] = useState([]);
    const [distributionFilter, setDistributionFilter] = useState('all');
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [applicationStatus, setApplicationStatus] = useState([]);
    const [graphData, setGraphData] = useState({
        points: [],
        aiScores: [],
        averageAiScore: 0
    });

    const extractSalary = (benefits) => {
        if (!benefits || !Array.isArray(benefits) || benefits.length === 0) {
            return "N/A";
        }

        const salaryPatterns = [
            /(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)\s*(?:INR|₹|Rs\.?|rupees?)/i,
            /(?:INR|₹|Rs\.?)\s*(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/i,
            /salary\s*(?:of|:)?\s*(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/i,
            /(\d{1,3}(?:,\d{3})*)\s*(?:per\s*(?:annum|year|month))/i,
            /(\d+(?:,\d+)*)\s*(?:lpa|LPA)/i,
            /(\d+(?:\.\d+)?)\s*(?:lakh|lac)/i
        ];

        for (const benefit of benefits) {
            if (typeof benefit !== 'string') continue;

            const lowerBenefit = benefit.toLowerCase();

            if (lowerBenefit.includes('salary') ||
                lowerBenefit.includes('inr') ||
                lowerBenefit.includes('₹') ||
                lowerBenefit.includes('lpa') ||
                lowerBenefit.includes('per annum') ||
                lowerBenefit.includes('per month') ||
                lowerBenefit.includes('lakh')) {

                for (const pattern of salaryPatterns) {
                    const match = benefit.match(pattern);
                    if (match) {
                        const amount = match[1] || match[0];

                        if (lowerBenefit.includes('lpa')) {
                            return `${amount} LPA`;
                        }
                        if (lowerBenefit.includes('per month') || lowerBenefit.includes('monthly')) {
                            return `₹${amount}/month`;
                        }
                        if (lowerBenefit.includes('per annum') || lowerBenefit.includes('annual')) {
                            return `₹${amount}/year`;
                        }

                        return `₹${amount}`;
                    }
                }

                if (lowerBenefit.includes('salary')) {
                    const numbers = benefit.match(/[\d,]+/g);
                    if (numbers && numbers.length > 0) {
                        return `₹${numbers[0]}`;
                    }
                }
            }
        }

        return "N/A";
    };

    const filterApplicationsByTime = (applications, filter, year, month) => {
        if (filter === 'all') {
            return applications;
        }

        return applications.filter(app => {
            const appDate = new Date(app.appliedAt || app.createdAt);

            if (filter === 'year') {
                return appDate.getFullYear() === year;
            }

            if (filter === 'month') {
                return appDate.getFullYear() === year && appDate.getMonth() === month;
            }

            return true;
        });
    };

    const calculateDistribution = (applications) => {
        let total = applications.length;
        let pending = 0;
        let filtered = 0;

        applications.forEach(app => {
            const status = app.status?.toLowerCase();
            if (status === 'filtered') {
                filtered++;
            } else if (status !== 'unfiltered') {
                pending++;
            }
        });

        return { total, pending, filtered };
    };

    useEffect(() => {
        if (allApplicationsData.length > 0) {
            const filteredApps = filterApplicationsByTime(
                allApplicationsData,
                distributionFilter,
                selectedYear,
                selectedMonth
            );
            const newDistribution = calculateDistribution(filteredApps);
            setApplicationDistribution(newDistribution);
        }
    }, [distributionFilter, selectedYear, selectedMonth, allApplicationsData]);

    const getAvailableYears = () => {
        const years = new Set();
        allApplicationsData.forEach(app => {
            const date = new Date(app.appliedAt || app.createdAt);
            years.add(date.getFullYear());
        });
        return Array.from(years).sort((a, b) => b - a);
    };

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem("candidateToken");
                const res = await axios.get(`${baseUrl}/auth/me`, {
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
        const fetchAppliedJobs = async () => {
            try {
                const token = localStorage.getItem("candidateToken");
                const res = await axios.get(`${baseUrl}/candidate/applied-jobs`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log(res.data);

                if (res.data?.success && res.data?.jobs) {
                    const userRes = await axios.get(`${baseUrl}/auth/me`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    const loggedInCandidateId = userRes.data?.data?._id;

                    let totalApplied = 0;
                    let filteredCount = 0;
                    let pendingCount = 0;
                    const statusList = [];
                    const aiScoresList = [];
                    const allAppsForFilter = [];

                    res.data.jobs.forEach(job => {
                        const appliedCandidates = job.appliedCandidates || [];
                        const candidateInApplied = appliedCandidates.find(
                            c => c.candidate === loggedInCandidateId
                        );

                        if (candidateInApplied) {
                            totalApplied++;

                            allAppsForFilter.push({
                                ...candidateInApplied,
                                jobId: job._id,
                                createdAt: job.createdAt
                            });

                            aiScoresList.push({
                                jobId: job._id,
                                aiScore: candidateInApplied.aiScore || 0,
                                jobName: job.companyName || "Job"
                            });

                            const candidateStatus = candidateInApplied.status?.toLowerCase();

                            if (candidateStatus === 'filtered') {
                                filteredCount++;
                                statusList.push({
                                    id: job._id,
                                    role: job.keyResponsibilities || "N/A",
                                    company: job.companyName,
                                    jobSummary: job.jobSummary,
                                    status: "Filtered",
                                    badgeClass: "bg-emerald-100 text-emerald-700",
                                    lineColor: "bg-green-400",
                                    aiScore: candidateInApplied.aiScore
                                });
                            } else if (candidateStatus === 'unfiltered') {
                                statusList.push({
                                    id: job._id,
                                    role: job.keyResponsibilities || "N/A",
                                    company: job.companyName,
                                    jobSummary: job.jobSummary,
                                    status: "Unfiltered",
                                    badgeClass: "bg-rose-100 text-rose-700",
                                    lineColor: "bg-rose-400",
                                    aiScore: candidateInApplied.aiScore
                                });
                            } else {
                                pendingCount++;
                                statusList.push({
                                    id: job._id,
                                    role: job.keyResponsibilities || "N/A",
                                    company: job.companyName,
                                    jobSummary: job.jobSummary,
                                    status: "Pending",
                                    badgeClass: "bg-amber-100 text-amber-700",
                                    lineColor: "bg-amber-400",
                                    aiScore: candidateInApplied.aiScore
                                });
                            }
                        }
                    });

                    const last7Jobs = aiScoresList.slice(-7);
                    const avgScore = last7Jobs.length > 0
                        ? Math.round(last7Jobs.reduce((sum, j) => sum + j.aiScore, 0) / last7Jobs.length)
                        : 0;

                    setGraphData({
                        points: last7Jobs,
                        aiScores: last7Jobs.map(j => j.aiScore),
                        averageAiScore: avgScore
                    });

                    setAllApplicationsData(allAppsForFilter);

                    setApplicationDistribution({
                        total: totalApplied,
                        pending: pendingCount,
                        filtered: filteredCount
                    });

                    setApplicationStatus(statusList.slice(-5));
                }
            } catch (error) {
                console.log(error);
            }
        };

        fetchAppliedJobs();
    }, []);

    useEffect(() => {
        const fetchjdcounts = async () => {
            try {
                const res = await axios.get(`${baseUrl}/candidate/jd-counts`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("candidateToken")}`,
                    },
                });

                if (res.data?.counts) {
                    setJdCounts(res.data.counts);
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchjdcounts();
    }, []);

    useEffect(() => {
        const fetchlatestfivejds = async () => {
            try {
                const res = await axios.get(`${baseUrl}/candidate/latest-five-jds`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("candidateToken")}`,
                    },
                });
                console.log(res.data);

                if (res.data?.success && res.data?.data) {
                    setLatestFiveJds(res.data.data);
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchlatestfivejds();
    }, []);

    useEffect(() => {
        const fetchJDs = async () => {
            try {
                const response = await axios.get(`${baseUrl}/jd/all-jd`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('candidateToken')}`,
                    }
                });

                console.log('JDs Data:', response.data);

                if (response.data?.success) {
                    setTotalJdsCount(response.data.count || response.data.data?.length || 0);
                }
            }
            catch (error) {
                console.error('Error fetching JDs:', error);
            }
        };
        fetchJDs();
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentDateTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const getGreeting = () => {
        const hour = currentDateTime.getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 17) return "Good Afternoon";
        return "Good Evening";
    };

    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const getFirstName = (fullName) => {
        if (!fullName) return "User";
        return fullName.split(' ')[0];
    };

    const formatTimeAgo = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        const now = new Date();
        const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

        if (diffInDays === 0) return "Today";
        if (diffInDays === 1) return "1D ago";
        if (diffInDays < 7) return `${diffInDays}D ago`;
        if (diffInDays < 30) return `${Math.floor(diffInDays / 7)}W ago`;
        return `${Math.floor(diffInDays / 30)}M ago`;
    };

    const truncateText = (text, maxLength = 50) => {
        if (!text) return "";
        return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
    };

    const generateGraphPoints = () => {
        const scores = graphData.aiScores;
        if (scores.length === 0) {
            return [
                { x: 0, y: 185 },
                { x: 60, y: 185 },
                { x: 120, y: 185 },
                { x: 180, y: 185 },
                { x: 240, y: 185 },
                { x: 300, y: 185 },
                { x: 340, y: 185 },
            ];
        }

        const scaleY = (score) => {
            const minY = 30;
            const maxY = 185;
            return maxY - ((score / 100) * (maxY - minY));
        };

        const xPositions = [0, 60, 120, 180, 240, 300, 340];
        const points = [];

        for (let i = 0; i < 7; i++) {
            const score = scores[i] !== undefined ? scores[i] : 0;
            points.push({
                x: xPositions[i],
                y: scaleY(score),
                score: score,
                highlight: i === scores.length - 1 && scores.length > 0
            });
        }

        return points;
    };

    const generatePath = (points) => {
        if (points.length === 0) return "";

        let path = `M${points[0].x},${points[0].y}`;
        for (let i = 1; i < points.length; i++) {
            const prev = points[i - 1];
            const curr = points[i];
            const midX = (prev.x + curr.x) / 2;
            path += ` Q${midX},${prev.y} ${midX},${(prev.y + curr.y) / 2}`;
            path += ` T${curr.x},${curr.y}`;
        }
        return path;
    };

    const generateAreaPath = (points) => {
        if (points.length === 0) return "";

        let path = `M${points[0].x},${points[0].y}`;
        for (let i = 1; i < points.length; i++) {
            const prev = points[i - 1];
            const curr = points[i];
            const midX = (prev.x + curr.x) / 2;
            path += ` Q${midX},${prev.y} ${midX},${(prev.y + curr.y) / 2}`;
            path += ` T${curr.x},${curr.y}`;
        }
        path += ` L${points[points.length - 1].x},185 L${points[0].x},185 Z`;
        return path;
    };

    const graphPoints = generateGraphPoints();

    const stats = [
        { title: "Total Applications", value: jdCounts.totalAppliedJds, img: TA, text: "text-pink-600", line: TAL },
        { title: "Total Filtered", value: jdCounts.filteredJds, img: TF, text: "text-purple-600", line: TFL },
        { title: "Total Incoming JD", value: totalJdsCount, img: IF, text: "text-indigo-600", line: ISL },
        { title: "Total Unfiltered", value: jdCounts.unfilteredJds, img: TU, text: "text-pink-600", line: TAL },
    ];

    const pieSize = 220;
    const pieCenter = pieSize / 2;
    const outerRadius = 90;
    const middleRadius = 68;
    const innerRadius = 46;
    const strokeWidth = 14;

    const outerCircumference = 2 * Math.PI * outerRadius;
    const middleCircumference = 2 * Math.PI * middleRadius;
    const innerCircumference = 2 * Math.PI * innerRadius;

    const totalForPie = applicationDistribution.total || 1;
    const outerPercent = 100;
    const pendingPercent = Math.round((applicationDistribution.pending / totalForPie) * 100);
    const filteredPercent = Math.round((applicationDistribution.filtered / totalForPie) * 100);

    return (
        <div className="min-h-screen">
            <div className="space-y-4">
                <div className="grid gap-4 sm:gap-6 lg:grid-cols-5">
                    <div className="relative h-full w-full overflow-hidden rounded-xl sm:rounded-2xl lg:col-span-3">
                        <img src={img} alt="Dashboard Banner" className="h-full w-full object-cover" />
                        <div className="absolute inset-0 flex flex-col items-end p-4 sm:p-6 md:p-8">
                            <p className="mb-1 text-[10px] sm:text-xl text-white/90">
                                {formatDate(currentDateTime)}
                            </p>
                            <h1 className="text-right text-xl font-bold text-white sm:text-4xl lg:text-5xl">
                                {getGreeting()}, {getFirstName(user?.name)}!
                            </h1>
                            <p className="mt-1 max-w-[200px] text-right text-[10px] text-white/90 sm:max-w-xs sm:text-sm">
                                Land your dream job faster, track progress, and celebrate every win
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 min-[480px]:grid-cols-2 gap-2 sm:gap-3 md:gap-4 lg:col-span-2">
                        {stats.map((stat, index) => (
                            <div key={index} className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 shadow-sm flex flex-col justify-between">
                                <div className="flex justify-between items-center gap-2">
                                    <p className="text-gray-500 text-xs sm:text-sm md:text-base lg:text-lg leading-tight">{stat.title}</p>
                                    <img src={stat.img} alt="" className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 object-contain flex-shrink-0" />
                                </div>
                                <div className="flex justify-between items-center mt-2">
                                    <h2 className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold ${stat.text}`}>{stat.value}</h2>
                                    <img src={stat.line} alt="" className="sm:h-6 md:h-6 lg:h-8 w-auto object-contain flex-shrink-0" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-5">
                    <div className="rounded-xl sm:rounded-2xl bg-white p-4 sm:p-5 shadow-sm lg:col-span-2 h-[380px] sm:h-[400px] md:h-[420px] flex flex-col">
                        <div className="flex items-center justify-between mb-3 sm:mb-4 flex-shrink-0">
                            <h2 className="text-sm sm:text-base font-semibold text-slate-900">Application Status</h2>
                            <Link to="/Candidate-Dashboard/AppliedJD" className="text-xs sm:text-sm font-medium text-indigo-500 hover:underline">View All</Link>
                        </div>
                        <div className="flex-1 overflow-x-auto overflow-y-auto pr-1 sm:pr-2">
                            <div className="space-y-3 sm:space-y-4 min-w-[400px]">
                                {applicationStatus.length > 0 ? (
                                    applicationStatus.map((app) => (
                                        <div key={app.id} className="relative flex justify-between gap-2 rounded-lg sm:rounded-xl bg-slate-50 p-3">
                                            <span className={`absolute left-0 top-0 h-full w-1 rounded-full ${app.lineColor}`} />
                                            <div className="pl-3 space-y-0.5 flex-1">
                                                <p className="text-xs sm:text-sm font-semibold text-slate-900">
                                                    {truncateText(app.role, 30) || "Job Position"}
                                                </p>
                                                <p className="text-[10px] sm:text-xs text-slate-500">{app.company}</p>
                                                <p className="text-[10px] text-slate-400 line-clamp-1">
                                                    {truncateText(app.jobSummary, 40)}
                                                </p>
                                            </div>
                                            <div className="flex items-center pl-3">
                                                {app.aiScore !== undefined && (
                                                    <p className="text-[11px] font-semibold text-slate-700">
                                                        AI Score: {app.aiScore}%
                                                    </p>
                                                )}
                                            </div>
                                            <div className="flex items-center pl-3">
                                                <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${app.badgeClass}`}>
                                                    {app.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex items-center justify-center h-full text-slate-400 text-sm">
                                        No applications yet
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl sm:rounded-2xl bg-white p-3 sm:p-4 md:p-5 shadow-sm lg:col-span-3 h-[380px] sm:h-[400px] md:h-[420px] flex flex-col">
                        <div className="flex items-center justify-between mb-3 sm:mb-4 flex-shrink-0">
                            <h2 className="text-sm sm:text-base md:text-lg font-bold text-[#11142D] tracking-tight">Jobs Analytics</h2>
                            <button className="flex items-center gap-1 sm:gap-1.5 rounded-full border border-slate-200 px-2 sm:px-3 py-1 text-[10px] sm:text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                                Daily
                                <svg className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                        </div>
                        <div className="flex flex-1 min-h-0 gap-3 sm:gap-4">
                            <div className="flex-1 min-w-0 overflow-x-auto">
                                <div className="min-w-[300px] h-full">
                                    <svg viewBox="0 0 400 220" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
                                        <defs>
                                            <linearGradient id="gradientArea" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#4C6FFF" stopOpacity="0.2" />
                                                <stop offset="100%" stopColor="#4C6FFF" stopOpacity="0" />
                                            </linearGradient>
                                        </defs>
                                        {[0, 25, 50, 75, 100].map((val, i) => (
                                            <text key={i} x="28" y={185 - (i * 38)} fontSize="10" fill="#94A3B8" textAnchor="end" alignmentBaseline="middle">{val}</text>
                                        ))}
                                        {[0, 1, 2, 3, 4].map((i) => (
                                            <line key={i} x1="35" y1={185 - (i * 38)} x2="390" y2={185 - (i * 38)} stroke="#E2E8F0" strokeWidth="0.5" opacity="0.5" />
                                        ))}
                                        <g transform="translate(40, 0)">
                                            <path d={generateAreaPath(graphPoints)} fill="url(#gradientArea)" />
                                            <path d={generatePath(graphPoints)} fill="none" stroke="#8CA3FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                            {graphPoints.map((point, i) => (
                                                <g key={i}>
                                                    {point.highlight ? (
                                                        <>
                                                            <line x1={point.x} y1={point.y} x2={point.x} y2="185" stroke="#8CA3FF" strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />
                                                            <g transform={`translate(${point.x}, ${point.y - 25})`}>
                                                                <rect x="-18" y="-12" width="36" height="22" rx="5" fill="white" stroke="#E2E8F0" strokeWidth="1" />
                                                                <text x="0" y="3" textAnchor="middle" fontSize="10" fontWeight="600" fill="#4C6FFF">{point.score}</text>
                                                            </g>
                                                            <circle cx={point.x} cy={point.y} r="5" fill="white" stroke="#4C6FFF" strokeWidth="2" />
                                                        </>
                                                    ) : (
                                                        <circle cx={point.x} cy={point.y} r="3" fill="#A5B4FC" />
                                                    )}
                                                </g>
                                            ))}
                                        </g>
                                        {graphData.points.length > 0 ? (
                                            graphData.points.map((job, i) => (
                                                <text
                                                    key={i}
                                                    x={40 + (i * 50) + 10}
                                                    y="205"
                                                    fontSize="9"
                                                    fill="#94A3B8"
                                                    textAnchor="middle"
                                                    className="cursor-pointer hover:fill-[#4C6FFF]"
                                                    onMouseEnter={(e) => {
                                                        const rect = e.target.getBoundingClientRect();
                                                        setTooltipData({
                                                            show: true,
                                                            x: rect.left + rect.width / 2,
                                                            y: rect.top,
                                                            name: job.jobName || `Job ${i + 1}`
                                                        });
                                                    }}
                                                    onMouseLeave={() => setTooltipData({ ...tooltipData, show: false })}
                                                >
                                                    JD{i + 1}
                                                </text>
                                            ))
                                        ) : (
                                            ["JD1", "JD2", "JD3", "JD4", "JD5", "JD6", "JD7"].map((label, i) => (
                                                <text key={i} x={40 + (i * 50) + 10} y="205" fontSize="9" fill="#94A3B8" textAnchor="middle">{label}</text>
                                            ))
                                        )}
                                    </svg>
                                    {tooltipData.show && (
                                        <div
                                            className="fixed z-50 px-3 py-2 bg-slate-900 text-white text-xs rounded-lg shadow-lg pointer-events-none transform -translate-x-1/2"
                                            style={{
                                                left: tooltipData.x,
                                                top: tooltipData.y - 35,
                                            }}
                                        >
                                            <div className="font-medium truncate max-w-[180px]">{tooltipData.name}</div>
                                            <div className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-2 h-2 bg-slate-900 rotate-45"></div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-col justify-center gap-4 sm:gap-6 min-w-[80px] sm:min-w-[100px] lg:min-w-[110px] border-l border-slate-100 pl-3 sm:pl-4 flex-shrink-0">
                                <div className="text-right">
                                    <p className="text-[9px] sm:text-[10px] lg:text-xs font-medium text-slate-500 mb-1 leading-tight">Total Jobs<br />Applied</p>
                                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-[#FF5B99]">{jdCounts.totalAppliedJds}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[9px] sm:text-[10px] lg:text-xs font-medium text-slate-500 mb-1 leading-tight">Average<br />AI Score</p>
                                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-[#D55AF7]">{graphData.averageAiScore}%</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
                    <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-sm sm:text-base font-semibold text-slate-900">Application Distribution</h3>
                            <div className="flex gap-2">
                                <select
                                    value={distributionFilter}
                                    onChange={(e) => setDistributionFilter(e.target.value)}
                                    className="border border-slate-200 rounded-lg px-2 py-1 text-[10px] sm:text-xs font-medium text-slate-600 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="all">All Time</option>
                                    <option value="year">By Year</option>
                                    <option value="month">By Month</option>
                                </select>

                                {distributionFilter === 'year' && (
                                    <select
                                        value={selectedYear}
                                        onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                                        className="border border-slate-200 rounded-lg px-2 py-1 text-[10px] sm:text-xs font-medium text-slate-600 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    >
                                        {getAvailableYears().length > 0 ? (
                                            getAvailableYears().map(year => (
                                                <option key={year} value={year}>{year}</option>
                                            ))
                                        ) : (
                                            <option value={new Date().getFullYear()}>{new Date().getFullYear()}</option>
                                        )}
                                    </select>
                                )}

                                {distributionFilter === 'month' && (
                                    <>
                                        <select
                                            value={selectedYear}
                                            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                                            className="border border-slate-200 rounded-lg px-2 py-1 text-[10px] sm:text-xs font-medium text-slate-600 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        >
                                            {getAvailableYears().length > 0 ? (
                                                getAvailableYears().map(year => (
                                                    <option key={year} value={year}>{year}</option>
                                                ))
                                            ) : (
                                                <option value={new Date().getFullYear()}>{new Date().getFullYear()}</option>
                                            )}
                                        </select>
                                        <select
                                            value={selectedMonth}
                                            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                                            className="border border-slate-200 rounded-lg px-2 py-1 text-[10px] sm:text-xs font-medium text-slate-600 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        >
                                            {months.map((month, index) => (
                                                <option key={index} value={index}>{month.slice(0, 3)}</option>
                                            ))}
                                        </select>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="relative flex justify-center my-6 sm:my-8">
                            <svg width={pieSize} height={pieSize} className="max-w-[200px] sm:max-w-[220px]" viewBox={`0 0 ${pieSize} ${pieSize}`}>
                                <circle cx={pieCenter} cy={pieCenter} r={outerRadius} stroke="#f3e8ff" strokeWidth={strokeWidth} fill="none" />
                                <circle cx={pieCenter} cy={pieCenter} r={outerRadius} stroke="#A855F7" strokeWidth={strokeWidth} fill="none" strokeLinecap="round" strokeDasharray={outerCircumference} strokeDashoffset={outerCircumference - (outerPercent / 100) * outerCircumference} transform={`rotate(-90 ${pieCenter} ${pieCenter})`} />

                                <circle cx={pieCenter} cy={pieCenter} r={middleRadius} stroke="#fef3c7" strokeWidth={strokeWidth} fill="none" />
                                <circle cx={pieCenter} cy={pieCenter} r={middleRadius} stroke="#F59E0B" strokeWidth={strokeWidth} fill="none" strokeLinecap="round" strokeDasharray={middleCircumference} strokeDashoffset={middleCircumference - (pendingPercent / 100) * middleCircumference} transform={`rotate(-90 ${pieCenter} ${pieCenter})`} />

                                <circle cx={pieCenter} cy={pieCenter} r={innerRadius} stroke="#d1fae5" strokeWidth={strokeWidth} fill="none" />
                                <circle cx={pieCenter} cy={pieCenter} r={innerRadius} stroke="#10B981" strokeWidth={strokeWidth} fill="none" strokeLinecap="round" strokeDasharray={innerCircumference} strokeDashoffset={innerCircumference - (filteredPercent / 100) * innerCircumference} transform={`rotate(-90 ${pieCenter} ${pieCenter})`} />
                            </svg>
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                                <p className="text-xs sm:text-sm text-slate-500">Total</p>
                                <p className="text-xl sm:text-2xl font-bold text-slate-900">{applicationDistribution.total}</p>
                            </div>
                        </div>
                        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 text-[10px] sm:text-xs">
                            <div className="flex items-center gap-1.5">
                                <span className="w-3 sm:w-4 h-2 sm:h-2.5 rounded-full bg-purple-500"></span>
                                <span className="text-slate-600">Total</span>
                                <span className="font-semibold">{applicationDistribution.total}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="w-3 sm:w-4 h-2 sm:h-2.5 rounded-full bg-amber-500"></span>
                                <span className="text-slate-600">Pending</span>
                                <span className="font-semibold">{applicationDistribution.pending}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="w-3 sm:w-4 h-2 sm:h-2.5 rounded-full bg-emerald-500"></span>
                                <span className="text-slate-600">Filtered</span>
                                <span className="font-semibold">{applicationDistribution.filtered}</span>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl sm:rounded-2xl bg-white p-4 sm:p-5 shadow-sm lg:col-span-2 min-w-0 overflow-hidden h-[380px] sm:h-[400px] md:h-[420px] flex flex-col">
                        <div className="mb-3 sm:mb-4 flex items-center justify-between flex-shrink-0">
                            <h2 className="text-sm sm:text-base font-semibold">Job Recommendations</h2>
                            <Link to="/Candidate-Dashboard/Alljds" className="text-[10px] sm:text-xs font-medium text-indigo-500 hover:underline">View All</Link>
                        </div>
                        <div className="overflow-x-auto overflow-y-auto -mx-4 sm:-mx-5 px-4 sm:px-5 flex-1">
                            <div className="space-y-3 sm:space-y-4 min-w-[520px]">
                                {latestFiveJds.length > 0 ? (
                                    latestFiveJds.map((job, index) => {
                                        const salary = extractSalary(job.benefits);
                                        return (
                                            <div key={job._id || index} className="flex items-center justify-between gap-4 rounded-xl sm:rounded-2xl border border-slate-300 p-3 sm:p-4">
                                                <div className="space-y-1 flex-1 min-w-0">
                                                    <p className="text-xs sm:text-sm font-semibold truncate">
                                                        {job.keyResponsibilities || truncateText(job.jobSummary, 40) || "Job Position"}
                                                    </p>
                                                    <p className="text-[10px] sm:text-xs text-slate-500">
                                                        {job.companyName}
                                                    </p>
                                                    <p className="text-[10px] sm:text-[11px] font-medium text-rose-500">
                                                        {job.appliedCandidates?.length || 0}+ applications
                                                    </p>
                                                    <div className="mt-1.5 sm:mt-2 flex flex-wrap gap-1.5 sm:gap-2 text-[9px] sm:text-[11px]">
                                                        {job.requiredQualifications && (
                                                            <span className="rounded-full bg-slate-200 px-2 sm:px-3 py-0.5 sm:py-1 font-medium text-slate-700 flex items-center whitespace-nowrap">
                                                                <User2 className="h-3 w-3 mr-1" />
                                                                {job.requiredQualifications}
                                                            </span>
                                                        )}
                                                        <span className="rounded-full bg-slate-200 px-2 sm:px-3 py-0.5 sm:py-1 font-medium text-slate-700 flex items-center whitespace-nowrap">
                                                            <Briefcase className="h-3 w-3 mr-1" />
                                                            Full Time
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end justify-center gap-2 flex-shrink-0">
                                                    <span className={`text-xs sm:text-sm font-semibold border border-slate-300 rounded-2xl px-3 py-1 ${salary === 'N/A' ? 'text-slate-400' : 'text-slate-700'}`}>
                                                        {salary}
                                                    </span>
                                                    <p className="text-[10px] sm:text-[11px] text-slate-400">
                                                        {formatTimeAgo(job.createdAt)}
                                                    </p>
                                                    <button className="inline-flex items-center rounded-full bg-slate-900 px-3 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-xs font-semibold text-white hover:bg-slate-800 whitespace-nowrap">
                                                        Apply Now
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="flex items-center justify-center h-full text-slate-400 text-sm py-10">
                                        No job recommendations available
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CandidateDashboard;