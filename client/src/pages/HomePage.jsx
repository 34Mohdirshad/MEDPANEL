import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, FileText, Activity, Layers, ArrowRight } from 'lucide-react';

const HomePage = () => {
    return (
        <div className="relative overflow-hidden pt-12">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 bg-clinical-blue/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 bg-clinical-cyan/10 rounded-full blur-3xl"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 pt-16 relative z-10">
                <div className="text-center">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide uppercase bg-clinical-light text-clinical-blue border border-clinical-teal/30 mb-8">
                            Modern Medical Repository
                        </span>
                        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold font-outfit text-clinical-dark leading-tight mb-8">
                            Unified Access to <br />
                            <span className="text-transparent bg-clip-text clinical-gradient">Medical Records</span>
                        </h1>
                        <p className="max-w-2xl mx-auto text-xl text-slate-500 mb-10 leading-relaxed font-sans">
                            A secure, organized, and lightning-fast medical gallery for reports, scans, and diagnostic data. Built for clinical efficiency.
                        </p>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <Link to="/gallery" className="group px-8 py-4 bg-clinical-blue text-white rounded-2xl text-lg font-bold hover:shadow-2xl hover:shadow-clinical-blue/40 transition-all flex items-center gap-3">
                            <Layers size={22} />
                            Browse Gallery
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link to="/admin/login" className="px-8 py-4 bg-white text-clinical-blue border-2 border-clinical-blue/20 rounded-2xl text-lg font-bold hover:bg-slate-50 transition-all">
                            Admin Login
                        </Link>
                    </motion.div>
                </div>

                <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <FeatureCard 
                        icon={<Shield size={28} className="text-clinical-blue" />}
                        title="Secure Repository"
                        description="End-to-end encrypted storage for sensitive medical documentation."
                    />
                    <FeatureCard 
                        icon={<FileText size={28} className="text-clinical-blue" />}
                        title="Multi-format Support"
                        description="Seamlessly view high-res scans, X-rays, and detailed PDF reports."
                    />
                    <FeatureCard 
                        icon={<Activity size={28} className="text-clinical-blue" />}
                        title="Smart Categorization"
                        description="Effortlessly filter through MRI, CT Scans, and routine lab results."
                    />
                </div>
            </div>
        </div>
    );
};

const FeatureCard = ({ icon, title, description }) => (
    <motion.div 
        whileHover={{ y: -10 }}
        className="bg-white p-10 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 group"
    >
        <div className="w-16 h-16 bg-clinical-light rounded-2xl flex items-center justify-center mb-6 group-hover:bg-clinical-blue transition-colors group-hover:text-white">
            {icon}
        </div>
        <h3 className="text-2xl font-bold text-slate-900 mb-3 font-outfit">{title}</h3>
        <p className="text-slate-500 leading-relaxed text-lg">{description}</p>
    </motion.div>
);

export default HomePage;
