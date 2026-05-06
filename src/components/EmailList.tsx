import React, { useState } from 'react';
import { Star, MoreVertical, Archive, Trash2, MailOpen, Mail, Search } from 'lucide-react';
import { Email } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface EmailListProps {
  emails: Email[];
  selectedId: string | null;
  onSelect: (email: Email) => void;
  onToggleStar: (id: string, starred: boolean) => void;
  onToggleRead: (id: string, read: boolean) => void;
}

const EmailList: React.FC<EmailListProps> = ({ 
  emails, 
  selectedId, 
  onSelect, 
  onToggleStar, 
  onToggleRead 
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = emails.filter(e => 
    e.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.body.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-900 overflow-hidden border border-slate-800 rounded-2xl shadow-2xl">
      <div className="p-4 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search transmissions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 bg-slate-950 border border-slate-800 rounded-lg focus:outline-none focus:border-indigo-500 text-xs text-slate-300 transition-all"
          />
        </div>
        <div className="flex items-center justify-between">
          <h2 className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Incoming Stream ({filtered.length})</h2>
          <div className="flex gap-2">
            <button className="p-1 hover:bg-slate-800 rounded-md transition-colors text-slate-500 hover:text-slate-200"><Archive className="w-3.5 h-3.5" /></button>
            <button className="p-1 hover:bg-slate-800 rounded-md transition-colors text-slate-500 hover:text-slate-200"><Trash2 className="w-3.5 h-3.5" /></button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <AnimatePresence mode="popLayout">
          {filtered.map((email) => (
            <motion.div
              layout
              key={email.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onClick={() => onSelect(email)}
              className={`
                flex items-start gap-4 px-4 py-4 border-b border-slate-800/50 cursor-pointer transition-all duration-200 group
                ${selectedId === email.id ? 'bg-slate-800 shadow-inner' : 'hover:bg-slate-800/30'}
              `}
            >
              <div className="shrink-0 mt-1 flex flex-col items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${email.status === 'unread' ? 'bg-indigo-500' : 'bg-slate-800'}`} />
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleStar(email.id, !email.is_starred);
                  }}
                  className="transition-transform active:scale-125"
                >
                  <Star className={`w-3.5 h-3.5 ${email.is_starred ? 'fill-yellow-400 text-yellow-400' : 'text-slate-700 opacity-40 group-hover:opacity-100'}`} />
                </button>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <span className={`text-sm truncate max-w-[180px] ${email.status === 'unread' ? 'text-white font-semibold' : 'text-slate-400'}`}>
                    {email.sender}
                  </span>
                  <span className="text-[10px] text-slate-600 font-mono">
                    {new Date(email.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <h3 className={`text-sm truncate mb-0.5 ${selectedId === email.id ? 'text-white' : 'text-slate-200'}`}>
                  {email.subject}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-1 leading-normal">
                  {email.body}
                </p>
              </div>

              <div className="shrink-0 ml-2">
                <span className={`text-[9px] font-bold uppercase tracking-tighter px-1.5 py-0.5 rounded opacity-80 ${
                  email.category === 'Important' ? 'bg-red-500/10 text-red-400' :
                  email.category === 'Social' ? 'bg-green-500/10 text-green-400' :
                  email.category === 'Promotions' ? 'bg-blue-500/10 text-blue-400' :
                  'bg-slate-800 text-slate-400'
                }`}>
                  {email.category}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center opacity-30 p-8 text-center mt-20">
            <Archive className="w-12 h-12 mb-4 text-slate-600" />
            <p className="font-mono text-xs tracking-widest uppercase text-slate-600">Secure Vault Empty</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailList;
