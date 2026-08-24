import React from 'react';

const ViewRecipe = ({ isOpen, onClose, recipe }) => {
    if (!isOpen || !recipe) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-3xl relative max-h-[90vh] overflow-y-auto">
                
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-3xl font-bold transition"
                >
                    &times;
                </button>

                <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8 mt-2 pr-8">
                    <div className="flex-1">
                        <h2 className="text-4xl font-extrabold text-gray-800 mb-3">{recipe.title}</h2>
                        <p className="text-gray-600 text-lg italic">{recipe.description}</p>
                    </div>

                    <div className="w-32 h-32 md:w-40 md:h-40 shrink-0 bg-gray-100 rounded-xl overflow-hidden border-2 border-emerald-100 shadow-sm flex items-center justify-center">
                        {recipe.imageUrl ? (
                            <img 
                                src={recipe.imageUrl} 
                                alt={recipe.title || "Recipe"} 
                                className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                                onError={(e) => { 
                                    e.target.onerror = null; 
                                    e.target.src = "https://placehold.co/150x150/ecfdf5/059669?text=No+Image" 
                                }}
                            />
                        ) : (
                            <span className="text-5xl">🍽️</span>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Ingredients (Emerald Theme) */}
                    <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-100 shadow-sm">
                        <h3 className="text-2xl font-bold text-emerald-600 mb-4 flex items-center gap-2">
                            🛒 Ingredients
                        </h3>
                        <ul className="list-disc pl-5 space-y-2 text-gray-700 font-medium">
                            {recipe.ingredients && recipe.ingredients.map((item, index) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>
                    </div>

                    {/* Instructions (Blue Accent) */}
                    <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 shadow-sm">
                        <h3 className="text-2xl font-bold text-blue-600 mb-4 flex items-center gap-2">
                            👨‍🍳 Instructions
                        </h3>
                        <ol className="list-decimal pl-5 space-y-2 text-gray-700 font-medium">
                            {recipe.instructions && recipe.instructions.map((step, index) => (
                                <li key={index}>{step}</li>
                            ))}
                        </ol>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewRecipe;