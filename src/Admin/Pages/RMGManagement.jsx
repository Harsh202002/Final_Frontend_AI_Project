import React, { useState, useEffect } from 'react';
import { Search, Trash2, Eye, User, SlidersVertical } from 'lucide-react';
import Pagination from '../../components/LandingPage/Pagination';
import AddNewRMG from '../Components/AddNewRMG';
import { baseUrl } from '../../utils/ApiConstants';
import axios from 'axios';

function RMGManagement() {
  const [recruiters, setRecruiters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activityLogs, setActivityLogs] = useState([]);
  const [editingRMG, setEditingRMG] = useState(null);

  useEffect(() => {
    const fetchAllRMG = async () => {
      try {
        const res = await axios.get(`${baseUrl}/admin/allrmg`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });

        console.log(res.data);
        
        
        if (res.data.success && res.data.data) {
          const mappedData = res.data.data.map((rmg, index) => ({
            id: rmg._id || `temp_${index}`,
            name: rmg.name || 'NA',
            email: rmg.email || 'NA',
            phone: rmg.phone || 'NA',
            status: rmg.isActive ? 'Active' : 'Inactive',
            registerId: rmg.registerId || 'NA',
            registerDate: rmg.createdAt ? new Date(rmg.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'NA',
            lastLogin: rmg.lastLogin ? new Date(rmg.lastLogin).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'NA',
            associates: rmg.associates || [],
            totalRecruiterManaged: rmg.totalRecruiterManaged || 0,
            totalJDHandled: rmg.totalJDHandled || 0,
            candidateSelected: rmg.candidateSelected || 0,
            candidateNotSelected: rmg.candidateNotSelected || 0,
            successRate: rmg.successRate || 0,
            role: rmg.role || 'NA',
            company: rmg.company || 'NA',
            createdAt: rmg.createdAt
          }));
          
          setRecruiters(mappedData);

          const initialLogs = mappedData.map(rmg => ({
            date: rmg.registerDate,
            action: `RMG ${rmg.name} Created`,
            by: "Admin",
            timestamp: new Date(rmg.createdAt).getTime()
          }));
          
          const deactivatedLogs = mappedData
            .filter(rmg => rmg.status === 'Inactive')
            .map(rmg => ({
              date: rmg.registerDate,
              action: `RMG ${rmg.name} Deactivated`,
              by: "Admin",
              timestamp: new Date(rmg.createdAt).getTime() + 1000 
            }));
          
          const allLogs = [...initialLogs, ...deactivatedLogs]
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, 5);
          
          setActivityLogs(allLogs);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching RMG data:", error);
        setLoading(false);
      }
    }

    fetchAllRMG();
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedRecruiter, setSelectedRecruiter] = useState(null);

  const itemsPerPage = 5;

  const filteredRecruiters = recruiters.filter(recruiter =>
    recruiter.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    recruiter.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    recruiter.phone.includes(searchQuery)
  );

  const totalPages = Math.ceil(filteredRecruiters.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRecruiters = filteredRecruiters.slice(startIndex, endIndex);

  useEffect(() => {
    if (recruiters.length > 0 && !selectedRecruiter) {
      setSelectedRecruiter(recruiters[0]);
    }
  }, [recruiters, selectedRecruiter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleDelete = async (id) => {
    try {
      const rmgToDelete = recruiters.find(r => r.id === id);
      
      const res = await axios.delete(`${baseUrl}/admin/rmg/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      alert("RMG deleted successfully!");

      if (res.data.success) {
        const newLog = {
          date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
          action: `RMG ${rmgToDelete.name} Deleted`,
          by: "Admin",
          timestamp: Date.now()
        };
        
        setActivityLogs(prev => [newLog, ...prev].slice(0, 5));
        
        setRecruiters(recruiters.filter(r => r.id !== id));
        if (selectedRecruiter?.id === id) {
          const remaining = recruiters.filter(r => r.id !== id);
          setSelectedRecruiter(remaining.length > 0 ? remaining[0] : null);
        }
        const newFilteredLength = recruiters.filter(r => r.id !== id).length;
        const newTotalPages = Math.ceil(newFilteredLength / itemsPerPage);
        if (currentPage > newTotalPages && newTotalPages > 0) {
          setCurrentPage(newTotalPages);
        }
      }
    } catch (error) {
      console.error("Error deleting RMG:", error);
      alert(error.response?.data?.message || 'Failed to delete RMG');
    }
  };

  const handleViewDetails = (recruiter) => {
    setSelectedRecruiter(recruiter);
  };

  const handleEditRMG = (recruiter) => {
    setEditingRMG(recruiter);
    setShowAddForm(true);
  };

  const handleSaveRMG = (responseData) => {
    if (editingRMG) {
      const updatedRecruiters = recruiters.map(r => 
        r.id === editingRMG.id 
          ? {
              ...r,
              name: responseData.name || responseData.fullName,
              email: responseData.email,
              phone: responseData.phone
            }
          : r
      );
      
      setRecruiters(updatedRecruiters);
      
      if (selectedRecruiter?.id === editingRMG.id) {
        setSelectedRecruiter({
          ...selectedRecruiter,
          name: responseData.name || responseData.fullName,
          email: responseData.email,
          phone: responseData.phone
        });
      }

      const newLog = {
        date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        action: `RMG ${responseData.name || responseData.fullName} Updated`,
        by: "Admin",
        timestamp: Date.now()
      };
      
      setActivityLogs(prev => [newLog, ...prev].slice(0, 5));
    } else {
      const newRecruiter = {
        id: responseData.data?._id || `temp_${Date.now()}`,
        name: responseData.data?.name || responseData.fullName || 'NA',
        email: responseData.data?.email || responseData.email || 'NA',
        phone: responseData.data?.phone || responseData.phone || 'NA',
        status: 'Active',
        registerId: `#324459${recruiters.length}`,
        registerDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        lastLogin: 'Just now',
        associates: [],
        totalRecruiterManaged: 0,
        totalJDHandled: 0,
        candidateSelected: 0,
        candidateNotSelected: 0,
        successRate: 0,
        role: 'RMG',
        company: responseData.data?.company || 'NA',
        createdAt: new Date()
      };
      
      const newLog = {
        date: newRecruiter.registerDate,
        action: `RMG ${newRecruiter.name} Created`,
        by: "Admin",
        timestamp: Date.now()
      };
      
      setActivityLogs(prev => [newLog, ...prev].slice(0, 5));
      setRecruiters([...recruiters, newRecruiter]);
    }
    
    setShowAddForm(false);
    setEditingRMG(null);
  };

  const handleCancelForm = () => {
    setShowAddForm(false);
    setEditingRMG(null);
  };

  const handleToggleStatus = (recruiter) => {
    const updatedRecruiters = recruiters.map(r => {
      if (r.id === recruiter.id) {
        return { ...r, status: r.status === 'Active' ? 'Inactive' : 'Active' };
      }
      return r;
    });
    
    setRecruiters(updatedRecruiters);
    setSelectedRecruiter({ ...recruiter, status: recruiter.status === 'Active' ? 'Inactive' : 'Active' });
    
    const newLog = {
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      action: `RMG ${recruiter.name} ${recruiter.status === 'Active' ? 'Deactivated' : 'Activated'}`,
      by: "Admin",
      timestamp: Date.now()
    };
    
    setActivityLogs(prev => [newLog, ...prev].slice(0, 5));
  };

  const handleSuspend = (recruiter) => {
    const newLog = {
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      action: `RMG ${recruiter.name} Suspended`,
      by: "Admin",
      timestamp: Date.now()
    };
    
    setActivityLogs(prev => [newLog, ...prev].slice(0, 5));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading RMG data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row gap-2">
          <div className='rounded-2xl shadow-md border border-gray-300 flex-1 min-w-0'>
            <div className="m-4 md:m-6">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="relative w-full sm:w-96">
                  <input
                    type="text"
                    placeholder="Search by Name, Email or Phone"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-4 pr-12 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                  <button className="absolute right-0 top-0 h-full px-4 bg-black text-white rounded-r-lg hover:bg-gray-800 transition-colors">
                    <Search className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="flex-1 sm:flex-none px-6 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
                  >
                    {showAddForm ? 'Hide Form' : 'Add New'}
                  </button>
                  {/* <button className="flex gap-1 px-6 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium">
                    <SlidersVertical />
                    Filter
                  </button> */}
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-b-2xl">
              <div className="overflow-x-auto">
                <table className="min-w-[900px] w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 whitespace-nowrap">Name</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 whitespace-nowrap">Email</th>
                      {/* <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 whitespace-nowrap">Phone</th> */}
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 whitespace-nowrap">Status</th>
                      {/* <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 whitespace-nowrap">Total Recruiter Managed</th> */}
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 whitespace-nowrap">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {currentRecruiters.length > 0 ? (
                      currentRecruiters.map((recruiter, index) => (
                        <tr key={recruiter.id} className={index % 2 === 0 ? 'bg-blue-50/30' : 'bg-white'}>
                          <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{recruiter.name}</td>
                          <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">{recruiter.email}</td>
                          {/* <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{recruiter.phone}</td> */}
                          <td className="px-6 py-4 text-sm whitespace-nowrap">
                            <span
                              className={`font-medium ${recruiter.status === 'Active' ? 'text-green-600' : 'text-red-600'}`}
                            >
                              {recruiter.status}
                            </span>
                          </td>
                          {/* <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{recruiter.totalRecruiterManaged}</td> */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleViewDetails(recruiter)}
                                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                              >
                                <Eye className="w-4 h-4 text-gray-600" />
                              </button>
                              <button
                                onClick={() => handleDelete(recruiter.id)}
                                className="p-2 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                              >
                                <Trash2 className="w-4 h-4 text-red-600" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                          No recruiters found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {filteredRecruiters.length > 0 && (
                <div className="border-t border-gray-200">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </div>
          </div>

          {selectedRecruiter && (
            <div className="bg-white shadow-md rounded-2xl border border-gray-300 p-5 w-full lg:w-[250px] h-fit">
              <div className="flex items-center gap-4">
                <div className="bg-gray-100 p-3 rounded-full">
                  <User className="w-6 h-6 text-gray-600" />
                </div>
                <div className="min-w-0">
                  <h2 className="font-semibold text-gray-900 text-lg truncate">{selectedRecruiter.name}</h2>
                  <p className="text-gray-500 text-sm truncate">{selectedRecruiter.email}</p>
                </div>
              </div>

              <div className="mt-4 text-sm text-gray-700 space-y-1">
                <p>
                  {/* <span className="font-medium text-gray-800">ID :</span> {selectedRecruiter.id} */}
                </p>
                <p>
                  <span className="font-medium text-gray-800">Register Date :</span> {selectedRecruiter.registerDate}
                </p>
                {/* <p>
                  <span className="font-medium text-gray-800">Last Login :</span> {selectedRecruiter.lastLogin}
                </p> */}
                <p>
                  <span className="font-medium text-gray-800">Role :</span> {selectedRecruiter.role}
                </p>
              </div>

              <hr className="my-4 border-gray-300" />

              {/* <div>
                <h3 className="font-medium text-gray-800 mb-1">Associate Recruiters</h3>
                {selectedRecruiter.associates && selectedRecruiter.associates.length > 0 ? (
                  selectedRecruiter.associates.map((associate, index) => (
                    <p key={index} className="text-gray-700 text-sm">{associate}</p>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No associates</p>
                )}
              </div> */}

              {/* <hr className="my-4 border-gray-300" /> */}

              {/* <div>
                <h3 className="font-medium text-gray-800 mb-2">Performance</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Total JD handled</span>
                    <span className="text-gray-900 font-medium">{selectedRecruiter.totalJDHandled}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Candidate Selected</span>
                    <span className="text-gray-900 font-medium">{selectedRecruiter.candidateSelected}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Candidate Not Selected</span>
                    <span className="text-gray-900 font-medium">{selectedRecruiter.candidateNotSelected}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Success Rate</span>
                    <span className="text-gray-900 font-medium">{selectedRecruiter.successRate}%</span>
                  </div>
                </div>
              </div> */}

              <div className="flex flex-col gap-2 mt-6">
                <div className="flex gap-2">
                  {/* <button 
                    onClick={() => handleSuspend(selectedRecruiter)}
                    className="border border-red-500 text-red-500 px-4 py-2 rounded-md font-medium hover:bg-red-50 transition flex-1"
                  >
                    Suspend
                  </button> */}
                  {/* <button 
                    onClick={() => handleToggleStatus(selectedRecruiter)}
                    className={`border ${selectedRecruiter.status === 'Active' ? 'border-gray-300 text-gray-700 bg-gray-50 hover:bg-gray-100' : 'border-green-500 text-green-500 hover:bg-green-50'} px-4 py-2 rounded-md font-medium transition flex-1`}
                  >
                    {selectedRecruiter.status === 'Active' ? 'Activate' : 'Activate'}
                  </button> */}
                </div>
                <div className="flex gap-2">
                  {/* <button 
                    onClick={() => handleEditRMG(selectedRecruiter)}
                    className="border border-blue-500 text-blue-500 px-4 py-2 rounded-md font-medium hover:bg-blue-50 transition flex-1"
                  >
                    Edit RMG
                  </button> */}
                  {/* <button 
                    onClick={() => handleToggleStatus(selectedRecruiter)}
                    className={`border ${selectedRecruiter.status === 'Active' ? 'border-red-500 text-red-500' : 'border-green-500 text-green-500'} px-4 py-2 rounded-md font-medium hover:bg-opacity-10 transition flex-1`}
                  >
                    {selectedRecruiter.status === 'Active' ? 'Deactivate' : 'Activate'}
                  </button> */}
                </div>
              </div>
            </div>
          )}
        </div>

        {showAddForm && (
          <AddNewRMG
            onSave={handleSaveRMG}
            onCancel={handleCancelForm}
            editData={editingRMG}
          />
        )}

        {/* <div className="w-full">
          <h1 className='text-3xl font-medium pl-1 mb-4'>Activity Logs</h1>
          <div className="w-full space-y-3">
            {activityLogs.length > 0 ? (
              activityLogs.map((item, index) => (
                <div
                  key={index}
                  className="border border-gray-300 shadow-md rounded-2xl flex justify-between items-center px-6 py-4"
                >
                  <span className="text-gray-700 font-medium w-1/3">{item.date}</span>
                  <span className="text-gray-800 font-medium text-center flex-1">{item.action}</span>
                  <span className="text-gray-700 font-semibold text-right w-1/4">{item.by}</span>
                </div>
              ))
            ) : (
              <div className="border border-gray-300 shadow-md rounded-2xl flex justify-center items-center px-6 py-4">
                <span className="text-gray-500">No activity logs available</span>
              </div>
            )}
          </div>
        </div> */}
      </div>
    </div>
  );
}

export default RMGManagement;