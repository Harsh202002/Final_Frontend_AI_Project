import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import Pagination from '../../components/LandingPage/Pagination';
import { baseUrl } from '../../utils/ApiConstants';

function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    rmg: [],
    hr: [],
    candidates: [],
    jd: [],
    offers: []
  });
  const [activeTab, setActiveTab] = useState('overview');

  const [rmgPage, setRmgPage] = useState(1);
  const [hrPage, setHrPage] = useState(1);
  const [candidatesPage, setCandidatesPage] = useState(1);
  const [jdPage, setJdPage] = useState(1);
  const [offersPage, setOffersPage] = useState(1);

  const ROWS_PER_PAGE = 5;

  const COLORS = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#84cc16'];

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const token = localStorage.getItem("token");

        const [allRMG, allHR, allCandidates, allJD, allOffers] = await Promise.all([
          axios.get(`${baseUrl}/api/admin/allrmg`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${baseUrl}/api/admin/allhr`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${baseUrl}/api/jd/all-candidates`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${baseUrl}/api/jd/all-jd-admin`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${baseUrl}/api/offer/all-offers`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
        ]);

        setDashboardData({
          rmg: allRMG.data.data || [],
          hr: allHR.data.data || [],
          candidates: allCandidates.data.data || [],
          jd: allJD.data.data || [],
          offers: allOffers.data.data || []
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  useEffect(() => {
    setRmgPage(1);
    setHrPage(1);
    setCandidatesPage(1);
    setJdPage(1);
    setOffersPage(1);
  }, [activeTab]);

  const getPaginatedData = (data, currentPage) => {
    const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
    const endIndex = startIndex + ROWS_PER_PAGE;
    return data.slice(startIndex, endIndex);
  };

  const getTotalPages = (data) => {
    return Math.ceil(data.length / ROWS_PER_PAGE);
  };

  const overviewData = [
    { name: 'RMG', value: dashboardData.rmg.length },
    { name: 'HR', value: dashboardData.hr.length },
    { name: 'Candidates', value: dashboardData.candidates.length },
    { name: 'JDs', value: dashboardData.jd.length },
    { name: 'Offers', value: dashboardData.offers.length }
  ];

  const offerStatusData = dashboardData.offers.reduce((acc, offer) => {
    const status = offer.status || 'Unknown';
    const existing = acc.find(item => item.name === status);
    if (existing) existing.value += 1;
    else acc.push({ name: status, value: 1 });
    return acc;
  }, []);

  const offerPriorityData = dashboardData.offers.reduce((acc, offer) => {
    const priority = offer.priority || 'Unknown';
    const existing = acc.find(item => item.name === priority);
    if (existing) existing.value += 1;
    else acc.push({ name: priority, value: 1 });
    return acc;
  }, []);

  const jdAIData = [
    { name: 'AI Generated', value: dashboardData.jd.filter(jd => jd.generatedByAI).length },
    { name: 'Manual', value: dashboardData.jd.filter(jd => !jd.generatedByAI).length }
  ];

  const getMonthlyData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.map((month, index) => ({
      name: month,
      candidates: dashboardData.candidates.filter(c => new Date(c.createdAt).getMonth() === index).length,
      jd: dashboardData.jd.filter(j => new Date(j.createdAt).getMonth() === index).length,
      offers: dashboardData.offers.filter(o => new Date(o.createdAt).getMonth() === index).length
    }));
  };

  const getPriorityClass = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': case 'model': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'jd created': return 'bg-blue-100 text-blue-700';
      case 'active': return 'bg-green-100 text-green-700';
      case 'closed': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-600 font-medium">Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 mb-6 md:mb-8">
        <StatCard
          title="Total RMG"
          value={dashboardData.rmg.length}
          icon="👥"
          color="indigo"
        />
        <StatCard
          title="Total HR"
          value={dashboardData.hr.length}
          icon="👔"
          color="purple"
        />
        <StatCard
          title="Candidates"
          value={dashboardData.candidates.length}
          icon="📋"
          color="cyan"
        />
        <StatCard
          title="Job Descriptions"
          value={dashboardData.jd.length}
          icon="📝"
          color="emerald"
        />
        <StatCard
          title="Offers"
          value={dashboardData.offers.length}
          icon="💼"
          color="amber"
        />
      </div>

      <div className="flex flex-wrap gap-2 mb-6 bg-white p-2 rounded-xl shadow-sm">
        {['overview', 'users', 'candidates', 'jobs', 'offers'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize
              ${activeTab === tab
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6">
            <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                System Overview
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={overviewData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    dataKey="value"
                  >
                    {overviewData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                Data Distribution
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={overviewData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {overviewData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
            <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Offer Status</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={offerStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {offerStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">JD Generation</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={jdAIData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label
                  >
                    <Cell fill="#10b981" />
                    <Cell fill="#6366f1" />
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Priority</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={offerPriorityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {offerPriorityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm mb-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Monthly Trends</h3>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={getMonthlyData()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Legend />
                <Area type="monotone" dataKey="candidates" stackId="1" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.6} name="Candidates" />
                <Area type="monotone" dataKey="jd" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} name="Job Descriptions" />
                <Area type="monotone" dataKey="offers" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} name="Offers" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      {activeTab === 'users' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-800">👥 RMG Members</h3>
              <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                {dashboardData.rmg.length} total
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {getPaginatedData(dashboardData.rmg, rmgPage).map((rmg) => (
                    <tr key={rmg._id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center font-semibold text-sm">
                            {rmg.name?.charAt(0)?.toUpperCase()}
                          </div>
                          <span className="font-medium text-slate-700">{rmg.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-600 text-sm">{rmg.email}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${rmg.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                          {rmg.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-500 text-sm">
                        {new Date(rmg.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {getTotalPages(dashboardData.rmg) > 1 && (
              <Pagination
                currentPage={rmgPage}
                totalPages={getTotalPages(dashboardData.rmg)}
                onPageChange={setRmgPage}
              />
            )}
          </div>

          <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-800">👔 HR Members</h3>
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                {dashboardData.hr.length} total
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Phone</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {getPaginatedData(dashboardData.hr, hrPage).map((hr) => (
                    <tr key={hr._id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center font-semibold text-sm">
                            {hr.name?.charAt(0)?.toUpperCase()}
                          </div>
                          <span className="font-medium text-slate-700">{hr.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-600 text-sm">{hr.email}</td>
                      <td className="py-3 px-4 text-slate-600 text-sm">{hr.phone || 'N/A'}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${hr.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                          {hr.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {getTotalPages(dashboardData.hr) > 1 && (
              <Pagination
                currentPage={hrPage}
                totalPages={getTotalPages(dashboardData.hr)}
                onPageChange={setHrPage}
              />
            )}
          </div>
        </div>
      )}

      {activeTab === 'candidates' && (
        <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h3 className="text-lg font-semibold text-slate-800">📋 All Candidates</h3>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-cyan-100 text-cyan-700 rounded-full text-sm font-medium whitespace-nowrap">
                {dashboardData.candidates.length} total
              </span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Phone</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Skills</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Applied</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {getPaginatedData(dashboardData.candidates, candidatesPage).map((candidate) => (
                  <tr key={candidate._id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 text-white flex items-center justify-center font-semibold">
                          {candidate.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-slate-700">{candidate.name}</p>
                          <p className="text-xs text-slate-400">ID: {candidate._id.slice(-6)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-slate-600 text-sm">{candidate.email}</td>
                    <td className="py-4 px-4 text-slate-600 text-sm">{candidate.phone}</td>
                    <td className="py-4 px-4">
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {candidate.skills?.slice(0, 3).map((skill, i) => (
                          <span key={i} className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded text-xs font-medium">
                            {skill}
                          </span>
                        ))}
                        {candidate.skills?.length > 3 && (
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-xs">
                            +{candidate.skills.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${candidate.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                        {candidate.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-500 text-sm">
                      {new Date(candidate.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {getTotalPages(dashboardData.candidates) > 1 && (
            <Pagination
              currentPage={candidatesPage}
              totalPages={getTotalPages(dashboardData.candidates)}
              onPageChange={setCandidatesPage}
            />
          )}
        </div>
      )}

      {activeTab === 'jobs' && (
        <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h3 className="text-lg font-semibold text-slate-800">📝 Job Descriptions</h3>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
              {dashboardData.jd.length} total
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Company</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Department</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Created By</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Applied</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Summary</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {getPaginatedData(dashboardData.jd, jdPage).map((jd) => (
                  <tr key={jd._id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-4">
                      <p className="font-medium text-slate-700">{jd.companyName || 'N/A'}</p>
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-sm">
                        {jd.department || 'N/A'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-600 text-sm">{jd.createdBy?.name || 'N/A'}</td>
                    <td className="py-4 px-4">
                      <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
                        {jd.appliedCandidates?.length || 0}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm text-slate-600 max-w-[200px] truncate">
                        {jd.jobSummary || 'No summary'}
                      </p>
                    </td>
                    <td className="py-4 px-4 text-slate-500 text-sm">
                      {new Date(jd.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {getTotalPages(dashboardData.jd) > 1 && (
            <Pagination
              currentPage={jdPage}
              totalPages={getTotalPages(dashboardData.jd)}
              onPageChange={setJdPage}
            />
          )}
        </div>
      )}

      {activeTab === 'offers' && (
        <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h3 className="text-lg font-semibold text-slate-800">💼 All Offers</h3>
            <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
              {dashboardData.offers.length} total
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Job Title</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Location</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Type</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Experience</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Salary</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Priority</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Due Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {getPaginatedData(dashboardData.offers, offersPage).map((offer) => (
                  <tr key={offer._id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-4">
                      <p className="font-semibold text-slate-700">{offer.jobTitle}</p>
                      <p className="text-xs text-slate-400">{offer.description?.slice(0, 50)}...</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-slate-600 text-sm">{offer.city}, {offer.state}</p>
                      <p className="text-xs text-slate-400">{offer.country}</p>
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
                        {offer.employmentType}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-600 text-sm">{offer.experience}</td>
                    <td className="py-4 px-4">
                      <span className="font-semibold text-emerald-600">
                        {offer.currency} {offer.salary?.toLocaleString()}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityClass(offer.priority)}`}>
                        {offer.priority}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(offer.status)}`}>
                        {offer.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-500 text-sm">
                      {new Date(offer.dueDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {getTotalPages(dashboardData.offers) > 1 && (
            <Pagination
              currentPage={offersPage}
              totalPages={getTotalPages(dashboardData.offers)}
              onPageChange={setOffersPage}
            />
          )}
        </div>
      )}

    </div>
  );
}

const StatCard = ({ title, value, icon, color, trend }) => {
  const colorClasses = {
    indigo: 'from-indigo-500 to-indigo-600 bg-indigo-100',
    purple: 'from-purple-500 to-purple-600 bg-purple-100',
    cyan: 'from-cyan-500 to-cyan-600 bg-cyan-100',
    emerald: 'from-emerald-500 to-emerald-600 bg-emerald-100',
    amber: 'from-amber-500 to-amber-600 bg-amber-100',
  };

  return (
    <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-100 group">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-500 text-sm font-medium">{title}</p>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mt-1 group-hover:scale-105 transition-transform">
            {value}
          </h2>
          <p className="text-xs text-emerald-500 font-medium mt-2 flex items-center gap-1">
            {trend}
          </p>
        </div>
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClasses[color].split(' ').slice(0, 2).join(' ')} flex items-center justify-center shadow-lg`}>
          <span className="text-xl">{icon}</span>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;