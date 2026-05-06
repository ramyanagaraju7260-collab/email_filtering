import React from 'react';
import { 
  ArrowLeft, 
  Trash2, 
  Archive, 
  Reply, 
  Forward, 
  MoreVertical, 
  Sparkles,
  Search,
  CheckCircle2,
  AlertTriangle,
  Info
} from 'lucide-react';
import { Email } from '../types';
import { motion } from 'motion/react';

interface EmailDetailProps {
  email: Email | null;
  onBack: () => void;
  onProcess: (email: Email) => void;
  isProcessing: boolean;
}

const EmailDetail: React.FC<EmailDetailProps> = ({ email, onBack, onProcess, isProcessing }) => {
  if (!email) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-950 opacity-40">
        <div className="text-center group p-12">
          <div className="w-16 h-16 border border-slate-800 mx-auto mb-4 flex items-center justify-center rotate-3 group-hover:rotate-0 transition-transform bg-slate-900 rounded-2xl">
            <Search className="w-8 h-8 text-slate-500" />
          </div>
          <p className="font-mono text-xs tracking-widest uppercase text-slate-500">Select a transmission to decrypt</p>
        </div>
      </div>
    );
  }

  const tags = JSON.parse(email.tags || '[]');

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 border border-slate-800 rounded-2xl ml-6 shadow-2xl relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/5 blur-[120px] pointer-events-none" />

      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50 backdrop-blur-md z-10">
        <div className="flex gap-4">
          <button onClick={onBack} className="p-2 hover:bg-slate-900 rounded-full lg:hidden">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex gap-1">
            <button className="p-2 hover:bg-slate-900 rounded-lg text-slate-400 hover:text-white transition-colors"><Archive className="w-4 h-4" /></button>
            <button className="p-2 hover:bg-slate-900 rounded-lg text-slate-400 hover:text-white transition-colors"><Trash2 className="w-4 h-4" /></button>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            disabled={isProcessing}
            onClick={() => onProcess(email)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-500 disabled:opacity-50 transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
          >
            {isProcessing ? (
              <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5 text-white" />
            )}
            {email.summary ? 'RE-SCAN CONTENT' : 'NEURAL ANALYSIS'}
          </button>
          <button className="p-2 hover:bg-slate-800 rounded-lg text-slate-400"><MoreVertical className="w-4 h-4" /></button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 max-w-4xl mx-auto w-full z-10">
        {/* Subject */}
        <h1 className="text-4xl font-sans font-bold tracking-tight mb-8 leading-tight text-white italic">
          {email.subject}
        </h1>

        {/* Sender Info */}
        <div className="flex items-center gap-4 mb-10 pb-8 border-b border-slate-800">
          <div className="w-10 h-10 bg-gradient-to-tr from-indigo-500 to-purple-500 text-white flex items-center justify-center rounded-xl font-bold text-lg shadow-lg">
            {email.sender[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm text-white">{email.sender}</p>
            <p className="text-xs text-slate-500">Routing: {email.to_address}</p>
          </div>
          <p className="font-mono text-[10px] text-slate-600 uppercase tracking-widest">{new Date(email.date).toLocaleString()}</p>
        </div>

        {/* AI INSIGHTS PANEL - BENTO STYLE */}
        {email.summary && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10"
          >
            <div className="md:col-span-2 bg-slate-900 border border-slate-800 p-5 rounded-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                 <Sparkles className="w-12 h-12 text-indigo-400" />
               </div>
               <h4 className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-3">AI Intelligence Summary</h4>
               <p className="text-sm font-medium leading-relaxed text-slate-200">"{email.summary}"</p>
            </div>
            
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between">
              <div>
                <h4 className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-3">Emotional Pulse</h4>
                <div className="flex items-center gap-2">
                  {email.sentiment === 'positive' && <div className="w-3 h-3 rounded-full bg-green-500 shadow-sm shadow-green-500/50" />}
                  {email.sentiment === 'negative' && <div className="w-3 h-3 rounded-full bg-red-500 shadow-sm shadow-red-500/50" />}
                  {email.sentiment === 'neutral' && <div className="w-3 h-3 rounded-full bg-blue-500 shadow-sm shadow-blue-500/50" />}
                  <span className="text-xs font-bold capitalize text-white">{email.sentiment}</span>
                </div>
              </div>
              <div className="mt-4">
                <h4 className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-3">Classification</h4>
                <span className="text-[10px] px-2 py-0.5 bg-indigo-500/10 text-indigo-400 rounded-md border border-indigo-500/20 font-bold uppercase tracking-widest">
                  {email.category}
                </span>
              </div>
            </div>

            <div className="md:col-span-3 bg-slate-950 border border-slate-800 p-4 rounded-2xl">
              <h4 className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-3">Extracted Metadata</h4>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag: string) => (
                  <span key={tag} className="text-[10px] uppercase font-bold text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1 rounded-lg">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Body */}
        <div className="text-slate-300 leading-relaxed font-sans text-base whitespace-pre-wrap selection:bg-indigo-500/30">
          {email.body}
        </div>

        {/* Footer Actions */}
        <div className="mt-16 flex gap-3 border-t border-slate-800 pt-8 pb-12">
          <button className="flex items-center gap-2 px-8 py-3 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 text-white transition-all text-xs font-bold uppercase tracking-widest">
            <Reply className="w-4 h-4 text-indigo-400" /> Reply
          </button>
          <button className="flex items-center gap-2 px-8 py-3 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 text-white transition-all text-xs font-bold uppercase tracking-widest">
            <Forward className="w-4 h-4 text-purple-400" /> Forward
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailDetail;
