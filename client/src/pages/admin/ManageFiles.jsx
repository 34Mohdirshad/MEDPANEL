import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Edit3, Files, Search, Filter, Calendar, Info, FileText, ImageIcon, ExternalLink, Activity, X, CheckSquare } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const ManageFiles = () => {
    const [files, setFiles] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    
    // Editing State
    const [editingFile, setEditingFile] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const [editDesc, setEditDesc] = useState('');
    const [editCat, setEditCat] = useState('');

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
        } catch (e) {
            toast.error('Repository extraction failed');
        }
        setLoading(false);
    };

    const handleDelete = async (id) => {
        if (!confirm('Permanently delete this medical record? This cannot be undone.')) return;
        try {
            await api.delete(`/files/${id}`);
            toast.success('Record purged from repository');
            fetchFiles();
        } catch (e) { toast.error('Purge operation failed'); }
    };

    const handleEditInitiate = (file) => {
        setEditingFile(file);
        setEditTitle(file.title);
        setEditDesc(file.description || '');
        setEditCat(file.category?._id || '');
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/files/${editingFile._id}`, {
                title: editTitle,
                description: editDesc,
                categoryId: editCat
            });
            toast.success('System registry updated');
            setEditingFile(null);
            fetchFiles();
        } catch (e) {
            toast.error('Update operation failed');
        }
    };

    return (
        <div className="space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div>
                    <h1 className="text-4xl font-extrabold font-outfit text-clinical-dark flex items-center gap-3 tracking-tighter uppercase">
                        Clinical <span className="text-clinical-blue underline decoration-clinical-teal/30">Registry</span> Manage
                    </h1>
                    <p className="text-slate-500 mt-2 font-medium">Coordinate, edit, and audit system-wide medical records.</p>
                </div>

                <div className="flex flex-col sm:flex-row bg-white p-2.5 rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/40 gap-3">
                    <div className="flex items-center gap-4 px-6 bg-slate-50 rounded-2xl border border-slate-100 py-3 w-80">
                        <Search size={18} className="text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="System-wide record query..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-transparent border-none focus:ring-0 outline-none w-full text-xs font-bold uppercase tracking-widest placeholder:text-slate-200"
                        />
                    </div>
                    <div className="flex items-center gap-4 px-6 bg-slate-50 rounded-2xl border border-slate-100 py-3 w-64">
                        <Filter size={18} className="text-slate-400" />
                        <select 
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="bg-transparent border-none focus:ring-0 outline-none w-full text-xs font-bold uppercase tracking-widest cursor-pointer"
                        >
                            <option value="All">All Classifications</option>
                            {categories.map(cat => <option key={cat._id} value={cat.name}>{cat.name}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-[48px] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                            <tr>
                                <th className="px-10 py-8">Record Identifier</th>
                                <th className="px-10 py-8">Classification</th>
                                <th className="px-10 py-8">Metadata Status</th>
                                <th className="px-10 py-8">Ingestion Date</th>
                                <th className="px-10 py-8 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                [1, 2, 3, 4, 5].map(n => (
                                    <tr key={n} className="animate-pulse">
                                        <td colSpan="5" className="px-10 py-10">
                                            <div className="h-6 bg-slate-100 rounded-lg w-full"></div>
                                        </td>
                                    </tr>
                                ))
                            ) : files.length > 0 ? (
                                <AnimatePresence>
                                    {files.map((file) => (
                                        <motion.tr 
                                            key={file._id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            className="group hover:bg-slate-50/50 transition-colors"
                                        >
                                            <td className="px-10 py-8">
                                                <div className="flex items-center gap-6">
                                                    <div className="w-16 h-16 bg-white rounded-2xl border border-slate-100 p-0.5 shadow-sm group-hover:shadow-md transition-all">
                                                        {file.fileType === 'pdf' ? (
                                                            <div className="w-full h-full bg-clinical-light/30 rounded-xl flex items-center justify-center text-clinical-blue">
                                                                <FileText size={24} />
                                                            </div>
                                                        ) : (
                                                            <img src={file.fileURL} className="w-full h-full object-cover rounded-xl" alt="" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-black text-slate-900 group-hover:text-clinical-blue transition-colors uppercase truncate max-w-xs">{file.title}</h4>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">ID: {file._id.slice(-8).toUpperCase()}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-clinical-light/30 text-clinical-blue rounded-full text-[10px] font-bold uppercase tracking-widest border border-clinical-teal/10">
                                                    <Activity size={10} />
                                                    {file.category?.name || 'Unlabeled'}
                                                </span>
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className="flex items-center gap-4">
                                                    <div className="p-2 bg-slate-100 rounded-lg text-slate-400">
                                                        <Info size={14} />
                                                    </div>
                                                    <p className="text-xs font-medium text-slate-500 line-clamp-1 max-w-xs">
                                                        {file.description || 'No diagnostic notes ingested.'}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8 text-xs font-bold text-slate-400 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <Calendar size={12} className="text-clinical-blue" />
                                                    {format(new Date(file.uploadDate), 'MMM dd, yyyy – HH:mm')}
                                                </div>
                                            </td>
                                            <td className="px-10 py-8 text-right">
                                                <div className="flex items-center justify-end gap-3 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                                                    <button 
                                                        onClick={() => handleEditInitiate(file)}
                                                        className="p-3 bg-white text-slate-400 hover:bg-clinical-blue hover:text-white rounded-xl transition-all border border-slate-100 shadow-sm"
                                                    >
                                                        <Edit3 size={16} />
                                                    </button>
                                                    <a 
                                                        href={file.fileURL} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="p-3 bg-white text-slate-400 hover:bg-clinical-blue hover:text-white rounded-xl transition-all border border-slate-100 shadow-sm"
                                                    >
                                                        <ExternalLink size={16} />
                                                    </a>
                                                    <button 
                                                        onClick={() => handleDelete(file._id)}
                                                        className="p-3 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all border border-red-50 shadow-sm"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-10 py-20 text-center">
                                        <Files size={64} className="mx-auto text-slate-100 mb-6" />
                                        <h3 className="text-xl font-bold text-slate-300 uppercase tracking-tighter">System Registry is Empty</h3>
                                        <p className="text-slate-400 mt-2">Initialize ingestion to view medical records.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit Modal */}
            <AnimatePresence>
                {editingFile && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-clinical-dark/60 backdrop-blur-sm"
                            onClick={() => setEditingFile(null)}
                        />
                        <motion.div 
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="relative w-full max-w-xl bg-white rounded-[40px] shadow-2xl p-10 overflow-hidden"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-2xl font-black text-clinical-dark uppercase tracking-tighter">Edit Record Metadata</h3>
                                <button onClick={() => setEditingFile(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleUpdate} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-2">Record Title</label>
                                    <input 
                                        type="text"
                                        required
                                        value={editTitle}
                                        onChange={(e) => setEditTitle(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold text-slate-900 focus:ring-4 focus:ring-clinical-blue/10 outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-2">Classification</label>
                                    <select 
                                        value={editCat}
                                        onChange={(e) => setEditCat(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold text-slate-900 focus:ring-4 focus:ring-clinical-blue/10 outline-none"
                                    >
                                        {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-2">Clinical Notes</label>
                                    <textarea 
                                        rows="4"
                                        value={editDesc}
                                        onChange={(e) => setEditDesc(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-[32px] py-4 px-6 text-sm font-medium text-slate-600 focus:ring-4 focus:ring-clinical-blue/10 outline-none resize-none"
                                    />
                                </div>
                                <button 
                                    type="submit"
                                    className="w-full py-5 bg-clinical-blue text-white rounded-3xl text-sm font-black tracking-widest uppercase hover:shadow-2xl hover:shadow-clinical-blue/20 transition-all flex items-center justify-center gap-3"
                                >
                                    <CheckSquare size={20} />
                                    Save System Changes
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            
            <div className="flex items-center justify-between text-[10px] font-bold text-slate-300 uppercase tracking-[0.3em] px-10">
                <span>Clinical Audit Mode Active</span>
                <span>System Synchronized: {format(new Date(), 'HH:mm:ss')}</span>
            </div>
        </div>
    );
};

export default ManageFiles;
