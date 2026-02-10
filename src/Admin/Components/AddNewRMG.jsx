// import axios from 'axios';
// import React, { useState, useEffect } from 'react';
// import { useCompany } from '../../Context/companyContext';
// import { baseUrl } from '../../utils/ApiConstants';

// function AddNewRMG({ onSave, onCancel, editData }) {
//     const { companies } = useCompany();
    
//     const companiesList = companies?.data || [];

//     const [loading, setLoading] = useState(false);
//     const [formData, setFormData] = useState({
//         fullName: '',
//         email: '',
//         companyId: ''
//     });

//     useEffect(() => {
//         if (editData) {
//             setFormData({
//                 fullName: editData.name || '',
//                 email: editData.email || '',
//                 companyId: editData.company || ''
//             });
//         } else {
//             if (companiesList.length > 0) {
//                 setFormData({
//                     fullName: '',
//                     email: '',
//                     companyId: companiesList[0]._id
//                 });
//             }
//         }
//     }, [editData, companiesList]);

//     const handleCompanyChange = (e) => {
//         const selectedId = e.target.value;
//         setFormData({
//             ...formData,
//             companyId: selectedId
//         });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);

//         try {
//             if (editData) {
//                 const response = await axios.put(
//                     `${baseUrl}/admin/rmg/${editData.id || editData._id}`,
//                     {
//                         name: formData.fullName,
//                         email: formData.email,
//                         company: formData.companyId
//                     },
//                     {
//                         headers: {
//                             Authorization: `Bearer ${localStorage.getItem('token')}`
//                         }
//                     }
//                 );

//                 if (response.data.success) {
//                     alert("RMG updated successfully!");
//                     onSave({
//                         ...response.data.data,
//                         fullName: response.data.data.name
//                     });
//                 }
//             } else {
//                 const response = await axios.post(
//                     `${baseUrl}/admin/rmg`,
//                     {
//                         name: formData.fullName,
//                         email: formData.email,
//                         company: formData.companyId
//                     },
//                     {
//                         headers: {
//                             Authorization: `Bearer ${localStorage.getItem('token')}`
//                         }
//                     }
//                 );

//                 if (response.data.success) {
//                     alert(response.data.message || "RMG created successfully! Credentials sent to email.");
//                     onSave(response.data);
//                 }
//             }

//             setFormData({
//                 fullName: '',
//                 email: '',
//                 companyId: companiesList[0]?._id || ''
//             });

//         } catch (error) {
//             console.error('Error:', error);
//             alert(error.response?.data?.message || `Failed to ${editData ? 'update' : 'create'} RMG`);
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="bg-white rounded-2xl shadow-md border border-gray-300 p-6">
//             <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-2xl font-bold text-gray-900">
//                     {editData ? 'Edit RMG' : 'Add RMG'}
//                 </h2>
//                 {onCancel && (
//                     <button
//                         onClick={onCancel}
//                         className="text-gray-500 hover:text-gray-700 text-sm font-medium"
//                     >
//                         Cancel
//                     </button>
//                 )}
//             </div>

//             <form onSubmit={handleSubmit} className="space-y-5">
//                 <div>
//                     <label className="block text-sm font-medium text-gray-900 mb-2">
//                         Full Name <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                         type="text"
//                         placeholder="Enter Full Name"
//                         value={formData.fullName}
//                         onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
//                         className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
//                         required
//                     />
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//                     <div>
//                         <label className="block text-sm font-medium text-gray-900 mb-2">
//                             Email ID <span className="text-red-500">*</span>
//                         </label>
//                         <input
//                             type="email"
//                             placeholder="Enter Email ID"
//                             value={formData.email}
//                             onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                             className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
//                             required
//                         />
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium text-gray-900 mb-2">
//                             Company Name <span className="text-red-500">*</span>
//                         </label>
//                         <select
//                             value={formData.companyId}
//                             onChange={handleCompanyChange}
//                             className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white"
//                             required
//                         >
//                             <option value="">Select Company</option>
//                             {companiesList.map((company) => (
//                                 <option key={company._id} value={company._id}>
//                                     {company.companyName}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>
//                 </div>

//                 <div className="flex gap-3">
//                     <button
//                         type="submit"
//                         disabled={loading}
//                         className="px-8 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
//                     >
//                         {loading ? 'Saving...' : (editData ? 'Update' : 'Save')}
//                     </button>
//                     {onCancel && (
//                         <button
//                             type="button"
//                             onClick={onCancel}
//                             className="px-8 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
//                         >
//                             Cancel
//                         </button>
//                     )}
//                 </div>
//             </form>
//         </div>
//     );
// }

// export default AddNewRMG;

import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useCompany } from '../../Context/companyContext';
import { baseUrl } from '../../utils/ApiConstants';
 
function AddNewRMG({ onSave, onCancel, editData }) {
    const { companies } = useCompany();
   
    const companiesList = companies?.data || [];
 
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        companyId: ''
    });
 
    useEffect(() => {
        if (editData) {
            setFormData({
                fullName: editData.name || '',
                email: editData.email || '',
                companyId: editData.company || ''
            });
        } else {
            if (companiesList.length > 0) {
                setFormData({
                    fullName: '',
                    email: '',
                    companyId: companiesList[0]._id
                });
            }
        }
    }, [editData, companiesList]);
 
    const handleCompanyChange = (e) => {
        const selectedId = e.target.value;
        setFormData({
            ...formData,
            companyId: selectedId
        });
    };
 
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
 
        try {
            if (editData) {
                const response = await axios.put(
                    `${baseUrl}/admin/rmg/${editData.id || editData._id}`,
                    {
                        name: formData.fullName,
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
                    alert("RMG updated successfully!");
                    onSave({
                        ...response.data.data,
                        fullName: response.data.data.name
                    });
                }
            } else {
                const response = await axios.post(
                    `${baseUrl}/admin/rmg`,
                    {
                        name: formData.fullName,
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
                    alert(response.data.message || "RMG created successfully! Credentials sent to email.");
                    onSave(response.data);
                }
            }
 
            setFormData({
                fullName: '',
                email: '',
                companyId: companiesList[0]?._id || ''
            });
 
        } catch (error) {
            console.error('Error:', error);
            alert(error.response?.data?.message || `Failed to ${editData ? 'update' : 'create'} RMG`);
        } finally {
            setLoading(false);
        }
    };
 
    return (
        <div className="bg-white rounded-2xl shadow-md border border-gray-300 p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                    {editData ? 'Edit RMG' : 'Add RMG'}
                </h2>
                {onCancel && (
                    <button
                        onClick={onCancel}
                        className="text-gray-500 hover:text-gray-700 text-sm font-medium"
                    >
                        Cancel
                    </button>
                )}
            </div>
 
            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                        Full Name <span className="text-red-500">*</span>
                    </label>
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
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                            Email ID <span className="text-red-500">*</span>
                        </label>
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
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                            Company Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white"
                            id="companyName"
                            name="companyName"
                            value={
                                companiesList.find(c => c._id === formData.companyId)?.companyName || ''
                            }
                            readOnly
                            required
                        />
                    </div>
                </div>
 
                <div className="flex gap-3">
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-8 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Saving...' : (editData ? 'Update' : 'Save')}
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
            </form>
        </div>
    );
}
 
export default AddNewRMG;