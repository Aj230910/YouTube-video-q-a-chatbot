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
          className="fixed inset-0 bg-black/75 backdrop-blur-md z-45 md:hidden transition-all duration-300 animate-fade-in"
        />
      )}

      <aside className={`fixed inset-y-0 left-0 z-50 w-80 bg-[#0F0F0F] text-white flex flex-col border-r border-[#303030]/50 h-screen overflow-hidden transition-all duration-300 ease-in-out md:translate-x-0 md:static ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } shadow-2xl md:shadow-none`}>
        
        {/* Brand Logo */}
        <div className="p-6 border-b border-[#303030]/50 flex items-center gap-3">
          <div className="bg-[#FF0000] p-2.5 rounded-xl text-white shadow-lg shadow-red-500/20">
            <Video className="w-5.5 h-5.5" />
          </div>
          <div>
            <h1 className="font-extrabold text-sm leading-tight tracking-tight text-white flex items-center gap-1.5 font-sans">
              YT Assistant
            </h1>
            <p className="text-[9px] text-[#AAAAAA] font-extrabold tracking-wider uppercase">
              Semantic Q&A
            </p>
          </div>
        </div>

        {/* Action Area */}
        <div className="p-4">
          <button
            onClick={onNewVideo}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-[#FF0000] hover:bg-[#CC0000] active:scale-[0.98] font-bold text-white transition-all duration-200 shadow-lg shadow-red-500/10 cursor-pointer btn-premium"
          >
            <Plus className="w-4.5 h-4.5" />
            <span className="text-xs tracking-wide">Index New Video</span>
          </button>
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto px-4 py-2 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-2 mb-2">
            <History className="w-3.5 h-3.5" />
            <span>Search History ({history.length})</span>
          </div>

          {history.length === 0 ? (
            <div className="text-center py-8 px-4 border border-dashed border-[#303030] rounded-2xl bg-[#1A1A1A]/30">
              <p className="text-xs text-[#AAAAAA] font-medium">No videos indexed yet.</p>
              <p className="text-[10px] text-zinc-650 mt-1">Ingest a link to begin.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {history.map((video) => (
                <button
                  key={video.video_id}
                  onClick={() => onSelectVideo(video)}
                  className={`w-full text-left p-3 rounded-2xl transition-all duration-250 border flex gap-3 cursor-pointer group ${
                    activeVideoId === video.video_id
                      ? 'bg-[#1A1A1A] border-[#FF0000]/40 shadow-md text-white active-item-glow'
                      : 'border-transparent hover:bg-[#1A1A1A]/50 text-[#AAAAAA] hover:text-white hover:border-[#303030]'
                  }`}
                >
                  {/* Thumbnail */}
                  <div className="w-12 h-9 rounded-lg bg-[#212121] overflow-hidden flex-shrink-0 border border-[#303030] group-hover:border-red-500/30 transition-colors shadow-sm">
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
                    <h4 className="text-xs font-semibold truncate leading-normal">
                      {video.title}
                    </h4>
                    <p className="text-[9px] text-zinc-500 font-semibold truncate mt-0.5 group-hover:text-[#AAAAAA]">
                      by {video.author}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer Area */}
        <div className="p-4 border-t border-[#303030]/50 flex flex-col gap-4 bg-[#0A0A0A]">
          {/* Connection Status */}
          <div className="flex items-center justify-between px-2 text-xs">
            <div className="flex items-center gap-2 text-zinc-500">
              <Server className="w-3.5 h-3.5" />
              <span className="font-semibold">Backend:</span>
            </div>
            <button 
              onClick={checkStatus}
              className="flex items-center gap-1.5 font-bold transition-colors cursor-pointer"
            >
              {serverStatus === 'online' && (
                <span className="flex items-center gap-1 text-emerald-500 font-extrabold text-[10px]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Online</span>
                </span>
              )}
              {serverStatus === 'offline' && (
                <span className="flex items-center gap-1 text-red-500 font-extrabold text-[10px] animate-pulse">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Offline</span>
                </span>
              )}
              {serverStatus === 'checking' && (
                <span className="flex items-center gap-1 text-blue-400 font-semibold">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Checking</span>
                </span>
              )}
            </button>
          </div>

          {/* User Info / Controls */}
          <div className="flex items-center justify-between pt-3 border-t border-[#303030]/40">
            <div className="flex flex-col">
              <span className="text-[8px] text-zinc-650 font-extrabold uppercase tracking-widest">Made with ❤️ by</span>
              <span className="text-xs text-[#FF0000] font-bold tracking-wide">
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
