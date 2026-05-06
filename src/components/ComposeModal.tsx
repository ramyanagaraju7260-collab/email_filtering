import React, { useState } from 'react';
import { X, Sparkles, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ComposeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (email: { subject: string; body: string; analyze: boolean }) => void;
}

const ComposeModal: React.FC<ComposeModalProps> = ({ isOpen, onClose, onSend }) => {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [analyze, setAnalyze] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden"
      >
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950/50">
          <h3 className="text-white font-bold tracking-tight italic">Initiate New Link</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full text-slate-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-8 space-y-6">
          <div>
            <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2 block">Subject Line</label>
            <input 
              type="text" 
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g., Immediate Action Required"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 text-white transition-all"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2 block">Transmission Body</label>
            <textarea 
              rows={8}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Paste email content here for analysis..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 text-white transition-all resize-none font-sans"
            />
          </div>

          <div className="flex items-center justify-between pt-4">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={analyze}
                onChange={(e) => setAnalyze(e.target.checked)}
                className="w-5 h-5 rounded border-slate-800 bg-slate-950 text-indigo-600 focus:ring-indigo-600"
              />
              <span className="text-xs font-bold text-slate-400 group-hover:text-amber-400 transition-colors flex items-center gap-2 italic">
                <Sparkles className="w-4 h-4" /> Instant Neural Spam Filter
              </span>
            </label>
            
            <button 
              onClick={() => {
                onSend({ subject, body, analyze });
                setSubject('');
                setBody('');
                onClose();
              }}
              className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20 font-bold text-xs uppercase tracking-widest"
            >
              <Send className="w-4 h-4" /> Broadcast
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ComposeModal;
