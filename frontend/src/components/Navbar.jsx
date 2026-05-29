import React from 'react';
import { User, Clock, ArrowLeft, Menu } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function Navbar({ activeVideo, onBack, onMenuClick }) {
  if (!activeVideo) return null;

  const formatDuration = (seconds) => {
    if (!seconds) return '0:00';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <header className="h-20 flex-shrink-0 bg-[#0F0F0F]/80 backdrop-blur-md border-b border-[#303030]/50 px-4 md:px-6 flex items-center justify-between gap-4 shadow-md relative z-20 transition-all duration-300">
      
      {/* Active Video Info */}
      <div className="flex items-center gap-2 md:gap-4 min-w-0 flex-1">
        {/* Menu button for mobile drawer */}
        <button
          onClick={onMenuClick}
          className="md:hidden p-2.5 rounded-xl bg-[#1A1A1A] hover:bg-[#212121] border border-[#303030] text-[#AAAAAA] hover:text-white transition-all cursor-pointer btn-premium"
          title="Open Sidebar"
        >
          <Menu className="w-4.5 h-4.5" />
        </button>

        <button
          onClick={onBack}
          className="p-2.5 rounded-xl bg-[#1A1A1A] hover:bg-[#212121] border border-[#303030] text-[#AAAAAA] hover:text-white transition-all cursor-pointer flex-shrink-0 btn-premium"
          title="Back to Landing Page"
        >
          <ArrowLeft className="w-4.5 h-4.5" />
        </button>

        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="w-12 h-9 md:w-14 md:h-10 rounded-xl overflow-hidden bg-[#212121] border border-[#303030] flex-shrink-0 shadow-sm">
            <img
              src={activeVideo.thumbnail_url}
              alt={activeVideo.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = `https://img.youtube.com/vi/${activeVideo.video_id}/hqdefault.jpg`;
              }}
            />
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="text-xs md:text-sm font-extrabold text-white truncate leading-snug font-sans">
              {activeVideo.title}
            </h2>
            <div className="flex items-center gap-2 md:gap-3 text-[10px] md:text-xs text-[#AAAAAA] font-semibold mt-0.5">
              <span className="flex items-center gap-1 min-w-0">
                <User className="w-3 h-3 text-zinc-500 flex-shrink-0" />
                <span className="truncate max-w-[80px] sm:max-w-[120px] md:max-w-xs">{activeVideo.author}</span>
              </span>
              <span className="w-1 h-1 bg-[#303030] rounded-full flex-shrink-0" />
              <span className="flex items-center gap-1 flex-shrink-0">
                <Clock className="w-3 h-3 text-zinc-500" />
                <span>{formatDuration(activeVideo.duration)}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action / Controls */}
      <div className="flex items-center gap-3">
        <span className="hidden sm:inline-flex items-center px-3 py-1 rounded-full bg-red-950/20 border border-red-900/30 text-[#FF0000] text-[10px] font-bold uppercase tracking-wider">
          Indexed
        </span>
        <ThemeToggle />
      </div>
    </header>
  );
}
