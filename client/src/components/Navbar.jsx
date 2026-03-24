import { Link, useLocation } from 'react-router-dom';
import { Stethoscope, Activity, LayoutGrid, Search, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
    const location = useLocation();
    const { isDark, toggleTheme } = useTheme();
    
    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Medical Gallery', path: '/gallery' },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b dark:border-slate-800 z-50 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
                <Link to="/" className="flex items-center space-x-2">
                    <div className="w-10 h-10 bg-clinical-blue rounded-xl flex items-center justify-center text-white shadow-lg shadow-clinical-blue/20">
                        <Stethoscope size={24} />
                    </div>
                    <span className="text-xl font-bold font-outfit text-clinical-dark dark:text-white tracking-tight">MedPortal</span>
                </Link>

                <div className="hidden md:flex items-center space-x-8">
                    {navLinks.map((link) => (
                        <Link 
                            key={link.path}
                            to={link.path}
                            className={`text-sm font-medium transition-colors ${
                                location.pathname === link.path 
                                ? 'text-clinical-blue font-bold' 
                                : 'text-slate-600 dark:text-slate-400 hover:text-clinical-blue'
                            }`}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <button 
                        onClick={toggleTheme}
                        className="p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-xl hover:text-clinical-blue transition-all"
                    >
                        {isDark ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                    <Link to="/admin" className="px-5 py-2 bg-clinical-blue text-white rounded-lg text-sm font-semibold hover:bg-clinical-dark transition-all shadow-md shadow-clinical-blue/10">
                        Admin Portal
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
