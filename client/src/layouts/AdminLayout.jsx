import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
    LayoutDashboard, 
    FolderTree, 
    FileUp, 
    Files, 
    LogOut, 
    Stethoscope, 
    Bell, 
    Search,
    UserCircle,
    ChevronRight
} from 'lucide-react';
import toast from 'react-hot-toast';

const AdminLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const menuItems = [
        { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/admin' },
        { name: 'Categories', icon: <FolderTree size={20} />, path: '/admin/categories' },
        { name: 'Medical Records', icon: <Files size={20} />, path: '/admin/files' },
        { name: 'Upload Record', icon: <FileUp size={20} />, path: '/admin/files/upload' },
    ];

    const handleLogout = () => {
        localStorage.removeItem('token');
        toast.success('Admin Session Terminated');
        navigate('/admin/login');
    };

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar */}
            <aside className="w-80 bg-white border-r border-slate-200 flex flex-col fixed inset-y-0 z-50 transition-all duration-300">
                <div className="p-8 border-b border-slate-100 mb-6">
                    <Link to="/admin" className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-clinical-blue rounded-2xl flex items-center justify-center text-white shadow-xl shadow-clinical-blue/20">
                            <Stethoscope size={28} />
                        </div>
                        <div>
                            <span className="text-2xl font-black font-outfit text-clinical-dark tracking-tighter">MedPanel</span>
                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-clinical-blue uppercase tracking-widest opacity-60">
                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                                System Online
                            </div>
                        </div>
                    </Link>
                </div>

                <nav className="flex-grow px-6 space-y-2">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link 
                                key={item.path}
                                to={item.path}
                                className={`group flex items-center justify-between px-6 py-4 rounded-3xl text-sm font-bold tracking-tight transition-all duration-300 ${
                                    isActive 
                                    ? 'bg-clinical-blue text-white shadow-2xl shadow-clinical-blue/30 scale-105' 
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-clinical-blue'
                                }`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`${isActive ? 'text-white' : 'text-slate-400 group-hover:text-clinical-blue transition-colors'}`}>
                                        {item.icon}
                                    </div>
                                    {item.name}
                                </div>
                                {isActive && <ChevronRight size={16} />}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-8 border-t border-slate-100">
                    <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-4 px-6 py-4 rounded-3xl text-sm font-bold text-red-500 hover:bg-red-50 hover:text-red-600 transition-all"
                    >
                        <LogOut size={20} />
                        Terminate Session
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-grow pl-80">
                {/* Header */}
                <header className="h-24 bg-white/80 backdrop-blur-lg border-b border-slate-100 flex items-center justify-between px-10 sticky top-0 z-40">
                    <div className="flex-grow flex items-center gap-4 max-w-2xl px-6 bg-slate-50 rounded-2xl border border-slate-100 py-3">
                        <Search size={18} className="text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="System-wide record search..." 
                            className="bg-transparent border-none focus:ring-0 outline-none w-full text-sm font-medium placeholder:text-slate-300"
                        />
                    </div>
                    
                    <div className="flex items-center gap-6">
                        <button className="relative p-2.5 bg-slate-50 rounded-xl text-slate-400 hover:text-clinical-blue transition-all border border-slate-100">
                            <Bell size={20} />
                            <div className="absolute top-2 right-2 w-2 h-2 bg-clinical-blue rounded-full border-2 border-white"></div>
                        </button>
                        <div className="h-10 w-[1px] bg-slate-100"></div>
                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <p className="text-sm font-bold text-slate-900 leading-none mb-1">Dr. Admin Console</p>
                                <p className="text-[10px] font-bold text-clinical-blue uppercase tracking-widest opacity-60">System Controller</p>
                            </div>
                            <div className="w-12 h-12 bg-slate-100 rounded-2xl border border-slate-200 flex items-center justify-center overflow-hidden">
                                <UserCircle size={32} className="text-slate-400" />
                            </div>
                        </div>
                    </div>
                </header>

                <div className="p-10">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
