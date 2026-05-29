import { User, Clock, ArrowLeft, Menu, Video } from 'lucide-react';

const GithubIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);
import ThemeToggle from './ThemeToggle';

export default function Navbar({ activeVideo, onBack, onMenuClick }) {
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
    <header className="h-16 flex-shrink-0 glass-panel border-b border-[var(--border-subtle)] px-4 md:px-6 flex items-center justify-between gap-4 shadow-sm relative z-20 transition-all duration-300">
      
      {/* Brand Logo or Video Details */}
      <div className="flex items-center gap-2.5 md:gap-3.5 min-w-0 flex-1">
        {/* Mobile menu trigger */}
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 rounded-xl hover:bg-[var(--bg-hover)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all cursor-pointer"
          title="Open Sidebar"
        >
          <Menu className="w-4 h-4" />
        </button>

        {activeVideo ? (
          <>
            <button
              onClick={onBack}
              className="p-2 rounded-xl hover:bg-[var(--bg-hover)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all cursor-pointer flex-shrink-0"
              title="Back to Landing Page"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <div className="w-10 h-7.5 rounded-lg overflow-hidden bg-[var(--bg-hover)] border border-[var(--border-subtle)] flex-shrink-0 shadow-sm">
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
                <h2 className="text-xs md:text-sm font-bold text-[var(--text-primary)] truncate leading-snug">
                  {activeVideo.title}
                </h2>
                <div className="flex items-center gap-2 text-[10px] md:text-xs text-[var(--text-secondary)] font-medium mt-0.5">
                  <span className="truncate max-w-[80px] sm:max-w-[120px] md:max-w-xs">{activeVideo.author}</span>
                  <span className="w-1 h-1 bg-[var(--border-color)] rounded-full flex-shrink-0" />
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[var(--text-muted)]" />
                    <span>{formatDuration(activeVideo.duration)}</span>
                  </span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2.5">
            <div className="bg-[var(--primary)] p-2 rounded-xl text-white shadow-md shadow-[var(--accent-glow)] flex items-center justify-center">
              <Video className="w-4.5 h-4.5" />
            </div>
            <div>
              <h1 className="font-extrabold text-xs md:text-sm leading-tight tracking-tight text-[var(--text-primary)] flex items-center gap-1.5">
                YouTube Q&A AI
              </h1>
              <p className="text-[9px] text-[var(--text-secondary)] font-extrabold tracking-wider uppercase">
                Apple HIG Design
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Right controls: Status/GitHub/Theme */}
      <div className="flex items-center gap-2.5">
        {activeVideo && (
          <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full bg-[var(--accent-glow)] border border-[var(--primary)]/20 text-[var(--primary)] text-[10px] font-bold uppercase tracking-wider">
            Indexed
          </span>
        )}
        <a
          href="https://github.com/Aj230910/YouTube-video-q-a-chatbot"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-xl hover:bg-[var(--bg-hover)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all flex items-center justify-center"
          title="View GitHub Repository"
        >
          <GithubIcon className="w-4 h-4" />
        </a>
        <ThemeToggle />
      </div>
    </header>
  );
}
