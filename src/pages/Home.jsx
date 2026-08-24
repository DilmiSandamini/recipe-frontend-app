import { useState, useEffect } from 'react';
import api from '../services/api';
import AddRecipe from '../components/AddRecipe';
import ViewRecipe from '../components/ViewRecipe';
import EditRecipe from '../components/EditRecipe';
import { FaSearch, FaTrash, FaEye, FaEdit } from 'react-icons/fa';

const Home = () => {
    const [recipes, setRecipes] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    
    // Add & View States
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);

    // Edit States
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedEditRecipe, setSelectedEditRecipe] = useState(null);

    // Delete States
    const [deleteInfo, setDeleteInfo] = useState(null);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);

    const fetchRecipes = () => {
        api.get('/catalog/all')
            .then((response) => setRecipes(response.data))
            .catch((error) => console.error("Error fetching data: ", error));
    };

    useEffect(() => {
        fetchRecipes();
    }, []);

    const filteredRecipes = recipes.filter(recipe => 
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleViewRecipe = (recipe) => {
        setSelectedRecipe(recipe);
        setIsViewModalOpen(true);
    };

    const handleEditClick = (recipe) => {
        setSelectedEditRecipe(recipe);
        setIsEditModalOpen(true);
    };

    const handleDeleteClick = (id, title) => {
        setDeleteInfo({ id, title });
        setIsDeleteConfirmOpen(true);
    };

    const confirmDelete = () => {
        api.delete(`/catalog/delete/${deleteInfo.id}`)
            .then(() => {
                setIsDeleteConfirmOpen(false);
                setShowDeleteSuccess(true);
                fetchRecipes();
                
                setTimeout(() => {
                    setShowDeleteSuccess(false);
                    setDeleteInfo(null);
                }, 2000);
            })
            .catch((error) => {
                console.error("Error deleting recipe: ", error);
                alert("Failed to delete recipe. Check backend API.");
                setIsDeleteConfirmOpen(false);
            });
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8 relative">
            
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
                <h1 className="text-4xl font-extrabold text-emerald-600 tracking-tight">
                    Our Fresh Recipes
                </h1>
                
                <div className="relative w-full md:w-1/3">
                    <FaSearch className="absolute left-4 top-3.5 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Search recipes..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm bg-white"
                    />
                </div>

                <button 
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-emerald-500 text-white px-8 py-3 rounded-full font-bold hover:bg-emerald-600 transition-all shadow-lg hover:shadow-emerald-500/30 whitespace-nowrap">
                    + Add New Recipe
                </button>
            </div>

            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredRecipes.length > 0 ? (
                    filteredRecipes.map((recipe) => (
                        <div key={recipe.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group relative">
                            
                            {/* Card Hover Action Buttons */}
                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-10">
                                <button 
                                    onClick={() => handleEditClick(recipe)}
                                    className="bg-white/90 backdrop-blur-sm text-blue-600 p-2.5 rounded-full hover:bg-blue-500 hover:text-white transition shadow-md border border-gray-100"
                                    title="Edit Recipe">
                                    <FaEdit />
                                </button>
                                <button 
                                    onClick={() => handleDeleteClick(recipe.id, recipe.title)}
                                    className="bg-white/90 backdrop-blur-sm text-red-500 p-2.5 rounded-full hover:bg-red-500 hover:text-white transition shadow-md border border-gray-100"
                                    title="Delete Recipe">
                                    <FaTrash />
                                </button>
                            </div>

                            {/* Card Content */}
                            <div className="p-8">
                                <h2 className="text-2xl font-extrabold text-gray-800 mb-3 group-hover:text-emerald-600 transition-colors pr-20 leading-tight">
                                    {recipe.title}
                                </h2>
                                <p className="text-gray-600 leading-relaxed line-clamp-3">
                                    {recipe.description}
                                </p>
                            </div>
                            
                            {/* View Button */}
                            <div className="px-6 pb-6 mt-auto">
                                <button 
                                    onClick={() => handleViewRecipe(recipe)}
                                    className="w-full bg-emerald-50 text-emerald-600 font-bold py-3.5 px-4 rounded-2xl hover:bg-emerald-500 hover:text-white transition-all flex items-center justify-center gap-2 border border-emerald-100 group-hover:border-transparent">
                                    <FaEye className="text-xl" /> View Full Recipe
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full text-center py-20 bg-white rounded-3xl border border-gray-100 border-dashed">
                        <span className="text-6xl block mb-4">🔍</span>
                        <p className="text-gray-500 text-xl font-medium">No recipes found matching "{searchQuery}"</p>
                        <p className="text-gray-400 mt-2">Try a different search term or add a new recipe.</p>
                    </div>
                )}
            </div>

            {/* Modals */}
            <AddRecipe isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} refreshRecipes={fetchRecipes} />
            <ViewRecipe isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} recipe={selectedRecipe} />
            <EditRecipe isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} refreshRecipes={fetchRecipes} recipe={selectedEditRecipe} />
            
            {/* Delete Confirmation Modal */}
            {isDeleteConfirmOpen && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center transform transition-all scale-105">
                        <div className="text-5xl mb-4">⚠️</div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">Are you sure?</h3>
                        <p className="text-gray-600 mb-8 leading-relaxed">
                            Do you really want to delete <span className="font-bold text-gray-800">"{deleteInfo?.title}"</span>? This action cannot be undone.
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

            {/* Delete Success Animation Modal */}
            {showDeleteSuccess && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white p-10 rounded-3xl shadow-2xl flex flex-col items-center transform transition-all duration-300 scale-110">
                        <div className="text-6xl mb-4 animate-bounce">🗑️</div>
                        <h2 className="text-3xl font-extrabold text-red-500 mb-2">Deleted!</h2>
                        <p className="text-gray-600 font-medium text-lg">Recipe has been permanently removed.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;