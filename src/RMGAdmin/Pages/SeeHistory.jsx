import React, { useState } from "react";
import {
    ChevronLeft,
    ChevronRight,
    Eye,
} from "lucide-react";
import { useLocation } from "react-router-dom";
import Pagination from "../../components/LandingPage/Pagination";
import FilteredCandidate from "./FilteredCandidate";
import UnfilteredCandidate from "./UnfilteredCandidate";

const SeeHistory = () => {
    const location = useLocation();
    const { jdData } = location.state || {};

    console.log("Received JD Data from Parent/Assigned Recruiter:", jdData);

    const [showFilteredPopup, setShowFilteredPopup] = useState(false);
    const [showUnfilteredPopup, setShowUnfilteredPopup] = useState(false);
    const [selectedCandidate, setSelectedCandidate] = useState(null);

    const jdArray = jdData?.fullData?.jds || [];

    const jobData = jdArray.map((jd, index) => {
        const appliedCandidates = jd.raw?.appliedCandidates || [];
        const filteredCands = appliedCandidates.filter(c => c.status === 'filtered');
        const unfilteredCands = appliedCandidates.filter(c => c.status === 'unfiltered' || c.status !== 'filtered');

        return {
            id: jd.id || jd._id,
            title: jdData?.fullData?.jobTitle || jdData?.title || "N/A",
            jdId: `JD#${(jd.id || jd._id)?.slice(-4) || index}`,
            assignedOn: new Date(jdData?.fullData?.createdAt).toLocaleDateString('en-CA') || "N/A",
            dueDate: new Date(jdData?.fullData?.dueDate).toLocaleDateString('en-CA') || "N/A",
            status: jdData?.fullData?.status || "N/A",
            statusColor: jdData?.fullData?.status === 'JD created' ? 'text-green-600' :
                jdData?.fullData?.status === 'In Progress' ? 'text-yellow-600' : 'text-red-600',
            priority: jdData?.fullData?.priority || "N/A",
            notes: jd.raw?.jobSummary || "No notes available",
            totalApply: jd.totalApplicants || appliedCandidates.length || 0,
            filtered: jd.filteredCount || filteredCands.length || 0,
            unfiltered: jd.unfilteredCount || unfilteredCands.length || 0,
            rawFilteredCandidates: jd.raw?.filteredCandidates || [],
            rawUnfilteredCandidates: jd.raw?.unfilteredCandidates || [],
            rawAppliedCandidates: appliedCandidates,
            skills: jdData?.fullData?.skills || []
        };
    });

    const finalJobData = jobData.length > 0 ? jobData : [{
        id: 1,
        title: "No Data Available",
        jdId: "N/A",
        assignedOn: "N/A",
        dueDate: "N/A",
        status: "N/A",
        statusColor: "text-gray-600",
        priority: "N/A",
        notes: "No data available",
        totalApply: 0,
        filtered: 0,
        unfiltered: 0,
        rawFilteredCandidates: [],
        rawUnfilteredCandidates: [],
        rawAppliedCandidates: [],
        skills: []
    }];

    const [currentJobIndex, setCurrentJobIndex] = useState(0);
    const [filteredPage, setFilteredPage] = useState(1);
    const [unfilteredPage, setUnfilteredPage] = useState(1);

    const itemsPerPage = 4;
    const currentJob = finalJobData[currentJobIndex];

    const filteredCandidates = (currentJob.rawAppliedCandidates || [])
        .filter(c => c.status === 'filtered')
        .map((candidate, index) => ({
            id: candidate._id || index + 1,
            name: candidate.name || "N/A",
            email: candidate.email || "N/A",
            phone: candidate.phone || "N/A",
            skills: currentJob.skills?.join(', ') || "N/A",
            percentage: candidate.aiScore || 0,
            aiExplanation: candidate.aiExplanation || "No explanation available",
            resume: candidate.resume || null,
            appliedAt: candidate.appliedAt || null
        }));

    const unfilteredCandidates = (currentJob.rawAppliedCandidates || [])
        .filter(c => c.status === 'unfiltered' || c.status !== 'filtered')
        .map((candidate, index) => ({
            id: candidate._id || index + 1,
            name: candidate.name || "N/A",
            email: candidate.email || "N/A",
            phone: candidate.phone || "N/A",
            skills: currentJob.skills?.join(', ') || "N/A",
            percentage: candidate.aiScore || 0,
            aiExplanation: candidate.aiExplanation || "No explanation available",
            resume: candidate.resume || null,
            appliedAt: candidate.appliedAt || null
        }));

    const finalFilteredCandidates = filteredCandidates.length > 0 ? filteredCandidates :
        (currentJob.rawFilteredCandidates || []).map((candidate, index) => ({
            id: candidate._id || index + 1,
            name: candidate.name || "N/A",
            email: candidate.email || "N/A",
            phone: candidate.phone || "N/A",
            skills: currentJob.skills?.join(', ') || "N/A",
            percentage: candidate.aiScore || 0,
            aiExplanation: candidate.aiExplanation || "No explanation available",
            resume: candidate.resume || null
        }));

    const finalUnfilteredCandidates = unfilteredCandidates.length > 0 ? unfilteredCandidates :
        (currentJob.rawUnfilteredCandidates || []).map((candidate, index) => ({
            id: candidate._id || index + 1,
            name: candidate.name || "N/A",
            email: candidate.email || "N/A",
            phone: candidate.phone || "N/A",
            skills: currentJob.skills?.join(', ') || "N/A",
            percentage: candidate.aiScore || 0,
            aiExplanation: candidate.aiExplanation || "No explanation available",
            resume: candidate.resume || null
        }));

    const filteredTotalPages = Math.ceil(finalFilteredCandidates.length / itemsPerPage) || 1;
    const filteredStartIndex = (filteredPage - 1) * itemsPerPage;
    const filteredEndIndex = filteredStartIndex + itemsPerPage;
    const currentFilteredCandidates = finalFilteredCandidates.slice(filteredStartIndex, filteredEndIndex);

    const unfilteredTotalPages = Math.ceil(finalUnfilteredCandidates.length / itemsPerPage) || 1;
    const unfilteredStartIndex = (unfilteredPage - 1) * itemsPerPage;
    const unfilteredEndIndex = unfilteredStartIndex + itemsPerPage;
    const currentUnfilteredCandidates = finalUnfilteredCandidates.slice(unfilteredStartIndex, unfilteredEndIndex);

    const handlePrevious = () => {
        setCurrentJobIndex((prev) => (prev === 0 ? finalJobData.length - 1 : prev - 1));
        setFilteredPage(1);
        setUnfilteredPage(1);
    };

    const handleNext = () => {
        setCurrentJobIndex((prev) => (prev === finalJobData.length - 1 ? 0 : prev + 1));
        setFilteredPage(1);
        setUnfilteredPage(1);
    };

    const handleFilteredEyeClick = (candidate) => {
        setSelectedCandidate(candidate);
        setShowFilteredPopup(true);
    };

    const handleUnfilteredEyeClick = (candidate) => {
        setSelectedCandidate(candidate);
        setShowUnfilteredPopup(true);
    };

    return (
        <div className="space-y-6">
            {showFilteredPopup && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <FilteredCandidate
                        candidate={selectedCandidate}
                        jobTitle={currentJob.title}
                        onClose={() => setShowFilteredPopup(false)}
                    />
                </div>
            )}

            {showUnfilteredPopup && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <UnfilteredCandidate
                        candidate={selectedCandidate}
                        jobTitle={currentJob.title}
                        onClose={() => setShowUnfilteredPopup(false)}
                    />
                </div>
            )}

            <div className="bg-white shadow-[0px_0px_6px_0px_rgba(0,_0,_0,_0.35)] rounded-xl p-5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <p className="text-gray-800 font-semibold text-lg">
                            Job Title : <span className="font-normal">{currentJob.title}</span>
                        </p>
                    </div>
                    {/* <div className="flex items-center gap-2">
                        <button
                            onClick={handlePrevious}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Previous Job"
                        >
                            <ChevronLeft className="w-5 h-5 cursor-pointer text-gray-600" />
                        </button>
                        <span className="text-sm text-gray-500">
                            {currentJobIndex + 1} / {finalJobData.length}
                        </span>
                        <button
                            onClick={handleNext}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Next Job"
                        >
                            <ChevronRight className="w-5 h-5 cursor-pointer text-gray-600" />
                        </button>
                    </div> */}
                </div>
            </div>

            <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 bg-white shadow-[0px_0px_6px_0px_rgba(0,_0,_0,_0.35)] rounded-xl p-5 space-y-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            {/* <p className="text-gray-700">
                                JD ID : <span className="font-medium">{currentJob.jdId}</span>
                            </p> */}

                            <p className="text-gray-700">
                                Assigned On : <span>{currentJob.assignedOn}</span>
                            </p>

                            <p className="text-gray-700">
                                Due Date : <span>{currentJob.dueDate}</span>
                            </p>

                            {/* <p className="text-gray-700">
                                Documents :
                                <span className="text-blue-600 cursor-pointer hover:underline ml-1">
                                    [Download JD.pdf]
                                </span>{" "}
                                /
                                <span className="text-blue-600 cursor-pointer hover:underline ml-1">
                                    [Candidate List.xlsx]
                                </span>
                            </p> */}
                        </div>

                        <div>
                            <div className="flex space-x-3.5">
                                <p className="text-gray-700 font-semibold mt-2">Current Status :</p>
                                <p className={`font-semibold mt-2 ${currentJob.statusColor}`}>
                                    {currentJob.status}
                                </p>
                            </div>
                            <div className="flex space-x-3.5">
                                <p className="text-gray-700 font-semibold mt-2">Priority :</p>
                                <p className="text-gray-600 font-semibold mt-2">{currentJob.priority}</p>
                            </div>
                            <p className="text-gray-700 font-semibold mt-2">Notes :</p>
                            <p className="text-gray-600 text-sm leading-tight border rounded-xl p-1 h-[120px] overflow-y-auto">
                                {currentJob.notes}
                            </p>

                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1 bg-white shadow-[0px_0px_6px_0px_rgba(0,_0,_0,_0.35)] rounded-xl space-y-4">
                    <h2 className="text-lg font-semibold px-5 pt-4">Candidate</h2>
                    <hr />
                    <div className="px-5 space-y-4 pb-4">
                        <div className="bg-green-100 text-green-700 px-4 py-2 rounded-full w-fit">
                            Total Apply : {currentJob.totalApply}
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 bg-blue-600 rounded-full"></span>
                            <p className="text-gray-700">Filtered Candidate: {finalFilteredCandidates.length}</p>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 bg-red-600 rounded-full"></span>
                            <p className="text-gray-700">Unfiltered Candidate: {finalUnfilteredCandidates.length}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="shadow-[0px_0px_6px_0px_rgba(0,_0,_0,_0.35)] p-4 rounded-xl space-y-4 bg-white">
                <div className="flex items-center gap-2">
                    <span className="w-4 h-4 bg-blue-600 rounded-full"></span>
                    <p className="text-gray-800 font-semibold">Filtered Candidate: {finalFilteredCandidates.length}</p>
                </div>

                <div className="bg-white shadow-[0px_0px_6px_0px_rgba(0,_0,_0,_0.35)] rounded-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left min-w-[900px]">
                            <thead>
                                <tr className="border-b border-gray-400 text-gray-700">
                                    <th className="py-3 px-4">Sl.No</th>
                                    <th className="py-3 px-4">Name</th>
                                    <th className="py-3 px-4">Email</th>
                                    <th className="py-3 px-4">Job Title</th>
                                    <th className="py-3 px-4">Skills</th>
                                    <th className="py-3 px-4">Status</th>
                                    <th className="py-3 px-4">Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {currentFilteredCandidates.length > 0 ? (
                                    currentFilteredCandidates.map((candidate, idx) => (
                                        <tr key={candidate.id} className="border-b border-gray-400 text-gray-700">
                                            <td className="py-3 px-4">{filteredStartIndex + idx + 1}.</td>
                                            <td className="py-3 px-4">{candidate.name}</td>
                                            <td className="py-3 px-4">{candidate.email}</td>
                                            <td className="py-3 px-4">{currentJob.title}</td>
                                            <td className="py-3 px-4">{candidate.skills}</td>

                                            <td className="py-3 px-2 flex items-center gap-2">
                                                <div className="w-24 bg-gray-200 rounded-full h-2">
                                                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${candidate.percentage}%` }}></div>
                                                </div>
                                                <span className="text-blue-600 text-sm">{candidate.percentage}%</span>
                                            </td>

                                            <td className="py-3 px-2">
                                                <button
                                                    onClick={() => handleFilteredEyeClick(candidate)}
                                                    className="p-2 border rounded-lg hover:bg-gray-100"
                                                >
                                                    <Eye className="w-5 h-5 text-blue-600" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="py-8 text-center text-gray-500">
                                            No filtered candidates available
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <Pagination
                        currentPage={filteredPage}
                        totalPages={filteredTotalPages}
                        onPageChange={setFilteredPage}
                    />
                </div>
            </div>

            <div className="shadow-[0px_0px_6px_0px_rgba(0,_0,_0,_0.35)] p-4 rounded-xl space-y-4 bg-white">
                <div className="flex items-center gap-2">
                    <span className="w-4 h-4 bg-red-600 rounded-full"></span>
                    <p className="text-gray-800 font-semibold">Unfiltered Candidate: {finalUnfilteredCandidates.length}</p>
                </div>

                <div className="bg-white shadow-[0px_0px_6px_0px_rgba(0,_0,_0,_0.35)] rounded-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left min-w-[900px]">
                            <thead>
                                <tr className="border-b border-gray-400 text-gray-700">
                                    <th className="py-3 px-4">Sl.No</th>
                                    <th className="py-3 px-4">Name</th>
                                    <th className="py-3 px-4">Email</th>
                                    <th className="py-3 px-4">Job Title</th>
                                    <th className="py-3 px-4">Skills</th>
                                    <th className="py-3 px-4">Status</th>
                                    <th className="py-3 px-4">Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {currentUnfilteredCandidates.length > 0 ? (
                                    currentUnfilteredCandidates.map((candidate, idx) => (
                                        <tr key={candidate.id} className="border-b border-gray-400 text-gray-700">
                                            <td className="py-3 px-4">{unfilteredStartIndex + idx + 1}.</td>
                                            <td className="py-3 px-4">{candidate.name}</td>
                                            <td className="py-3 px-4">{candidate.email}</td>
                                            <td className="py-3 px-4">{currentJob.title}</td>
                                            <td className="py-3 px-4">{candidate.skills}</td>

                                            <td className="py-3 px-2 flex items-center gap-2">
                                                <div className="w-24 bg-gray-200 rounded-full h-2">
                                                    <div className="bg-red-500 h-2 rounded-full" style={{ width: `${candidate.percentage}%` }}></div>
                                                </div>
                                                <span className="text-red-600 text-sm">{candidate.percentage}%</span>
                                            </td>

                                            <td className="py-3 px-2">
                                                <button
                                                    onClick={() => handleUnfilteredEyeClick(candidate)}
                                                    className="p-2 border rounded-lg hover:bg-gray-100"
                                                >
                                                    <Eye className="w-5 h-5 text-red-600" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="py-8 text-center text-gray-500">
                                            No unfiltered candidates available
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <Pagination
                        currentPage={unfilteredPage}
                        totalPages={unfilteredTotalPages}
                        onPageChange={setUnfilteredPage}
                    />
                </div>
            </div>
        </div>
    );
};

export default SeeHistory;