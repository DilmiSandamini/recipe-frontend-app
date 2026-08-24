import { useState, useEffect } from 'react';
import api from '../services/api';

const EditUser = ({ isOpen, onClose, refreshUsers, user }) => {
    const [formData, setFormData] = useState({ name: '', email: '' });
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({ name: user.name, email: user.email });
        }
    }, [user]);

    if (!isOpen || !user) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        api.put(`/users/update/${user.id}`, formData)
            .then(() => {
                setShowSuccess(true);
                refreshUsers();
                
                setTimeout(() => {
                    setShowSuccess(false);
                    onClose(); 
                }, 2000);
            })
            .catch(err => {
                console.error("Error updating user: ", err);
                alert("Failed to update user.");
            });
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            {showSuccess ? (
                <div className="bg-white p-10 rounded-2xl shadow-2xl flex flex-col items-center transform transition-all duration-300 scale-110">
                    <div className="text-6xl mb-4 animate-bounce">✨</div>
                    <h2 className="text-3xl font-extrabold text-emerald-500 mb-2">Updated!</h2>
                    <p className="text-gray-600 font-medium text-lg">User details updated successfully.</p>
                </div>
            ) : (
                <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md relative transition-all duration-300">
                    <button onClick={onClose} className="absolute top-4 right-5 text-gray-400 hover:text-red-500 text-3xl font-bold transition">
                        &times;
                    </button>

                    <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Edit User</h2>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-gray-700 font-semibold mb-1">User Name</label>
                            <input type="text" name="name" required value={formData.name} onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-1">Email Address</label>
                            <input type="email" name="email" required value={formData.email} onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                        </div>
                        
                        <button type="submit" className="w-full bg-emerald-500 text-white font-bold py-3 rounded-lg hover:bg-emerald-600 transition shadow-md mt-6">
                            Update User
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default EditUser;