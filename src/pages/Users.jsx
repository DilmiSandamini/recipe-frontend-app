import { useState, useEffect } from 'react';
import api from '../services/api';
import AddUser from '../components/AddUser';
import EditUser from '../components/EditUser'; 
import { FaSearch, FaTrash, FaEdit } from 'react-icons/fa';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const [deleteInfo, setDeleteInfo] = useState(null);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);

    const fetchUsers = () => {
        api.get('/users/all')
            .then((response) => {
                setUsers(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching users: ", error);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleEditClick = (user) => {
        setSelectedUser(user);
        setIsEditModalOpen(true);
    };

    const handleDeleteClick = (id, name) => {
        setDeleteInfo({ id, name });
        setIsDeleteConfirmOpen(true);
    };

    const confirmDelete = () => {
        api.delete(`/users/delete/${deleteInfo.id}`)
            .then(() => {
                setIsDeleteConfirmOpen(false);
                setShowDeleteSuccess(true);
                fetchUsers();
                
                setTimeout(() => {
                    setShowDeleteSuccess(false);
                    setDeleteInfo(null);
                }, 2000);
            })
            .catch((error) => {
                console.error("Error deleting user: ", error);
                alert("Failed to delete user.");
                setIsDeleteConfirmOpen(false);
            });
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8 relative">
            <div className="max-w-6xl mx-auto">
                
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
                    <div className="text-center md:text-left">
                        <h1 className="text-4xl font-bold text-emerald-600 mb-2">
                            Users Management
                        </h1>
                        <p className="text-gray-600 text-lg">
                            Manage all registered users in the platform.
                        </p>
                    </div>
                    
                    <div className="relative w-full md:w-1/3">
                        <FaSearch className="absolute left-4 top-3.5 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Search users..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm bg-white"
                        />
                    </div>

                    <button 
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-emerald-500 text-white px-8 py-3 rounded-full font-bold hover:bg-emerald-600 transition-all shadow-lg hover:shadow-emerald-500/30 whitespace-nowrap">
                        + Add User
                    </button>
                </div>

                <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-emerald-100">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-emerald-500 text-white">
                                    <th className="p-5 font-semibold rounded-tl-2xl text-lg">ID</th>
                                    <th className="p-5 font-semibold text-lg">User Name</th>
                                    <th className="p-5 font-semibold text-lg">Email Address</th>
                                    <th className="p-5 font-semibold text-lg">Role</th>
                                    <th className="p-5 font-semibold text-center rounded-tr-2xl text-lg">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="5" className="text-center p-8 text-gray-500 font-semibold text-lg animate-pulse">
                                            Loading users...
                                        </td>
                                    </tr>
                                ) : filteredUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="text-center p-8 text-gray-500 font-semibold text-lg">
                                            No users found.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredUsers.map((user, index) => (
                                        <tr 
                                            key={user.id} 
                                            className={`border-b border-emerald-100 last:border-0 hover:bg-emerald-50 transition ${index % 2 === 0 ? 'bg-white' : 'bg-emerald-50/30'}`}
                                        >
                                            <td className="p-5 text-gray-700 font-bold">#{user.id}</td>
                                            <td className="p-5 text-gray-800 font-semibold flex items-center gap-3">
                                                <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-bold text-lg border border-emerald-200 uppercase">
                                                    {user.name.charAt(0)}
                                                </div>
                                                {user.name}
                                            </td>
                                            <td className="p-5 text-gray-600">{user.email}</td>
                                            <td className="p-5">
                                                <span className="bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full text-sm font-bold border border-emerald-200 shadow-sm">
                                                    User
                                                </span>
                                            </td>
                                            <td className="p-5 text-center flex justify-center gap-3">
                                                <button 
                                                    onClick={() => handleEditClick(user)}
                                                    className="bg-blue-50 text-blue-500 p-2.5 rounded-lg hover:bg-blue-500 hover:text-white transition-colors shadow-sm">
                                                    <FaEdit />
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteClick(user.id, user.name)}
                                                    className="bg-red-50 text-red-500 p-2.5 rounded-lg hover:bg-red-500 hover:text-white transition-colors shadow-sm">
                                                    <FaTrash />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <AddUser isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} refreshUsers={fetchUsers} />
            <EditUser isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} refreshUsers={fetchUsers} user={selectedUser} />

            {isDeleteConfirmOpen && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center transform transition-all scale-105">
                        <div className="text-5xl mb-4">⚠️</div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">Are you sure?</h3>
                        <p className="text-gray-600 mb-8 leading-relaxed">
                            Do you want to delete <span className="font-bold text-gray-800">"{deleteInfo?.name}"</span>?
                        </p>
                        <div className="flex gap-4 justify-center">
                            <button 
                                onClick={() => setIsDeleteConfirmOpen(false)} 
                                className="px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition w-full">
                                Cancel
                            </button>
                            <button 
                                onClick={confirmDelete} 
                                className="px-6 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition shadow-lg hover:shadow-red-500/30 w-full">
                                Yes, Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showDeleteSuccess && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white p-10 rounded-3xl shadow-2xl flex flex-col items-center transform transition-all duration-300 scale-110">
                        <div className="text-6xl mb-4 animate-bounce">🗑️</div>
                        <h2 className="text-3xl font-extrabold text-red-500 mb-2">Deleted!</h2>
                        <p className="text-gray-600 font-medium text-lg">User has been removed.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Users;