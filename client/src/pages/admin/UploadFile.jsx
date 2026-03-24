import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    CloudUpload, 
    FileText, 
    ImageIcon, 
    FolderTree, 
    CheckCircle, 
    Info, 
    Loader2, 
    X, 
    AlertCircle,
    Shield
} from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const UploadFile = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => { fetchCategories(); }, []);

    const fetchCategories = async () => {
        try {
            const res = await api.get('/categories');
            setCategories(res.data);
            if (res.data.length > 0) setCategoryId(res.data[0]._id);
        } catch (e) { toast.error('Failed to load system categories'); }
    };

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (selected) {
            if (selected.size > 10 * 1024 * 1024) return toast.error('File exceeds 10MB limit');
            setFile(selected);
            if (selected.type.includes('image')) {
                setPreview(URL.createObjectURL(selected));
            } else {
                setPreview(null);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) return toast.error('Medical file required');
        
        setLoading(true);
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('categoryId', categoryId);
        formData.append('file', file);

        try {
            await api.post('/files/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            toast.success('Clinical record uploaded to registry');
            navigate('/admin/files');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Repository upload failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-12">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-extrabold font-outfit text-clinical-dark flex items-center gap-3 tracking-tighter uppercase">
                        Registry <span className="text-clinical-blue underline decoration-clinical-teal/30">Ingestion</span>
                    </h1>
                    <p className="text-slate-500 mt-2 font-medium">Upload new results and clinical reports into the central repository.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Meta Data */}
                <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-2xl shadow-slate-200/50 space-y-10">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="w-12 h-12 bg-clinical-light rounded-2xl flex items-center justify-center text-clinical-blue">
                            <Info size={24} />
                        </div>
                        <h2 className="text-xl font-black text-clinical-dark uppercase tracking-tight">Report Meta Data</h2>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-2">Record Nomenclature</label>
                        <input 
                            type="text"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Brain MRI - T2 Weighted Scan"
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-5 px-6 text-sm font-bold text-slate-900 focus:ring-4 focus:ring-clinical-blue/10 focus:border-clinical-blue outline-none transition-all truncate placeholder:text-slate-300"
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-2">Clinical Classification</label>
                        <div className="relative group">
                            <FolderTree size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-clinical-blue transition-colors" />
                            <select 
                                required
                                value={categoryId}
                                onChange={(e) => setCategoryId(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-5 pl-16 pr-6 text-sm font-bold text-slate-900 focus:ring-4 focus:ring-clinical-blue/10 focus:border-clinical-blue outline-none transition-all appearance-none cursor-pointer uppercase tracking-tighter"
                            >
                                {categories.map(cat => (
                                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-2">Diagnosis / Physician Notes</label>
                        <textarea 
                            rows="5"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Detailed radiological findings or clinical interpretation..."
                            className="w-full bg-slate-50 border border-slate-100 rounded-[32px] py-6 px-8 text-sm font-medium text-slate-600 focus:ring-4 focus:ring-clinical-blue/10 focus:border-clinical-blue outline-none transition-all resize-none"
                        />
                    </div>
                </div>

                {/* File Upload */}
                <div className="bg-white p-10 rounded-[40px] border-2 border-dashed border-slate-100 shadow-xl shadow-slate-200/20 flex flex-col items-center justify-center text-center space-y-10 group hover:border-clinical-blue transition-all">
                    {!file ? (
                        <>
                            <div className="w-40 h-40 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 relative group-hover:bg-clinical-light group-hover:text-clinical-blue transition-all group-hover:scale-110">
                                <CloudUpload size={80} className="animate-bounce" />
                                <div className="absolute inset-0 border-4 border-dashed border-slate-100 rounded-full animate-[spin_10s_linear_infinite]"></div>
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-3 uppercase tracking-tight">Ingest Digital Media</h3>
                                <p className="text-sm text-slate-400 font-medium">JPEG, PNG, or PDF formats supported.<br />Maximum module size: 10MB.</p>
                            </div>
                            <label className="px-10 py-5 bg-clinical-blue text-white rounded-3xl text-sm font-black tracking-widest uppercase hover:bg-clinical-dark cursor-pointer transition-all shadow-2xl shadow-clinical-blue/20">
                                Select File Pipeline
                                <input type="file" className="hidden" onChange={handleFileChange} accept=".jpg,.png,.pdf" />
                            </label>
                        </>
                    ) : (
                        <div className="w-full space-y-10">
                            <div className="relative">
                                <div className="p-1.5 bg-clinical-light rounded-[32px] border border-clinical-teal/20">
                                    {preview ? (
                                        <img src={preview} className="w-full h-80 object-cover rounded-[28px] shadow-lg" alt="Preview" />
                                    ) : (
                                        <div className="w-full h-80 bg-slate-100 flex flex-col items-center justify-center gap-6 rounded-[28px]">
                                            <FileText size={100} className="text-clinical-blue" />
                                            <span className="text-lg font-bold text-clinical-blue uppercase tracking-widest bg-white px-6 py-2 rounded-2xl shadow-sm border border-slate-100">Electronic PDF Module</span>
                                        </div>
                                    )}
                                </div>
                                <button onClick={() => {setFile(null); setPreview(null);}} className="absolute -top-3 -right-3 p-3 bg-red-600 text-white rounded-full shadow-xl hover:scale-110 transition-transform">
                                    <X size={20} />
                                </button>
                            </div>
                            
                            <div className="flex items-center gap-4 bg-slate-50 p-6 rounded-3xl border border-slate-100">
                                <CheckCircle size={28} className="text-green-500 flex-shrink-0" />
                                <div className="text-left">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Staged for Registry</p>
                                    <p className="text-sm font-black text-slate-900 truncate uppercase">{file.name}</p>
                                </div>
                            </div>

                            <button 
                                type="submit"
                                disabled={loading}
                                className="w-full py-6 bg-clinical-blue text-white rounded-[32px] text-lg font-black tracking-widest uppercase hover:bg-clinical-dark transition-all disabled:opacity-50 flex items-center justify-center gap-3 shadow-2xl shadow-clinical-blue/40 active:scale-95"
                            >
                                {loading ? <Loader2 className="animate-spin" size={24} /> : 'Execute Data Ingestion'}
                            </button>
                        </div>
                    )}
                </div>
            </form>

            <div className="flex items-center justify-center gap-8 text-[10px] font-bold text-slate-300 uppercase tracking-[0.3em]">
                <div className="flex items-center gap-2">
                    <Shield size={16} />
                    Secure Ingestion Module V2.4
                </div>
                <div className="flex items-center gap-2">
                    <AlertCircle size={16} />
                    Validated Clinical Endpoint
                </div>
            </div>
        </div>
    );
};

export default UploadFile;
