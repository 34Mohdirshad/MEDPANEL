import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Download, FileText, Calendar, Tag, Info } from 'lucide-react';
import { format } from 'date-fns';

const Modal = ({ file, onClose }) => {
    const isPDF = file.fileType === 'pdf';

    return (
        <AnimatePresence>
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            >
                <div 
                    className="absolute inset-0 bg-clinical-dark/80 backdrop-blur-xl" 
                    onClick={onClose}
                ></div>
                
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0, y: 40 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 40 }}
                    className="relative w-full max-w-6xl bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col md:flex-row h-[90vh] md:h-[80vh]"
                >
                    <button 
                        onClick={onClose}
                        className="absolute right-6 top-6 z-50 p-3 bg-white/20 backdrop-blur hover:bg-white text-white hover:text-clinical-dark rounded-full transition-all shadow-lg"
                    >
                        <X size={24} />
                    </button>

                    {/* Preview Section */}
                    <div className="flex-grow bg-slate-900 overflow-hidden relative group">
                        {isPDF ? (
                            <div className="w-full h-full flex flex-col items-center justify-center gap-8 bg-clinical-dark/60">
                                <FileText size={160} className="text-white/20 animate-pulse" />
                                <div className="text-center">
                                    <h4 className="text-2xl font-bold text-white mb-4">PDF Medical Report</h4>
                                    <a 
                                        href={file.fileURL} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="px-8 py-3 bg-clinical-blue text-white rounded-2xl font-bold flex items-center gap-3 hover:bg-clinical-cyan transition-all shadow-xl shadow-clinical-blue/20"
                                    >
                                        <ExternalLink size={20} />
                                        Open Full PDF
                                    </a>
                                </div>
                            </div>
                        ) : (
                            <img 
                                src={file.fileURL} 
                                alt={file.title} 
                                className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-1000" 
                            />
                        )}
                    </div>

                    {/* Info Section */}
                    <div className="w-full md:w-[400px] flex-shrink-0 bg-white p-10 overflow-y-auto">
                        <div className="flex items-center gap-2 text-xs font-bold text-clinical-blue uppercase tracking-widest mb-4">
                            <Tag size={14} />
                            {file.category?.name || 'Uncategorized'}
                        </div>
                        <h2 className="text-3xl font-extrabold text-clinical-dark leading-tight mb-6 font-outfit uppercase">
                            {file.title}
                        </h2>
                        
                        <div className="space-y-6">
                            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                <h4 className="flex items-center gap-2 text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">
                                    <Info size={16} />
                                    Clinical Description
                                </h4>
                                <p className="text-slate-600 leading-relaxed font-medium">
                                    {file.description || 'No detailed clinical notes available for this record.'}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-clinical-light/30 rounded-2xl border border-clinical-teal/10">
                                    <h4 className="text-[10px] font-bold text-clinical-blue/60 uppercase tracking-widest mb-1">Upload Date</h4>
                                    <p className="text-clinical-dark font-bold text-sm">
                                        {format(new Date(file.uploadDate), 'MMM dd, yyyy')}
                                    </p>
                                </div>
                                <div className="p-4 bg-clinical-light/30 rounded-2xl border border-clinical-teal/10">
                                    <h4 className="text-[10px] font-bold text-clinical-blue/60 uppercase tracking-widest mb-1">File Size</h4>
                                    <p className="text-clinical-dark font-bold text-sm">
                                        {(file.fileSize / 1024 / 1024).toFixed(2)} MB
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 space-y-3">
                            <a 
                                href={file.fileURL} 
                                download 
                                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-clinical-dark transition-all"
                            >
                                <Download size={20} />
                                Download Record
                            </a>
                            <p className="text-center text-xs text-slate-400 font-medium tracking-tight">
                                Medical data is protected and secured using 256-bit encryption standards.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default Modal;
