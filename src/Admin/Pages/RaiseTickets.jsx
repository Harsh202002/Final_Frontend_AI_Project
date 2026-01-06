import React, { useState } from "react";
import { Calendar, Download } from "lucide-react";
import robot from '../../assets/robot.png'
import axios from 'axios';
import { baseUrl } from '../../utils/ApiConstants';

export default function RaiseTickets() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const supportHistory = [
    {
      supportId: "#254798",
      requestType: "Issue with Candidate Selection",
      startDate: "20-02-2025",
      endDate: "20-02-2025",
      status: "Solved"
    },
    {
      supportId: "#254799",
      requestType: "Issue with Candidate Selection",
      startDate: "20-02-2025",
      endDate: "20-02-2025",
      status: "Solved"
    },
    {
      supportId: "#254800",
      requestType: "Issue with Candidate Selection",
      startDate: "20-02-2025",
      endDate: "20-02-2025",
      status: "Solved"
    },
    {
      supportId: "#254801",
      requestType: "Issue with Candidate Selection",
      startDate: "20-02-2025",
      endDate: "20-02-2025",
      status: "Solved"
    }
  ];

  const handleSubmitTicket = async () => {
    if (!subject.trim() || !message.trim()) {
      alert("Please fill in both request type and remarks");
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${baseUrl}/api/tickets/raise-ticket-admin`,
        {
          subject,
          message
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      console.log(response.data);
      

      alert("Ticket raised successfully!");
      setSubject("");
      setMessage("");
      console.log("Ticket response:", response.data);

    } catch (error) {
      console.error("Error raising ticket:", error);
      alert(error.response?.data?.message || "Failed to raise ticket");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExportCSV = () => {
    const headers = ['Support ID', 'Request Type', 'Start Date', 'End Date', 'Status'];

    const rows = supportHistory.map(item => [
      item.supportId,
      item.requestType,
      item.startDate,
      item.endDate,
      item.status
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    const currentDate = new Date().toLocaleDateString('en-GB').replace(/\//g, '-');
    const fileName = `Support_History_${currentDate}.csv`;

    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen flex flex-col items-center">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-10 mb-10">
        <h2 className="text-2xl font-semibold text-gray-900">
          Create New Ticket
        </h2>

        <p className="text-gray-400 mt-1">
          Fill up all the information here, then click submit button
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">


          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Request Type
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Write your request type"
              className="w-full border-b border-gray-300 focus:outline-none text-gray-700"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Date
            </label>
            <div className="flex items-center border-b border-gray-300">
              <input
                type="text"
                value={new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                readOnly
                className="w-full focus:outline-none text-gray-700"
              />
              <Calendar className="text-gray-500 w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col md:flex-row md:items-end gap-4">
          <div className="flex-1">
            <label className="block text-gray-700 font-medium mb-1">
              Remarks
            </label>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your remark"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
          </div>

          <button
            onClick={handleSubmitTicket}
            disabled={isSubmitting}
            className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Submitting..." : "Submit Tickets"}
          </button>
        </div>
      </div>

      {/* <div className="w-full max-w-6xl flex flex-col md:flex-row items-start gap-8">
        <div className="w-full md:w-1/3 flex justify-center md:justify-start">
          <img
            src={robot}
            alt="robot"
            className="w-48 md:w-60 object-contain"
          />
        </div>

        <div className="w-full md:w-2/3 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>

              <h3 className="text-lg font-semibold text-gray-900">
                Latest Support History
              </h3>
              <p className="text-gray-400 text-sm">
                Here is your recent history
              </p>
            </div>

            <button 
              onClick={handleExportCSV}
              className="flex items-center gap-2 border border-gray-300 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <Download className="w-4 h-4" /> Export
            </button>
          </div>

          <div className="overflow-x-auto -mx-6 px-6">
            <table className="w-full min-w-[600px] text-left border-t border-gray-200">
              <thead>
                <tr className="text-sm text-gray-600">
                  <th className="py-2 pr-4 whitespace-nowrap">Support ID</th>
                  <th className="py-2 pr-4 whitespace-nowrap">Request type</th>
                  <th className="py-2 pr-4 whitespace-nowrap">Start Date</th>
                  <th className="py-2 pr-4 whitespace-nowrap">End Date</th>
                  <th className="py-2 whitespace-nowrap">Status</th>
                </tr>
              </thead>
              <tbody>

                {supportHistory.map((item, index) => (
                  <tr
                    key={index}
                    className="border-t border-gray-200 text-sm text-gray-700"
                  >
                    <td className="py-3 pr-4">{item.supportId}</td>
                    <td className="py-3 pr-4">{item.requestType}</td>
                    <td className="py-3 pr-4 whitespace-nowrap">{item.startDate}</td>
                    <td className="py-3 pr-4 whitespace-nowrap">{item.endDate}</td>
                    <td className="py-3 text-green-600 font-medium">{item.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div> */}
    </div>
  );
}