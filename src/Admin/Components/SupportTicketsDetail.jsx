import { useState, useEffect } from 'react';
import axios from 'axios';
import { baseUrl } from '../../utils/ApiConstants';

const SupportTicketDetail = ({ selectedTicket, getStatusColor }) => {
    const [status, setStatus] = useState('');
    const [assignedTo, setAssignedTo] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        if (selectedTicket && selectedTicket.raisedBy && selectedTicket.raisedBy._id) {
            setAssignedTo(selectedTicket.raisedBy._id);
        }
    }, [selectedTicket]);

    const handleUpdateTicket = async () => {
        if (!selectedTicket || !selectedTicket._id) return;

        setIsUpdating(true);
        try {
            const updateData = {};
            if (status) updateData.status = status;
            if (assignedTo) updateData.assignedTo = assignedTo;

            const res = await axios.put(
                `${baseUrl}/tickets/${selectedTicket._id}`,
                updateData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            alert("Ticket updated successfully");

            if (res.data.success) {
                console.log("Ticket updated successfully:", res.data);
                setStatus('');
            }
        } catch (error) {
            console.error("Error updating ticket:", error);
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm p-6 h-fit">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Support Ticket Details</h2>

            {selectedTicket ? (
                <div className="space-y-4">
                    <div className="inline-block mr-3 text-sm font-medium">
                        Role:
                    </div>
                    <div className="inline-block px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-medium">
                        {selectedTicket.role}
                    </div>

                    <div>
                        <div className="text-sm font-medium text-gray-900 mb-1">Subject : {selectedTicket.subject}</div>
                        <div className="text-sm font-medium text-gray-900">Reporter : {selectedTicket.reporter}</div>
                        {selectedTicket.email && (
                            <div className="text-sm font-medium text-gray-900">Email : {selectedTicket.email}</div>
                        )}
                    </div>

                    <div className="">
                        <div className='flex gap-3'>
                            <div className="text-sm font-medium text-gray-900 mb-1">Start Date :</div>
                            <div className="text-sm font-medium text-gray-900">{selectedTicket.startDate}</div>
                        </div>
                        <div className='flex gap-3'>
                            <div className="text-sm font-medium text-gray-900">Due Date :</div>
                            <div className="text-sm font-medium text-gray-900">{selectedTicket.dueDate}</div>
                        </div>
                    </div>

                    <div className='flex gap-3'>
                        <div className="text-sm font-medium text-gray-900 mb-2">Status :</div>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedTicket.status)}`}>
                            {selectedTicket.status}
                        </span>
                    </div>

                    <div className='flex gap-3'>
                        <div className="text-sm font-medium text-gray-900 mb-2">Priority :</div>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${selectedTicket.priority === 'High'
                                ? 'bg-red-100 text-red-600'
                                : selectedTicket.priority === 'Medium'
                                    ? 'bg-orange-100 text-orange-600'
                                    : 'bg-gray-100 text-gray-600'
                            }`}>
                            {selectedTicket.priority || 'Normal'}
                        </span>
                    </div>

                    {selectedTicket.assignedTo && (
                        <div className='flex gap-3'>
                            <div className="text-sm font-medium text-gray-900 mb-2">Assigned To :</div>
                            <span className="text-sm text-gray-600">
                                {selectedTicket.assignedTo.name || selectedTicket.assignedTo}
                            </span>
                        </div>
                    )}

                    <hr />

                    <div>
                        <div className="text-sm font-medium text-gray-900 mb-2">Description :</div>
                        <div className="text-sm text-gray-600 leading-relaxed">
                            {selectedTicket.description || 'No description provided'}
                        </div>
                    </div>

                    <hr />

                    <div>
                        <div className="text-sm font-medium text-gray-900 mb-3">Update Status</div>
                        <div className="space-y-3">
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-400 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Select Status</option>
                                <option value="Open">Open</option>
                                <option value="Closed">Closed</option>
                                <option value="Resolved">Resolved</option>
                            </select>

                            <input
                                type="text"
                                value={assignedTo}
                                readOnly
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-700 hidden"
                                placeholder="Assigned To ID"
                            />

                            <button
                                onClick={handleUpdateTicket}
                                disabled={isUpdating || !status}
                                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                            >
                                {isUpdating ? 'Updating...' : 'Update Ticket'}
                            </button>
                        </div>
                    </div>

                    <hr />

                    {/* <div>
                        <div className="text-sm font-medium text-gray-900 mb-3">Reply</div>
                        <textarea
                            placeholder="Your reply"
                            className="w-full px-3 py-2 border border-gray-400 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows={2}
                        />
                    </div>

                    <div className="bg-gray-50 rounded-lg mt-4">
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                                <span className="text-xs font-medium text-gray-600">A</span>
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-sm font-medium text-gray-900">Admin</span>
                                    <span className="text-xs text-gray-500">May 15, 2025</span>
                                </div>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    Thank you for reporting this issue, we are looking into it and will update you shortly.
                                </p>
                            </div>
                        </div>
                    </div> */}
                </div>
            ) : (
                <div className="text-center text-gray-500 py-8">
                    <p className="text-sm">Select a ticket to view details</p>
                </div>
            )}
        </div>
    );
};

export default SupportTicketDetail;