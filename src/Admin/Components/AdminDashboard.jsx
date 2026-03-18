import { useEffect, useState, useMemo } from "react";
import { useNavigate } from 'react-router-dom';
import heroImage from "../../assets/Frame.png";
import { RadialBarChart, PieChart, Pie, Cell, RadialBar, ResponsiveContainer, Tooltip, CartesianGrid, XAxis, YAxis, Area, AreaChart } from 'recharts';
import axios from "axios";
import ISL from "../../img/ISL.png"
import TFL from "../../img/TFL.png"
import TAL from "../../img/TAL.png"
import img1 from "../../img/adminDash-card1.png"
import img2 from "../../img/adminDash-card2.png"
import { baseUrl } from "../../utils/ApiConstants";


function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState({
    rmgCount: 0,
    hrCount: 0,
    candidatesCount: 0,
    offersCount: 0,
    jdCount: 0,
    candidates: [],
    offers: [],
    jds: [],
  });

  const [systemOverviewFilter, setSystemOverviewFilter] = useState("yearly");
  const [jdPriorityFilter, setJdPriorityFilter] = useState("yearly");
  const [jdGenerationYear, setJdGenerationYear] = useState("2026");
  const [monthlyTrendYear, setMonthlyTrendYear] = useState("2026");
  const [loading, setLoading] = useState(true);

  const availableYears = ["2025", "2026"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        const [allrmg, allhr, allcandidates, alloffers, jdcreatedbyhr] = await Promise.all([
          axios.get(`${baseUrl}/admin/allrmg`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${baseUrl}/admin/allhr`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${baseUrl}/jd/all-candidates`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${baseUrl}/offer/all-offers`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${baseUrl}/jd/all-jd-admin`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        setDashboardData({
          rmgCount: allrmg.data?.count || 0,
          hrCount: allhr.data?.count || 0,
          candidatesCount: allcandidates.data?.count || 0,
          offersCount: alloffers.data?.count || 0,
          jdCount: jdcreatedbyhr.data?.count || 0,
          candidates: allcandidates.data?.data || [],
          offers: alloffers.data?.data || [],
          jds: jdcreatedbyhr.data?.data || [],
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  const getMonthFromDate = (dateString) => new Date(dateString).getMonth();
  const getYearFromDate = (dateString) => new Date(dateString).getFullYear().toString();

  const stats = useMemo(() => [
    { title: "Total Jobs", value: dashboardData.offersCount, line: TAL, img: img1, text: "text-green-600" },
    { title: "Total Applicants", value: dashboardData.candidatesCount, line: ISL, img: img2, text: "text-red-600" },
    { title: "Total JDs", value: dashboardData.jdCount, line: TFL, img: img2, text: "text-green-600" },
    { title: "Total Recruiters", value: dashboardData.hrCount, line: TAL, img: img1, text: "text-green-600" },
  ], [dashboardData]);

  const chartData = useMemo(() => {
    const currentYear = systemOverviewFilter === "yearly" ? "2026" : new Date().getFullYear().toString();
    const currentMonth = new Date().getMonth();

    const filterData = (data, dateField) => {
      return data.filter(item => {
        const itemDate = new Date(item[dateField]);
        const itemYear = itemDate.getFullYear().toString();
        const itemMonth = itemDate.getMonth();
        if (systemOverviewFilter === "yearly") return itemYear === currentYear;
        return itemYear === currentYear && itemMonth === currentMonth;
      });
    };

    const filteredCandidates = filterData(dashboardData.candidates, 'createdAt');
    const filteredOffers = filterData(dashboardData.offers, 'createdAt');
    const filteredJDs = filterData(dashboardData.jds, 'createdAt');
    const total = filteredCandidates.length + dashboardData.hrCount + filteredJDs.length + filteredOffers.length + dashboardData.rmgCount;

    const calculatePercentage = (count) => total === 0 ? 0 : Math.round((count / total) * 100);

    return [
      { name: 'Candidates', value: calculatePercentage(filteredCandidates.length), count: filteredCandidates.length, fill: '#FF8A9B' },
      { name: 'HRs', value: calculatePercentage(dashboardData.hrCount), count: dashboardData.hrCount, fill: '#6B71FF' },
      { name: 'JDs', value: calculatePercentage(filteredJDs.length), count: filteredJDs.length, fill: '#D9E87D' },
      { name: 'Requisitions', value: calculatePercentage(filteredOffers.length), count: filteredOffers.length, fill: '#E589F5' },
      { name: 'RMG', value: calculatePercentage(dashboardData.rmgCount), count: dashboardData.rmgCount, fill: '#5BC0DE' },
    ];
  }, [dashboardData, systemOverviewFilter]);

  const priorityData = useMemo(() => {
    const currentYear = new Date().getFullYear().toString();
    const currentMonth = new Date().getMonth();

    const filteredOffers = dashboardData.offers.filter(offer => {
      const offerDate = new Date(offer.createdAt);
      const offerYear = offerDate.getFullYear().toString();
      const offerMonth = offerDate.getMonth();
      if (jdPriorityFilter === "yearly") return offerYear === currentYear;
      return offerYear === currentYear && offerMonth === currentMonth;
    });

    const priorityCounts = { low: 0, model: 0, high: 0, critical: 0 };

    filteredOffers.forEach(offer => {
      const priority = offer.priority?.toLowerCase() || 'low';
      if (priority === 'low') priorityCounts.low++;
      else if (priority === 'model' || priority === 'medium') priorityCounts.model++;
      else if (priority === 'high') priorityCounts.high++;
      else if (priority === 'critical') priorityCounts.critical++;
    });

    return [
      { priority_level: "low", count: priorityCounts.low },
      { priority_level: "medium", count: priorityCounts.model },
      { priority_level: "high", count: priorityCounts.high },
      { priority_level: "critical", count: priorityCounts.critical },
    ];
  }, [dashboardData.offers, jdPriorityFilter]);

  const maxCount = Math.max(...priorityData.map((d) => d.count), 1);

  const mostActivePriority = useMemo(() => {
    const maxItem = priorityData.reduce((max, item) => item.count > max.count ? item : max, priorityData[0]);
    return maxItem.priority_level.charAt(0).toUpperCase() + maxItem.priority_level.slice(1);
  }, [priorityData]);

  const jdGenerationData = useMemo(() => {
    const jobTitleCounts = {};

    dashboardData.offers
      .filter(offer => getYearFromDate(offer.createdAt) === jdGenerationYear)
      .forEach(offer => {
        const jobTitle = offer.jobTitle || 'Unknown';
        const month = getMonthFromDate(offer.createdAt);
        if (!jobTitleCounts[jobTitle]) jobTitleCounts[jobTitle] = {};
        if (!jobTitleCounts[jobTitle][month]) jobTitleCounts[jobTitle][month] = 0;
        jobTitleCounts[jobTitle][month]++;
      });

    const sortedTitles = Object.entries(jobTitleCounts)
      .map(([title, monthsData]) => ({
        title,
        total: Object.values(monthsData).reduce((a, b) => a + b, 0),
        months: monthsData
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);

    const maxMonthlyCount = Math.max(...sortedTitles.flatMap(item => Object.values(item.months)), 1);

    return {
      roles: sortedTitles.map(item => item.title),
      data: sortedTitles.map(item => ({
        role: item.title,
        monthlyData: months.map((_, monthIndex) => ({
          month: months[monthIndex],
          count: item.months[monthIndex] || 0,
          percentage: Math.round(((item.months[monthIndex] || 0) / maxMonthlyCount) * 100)
        }))
      }))
    };
  }, [dashboardData.offers, jdGenerationYear]);

  const { trendData, trendTotals } = useMemo(() => {
    const monthlyData = months.map((monthName) => ({
      name: monthName.toUpperCase(),
      candidates: 0,
      jd: 0,
      offers: 0,
    }));

    let totalCandidates = 0;
    let totalJD = 0;
    let totalOffers = 0;

    dashboardData.candidates
      .filter(c => getYearFromDate(c.createdAt) === monthlyTrendYear)
      .forEach(candidate => {
        const month = getMonthFromDate(candidate.createdAt);
        monthlyData[month].candidates++;
        totalCandidates++;
      });

    dashboardData.jds
      .filter(j => getYearFromDate(j.createdAt) === monthlyTrendYear)
      .forEach(jd => {
        const month = getMonthFromDate(jd.createdAt);
        monthlyData[month].jd++;
        totalJD++;
      });

    dashboardData.offers
      .filter(o => getYearFromDate(o.createdAt) === monthlyTrendYear)
      .forEach(offer => {
        const month = getMonthFromDate(offer.createdAt);
        monthlyData[month].offers++;
        totalOffers++;
      });

    return {
      trendData: monthlyData,
      trendTotals: { candidates: totalCandidates, jd: totalJD, offers: totalOffers }
    };
  }, [dashboardData, monthlyTrendYear]);

  const candidatesTableData = useMemo(() => {
    const avatarColors = ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#EC4899'];
    return dashboardData.candidates
      .slice(-5)
      .reverse()
      .map((candidate, index) => ({
        id: candidate._id,
        name: candidate.name,
        phone_no: candidate.phone,
        email: candidate.email,
        status: candidate.hasLoggedIn ? 'Active' : 'Pending',
        applied_date: new Date(candidate.createdAt).toLocaleDateString('en-CA'),
        avatar_color: avatarColors[index % avatarColors.length],
      }));
  }, [dashboardData.candidates]);

  const navigate = useNavigate();
  const user = { name: "Admin", role: "Administrator" };
  const now = new Date();

  const formatDate = (date) => date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  const getGreeting = () => {
    const hour = now.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const getFirstName = (name) => name?.split(" ")[0] || name;

  const getBarColor = (level) => {
    switch (level.toLowerCase()) {
      case "low": return "bg-indigo-300";
      case "model":
      case "medium": return "bg-indigo-500";
      case "high": return "bg-indigo-400";
      case "critical": return "bg-indigo-600";
      default: return "bg-indigo-400";
    }
  };

  const formatLabel = (level) => level.charAt(0).toUpperCase() + level.slice(1);

  const getColor = (percentage) => {
    if (percentage >= 80) return "bg-cyan-600";
    if (percentage >= 60) return "bg-cyan-500";
    if (percentage >= 40) return "bg-cyan-400";
    if (percentage >= 20) return "bg-cyan-300";
    if (percentage > 0) return "bg-cyan-200";
    return "bg-gray-100";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="space-y-6">

        {/* //middle banners */}
        <div className="grid grid-cols-1 min-[480px]:grid-cols-4 gap-4 lg:col-span-2 order-last lg:order-first">
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


        <div className="grid gap-4 sm:gap-6 lg:grid-cols-5">
          {/* banner */}
          <div className="relative h-40 w-full overflow-hidden rounded-xl sm:h-56 md:h-64 lg:h-72 lg:col-span-3">
            <img
              src={heroImage}
              alt="Dashboard Banner"
              className="absolute inset-0 h-full w-full object-cover"
            />

            <div className="relative z-10 flex h-full flex-col justify-center p-4 sm:p-8 md:p-10 lg:p-12">

              <p className="text-[10px] font-medium text-black/70 sm:text-xs md:text-sm lg:text-base">
                {formatDate(now)}
              </p>

              <h1 className="mt-1 text-xl font-bold text-black sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
                {getGreeting()}, {getFirstName(user?.name)}!
              </h1>

              <p className="mt-2 max-w-[180px] text-[10px] leading-tight text-black/80 sm:mt-4 sm:max-w-xs sm:text-sm md:text-base lg:max-w-md">
                Run the show effortlessly with smarter {user.role} controls and happy workflows.
              </p>

              <div className="mt-4 sm:mt-6">
                <button
                  onClick={() => navigate('/Admin-Dashboard/RecruiterManagement')}
                  className="w-fit rounded-lg bg-[#59459F] px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-[#483885] active:scale-95 sm:px-6 sm:py-3 sm:text-sm"
                >
                  Manage Recruiter
                </button>
              </div>
            </div>
          </div>
          {/* //pie chart */}

          <div className="lg:col-span-2 max-h-80">
            <div className="w-full h-full bg-white p-2 sm:p-2 rounded-xl sm:rounded-2xl shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-1  sm:mb-2">
                <h2 className="text-gray-900 text-sm sm:text-sm lg:text-xl font-semibold">System Overview</h2>
                <select
                  className="border border-gray-200 rounded-full px-3 sm:px-4 sm:py-1 text-gray-600 text-sm outline-none"
                  value={systemOverviewFilter}
                  onChange={(e) => setSystemOverviewFilter(e.target.value)}
                >
                  <option value="yearly">Yearly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              {/* Flex container to hold Chart (Left) and Legend (Right) */}
              <div className="flex flex-row items-center justify-between ">

                {/* Chart Container (Left) */}
                <div className="relative w-2/3 h-42 sm:h-47">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius="70%"
                        outerRadius="100%"
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} cornerRadius={10} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>

                  {/* Centered Text Overlay */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-gray-400 text-xs sm:text-sm font-medium">Total Roles</span>
                    <span className="text-gray-900 text-2xl sm:text-4xl font-bold">121</span>
                  </div>
                </div>

                {/* Legend Grid (Right Side, Vertical) */}
                <div className="flex flex-col gap-y-0.5 w-1/4">
                  {chartData.map((item, index) => (
                    <div key={index} className="flex flex-col items-end text-right">
                      <div className="flex items-center gap-0.2">
                        <span className="text-gray-900 text-xs sm:text-sm">{item.value}%</span>
                        <div className="w-4 h-2 rounded-full" style={{ backgroundColor: item.fill }} />
                      </div>
                      <span className="text-gray-500 text-xs sm:text-xs font-bold ">{item.name}</span>
                    </div>
                  ))}
                </div>

              </div>
            </div>
          </div>



        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">
          {/* Job Priority */}
          <div className="lg:col-span-2"> {/* Adjusted span based on your 40/60 preference */}
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 h-full flex flex-col">
              <div className="flex flex-row justify-between items-center mb-8">
                <h3 className="text-xl font-bold text-gray-900">JD Priority</h3>
                <select
                  className="text-sm border border-gray-200 rounded-full px-4 py-1.5 text-gray-600 outline-none"
                  value={jdPriorityFilter}
                  onChange={(e) => setJdPriorityFilter(e.target.value)}
                >
                  <option value="daily">Daily</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>

              <div className="flex-1 flex gap-4">
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
                        <span className="text-xs sm:text-sm text-gray-500 font-medium h-6 text-center">
                          {formatLabel(item.priority_level)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>


          <div className="lg:col-span-3 h-[400px]">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 py-3 px-4">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Candidates</h3>
              </div>
              <div className="flex-1 overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-100">
                      <th className="text-left py-3 px-2 text-xs sm:text-sm font-medium text-gray-500">Name</th>
                      <th className="text-left py-3 px-2 text-xs sm:text-sm font-medium text-gray-500">Phone</th>
                      <th className="text-left py-3 px-2 text-xs sm:text-sm font-medium text-gray-500">Email</th>
                      <th className="text-left py-3 px-2 text-xs sm:text-sm font-medium text-gray-500">Status</th>
                      <th className="text-left py-3 px-2 text-xs sm:text-sm font-medium text-gray-500">Applied Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {candidatesTableData.length > 0 ? (
                      candidatesTableData.map((candidate) => (
                        <tr key={candidate.id} className="border-b border-gray-50 hover:bg-gray-50">
                          <td className="py-3 px-2">
                            <div className="flex items-center gap-2">
                              <div
                                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium"
                                style={{ backgroundColor: candidate.avatar_color }}
                              >
                                {candidate.name?.charAt(0) || 'U'}
                              </div>
                              <span className="text-xs sm:text-sm text-gray-900">{candidate.name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-2 text-xs sm:text-sm text-gray-600">{candidate.phone_no}</td>
                          <td className="py-3 px-2 text-xs sm:text-sm text-gray-600 truncate max-w-[150px]">{candidate.email || 'N/A'}</td>
                          <td className="py-3 px-2">
                            <span className={`text-xs px-2 py-1 rounded-full ${candidate.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                              {candidate.status}
                            </span>
                          </td>
                          <td className="py-3 px-2 text-xs sm:text-sm text-gray-600">{candidate.applied_date}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="py-8 text-center text-gray-500">No candidates found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>


        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">






          <div className="lg:col-span-3 h-[400px] ">
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 h-full flex flex-col">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Monthly Trends</h2>
                <div className="flex flex-wrap items-center gap-4">
                  <select
                    className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 text-gray-600"
                    value={monthlyTrendYear}
                    onChange={(e) => setMonthlyTrendYear(e.target.value)}
                  >
                    {availableYears.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                  <div className="flex items-center gap-1.5 text-xs">
                    <div className="flex items-center gap-0.5">
                      <div className="w-3 h-3 rounded-full bg-[#ff8a9a]"></div>
                      <span>Candidates</span>
                      <span className="font-bold text-gray-800">({trendTotals.candidates})</span>
                    </div>
                    <div className="flex items-center gap-0.5">
                      <div className="w-3 h-3 rounded-full bg-[#8280ff]"></div>
                      <span>JD</span>
                      <span className="font-bold text-gray-800">({trendTotals.jd})</span>
                    </div>
                    <div className="flex items-center gap-0.5">
                      <div className="w-3 h-3 rounded-full bg-[#c58fff]"></div>
                      <span>Requisitions</span>
                      <span className="font-bold text-gray-800">({trendTotals.offers})</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-1 w-full overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <div className="min-w-[700px] h-full min-h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorCand" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ff8a9a" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#ff8a9a" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorJd" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8280ff" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#8280ff" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorOffers" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#c58fff" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#c58fff" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={false} stroke="#f0f0f0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9e9e9e', fontSize: 12 }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9e9e9e', fontSize: 12 }} />
                      <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                      <Area type="monotone" dataKey="candidates" stroke="#ff8a9a" strokeWidth={2} fillOpacity={1} fill="url(#colorCand)" dot={{ r: 4, fill: '#fff', stroke: '#ff8a9a', strokeWidth: 2 }} />
                      <Area type="monotone" dataKey="jd" stroke="#8280ff" strokeWidth={2} fillOpacity={1} fill="url(#colorJd)" dot={{ r: 4, fill: '#fff', stroke: '#8280ff', strokeWidth: 2 }} />
                      <Area type="monotone" dataKey="offers" stroke="#c58fff" strokeWidth={2} fillOpacity={1} fill="url(#colorOffers)" dot={{ r: 4, fill: '#fff', stroke: '#c58fff', strokeWidth: 2 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 h-[400px]">
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 h-full flex flex-col">
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Create Job Description</h3>
                <div className="flex items-center gap-3">
                  <select
                    className="text-sm border border-gray-200 rounded-lg px-2 py-1 text-gray-600"
                    value={jdGenerationYear}
                    onChange={(e) => setJdGenerationYear(e.target.value)}
                  >
                    {availableYears.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                  <div className="flex items-center gap-1 text-xs text-gray-600">
                    <span>0%</span>
                    <div className="flex gap-0.5">
                      <div className="w-2 h-2 bg-gray-100"></div>
                      <div className="w-2 h-2 bg-cyan-200"></div>
                      <div className="w-2 h-2 bg-cyan-400"></div>
                      <div className="w-2 h-2 bg-cyan-600"></div>
                    </div>
                    <span>100%</span>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <div className="inline-block min-w-full">
                  <div className="flex gap-2">
                    <div className="flex flex-col gap-1 pt-6">
                      {jdGenerationData.roles.length > 0 ? (
                        jdGenerationData.roles.map((role, index) => (
                          <div
                            key={index}
                            className="h-8 flex items-center text-xs text-gray-600 pr-2 truncate"
                            style={{ minWidth: "100px", maxWidth: "120px" }}
                            title={role}
                          >
                            {role.length > 15 ? role.substring(0, 15) + '...' : role}
                          </div>
                        ))
                      ) : (
                        <div className="text-xs text-gray-400">No data</div>
                      )}
                    </div>

                    <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                      <div className="flex gap-1 mb-1">
                        {months.map((month, index) => (
                          <div key={index} className="w-6 text-center text-[10px] text-gray-600 font-medium">{month}</div>
                        ))}
                      </div>

                      {jdGenerationData.data.length > 0 ? (
                        jdGenerationData.data.map((roleData, roleIndex) => (
                          <div key={roleIndex} className="flex gap-1 mb-1">
                            {roleData.monthlyData.map((monthData, monthIndex) => (
                              <div
                                key={monthIndex}
                                className={`w-6 h-8 ${getColor(monthData.percentage)} rounded flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity relative group`}
                                title={`${monthData.count} JDs`}
                              >
                                <span className="text-[8px] font-semibold text-white opacity-0 group-hover:opacity-100">{monthData.count}</span>
                              </div>
                            ))}
                          </div>
                        ))
                      ) : (
                        <div className="text-xs text-gray-400 py-4 text-center">No JD data for {jdGenerationYear}</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>






      </div>
    </div>
  );
}

export default AdminDashboard;