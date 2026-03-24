import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    LayoutDashboard, 
    TrendingUp, 
    FileText, 
    FolderTree, 
    Clock, 
    Activity,
    Plus,
    Inbox,
    Shield
} from 'lucide-react';
import api from '../../api/axios';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

const DashboardPage = () => {
    const [stats, setStats] = useState({ totalUploads: 0, categoryStats: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await api.get('/files/stats');
            setStats(res.data);
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    };

    const chartData = {
        labels: stats.categoryStats.map(s => s.name),
        datasets: [
            {
                label: 'Records per Category',
                data: stats.categoryStats.map(s => s.count),
                backgroundColor: 'rgba(0, 119, 182, 0.7)',
                borderColor: '#0077b6',
                borderWidth: 2,
                borderRadius: 12,
            },
        ],
    };

    const pieData = {
        labels: stats.categoryStats.map(s => s.name),
        datasets: [
            {
                data: stats.categoryStats.map(s => s.count),
                backgroundColor: [
                    '#0077b6',
                    '#00b4d8',
                    '#90e0ef',
                    '#ade8f4',
                    '#023e8a',
                    '#03045e'
                ],
                borderWidth: 0,
            },
        ],
    };

    return (
        <div className="space-y-10">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-extrabold font-outfit text-clinical-dark flex items-center gap-3">
                        Clinical Performance <span className="text-clinical-blue underline decoration-clinical-teal/30">Analytics</span>
                    </h1>
                    <p className="text-slate-500 mt-2 font-medium">Real-time repository statistics and medical registry overview.</p>
                </div>
                <div className="flex items-center gap-3 bg-white p-2 rounded-[24px] border border-slate-100 shadow-xl shadow-slate-200/40">
                    <div className="px-5 py-3 bg-green-50 text-green-600 rounded-2xl flex items-center gap-2 font-bold text-xs uppercase tracking-widest">
                        <Activity size={16} />
                        Connected
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard 
                    title="Total Medical Records" 
                    value={stats.totalUploads} 
                    icon={<FileText size={24} />} 
                    color="bg-clinical-blue"
                    percentage="+12% from last month"
                />
                <StatCard 
                    title="Active Categories" 
                    value={stats.categoryStats.length} 
                    icon={<FolderTree size={24} />} 
                    color="bg-clinical-cyan"
                    percentage="3 new added"
                />
                <StatCard 
                    title="DB Storage Health" 
                    value="98.2%" 
                    icon={<Shield size={24} />} 
                    color="bg-green-500"
                    percentage="Optimization active"
                />
                <StatCard 
                    title="Daily Submissions" 
                    value="24" 
                    icon={<Clock size={24} />} 
                    color="bg-indigo-500"
                    percentage="Peak hour: 10AM"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-2xl shadow-slate-200/50"
                >
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-bold text-clinical-dark flex items-center gap-2 uppercase tracking-tight">
                            <TrendingUp size={24} className="text-clinical-blue" />
                            Registry Distribution
                        </h2>
                    </div>
                    <div className="h-[400px] flex items-center justify-center">
                        <Bar options={{ responsive: true, maintainAspectRatio: false }} data={chartData} />
                    </div>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-2xl shadow-slate-200/50"
                >
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-bold text-clinical-dark flex items-center gap-2 uppercase tracking-tight">
                            <Inbox size={24} className="text-clinical-blue" />
                            Categorical Share
                        </h2>
                    </div>
                    <div className="h-[400px] flex items-center justify-center">
                        <Pie options={{ responsive: true, maintainAspectRatio: false }} data={pieData} />
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

const StatCard = ({ title, value, icon, color, percentage }) => (
    <motion.div 
        whileHover={{ scale: 1.02 }}
        className="bg-white p-8 rounded-[36px] border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden group"
    >
        <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-inherit/20`}>
            {icon}
        </div>
        <div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest leading-none mb-3">{title}</p>
            <h3 className="text-4xl font-black text-slate-900 font-outfit">{value}</h3>
            <p className="text-[10px] font-bold text-green-500 mt-4 uppercase tracking-tighter flex items-center gap-1.5 bg-green-50 px-3 py-1 rounded-full w-fit">
                <TrendingUp size={10} />
                {percentage}
            </p>
        </div>
        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-slate-50 rounded-full opacity-50 group-hover:scale-150 transition-transform"></div>
    </motion.div>
);

export default DashboardPage;
