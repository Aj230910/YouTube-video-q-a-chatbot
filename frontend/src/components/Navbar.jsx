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
    <header className="h-20 flex-shrink-0 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/40 px-4 md:px-6 flex items-center justify-between gap-4 shadow-sm relative z-20 transition-all duration-300">
      
      {/* Active Video Info */}
      <div className="flex items-center gap-2 md:gap-4 min-w-0 flex-1">
        {/* Menu button for mobile drawer */}
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 rounded-xl bg-slate-100/80 hover:bg-slate-200 dark:bg-slate-900/80 dark:hover:bg-slate-850 border border-slate-200/40 dark:border-slate-800/40 text-slate-650 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer"
          title="Open Sidebar"
        >
          <Menu className="w-4.5 h-4.5" />
        </button>

        <button
          onClick={onBack}
          className="p-2 rounded-xl bg-slate-100/80 hover:bg-slate-200 dark:bg-slate-900/80 dark:hover:bg-slate-850 border border-slate-200/40 dark:border-slate-800/40 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer flex-shrink-0"
          title="Back to Landing Page"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="w-12 h-9 md:w-14 md:h-10 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200/40 dark:border-slate-800/40 flex-shrink-0 shadow-sm">
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
            <h2 className="text-xs md:text-sm font-extrabold text-slate-800 dark:text-slate-100 truncate leading-snug">
              {activeVideo.title}
            </h2>
            <div className="flex items-center gap-2 md:gap-3 text-[10px] md:text-xs text-slate-500 dark:text-slate-400 font-semibold mt-0.5">
              <span className="flex items-center gap-1 min-w-0">
                <User className="w-3 h-3 text-slate-450 dark:text-slate-500 flex-shrink-0" />
                <span className="truncate max-w-[80px] sm:max-w-[120px] md:max-w-xs">{activeVideo.author}</span>
              </span>
              <span className="w-1 h-1 bg-slate-300 dark:bg-slate-700 rounded-full flex-shrink-0" />
              <span className="flex items-center gap-1 flex-shrink-0">
                <Clock className="w-3 h-3 text-slate-450 dark:text-slate-500" />
                <span>{formatDuration(activeVideo.duration)}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action / Controls */}
      <div className="flex items-center gap-3">
        <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/40 border border-emerald-200/50 dark:border-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
          Indexed
        </span>
        <ThemeToggle />
      </div>
    </header>
  );
}

