// 
import { useEffect, useState } from 'react';
import { Search, X } from 'lucide-react';
import Pagination from '../../components/LandingPage/Pagination';
import axios from 'axios';
import { baseUrl } from '../../utils/ApiConstants';
import { log } from '@tensorflow/tfjs';

function AppliedJD() {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [appliedJobs, setAppliedJobs] = useState([]);
    const [selectedSkills, setSelectedSkills] = useState(null);
    const [showSkillsPopup, setShowSkillsPopup] = useState(false);
    const [candidateId, setCandidateId] = useState(null);

    const itemsPerPage = 5;

    // Fetch Applied JDs
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    `${baseUrl}/candidate/applied-jds`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('candidateToken')}`,
                        },
                    }
                );

                if (response.data.success) {
                    setAppliedJobs(response.data.data);
                    console.log("skhgkhgsfhg",response.data.data);
                    
                }
            } catch (error) {
                console.error('Error fetching applied JDs:', error);
            }
        };
        fetchData();
    }, []);

    // Get Candidate ID
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('candidate'));
        if (user && user.id) {
            setCandidateId(user.id);
        }
    }, []);

    // Get Application Status
    const getApplicationStatus = (job) => {
        if (!candidateId || !job.appliedCandidates?.length) return 'pending';

        const appliedCandidate = job.appliedCandidates.find(
            (c) => c.candidate === candidateId
        );

        return appliedCandidate?.status || 'pending';
    };

    // Status Badge Color
    const getStatusBadgeClass = (status) => {
        switch (status.toLowerCase()) {
            case 'filtered':
                return 'bg-green-100 text-green-600';
            case 'unfiltered':
                return 'bg-red-100 text-red-600';
            default:
                return 'bg-yellow-100 text-yellow-600';
        }
    };

    // Skills Popup
    const handleViewSkills = (requirements) => {
        setSelectedSkills(requirements);
        setShowSkillsPopup(true);
    };

    const closeSkillsPopup = () => {
        setShowSkillsPopup(false);
        setSelectedSkills(null);
    };

    // Date Format
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-GB');
    };

    // 🔥 FILTER + SORT (LATEST DATE FIRST)
    const filteredCandidates = appliedJobs
        .filter((job) =>
            job.companyName
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Pagination
    const totalPages = Math.ceil(filteredCandidates.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = filteredCandidates.slice(
        startIndex,
        startIndex + itemsPerPage
    );

    return (
        <>
            {/* Skills Popup */}
            {showSkillsPopup && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={closeSkillsPopup}
                    />

                    <div className="relative bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4 z-10">
                        <div className="flex justify-between mb-4">
                            <h3 className="text-lg font-semibold">
                                Required Skills
                            </h3>
                            <button onClick={closeSkillsPopup}>
                                <X />
                            </button>
                        </div>

                        <div className="space-y-2">
                            {selectedSkills?.length ? (
                                selectedSkills.map((skill, i) => (
                                    <div
                                        key={i}
                                        className="px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm"
                                    >
                                        {skill}
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 text-sm">
                                    No skills listed
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Main Table */}
            <div className="bg-white rounded-xl shadow-md border p-6">
                <div className="mb-6 flex justify-between">
                    <div className="relative w-64">
                        <input
                            type="text"
                            placeholder="Search by Company"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full pl-3 pr-10 py-2 border rounded-lg"
                        />
                        <Search className="absolute right-3 top-2.5 text-gray-500" />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[700px]">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left">ID</th>
                                <th className="px-4 py-3 text-left">Company</th>
                                <th className="px-4 py-3 text-left">Job Title</th>
                                <th className="px-4 py-3 text-left">Applied On</th>
                                <th className="px-4 py-3 text-left">Skills</th>
                                <th className="px-4 py-3 text-left">Status</th>
                            </tr>
                        </thead>

                        <tbody>
                            {currentData.length ? (
                                currentData.map((job, index) => {
                                    const status = getApplicationStatus(job);
                                    return (
                                        <tr key={index} className="border-b">
                                            <td className="px-4 py-3">
                                                {startIndex + index + 1}
                                            </td>
                                            <td className="px-4 py-3">
                                                {job.companyName}
                                            </td>
                                            <td className="px-4 py-3">
                                                {job?.offerId?.jobTitle}
                                            </td>
                                            <td className="px-4 py-3">
                                                {(job.appliedDate) ? formatDate(job.appliedDate) : 'N/A'}
                                            </td>
                                            <td className="px-4 py-3">
                                                <button
                                                    onClick={() =>
                                                        handleViewSkills(
                                                            job.requirements
                                                        )
                                                    }
                                                    className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full"
                                                >
                                                    View
                                                </button>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-sm ${getStatusBadgeClass(
                                                        status
                                                    )}`}
                                                >
                                                    {status}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td
                                        colSpan="6"
                                        className="text-center py-6"
                                    >
                                        No JDs found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {totalPages > 1 && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    )}
                </div>
            </div>
        </>
    );
}

export default AppliedJD;
