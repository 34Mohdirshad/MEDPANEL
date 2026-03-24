import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit3, FolderTree, Package, Search, ChevronRight } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const ManageCategories = () => {
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => { fetchCategories(); }, []);

    const fetchCategories = async () => {
        try {
            const res = await api.get('/categories');
            setCategories(res.data);
        } catch (e) { toast.error('Failed to load categories'); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (editingId) {
                await api.put(`/categories/${editingId}`, { name, description });
                toast.success('Category updated successfully');
            } else {
                await api.post('/categories', { name, description });
                toast.success('Category created successfully');
            }
            setName('');
            setDescription('');
            setEditingId(null);
            fetchCategories();
        } catch (e) { toast.error('Check input details'); }
        setLoading(false);
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure? All associated files will lose their category.')) return;
        try {
            await api.delete(`/categories/${id}`);
            toast.success('Category removed from system');
            fetchCategories();
        } catch (e) { toast.error('Deletion failed'); }
    };

    return (
        <div className="space-y-12">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-extrabold font-outfit text-clinical-dark flex items-center gap-3">
                        Category <span className="text-clinical-blue underline decoration-clinical-teal/30">Registry</span>
                    </h1>
                    <p className="text-slate-500 mt-2 font-medium">Create and regulate clinical classifications for medical records.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Form */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-2xl shadow-slate-200/50 sticky top-36">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-14 h-14 bg-clinical-light rounded-2xl flex items-center justify-center text-clinical-blue">
                                <Plus size={28} />
                            </div>
                            <h2 className="text-xl font-bold text-clinical-dark uppercase tracking-tight">{editingId ? 'Modify Category' : 'Register New Category'}</h2>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-2">Official Class Name</label>
                                <input 
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g. MRI Scans"
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold text-slate-900 focus:ring-4 focus:ring-clinical-blue/10 focus:border-clinical-blue outline-none transition-all"
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-2">Internal Notes / Scope</label>
                                <textarea 
                                    rows="4"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Describe clinical scope of this category..."
                                    className="w-full bg-slate-50 border border-slate-100 rounded-3xl py-4 px-6 text-sm font-medium text-slate-600 focus:ring-4 focus:ring-clinical-blue/10 focus:border-clinical-blue outline-none transition-all resize-none"
                                />
                            </div>

                            <button 
                                type="submit"
                                disabled={loading}
                                className="w-full py-5 bg-clinical-blue text-white rounded-3xl text-sm font-black tracking-widest uppercase hover:bg-clinical-dark active:scale-95 transition-all shadow-xl shadow-clinical-blue/20"
                            >
                                {loading ? 'Processing...' : (editingId ? 'Update System Registry' : 'Initialize Category')}
                            </button>
                            {editingId && (
                                <button 
                                    type="button" 
                                    onClick={() => {setEditingId(null); setName(''); setDescription('');}}
                                    className="w-full py-4 text-slate-400 font-bold hover:text-red-500 transition-colors"
                                >
                                    Cancel Operations
                                </button>
                            )}
                        </form>
                    </div>
                </div>

                {/* List */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center gap-4 bg-white p-4 rounded-[28px] border border-slate-100 mb-8 max-w-md ml-auto shadow-xl shadow-slate-200/30">
                        <Search size={18} className="text-slate-400 ml-2" />
                        <input type="text" placeholder="Filter registry..." className="bg-transparent border-none focus:ring-0 outline-none w-full text-xs font-bold uppercase tracking-widest placeholder:text-slate-200" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <AnimatePresence>
                            {categories.map((cat) => (
                                <motion.div 
                                    key={cat._id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/40 relative group overflow-hidden"
                                >
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="w-12 h-12 bg-clinical-blue text-white rounded-2xl flex items-center justify-center font-bold text-lg shadow-lg shadow-clinical-blue/10">
                                            {cat.name.charAt(0)}
                                        </div>
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => {setEditingId(cat._id); setName(cat.name); setDescription(cat.description); window.scrollTo({top: 0, behavior: 'smooth'})}}
                                                className="p-3 bg-slate-50 text-slate-400 hover:bg-clinical-blue hover:text-white rounded-xl transition-all border border-slate-100"
                                            >
                                                <Edit3 size={16} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(cat._id)}
                                                className="p-3 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all border border-red-50"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900 mb-3 uppercase tracking-tighter group-hover:text-clinical-blue transition-colors">
                                            {cat.name}
                                        </h3>
                                        <p className="text-sm text-slate-500 leading-relaxed font-medium line-clamp-3 min-h-[60px]">
                                            {cat.description || 'No system descriptor provided for this category module.'}
                                        </p>
                                    </div>

                                    <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                        <div className="flex items-center gap-2">
                                            <Package size={12} className="text-clinical-blue" />
                                            Module ID: {cat._id.slice(-6)}
                                        </div>
                                        <ChevronRight size={14} className="text-slate-200" />
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageCategories;
