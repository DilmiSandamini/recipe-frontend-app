import { useState, useRef } from 'react';
import api from '../services/api';

const AddRecipe = ({ isOpen, onClose, refreshRecipes }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        ingredients: '',
        instructions: ''
    });
    
    const [imageFile, setImageFile] = useState(null); 
    const [showSuccess, setShowSuccess] = useState(false); 
    const fileInputRef = useRef(null);

    if (!isOpen) return null; 

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!imageFile) {
            alert("Please select an image for the recipe!");
            return;
        }
        
        const data = new FormData();
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('ingredients', formData.ingredients);
        data.append('instructions', formData.instructions);
        data.append('image', imageFile);

        api.post('/catalog/add-with-image', data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(() => {
                setShowSuccess(true); 
                refreshRecipes(); 
                
                setTimeout(() => {
                    setShowSuccess(false);
                    onClose(); 
                    setFormData({ title: '', description: '', ingredients: '', instructions: '' }); 
                    setImageFile(null);
                    if(fileInputRef.current) fileInputRef.current.value = "";
                }, 2000);
            })
            .catch(err => {
                console.error("Error adding recipe: ", err);
                alert("Failed to add recipe.");
            });
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            {showSuccess ? (
                <div className="bg-white p-10 rounded-2xl shadow-2xl flex flex-col items-center transform transition-all duration-300 scale-110">
                    <div className="text-6xl mb-4 animate-bounce">🎉</div>
                    <h2 className="text-3xl font-extrabold text-emerald-500 mb-2">Success!</h2>
                    <p className="text-gray-600 font-medium text-lg">Recipe Added Successfully</p>
                </div>
            ) : (
                <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg relative max-h-[90vh] overflow-y-auto transition-all duration-300">
                    <button onClick={onClose} className="absolute top-4 right-5 text-gray-400 hover:text-red-500 text-3xl font-bold transition">
                        &times;
                    </button>

                    <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Add New Recipe</h2>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-gray-700 font-semibold mb-1">Recipe Title</label>
                            <input type="text" name="title" required value={formData.title} onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-1">Description</label>
                            <textarea name="description" required value={formData.description} onChange={handleChange} rows="2"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"></textarea>
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-1">Ingredients (One per line)</label>
                            <textarea name="ingredients" required value={formData.ingredients} onChange={handleChange} rows="2"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"></textarea>
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-1">Instructions (One step per line)</label>
                            <textarea name="instructions" required value={formData.instructions} onChange={handleChange} rows="2"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"></textarea>
                        </div>
                        
                        <div>
                            <label className="block text-gray-700 font-semibold mb-1">Recipe Image</label>
                            <input 
                                type="file" 
                                accept="image/*" 
                                required 
                                onChange={handleImageChange}
                                ref={fileInputRef}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100" 
                            />
                        </div>
                        
                        <button type="submit" className="w-full bg-emerald-500 text-white font-bold py-3 rounded-lg hover:bg-emerald-600 transition shadow-md mt-4">
                            Save Recipe
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default AddRecipe;