import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useCompany } from '../../Context/companyContext';
import { baseUrl } from '../../utils/ApiConstants';

function RequirementForm() {
  const { companies } = useCompany();
  const companyName = companies?.data?.[0]?.companyName || "NA";

  console.log("Companies in RequirementForm:", companies);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    jobTitle: '',
    priority: '',
    dueDate: '',
    assignedTo: '',
    description: '',
    skills: '',
    preferredSkills: '',
    experience: '',
    positionAvailable: '',
    location: '',
    city: '',
    state: '',
    country: '',
    employmentType: '',
    salary: '',
    currency: '',
    attachments: null
  });

  const [hrUsers, setHrUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchHRUsers();
  }, []);

  const fetchHRUsers = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/offer/hr`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data && response.data.data) {
        setHrUsers(response.data.data);
        console.log("HR Users fetched:", response.data.data);
      }
    } catch (error) {
      console.error("Error fetching HR users:", error);
      setError('Failed to fetch HR users');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === 'file') {
      setFormData({
        ...formData,
        attachments: files[0]
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');

      const skillsArray = formData.skills.split(',').map(skill => skill.trim()).filter(skill => skill);
      const preferredSkillsArray = formData.preferredSkills
        ? formData.preferredSkills.split(',').map(skill => skill.trim()).filter(skill => skill)
        : [];

      const salaryValue = parseInt(formData.salary.replace(/[^\d]/g, '')) || 0;

      const submitData = {
        ...formData,
        companyName: companyName,
        skills: skillsArray,
        preferredSkills: preferredSkillsArray,
        salary: salaryValue,
        assignedTo: formData.assignedTo
      };

      delete submitData.attachments;

      console.log('Submitting data:', submitData);

      const response = await axios.post(`${baseUrl}/api/offer/`, submitData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      alert('Requirement form submitted successfully!');

      if (response.data.success) {
        navigate("/RMGAdmin-Dashboard/AssignedRecruiters");
        setSuccess(response.data.message || 'Requirement created successfully!');
        setFormData({
          jobTitle: '',
          companyName: companyName,
          priority: '',
          dueDate: '',
          assignedTo: '',
          description: '',
          skills: '',
          preferredSkills: '',
          experience: '',
          positionAvailable: '',
          location: '',
          city: '',
          state: '',
          country: '',
          employmentType: '',
          salary: '',
          currency: '',
          attachments: null
        });
      }
    } catch (err) {
      console.error('Submit error:', err.response?.data);
      setError(err.response?.data?.error || err.response?.data?.message || 'Failed to create requirement. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <h1 className="text-4xl font-semibold text-gray-900">Create Requirement</h1>
        </div>

        {success && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md">
            {success}
          </div>
        )}
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-lg border border-gray-300 p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleChange}
                  placeholder="Enter Job Title"
                  required
                  className="w-full px-3 py-2 border bg-[#D9D9D940] border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="jobTitle"
                  value={companyName}
                  readOnly
                  disabled
                  className="w-full cursor-not-allowed px-3 py-2 border bg-[#D9D9D940] border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority <span className="text-red-500">*</span>
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border bg-[#D9D9D940] border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                >
                  <option value="">Select Priority</option>
                  <option value="Low">Low</option>
                  <option value="Model">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Due date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border bg-[#D9D9D940] border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assigned To (HR) <span className="text-red-500">*</span>
                </label>
                <select
                  name="assignedTo"
                  value={formData.assignedTo}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border bg-[#D9D9D940] border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                >
                  <option value="">Select HR User</option>
                  {hrUsers.map(user => (
                    <option key={user._id || user.id} value={user._id || user.id}>
                      {user.name || user.fullName || 'Unknown User'}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter Description"
                rows="4"
                required
                className="w-full px-3 py-2 border bg-[#D9D9D940] border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            <hr />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skills <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="Enter Skills (comma separated, e.g., JavaScript, React, Node.js)"
                required
                className="w-full px-3 py-2 border bg-[#D9D9D940] border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Skills <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                name="preferredSkills"
                value={formData.preferredSkills}
                onChange={handleChange}
                placeholder="Enter Preferred Skills (comma separated)"
                className="w-full px-3 py-2 border bg-[#D9D9D940] border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <hr />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Experience <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                placeholder="Enter Experience (e.g., 3-5 years)"
                required
                className="w-full px-3 py-2 border bg-[#D9D9D940] border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Position Available <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="positionAvailable"
                value={formData.positionAvailable}
                onChange={handleChange}
                placeholder="Enter number of positions"
                required
                min="1"
                className="w-full px-3 py-2 border bg-[#D9D9D940] border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location <span className="text-red-500">*</span>
                </label>
                <select
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-[#D9D9D940]"
                >
                  <option value="">Select location</option>
                  <option value="On-site">On-site</option>
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Enter City"
                  required
                  className="w-full px-3 py-2 border bg-[#D9D9D940] border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="Enter State"
                  required
                  className="w-full px-3 py-2 border bg-[#D9D9D940] border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="Enter Country"
                  required
                  className="w-full px-3 py-2 border bg-[#D9D9D940] border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Employment Type <span className="text-red-500">*</span>
              </label>
              <select
                name="employmentType"
                value={formData.employmentType}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border bg-[#D9D9D940] border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                <option value="">Select Employment Type</option>
                <option value="Full-Time">Full-Time</option>
                <option value="Part-Time">Part-Time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
                <option value="Remote">Remote</option>
              </select>
            </div>

            <hr />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Salary (per annum in numbers) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  placeholder="Enter Salary (e.g., 600000)"
                  required
                  min="0"
                  className="w-full px-3 py-2 border bg-[#D9D9D940] border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Currency <span className="text-red-500">*</span>
                </label>
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border bg-[#D9D9D940] border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                >
                  <option value="">Select Currency</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="INR">INR</option>
                </select>
              </div>
            </div>

            <hr />

            {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Attachments <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center hover:border-blue-400 transition-colors bg-[#D9D9D940]">
                <input
                  type="file"
                  className="hidden"
                  id="file-upload"
                  name="attachments"
                  onChange={handleChange}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="text-gray-500">
                    {formData.attachments ? (
                      <p className="text-sm text-green-600">
                        File selected: {formData.attachments.name}
                      </p>
                    ) : (
                      <>
                        <p className="text-sm">Click to upload or drag and drop</p>
                        <p className="text-xs mt-1">PDF, DOC, JPG or PNG (max. 10MB)</p>
                      </>
                    )}
                  </div>
                </label>
              </div>
            </div> */}

            <div className="flex justify-center pt-4">
              <button
                type="submit"
                disabled={loading}
                className={`w-full sm:w-auto px-6 py-2 text-white rounded-md transition-colors font-medium ${loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gray-600 hover:bg-gray-700'
                  }`}
              >
                {loading ? 'Creating...' : 'Create Requirement'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RequirementForm;