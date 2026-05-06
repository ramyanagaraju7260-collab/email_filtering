import React from 'react';
import { 
  Inbox, 
  Star, 
  Send, 
  AlertCircle, 
  Tag, 
  Settings, 
  Trash2, 
  ShieldAlert, 
  Users, 
  Megaphone,
  Clock
} from 'lucide-react';
import { Category } from '../types';

interface SidebarProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  counts: Record<string, number>;
}

const Sidebar: React.FC<SidebarProps> = ({ activeCategory, onCategoryChange, counts }) => {
  const categories = [
    { id: 'all', name: 'Inbox', icon: Inbox, color: 'text-slate-400' },
    { id: 'Important', name: 'Important', icon: AlertCircle, color: 'text-amber-500' },
    { id: 'Promotions', name: 'Promotions', icon: Megaphone, color: 'text-blue-500' },
    { id: 'Social', name: 'Social', icon: Users, color: 'text-green-500' },
    { id: 'Updates', name: 'Updates', icon: Clock, color: 'text-indigo-500' },
    { id: 'Spam', name: 'Spam', icon: ShieldAlert, color: 'text-red-500' },
    { id: 'starred', name: 'Starred', icon: Star, color: 'text-yellow-400' },
  ];

  return (
    <div className="w-64 h-full bg-slate-950 border-r border-slate-800 p-6 flex flex-col">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
          <div className="w-3 h-3 border-2 border-white rounded-sm" />
        </div>
        <h1 className="text-white font-bold text-xl tracking-tight uppercase italic">EmailWise AI</h1>
      </div>

      <nav className="space-y-1">
        <p className="font-mono text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-4">Channels</p>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onCategoryChange(cat.id)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 group ${
              activeCategory === cat.id 
                ? 'bg-slate-800 text-white shadow-sm' 
                : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
            }`}
          >
            <cat.icon className={`w-4 h-4 ${activeCategory === cat.id ? 'text-indigo-400' : 'text-inherit opacity-60'}`} />
            <span className="text-sm font-medium">{cat.name}</span>
            {counts[cat.id] > 0 && (
              <span className={`ml-auto text-[10px] px-1.5 py-0.5 rounded ${
                activeCategory === cat.id ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-900 text-slate-500'
              }`}>
                {counts[cat.id]}
              </span>
            )}
          </button>
        ))}
      </nav>

      <div className="mt-auto">
        <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
          <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-2">Neural Engine</div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-slate-400">Accuracy</span>
            <span className="text-xs text-indigo-400">99.8%</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-indigo-500 h-full w-[99.8%]"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
