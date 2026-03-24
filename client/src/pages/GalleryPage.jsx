import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, LayoutGrid, List, FileText, ImageIcon, Eye, Activity } from 'lucide-react';
import api from '../api/axios';
import FileCard from '../components/FileCard';
import Modal from '../components/Modal';

const GalleryPage = () => {
    const [files, setFiles] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        fetchCategories();
        fetchFiles();
    }, [selectedCategory, searchTerm]);

    const fetchCategories = async () => {
        try {
            const res = await api.get('/categories');
            setCategories(res.data);
        } catch (e) { console.error(e); }
    };

    const fetchFiles = async () => {
        setLoading(true);
        try {
            const res = await api.get('/files', {
                params: { category: selectedCategory, search: searchTerm }
            });
            setFiles(res.data);
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-3xl font-extrabold font-outfit text-clinical-dark flex items-center gap-2">
                        <LayoutGrid size={28} className="text-clinical-blue" />
                        Medical File Gallery
                    </h1>
                    <p className="text-slate-500 mt-1">Browse and filter medical records by category.</p>
                </div>

                <div className="relative group w-full md:w-96">
                    <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-clinical-blue transition-colors" />
                    <input 
                        type="text"
                        placeholder="Search records (MRI, Scan, Lab...)"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-clinical-blue/20 focus:border-clinical-blue outline-none transition-all shadow-sm"
                    />
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-10">
                {/* Sidebar Filter */}
                <aside className="w-full md:w-64 flex-shrink-0 space-y-6">
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40">
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <Filter size={16} />
                            Categories
                        </h3>
                        <div className="space-y-2">
                            <button 
                                onClick={() => setSelectedCategory('All')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                                    selectedCategory === 'All' 
                                    ? 'bg-clinical-blue text-white shadow-lg shadow-clinical-blue/20 scale-105' 
                                    : 'text-slate-600 hover:bg-slate-50'
                                }`}
                            >
                                <LayoutGrid size={18} />
                                All Files
                            </button>
                            {categories.map((cat) => (
                                <button 
                                    key={cat._id}
                                    onClick={() => setSelectedCategory(cat.name)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                                        selectedCategory === cat.name 
                                        ? 'bg-clinical-blue text-white shadow-lg shadow-clinical-blue/20 scale-105' 
                                        : 'text-slate-600 hover:bg-slate-50'
                                    }`}
                                >
                                    <FileText size={18} />
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    <div className="p-6 bg-clinical-dark rounded-3xl text-white relative overflow-hidden group">
                        <Activity size={40} className="absolute -right-2 -bottom-2 text-white/10 group-hover:scale-125 transition-transform" />
                        <h4 className="font-bold mb-2">Need Support?</h4>
                        <p className="text-xs text-white/70 tracking-tight">Access technical logs or contact clinical support at med.portal@clinical.com</p>
                    </div>
                </aside>

                {/* Grid */}
                <div className="flex-grow">
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map(n => (
                                <div key={n} className="h-64 bg-slate-200 animate-pulse rounded-3xl"></div>
                            ))}
                        </div>
                    ) : files.length > 0 ? (
                        <motion.div 
                            layout
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            <AnimatePresence>
                                {files.map(file => (
                                    <FileCard 
                                        key={file._id} 
                                        file={file} 
                                        onPreview={() => setSelectedFile(file)}
                                    />
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    ) : (
                        <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-100">
                            <ImageIcon size={64} className="mx-auto text-slate-200 mb-4" />
                            <h3 className="text-xl font-bold text-slate-400">No medical records found.</h3>
                            <button onClick={() => {setSearchTerm(''); setSelectedCategory('All')}} className="mt-4 text-clinical-blue font-semibold hover:underline">Clear Filters</button>
                        </div>
                    )}
                </div>
            </div>

            {selectedFile && (
                <Modal file={selectedFile} onClose={() => setSelectedFile(null)} />
            )}
        </div>
    );
};

export default GalleryPage;
