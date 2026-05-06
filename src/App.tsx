/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import EmailList from './components/EmailList';
import EmailDetail from './components/EmailDetail';
import ComposeModal from './components/ComposeModal';
import { Email, Category } from './types';
import { categorizeEmail } from './services/aiService';
import { Sparkles, RefreshCcw } from 'lucide-react';

export default function App() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isComposeOpen, setIsComposeOpen] = useState(false);

  const fetchEmails = async () => {
    try {
      const res = await fetch('/api/emails');
      const data = await res.json();
      setEmails(data);
    } catch (err) {
      console.error('Failed to fetch emails', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmails();
  }, []);

  const handleLoadMock = async () => {
    setIsLoading(true);
    try {
      await fetch('/api/emails/mock', { method: 'POST' });
      await fetchEmails();
    } catch (err) {
      console.error('Failed to load mock data', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateEmail = async (id: string, updates: Partial<Email>) => {
    try {
      await fetch(`/api/emails/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      
      // Update local state
      setEmails(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
      if (selectedEmail?.id === id) {
        setSelectedEmail(prev => prev ? { ...prev, ...updates } : null);
      }
    } catch (err) {
      console.error('Update failed', err);
    }
  };

  const handleProcessEmail = async (email: Email) => {
    setIsProcessing(true);
    try {
      const results = await categorizeEmail({ subject: email.subject, body: email.body });
      
      await handleUpdateEmail(email.id, {
        category: results.category,
        sentiment: results.sentiment,
        summary: results.summary,
        tags: JSON.stringify(results.tags),
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCreateEmail = async (data: { subject: string; body: string; analyze: boolean }) => {
    try {
      const res = await fetch('/api/emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject: data.subject, body: data.body }),
      });
      const newEmail = await res.json();
      
      setEmails(prev => [newEmail, ...prev]);
      
      if (data.analyze) {
        handleProcessEmail(newEmail);
      }
    } catch (err) {
      console.error('Failed to create email', err);
    }
  };

  const filteredEmails = useMemo(() => {
    if (activeCategory === 'all') return emails;
    if (activeCategory === 'starred') return emails.filter(e => e.is_starred);
    return emails.filter(e => e.category === activeCategory);
  }, [emails, activeCategory]);

  const counts = useMemo(() => {
    const res: Record<string, number> = { all: emails.length, starred: emails.filter(e => e.is_starred).length };
    const categories: Category[] = ['Spam', 'Important', 'Promotions', 'Social', 'Updates'];
    categories.forEach(cat => {
      res[cat] = emails.filter(e => e.category === cat).length;
    });
    return res;
  }, [emails]);

  if (isLoading) {
    return (
      <div className="h-screen w-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 border-[6px] border-indigo-600 border-t-transparent rounded-full animate-spin shadow-lg shadow-indigo-600/20" />
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-slate-500 animate-pulse font-bold">Neural Engine Linking...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex bg-slate-950 text-slate-300 overflow-hidden font-sans">
      <Sidebar 
        activeCategory={activeCategory} 
        onCategoryChange={setActiveCategory}
        counts={counts}
      />

      <main className="flex-1 flex flex-col p-8 overflow-hidden gap-6">
        {/* Header Bar */}
        <header className="flex justify-between items-center shrink-0">
          <div className="flex items-center gap-4">
             <h2 className="text-white font-bold text-lg tracking-tight">Transmission Hub</h2>
             <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 text-[10px] rounded border border-indigo-500/20 uppercase tracking-widest font-bold">Secure</span>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsComposeOpen(true)}
              className="p-2 text-slate-400 hover:text-white transition-colors"
            >
              <div className="w-5 h-5 border border-current rounded-full flex items-center justify-center font-bold font-mono">+</div>
            </button>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 border border-slate-700 shadow-lg"></div>
          </div>
        </header>

        <ComposeModal 
          isOpen={isComposeOpen}
          onClose={() => setIsComposeOpen(false)}
          onSend={handleCreateEmail}
        />

        {emails.length === 0 ? (
          <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col items-center justify-center p-8 text-center shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            <Sparkles className="w-16 h-16 mb-6 text-indigo-500 animate-pulse" />
            <h3 className="text-2xl font-bold text-white italic mb-2 tracking-tight">SYSTEM STANDBY</h3>
            <p className="text-slate-400 mb-8 max-w-sm text-sm">Synchronize with external mail servers or initialize diagnostic transmissions.</p>
            <button 
              onClick={handleLoadMock}
              className="px-8 py-3 bg-indigo-600 text-white font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20 active:scale-95"
            >
              Initialize Diagnostic Link
            </button>
          </div>
        ) : (
          <div className="flex-1 flex gap-6 overflow-hidden">
            {/* Left: Email List (Bento Section) */}
            <div className="w-[450px] shrink-0 h-full">
              <EmailList 
                emails={filteredEmails}
                selectedId={selectedEmail?.id || null}
                onSelect={(e) => {
                  setSelectedEmail(e);
                  if (e.status === 'unread') handleUpdateEmail(e.id, { status: 'read' });
                }}
                onToggleStar={(id, starred) => handleUpdateEmail(id, { is_starred: starred })}
                onToggleRead={(id, read) => handleUpdateEmail(id, { status: read ? 'read' : 'unread' })}
              />
            </div>

            {/* Right: Email Detail (Bento Section) */}
            <div className="flex-1 h-full">
              <EmailDetail 
                email={selectedEmail}
                onBack={() => setSelectedEmail(null)}
                onProcess={handleProcessEmail}
                isProcessing={isProcessing}
              />
            </div>
          </div>
        )}

        {/* Global Footer Stats (Bento Visual) */}
        {!selectedEmail && emails.length > 0 && (
          <footer className="grid grid-cols-4 gap-4 h-24 shrink-0 mt-2">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Process Rate</span>
              <span className="text-lg font-bold text-white tracking-tight">12.4ms/mail</span>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Spam Blocked</span>
              <span className="text-lg font-bold text-red-400 tracking-tight">241/day</span>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">AI Models</span>
              <span className="text-lg font-bold text-indigo-400 tracking-tight">Gemini 3 Flash</span>
            </div>
            <div className="bg-indigo-600 rounded-xl p-3 flex items-center justify-between shadow-lg shadow-indigo-600/20">
              <div>
                <span className="text-[10px] text-indigo-200 uppercase font-bold tracking-widest">Efficiency</span>
                <p className="text-white font-bold leading-tight">+14% Growth</p>
              </div>
              <Sparkles className="w-5 h-5 text-white" />
            </div>
          </footer>
        )}
      </main>
    </div>
  );
}

