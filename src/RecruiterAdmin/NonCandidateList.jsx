import React, { useMemo, useState, useEffect } from "react";
import {
    Search,
    Share2,
    Edit2,
    Trash2,
    CheckCircle,
    Copy,
    X,
    Link,
    Eye,
} from "lucide-react";
import Pagination from "../components/LandingPage/Pagination";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import SpinLoader from "../components/SpinLoader"; 
import { baseUrl } from "../utils/ApiConstants";

export default function NonCandidateList() {
    const [q, setQ] = useState("");
    const [selectedIds, setSelectedIds] = useState(new Set());
    const [shareFor, setShareFor] = useState(null);
    const [copied, setCopied] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sendingInvites, setSendingInvites] = useState(false);
    const location = useLocation();
    const { jdId } = location.state || {};
    const navigate = useNavigate();
    console.log(jdId);

    useEffect(() => {
        const fetchNonCandidates = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`${baseUrl}/jd/all-candidates`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                console.log("Non-Candidates Data:", res.data);
                if (res.data.success && res.data.data) {
                    setCandidates(res.data.data);
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }

        fetchNonCandidates();
    }, [])

    const itemsPerPage = 5;

    const filtered = useMemo(() => {
        const needle = q.trim().toLowerCase();
        let result = candidates;
        
        // First, filter by search query
        if (needle) {
            result = result.filter(
                (c) =>
                    c.name?.toLowerCase().includes(needle) ||
                    c.email?.toLowerCase().includes(needle)
            );
        }
        
        // Then filter out candidates who have already received invite or completed test
        result = result.filter(candidate => {
            // Exclude if mailStatus is "sent" (already received invite for this JD)
            const appliedCandidateRecord = candidate.appliedCandidates?.find(
                ac => ac.candidate?._id === candidate._id || ac.candidate === candidate._id
            );
            
            if (appliedCandidateRecord?.mailStatus === 'sent') {
                return false;
            }
            
            // Exclude if already completed test
            if (appliedCandidateRecord?.testCompletedAt) {
                return false;
            }
            
            return true;
        });
        
        return result;
    }, [q, candidates, jdId]);

    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = filtered.slice(startIndex, endIndex);

    const allSelected =
        currentItems.length > 0 &&
        currentItems.every((c) => selectedIds.has(c._id));

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [q]);

    useEffect(() => {
        if (shareFor) {
            const handleEscape = (e) => {
                if (e.key === "Escape") setShareFor(null);
            };
            window.addEventListener("keydown", handleEscape);
            return () => window.removeEventListener("keydown", handleEscape);
        }
    }, [shareFor]);

    const handleSendBulkInvite = async () => {
        if (!jdId) {
            alert("JD ID is missing. Please go back and select a JD.");
            return;
        }
        if (selectedIds.size === 0) {
            alert("Please select at least one candidate.");
            return;
        }

        try {
            setSendingInvites(true);
            const candidateIds = Array.from(selectedIds);
            const res = await axios.post(
                `${baseUrl}/candidate/send-email/${jdId}`,
                { candidateIds },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            if (res.data.success) {
                alert("Invites sent successfully");
                // Prepare candidate objects for GenerateAssessment: only those we just invited
                const invitedCandidateIds = candidateIds;
                const invitedCandidates = candidates.filter(c => invitedCandidateIds.includes(c._id));
                setSelectedIds(new Set());

                // Navigate to GenerateAssessment with only invited candidates
                navigate("/RecruiterAdmin-Dashboard/JDDetails/GenerateAssessment", {
                    state: {
                        filteredCandidates: invitedCandidates,
                        jdData: null
                    }
                });
            }
        } catch (error) {
            console.log(error);
            alert(error.response?.data?.message || "Failed to send invites");
        } finally {
            setSendingInvites(false);
        }
    };

    return (
        <div className="min-h-screen">
            {sendingInvites && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white rounded-2xl p-8 shadow-xl flex flex-col items-center gap-4">
                        <SpinLoader />
                        <p className="text-gray-700 font-medium">Sending invites...</p>
                        <p className="text-sm text-gray-500">
                            Please wait while we send invites to {selectedIds.size} candidate(s)
                        </p>
                    </div>
                </div>
            )}

            <div className="mx-auto w-full max-w-7xl">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Candidates List from Database
                    </h1>

                    <div className="relative w-full sm:w-80">
                        <input
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            placeholder="Search by Name or Email"
                            className="w-full rounded-2xl border border-gray-300 bg-white py-2.5 pl-4 pr-12 text-sm outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-black/5"
                        />
                        <button
                            className="absolute right-1 top-1/2 -translate-y-1/2 rounded-xl bg-black px-3 py-2 text-white"
                            aria-label="Search"
                        >
                            <Search size={18} />
                        </button>
                    </div>
                </div>

                <div className="mt-4 overflow-x-auto rounded-3xl border border-gray-300 shadow-md bg-white">
                    <table className="w-full min-w-[800px] divide-y divide-gray-200 md:table">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="w-12 px-4 py-4 text-left">
                                    <input
                                        type="checkbox"
                                        aria-label="Select all"
                                        className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
                                        checked={allSelected}
                                        onChange={() => {
                                            setSelectedIds((prev) => {
                                                if (allSelected) {
                                                    const next = new Set(prev);
                                                    currentItems.forEach((c) => next.delete(c._id));
                                                    return next;
                                                }
                                                const next = new Set(prev);
                                                currentItems.forEach((c) => next.add(c._id));
                                                return next;
                                            });
                                        }}
                                    />
                                </th>
                                <th className="px-4 py-4 text-left text-sm font-medium text-gray-600">
                                    Candidate Name
                                </th>
                                <th className="px-4 py-4 text-left text-sm font-medium text-gray-600">
                                    Email
                                </th>
                                <th className="px-4 py-4 text-left text-sm font-medium text-gray-600">
                                    Phone
                                </th>
                                <th className="px-4 py-4 text-left text-sm font-medium text-gray-600">
                                    Resume
                                </th>
                                {/* <th className="px-4 py-4 text-left text-sm font-medium text-gray-600">
                                    Action
                                </th> */}
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                                        <div className="flex justify-center">
                                            <SpinLoader />
                                        </div>
                                    </td>
                                </tr>
                            ) : currentItems.length > 0 ? (
                                currentItems.map((c) => (
                                    <tr key={c._id} className="hover:bg-gray-50/60">
                                        <td className="px-4 py-4">
                                            <input
                                                type="checkbox"
                                                aria-label={`Select ${c.name}`}
                                                className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
                                                checked={selectedIds.has(c._id)}
                                                onChange={() => {
                                                    setSelectedIds((prev) => {
                                                        const next = new Set(prev);
                                                        next.has(c._id) ? next.delete(c._id) : next.add(c._id);
                                                        return next;
                                                    });
                                                }}
                                            />
                                        </td>

                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-medium text-gray-900">
                                                    {c.name}
                                                </span>
                                            </div>
                                        </td>

                                        <td className="px-4 py-4 text-sm text-gray-700">
                                            {c.email}
                                        </td>

                                        <td className="px-4 py-4 text-sm text-gray-700">
                                            {c.phone}
                                        </td>

                                        <td className="py-4 px-6">
                                            <a
                                                href={c.resume}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 hover:bg-blue-200"
                                            >
                                                View
                                            </a>
                                        </td>

                                        {/* <td className="px-4 py-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => setShareFor(c)}
                                                    aria-label="Share"
                                                    title="Share"
                                                    className="rounded-lg border border-gray-200 bg-white p-2 text-gray-600 transition hover:bg-gray-50 hover:text-gray-900"
                                                >
                                                    <Share2 size={18} />
                                                </button>

                                                <button
                                                    onClick={() => alert("View clicked")}
                                                    aria-label="View"
                                                    title="View"
                                                    className="rounded-lg border border-blue-200 bg-white p-2 text-blue-600 transition hover:bg-blue-50 hover:text-blue-900"
                                                >
                                                    <Eye size={18} />
                                                </button>

                                                <button
                                                    onClick={() => alert("Delete clicked")}
                                                    aria-label="Delete"
                                                    title="Delete"
                                                    className="rounded-lg border border-red-200 bg-white p-2 text-red-600 transition hover:bg-red-50 hover:text-red-900"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td> */}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                                        No candidates found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {filtered.length > 0 && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    )}
                </div>

                {selectedIds.size > 0 && (
                    <div className="mt-4 flex items-center justify-between rounded-lg bg-gray-50 p-3">
                        <span className="text-sm text-gray-600">
                            {selectedIds.size} candidate(s) selected
                        </span>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleSendBulkInvite}
                                disabled={sendingInvites}
                                className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {sendingInvites ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Sending...
                                    </>
                                ) : (
                                    "Send Invite"
                                )}
                            </button>
                            <button
                                onClick={() => setSelectedIds(new Set())}
                                disabled={sendingInvites}
                                className="text-sm text-red-600 hover:text-red-700 disabled:text-gray-400 disabled:cursor-not-allowed"
                            >
                                Clear selection
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {shareFor && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center"
                    aria-modal="true"
                    role="dialog"
                >
                    <div
                        className="absolute inset-0 bg-black/30"
                        onClick={() => setShareFor(null)}
                        aria-hidden
                    />
                    <div className="relative z-10 w-[92%] max-w-2xl rounded-2xl bg-white p-4 sm:p-6 shadow-xl">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Link</h3>
                            </div>
                            <button
                                onClick={() => setShareFor(null)}
                                aria-label="Close share modal"
                                className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="mt-3 flex items-center gap-2">
                            <div className="relative flex-1">
                                <Link className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    readOnly
                                    value={shareFor.resume || ''}
                                    className="w-full rounded-lg border border-gray-300 bg-gray-100 py-2.5 pl-10 pr-12 text-sm text-gray-700 outline-none focus:border-gray-400 focus:ring-2 focus:ring-black/5"
                                />
                                <button
                                    onClick={async () => {
                                        try {
                                            await navigator.clipboard.writeText(shareFor.resume || '');
                                            setCopied(true);
                                            setTimeout(() => setCopied(false), 1500);
                                        } catch {
                                            setCopied(false);
                                            alert("Copy failed. Please copy manually.");
                                        }
                                    }}
                                    className="absolute right-1 top-1/2 -translate-y-1/2 rounded-md p-2 text-gray-600 hover:bg-gray-100"
                                    aria-label="Copy link"
                                    title="Copy link"
                                >
                                    <Copy size={18} />
                                </button>
                            </div>
                            {copied && (
                                <span className="whitespace-nowrap text-xs font-medium text-emerald-600">
                                    Copied!
                                </span>
                            )}
                        </div>

                        <div className="mt-6">
                            <p className="mb-3 text-sm font-semibold text-gray-900">Share via</p>
                            <div className="flex flex-wrap items-center gap-3">
                                <button
                                    onClick={() => {
                                        const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareFor.resume || '')}`;
                                        window.open(url, "_blank", "noopener,noreferrer");
                                    }}
                                    className="rounded-full border border-sky-400 bg-white px-4 py-2 text-sm font-medium text-sky-600 transition hover:bg-sky-50"
                                >
                                    Share to LinkedIn
                                </button>
                                <button
                                    onClick={() => {
                                        const subject = encodeURIComponent(
                                            `Candidate: ${shareFor.name} - ${shareFor.email}`
                                        );
                                        const body = encodeURIComponent(`Check out this profile:\n${shareFor.resume || ''}`);
                                        window.location.href = `mailto:?subject=${subject}&body=${body}`;
                                    }}
                                    className="rounded-full border border-violet-400 bg-white px-4 py-2 text-sm font-medium text-violet-600 transition hover:bg-violet-50"
                                >
                                    Share to Indeed
                                </button>
                                <button
                                    onClick={async () => {
                                        if (navigator.share) {
                                            try {
                                                await navigator.share({
                                                    title: `${shareFor.name} - ${shareFor.email}`,
                                                    url: shareFor.resume || '',
                                                });
                                            } catch { }
                                        } else {
                                            alert("Web Share API not supported on this device/browser.");
                                        }
                                    }}
                                    className="text-sm font-medium text-gray-700 underline underline-offset-4"
                                >
                                    more..
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}