import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit2, Save, X } from "lucide-react";
import { superAdminBaseUrl } from "../utils/ApiConstants";
import axios from "axios";

const CompanyDetail = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [company, setCompany] = useState(location.state?.company || null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        console.log(company);
        
        if (!company) {
            navigate('/SuperAdmin-Dashboard/RejisteredRecruiters');
        } else {
            initializeFormData(company);
        }
    }, [company, navigate]);

    const initializeFormData = (companyData) => {
        setFormData({
            id: companyData._id,
            companyName: companyData.companyName || '',
            phone: companyData.phone || companyData.phoneNumber || '',
            email: companyData.email || '',
            registerName: companyData.registerName || '',
            contactPerson: companyData.contactPerson || '',
            gstNumber: companyData.gstNumber || '',
            panNumber: companyData.panNumber || '',
            companyType: companyData.companyType || '',
            typeOfStaffing: companyData.typeOfStaffing || '',
            employees: companyData.employees || '',
            city: companyData.city || '',
            state: companyData.state || '',
            address: {
                street: companyData.address?.street || companyData.address1 || '',
                city: companyData.address?.city || companyData.city || '',
                state: companyData.address?.state || companyData.state || '',
            }
        });
    };

    const handleInputChange = (field, value) => {
        if (field.includes('.')) {
            const [parent, child] = field.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [field]: value
            }));
        }
    };

    const handleSave = async () => {
        setLoading(true);
        setError("");

        try {
            const token = localStorage.getItem('token');

            const formDataToSend = new FormData();
            
            formDataToSend.append('companyName', formData.companyName);
            formDataToSend.append('phone', formData.phone);
            formDataToSend.append('email', formData.email);
            formDataToSend.append('registerName', formData.registerName);
            formDataToSend.append('contactPerson', formData.contactPerson);
            formDataToSend.append('gstNumber', formData.gstNumber);
            formDataToSend.append('panNumber', formData.panNumber);
            formDataToSend.append('companyType', formData.companyType);
            formDataToSend.append('typeOfStaffing', formData.typeOfStaffing);
            formDataToSend.append('employees', formData.employees);
            formDataToSend.append('city', formData.city);
            formDataToSend.append('state', formData.state);
            
            formDataToSend.append('address', JSON.stringify(formData.address));

            console.log('Sending data for ID:', company._id);

            const response = await axios.put(
                `${superAdminBaseUrl}/company/${company._id}`,
                formDataToSend,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            console.log('Full Response:', response);
            console.log('Response Data:', response.data);

            if (response.status === 200) {
                const updatedCompany = response.data.company || response.data.data || response.data;
                
                console.log('Updated Company:', updatedCompany);

                setCompany(updatedCompany);
                
                initializeFormData(updatedCompany);
                
                setIsEditing(false);
                
                alert('Company details updated successfully!');
            } else {
                setError('Update failed. Please try again.');
            }
        } catch (err) {
            console.error('Update error:', err);
            console.error('Error response:', err.response);
            setError(
                err.response?.data?.message || 
                err.response?.data?.error || 
                err.message ||
                'Error updating company details'
            );
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setError("");
        initializeFormData(company);
    };

    const getInitial = (name) => {
        return name?.charAt(0)?.toUpperCase() || 'N';
    };

    if (!company) {
        return (
            <div className="max-w-5xl mx-auto p-6">
                <div className="flex items-center justify-center py-20">
                    <p className="text-gray-500">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto p-6">

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-10">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Company Details</h2>
                    {!isEditing ? (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <Edit2 className="w-4 h-4" />
                            Edit
                        </button>
                    ) : (
                        <div className="flex gap-2">
                            <button
                                onClick={handleSave}
                                disabled={loading}
                                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                            >
                                <Save className="w-4 h-4" />
                                {loading ? 'Saving...' : 'Save'}
                            </button>
                            <button
                                onClick={handleCancel}
                                disabled={loading}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
                            >
                                <X className="w-4 h-4" />
                                Cancel
                            </button>
                        </div>
                    )}
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                        {error}
                    </div>
                )}

                <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
                    {company.logo ? (
                        <img
                            src={company.logo}
                            alt="Company Logo"
                            className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                        />
                    ) : (
                        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-bold text-2xl">
                                {getInitial(isEditing ? formData.companyName : company.companyName)}
                            </span>
                        </div>
                    )}
                    <div className="flex-1">
                        {isEditing ? (
                            <input
                                type="text"
                                value={formData.companyName}
                                onChange={(e) => handleInputChange('companyName', e.target.value)}
                                className="text-lg font-semibold text-gray-900 border rounded-lg px-3 py-2 w-full"
                                placeholder="Company Name"
                            />
                        ) : (
                            <h3 className="text-lg font-semibold text-gray-900">
                                {company.companyName || 'N/A'}
                            </h3>
                        )}
                    </div>
                </div>

                <div className="">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Register Name
                            </label>
                            <input
                                type="text"
                                value={isEditing ? formData.registerName : company.registerName || 'N/A'}
                                onChange={isEditing ? (e) => handleInputChange('registerName', e.target.value) : undefined}
                                readOnly={!isEditing}
                                className={`mt-1 w-full border rounded-lg px-3 py-2 ${isEditing ? 'bg-white' : 'bg-gray-50'}`}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Contact Person
                            </label>
                            <input
                                type="text"
                                value={isEditing ? formData.contactPerson : company.contactPerson || 'N/A'}
                                onChange={isEditing ? (e) => handleInputChange('contactPerson', e.target.value) : undefined}
                                readOnly={!isEditing}
                                className={`mt-1 w-full border rounded-lg px-3 py-2 ${isEditing ? 'bg-white' : 'bg-gray-50'}`}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Phone Number
                            </label>
                            <input
                                type="text"
                                value={isEditing ? formData.phone : (company.phone || company.phoneNumber || 'N/A')}
                                onChange={isEditing ? (e) => handleInputChange('phone', e.target.value) : undefined}
                                readOnly={!isEditing}
                                className={`mt-1 w-full border rounded-lg px-3 py-2 ${isEditing ? 'bg-white' : 'bg-gray-50'}`}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Email ID
                            </label>
                            <input
                                type="email"
                                value={isEditing ? formData.email : company.email || 'N/A'}
                                onChange={isEditing ? (e) => handleInputChange('email', e.target.value) : undefined}
                                readOnly={!isEditing}
                                className={`mt-1 w-full border rounded-lg px-3 py-2 ${isEditing ? 'bg-white' : 'bg-gray-50'}`}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                State
                            </label>
                            <input
                                type="text"
                                value={isEditing ? formData.state : company.state || 'N/A'}
                                onChange={isEditing ? (e) => handleInputChange('state', e.target.value) : undefined}
                                readOnly={!isEditing}
                                className={`mt-1 w-full border rounded-lg px-3 py-2 ${isEditing ? 'bg-white' : 'bg-gray-50'}`}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                City
                            </label>
                            <input
                                type="text"
                                value={isEditing ? formData.city : company.city || 'N/A'}
                                onChange={isEditing ? (e) => handleInputChange('city', e.target.value) : undefined}
                                readOnly={!isEditing}
                                className={`mt-1 w-full border rounded-lg px-3 py-2 ${isEditing ? 'bg-white' : 'bg-gray-50'}`}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Number of Employees
                            </label>
                            <input
                                type="text"
                                value={isEditing ? formData.employees : company.employees || 'N/A'}
                                onChange={isEditing ? (e) => handleInputChange('employees', e.target.value) : undefined}
                                readOnly={!isEditing}
                                className={`mt-1 w-full border rounded-lg px-3 py-2 ${isEditing ? 'bg-white' : 'bg-gray-50'}`}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Type of Staffing
                            </label>
                            <input
                                type="text"
                                value={isEditing ? formData.typeOfStaffing : company.typeOfStaffing || 'N/A'}
                                onChange={isEditing ? (e) => handleInputChange('typeOfStaffing', e.target.value) : undefined}
                                readOnly={!isEditing}
                                className={`mt-1 w-full border rounded-lg px-3 py-2 ${isEditing ? 'bg-white' : 'bg-gray-50'}`}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                GST Number
                            </label>
                            <input
                                type="text"
                                value={isEditing ? formData.gstNumber : company.gstNumber || 'N/A'}
                                onChange={isEditing ? (e) => handleInputChange('gstNumber', e.target.value) : undefined}
                                readOnly={!isEditing}
                                className={`mt-1 w-full border rounded-lg px-3 py-2 ${isEditing ? 'bg-white' : 'bg-gray-50'}`}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                PAN Number
                            </label>
                            <input
                                type="text"
                                value={isEditing ? formData.panNumber : company.panNumber || 'N/A'}
                                onChange={isEditing ? (e) => handleInputChange('panNumber', e.target.value) : undefined}
                                readOnly={!isEditing}
                                className={`mt-1 w-full border rounded-lg px-3 py-2 ${isEditing ? 'bg-white' : 'bg-gray-50'}`}
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Company Address
                            </label>
                            {isEditing ? (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                    <input
                                        type="text"
                                        placeholder="Street"
                                        value={formData.address?.street || ''}
                                        onChange={(e) => handleInputChange('address.street', e.target.value)}
                                        className="border rounded-lg px-3 py-2"
                                    />
                                    <input
                                        type="text"
                                        placeholder="City"
                                        value={formData.address?.city || ''}
                                        onChange={(e) => handleInputChange('address.city', e.target.value)}
                                        className="border rounded-lg px-3 py-2"
                                    />
                                    <input
                                        type="text"
                                        placeholder="State"
                                        value={formData.address?.state || ''}
                                        onChange={(e) => handleInputChange('address.state', e.target.value)}
                                        className="border rounded-lg px-3 py-2"
                                    />
                                </div>
                            ) : (
                                <div className="border rounded-lg px-3 py-2 bg-gray-50">
                                    <p className="text-gray-700">
                                        {(() => {
                                            const street = company.address?.street || company.address1 || '';
                                            const city = company.address?.city || company.city || '';
                                            const state = company.address?.state || company.state || '';
                                            const parts = [street, city, state].filter(Boolean);
                                            return parts.length > 0 ? parts.join(', ') : 'No address provided';
                                        })()}
                                    </p>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompanyDetail;