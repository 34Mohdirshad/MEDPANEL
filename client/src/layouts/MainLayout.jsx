import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

const MainLayout = () => {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <Navbar />
            <main className="flex-grow pt-16">
                <Outlet />
            </main>
            <footer className="bg-white border-t py-8 text-center text-slate-500 text-sm">
                &copy; 2024 Medical Gallery Portal. All rights reserved.
            </footer>
        </div>
    );
};

export default MainLayout;
