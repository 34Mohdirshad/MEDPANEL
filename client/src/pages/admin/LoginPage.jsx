import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Lock, User, Activity, AlertCircle } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/auth/login', { username, password });
            localStorage.setItem('token', res.data.token);
            toast.success('Successfully authenticated');
            navigate('/admin');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-clinical-dark flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-clinical-blue/20 rounded-full blur-[100px]"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-clinical-cyan/20 rounded-full blur-[80px]"></div>
            
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-lg bg-white/10 backdrop-blur-2xl p-10 rounded-[40px] border border-white/20 shadow-2xl relative z-10"
            >
                <div className="text-center mb-10">
                    <div className="w-20 h-20 bg-clinical-blue mx-auto rounded-3xl flex items-center justify-center text-white shadow-xl shadow-clinical-blue/40 mb-6">
                        <Shield size={40} />
                    </div>
                    <h1 className="text-3xl font-extrabold text-white font-outfit uppercase tracking-wider mb-2">Admin Secure Gateway</h1>
                    <p className="text-white/60 font-medium">Verify credentials to access clinical database.</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-white/80 uppercase tracking-widest ml-1">Username</label>
                        <div className="relative group">
                            <User size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-clinical-blue transition-colors" />
                            <input 
                                type="text"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white text-lg font-medium focus:ring-2 focus:ring-clinical-blue/40 focus:border-clinical-blue outline-none transition-all placeholder:text-white/20"
                                placeholder="clinician_admin"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-white/80 uppercase tracking-widest ml-1">Secure Password</label>
                        <div className="relative group">
                            <Lock size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-clinical-blue transition-colors" />
                            <input 
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white text-lg font-medium focus:ring-2 focus:ring-clinical-blue/40 focus:border-clinical-blue outline-none transition-all placeholder:text-white/20"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button 
                        type="submit"
                        disabled={loading}
                        className="w-full py-5 bg-clinical-blue text-white rounded-2xl text-xl font-extrabold hover:bg-clinical-cyan hover:shadow-2xl hover:shadow-clinical-blue/40 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                        {loading ? <Activity className="animate-spin" size={24} /> : 'Authenticate System'}
                    </button>
                </form>

                <div className="mt-8 flex items-center justify-center gap-2 text-white/40 text-sm font-bold uppercase tracking-tighter">
                    <AlertCircle size={14} />
                    System restricted to authorized personnel only.
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;
