import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useCompany } from '../../Context/companyContext';
import { baseUrl } from '../../utils/ApiConstants';
 
function AddNewRecruiter({ onSave, onCancel, editData }) {
    const { companies } = useCompany();
   
    const companiesList = companies?.data || [];
 
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        companyId: '',    
        companyName: ''    
    });
 
    const [errors, setErrors] = useState({});
 
    const validatePhone = (phone) => {
        const phoneRegex = /^\d{10,}$/; // At least 10 digits
        return phoneRegex.test(phone);
    };
 
    const handlePhoneChange = (e) => {
        const value = e.target.value;
        setFormData({ ...formData, phone: value });
        if (value && !validatePhone(value)) {
            setErrors({ ...errors, phone: 'Phone number must be at least 10 digits' });
        } else {
            setErrors({ ...errors, phone: '' });
        }
    };
 
    const handleKeyPress = (e) => {
        if (!/[0-9]/.test(e.key)) {
            e.preventDefault();
        }
    };
 
    useEffect(() => {
        if (editData) {
            const company = companiesList.find(c => c._id === editData.company);
            setFormData({
                fullName: editData.name || '',
                email: editData.email || '',
                phone: editData.phone || '',
                companyId: editData.company || '',
                companyName: company?.companyName || editData.companyName || ''
            });
        } else {
            if (companiesList.length > 0) {
                setFormData({
                    fullName: '',
                    email: '',
                    phone: '',
                    companyId: companiesList[0]._id,
                    companyName: companiesList[0].companyName
                });
            }
        }
    }, [editData, companiesList]);
 
    const handleCompanyChange = (e) => {
        const selectedId = e.target.value;
        const selectedCompany = companiesList.find(c => c._id === selectedId);
       
        setFormData({
            ...formData,
            companyId: selectedId,
            companyName: selectedCompany?.companyName || ''
        });
    };
 
    const handleSubmit = async (e) => {
        e.preventDefault();
 
        // Validate phone before submitting
        if (formData.phone && !validatePhone(formData.phone)) {
            setErrors({ ...errors, phone: 'Phone number must be at least 10 digits' });
            return;
        }
 
        try {
            if (editData) {
                const response = await axios.put(
                    `${baseUrl}/admin/hr/${editData.id}`,
                    {
                        name: formData.fullName,
                        phone: formData.phone,
                        email: formData.email,
                        company: formData.companyId  
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`
                        }
                    }
                );
 
                if (response.data.success) {
                    alert("HR updated successfully!");
                    onSave({
                        ...response.data.data,
                        fullName: response.data.data.name
                    });
                }
            } else {
                const response = await axios.post(`${baseUrl}/admin/hr`, {
                    name: formData.fullName,
                    phone: formData.phone,
                    email: formData.email,
                    company: formData.companyId
                }, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
 
                alert("HR created successfully!");
                onSave(response.data);
            }
 
            setFormData({
                fullName: '',
                email: '',
                phone: '',
                companyId: companiesList[0]?._id || '',
                companyName: companiesList[0]?.companyName || ''
            });
 
        } catch (error) {
            console.error('Error:', error);
            alert(error.response?.data?.message || `Failed to ${editData ? 'update' : 'create'} HR`);
        }
    };
 
    return (
        <div className="bg-white rounded-2xl shadow-md border border-gray-300 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {editData ? 'Edit Recruiter' : 'Add Recruiters'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Full Name</label>
                    <input
                        type="text"
                        placeholder="Enter Full Name"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                        required
                    />
                </div>
 
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">Email ID</label>
                        <input
                            type="email"
                            placeholder="Enter Email ID"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">Phone Number</label>
                        <input
                            type="tel"
                            placeholder="Enter Phone Number"
                            value={formData.phone}
                            onChange={handlePhoneChange}
                            onKeyPress={handleKeyPress}
                            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                            required
                        />
                        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                    </div>
                </div>
 
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-end">
                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">Company Name</label>
                        <input
                            type="text"
                            className="form-control w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                            id="companyName"
                            name="companyName"
                            value={formData.companyName}
                            readOnly
                            required
                        />
                    </div>
                    <div className="flex gap-3">
                        <button
                            type="submit"
                            className="px-8 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
                        >
                            {editData ? 'Update' : 'Save'}
                        </button>
                        {onCancel && (
                            <button
                                type="button"
                                onClick={onCancel}
                                className="px-8 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </div>
            </form>
        </div>
    );
}
 
export default AddNewRecruiter;