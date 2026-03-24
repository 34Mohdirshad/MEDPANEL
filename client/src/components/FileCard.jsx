import { motion } from 'framer-motion';
import { FileText, ImageIcon, Eye, Calendar, Tag } from 'lucide-react';
import { format } from 'date-fns';

const FileCard = ({ file, onPreview }) => {
    const isPDF = file.fileType === 'pdf';

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            layout
            className="group block relative bg-white border border-slate-100 rounded-3xl shadow-xl shadow-slate-200/40 hover:shadow-clinical-blue/10 hover:-translate-y-2 transition-all p-4"
        >
            <div className="relative h-48 w-full bg-slate-50 rounded-2xl overflow-hidden mb-6 flex items-center justify-center">
                {isPDF ? (
                    <div className="flex flex-col items-center gap-2">
                        <FileText size={64} className="text-clinical-blue group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-bold text-clinical-blue uppercase tracking-widest px-3 py-1 bg-clinical-light rounded-full">PDF Report</span>
                    </div>
                ) : (
                    <img src={file.fileURL} alt={file.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                )}
                
                <div onClick={onPreview} className="absolute inset-0 bg-clinical-blue/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer">
                    <div className="bg-white p-4 rounded-2xl text-clinical-blue flex items-center gap-2 font-bold transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <Eye size={20} />
                        Quick View
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-clinical-blue/60 uppercase tracking-widest">
                    <Tag size={12} />
                    {file.category?.name || 'Uncategorized'}
                </div>
                <div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-clinical-blue transition-colors line-clamp-1 truncate uppercase font-outfit">{file.title}</h3>
                    <p className="text-sm text-slate-500 line-clamp-2 mt-1 min-h-[40px] leading-relaxed">
                        {file.description || 'No description provided.'}
                    </p>
                </div>
                
                <div className="pt-4 border-t border-slate-50 flex items-center justify-between text-xs text-slate-400 font-medium">
                    <div className="flex items-center gap-1.5">
                        <Calendar size={12} />
                        {format(new Date(file.uploadDate), 'MMM dd, yyyy')}
                    </div>
                    <div className="text-slate-300 uppercase">
                        {(file.fileSize / 1024 / 1024).toFixed(2)} MB
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default FileCard;
