import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = ({ setIsAuthenticated }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
    const response = await axios.post('http://136.119.198.141:8080/api/admin/login', {   
                username: username,
                password: password
            });

            if (response.data.success) {
                localStorage.setItem('isAdminLoggedIn', 'true');
                setIsAuthenticated(true);
                navigate('/'); 
            }
        } catch (err) {
            setError('Invalid username or password! Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-emerald-50 flex items-center justify-center p-4 relative overflow-hidden">
            
            {/* Background Decoration Circles */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>

            <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md border border-emerald-100 relative z-10">
                <div className="text-center mb-10">
                    <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl shadow-inner">
                        🔐
                    </div>
                    <h1 className="text-4xl font-extrabold text-emerald-600 mb-2 tracking-tight">Flavoriz Admin</h1>
                    <p className="text-gray-500 font-medium">Sign in to manage your platform</p>
                </div>
                
                <form onSubmit={handleLogin} className="space-y-6">
                    {error && (
                        <div className="bg-red-50 text-red-500 p-4 rounded-xl text-sm font-bold text-center border border-red-100 animate-pulse">
                            {error}
                        </div>
                    )}
                    
                    <div>
                        <label className="block text-gray-700 font-bold mb-2 ml-1">Username</label>
                        <input 
                            type="text" 
                            required 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter admin username"
                            className="w-full px-5 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all bg-gray-50 focus:bg-white font-medium" 
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-bold mb-2 ml-1">Password</label>
                        <input 
                            type="password" 
                            required 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full px-5 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all bg-gray-50 focus:bg-white font-medium" 
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full bg-emerald-500 text-white font-bold py-3.5 rounded-2xl hover:bg-emerald-600 transition-all shadow-lg hover:shadow-emerald-500/40 flex justify-center items-center gap-2 mt-4 disabled:opacity-70 disabled:cursor-not-allowed">
                        {isLoading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;