import React, { useEffect, useState } from 'react';
import { Video, History, Plus, Server, CheckCircle2, AlertCircle, RefreshCw, Sparkles } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { apiService } from '../services/api';

export default function Sidebar({ history, activeVideoId, onSelectVideo, onNewVideo, isOpen, onClose }) {
  const [serverStatus, setServerStatus] = useState('checking'); // 'online' | 'offline' | 'checking'

  const checkStatus = async () => {
    setServerStatus('checking');
    try {
      await apiService.checkHealth();
      setServerStatus('online');
    } catch (err) {
      setServerStatus('offline');
    }
  };

  useEffect(() => {
    checkStatus();
    // Check backend status every 20 seconds
    const interval = setInterval(checkStatus, 20000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Mobile Sidebar Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-45 md:hidden transition-all duration-300 animate-fade-in"
        />
      )}

      <aside className={`fixed inset-y-0 left-0 z-50 w-80 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col border-r border-slate-200 dark:border-slate-900 h-screen overflow-hidden transition-all duration-300 ease-in-out md:translate-x-0 md:static ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } shadow-2xl md:shadow-none`}>
        
        {/* Brand Logo */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-900/60 flex items-center gap-3">
          <div className="bg-zinc-900 dark:bg-zinc-100 p-2 rounded-xl text-white dark:text-zinc-900 shadow-sm">
            <Video className="w-5.5 h-5.5" />
          </div>
          <div>
            <h1 className="font-extrabold text-base leading-tight tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
              YT Assistant
            </h1>
            <p className="text-[9px] text-slate-400 dark:text-slate-500 font-extrabold tracking-wider uppercase">
              Semantic Q&A
            </p>
          </div>
        </div>

        {/* Action Area */}
        <div className="p-4">
          <button
            onClick={onNewVideo}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-750 font-bold text-white transition-all duration-200 shadow-sm active:scale-[0.98] cursor-pointer"
          >
            <Plus className="w-4.5 h-4.5" />
            <span className="text-sm">Index New Video</span>
          </button>
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto px-4 py-2 flex flex-col gap-1.5">
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-widest px-2 mb-2">
            <History className="w-3.5 h-3.5" />
            <span>Search History ({history.length})</span>
          </div>

          {history.length === 0 ? (
            <div className="text-center py-8 px-4 border border-dashed border-slate-205 dark:border-slate-805 rounded-2xl bg-slate-50/50 dark:bg-slate-900/20">
              <p className="text-xs text-slate-450 dark:text-slate-550 font-semibold">No videos indexed yet.</p>
              <p className="text-[10px] text-slate-400 dark:text-slate-600 mt-1">Ingest a link to begin.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-1.5">
              {history.map((video) => (
                <button
                  key={video.video_id}
                  onClick={() => onSelectVideo(video)}
                  className={`w-full text-left p-2.5 rounded-xl transition-all duration-200 border flex gap-3 cursor-pointer group ${
                    activeVideoId === video.video_id
                      ? 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm text-slate-900 dark:text-white'
                      : 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-900/50 text-slate-550 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-250'
                  }`}
                >
                  {/* Thumbnail */}
                  <div className="w-12 h-9 rounded-lg bg-slate-100 dark:bg-slate-900 overflow-hidden flex-shrink-0 border border-slate-200 dark:border-slate-800/80 group-hover:border-slate-350 dark:group-hover:border-slate-700 transition-colors shadow-sm">
                    <img
                      src={video.thumbnail_url}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = `https://img.youtube.com/vi/${video.video_id}/hqdefault.jpg`;
                      }}
                    />
                  </div>
                  
                  {/* Metadata */}
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <h4 className="text-xs font-bold truncate leading-normal">
                      {video.title}
                    </h4>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold truncate mt-0.5 group-hover:text-slate-500 dark:group-hover:text-slate-400">
                      by {video.author}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer Area */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-900/60 flex flex-col gap-3 bg-slate-50/50 dark:bg-slate-950">
          {/* Connection Status */}
          <div className="flex items-center justify-between px-2 text-xs">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-450">
              <Server className="w-3.5 h-3.5" />
              <span className="font-semibold">Backend:</span>
            </div>
            <button 
              onClick={checkStatus}
              className="flex items-center gap-1.5 font-bold transition-colors cursor-pointer"
            >
              {serverStatus === 'online' && (
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-450 font-extrabold text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Online</span>
                </span>
              )}
              {serverStatus === 'offline' && (
                <span className="flex items-center gap-1 text-rose-500 dark:text-rose-400 font-extrabold text-[11px] animate-pulse">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Offline</span>
                </span>
              )}
              {serverStatus === 'checking' && (
                <span className="flex items-center gap-1 text-blue-500 dark:text-blue-400 font-semibold">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Checking</span>
                </span>
              )}
            </button>
          </div>

          {/* User Info / Controls */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-900/40">
            <div className="flex flex-col">
              <span className="text-[9px] text-slate-455 dark:text-slate-500 font-extrabold uppercase tracking-widest">Made with ❤️ by</span>
              <span className="text-xs text-blue-600 dark:text-blue-400 font-bold">
                AMBRISH JEYAN T
              </span>
            </div>
            <div className="md:hidden">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

