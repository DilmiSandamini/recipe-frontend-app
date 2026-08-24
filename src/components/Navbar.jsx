import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="bg-white shadow-md p-4 sticky top-0 z-50">
            <div className="max-w-6xl mx-auto flex justify-between items-center">
                <Link to="/" className="text-2xl font-extrabold text-emerald-600">
                    Flavoriz
                </Link>
                <div className="space-x-6 flex items-center">
                    <Link to="/" className="text-gray-600 hover:text-emerald-500 font-bold transition text-lg">
                        Home
                    </Link>
                    <Link to="/users" className="text-gray-600 hover:text-emerald-500 font-bold transition text-lg">
                        Users
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;