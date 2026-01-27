import React, { useState } from "react";
import { Calendar } from "lucide-react";
import robot from '../../assets/robot.png'
import axios from "axios";
import { baseUrl } from "../../utils/ApiConstants";

export default function RMGSupportTickets() {
  const [formData, setFormData] = useState({
    subject: "",
    description: "",
    priority: "Medium"
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };


  const handleSubmit = async () => {
    if (!formData.subject || !formData.description) {
      setMessage("Please fill in all required fields");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");

      const { data } = await axios.post(`${baseUrl}/tickets/`, formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );


      if (data.success) {
        setMessage(data.message);
        setFormData({
          subject: "",
          description: "",
          priority: "Medium"
        });
      } else {
        setMessage(data.message || "Failed to create ticket");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Error creating ticket. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getCurrentDate = () => {
    const date = new Date();
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
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

        {message && (
          <div className={`mt-4 p-3 rounded-md ${message.includes("Successfully") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Subject *
            </label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Enter ticket subject"
              className="w-full border-b border-gray-300 focus:outline-none text-gray-700"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Priority
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full border-b border-gray-300 focus:outline-none text-gray-700 bg-transparent"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Date
            </label>
            <div className="flex items-center border-b border-gray-300">
              <input
                type="text"
                value={getCurrentDate()}
                readOnly
                className="w-full focus:outline-none text-gray-700 bg-transparent"
              />
              <Calendar className="text-gray-500 w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col md:flex-row md:items-end gap-4">
          <div className="flex-1">
            <label className="block text-gray-700 font-medium mb-1">
              Description *
            </label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Write your description"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? "Submitting..." : "Submit Tickets"}
          </button>
        </div>
      </div>

      <div className="w-full max-w-6xl flex flex-col md:flex-row items-start gap-8">
        <div className="w-full md:w-1/3 flex justify-center md:justify-start">
          <img
            src={robot}
            alt="robot"
            className="w-48 md:w-60 object-contain"
          />
        </div>
      </div>
    </div>
  );
}