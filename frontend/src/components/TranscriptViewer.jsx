import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Search, Download, Clock, Play } from 'lucide-react';

export default function TranscriptViewer({ transcript, onTimestampClick, videoTitle, activeTimestamp }) {
  const [searchQuery, setSearchQuery] = useState('');
  const activeItemRef = useRef(null);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const activeIndex = useMemo(() => {
    if (activeTimestamp === undefined || activeTimestamp === null) return -1;
    for (let i = 0; i < transcript.length; i++) {
      const currentStart = transcript[i].start;
      const nextStart = transcript[i + 1] ? transcript[i + 1].start : Infinity;
      if (activeTimestamp >= currentStart && activeTimestamp < nextStart) {
        return i;
      }
    }
    return -1;
  }, [transcript, activeTimestamp]);

  useEffect(() => {
    if (activeIndex !== -1) {
      activeItemRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [activeIndex]);

  const filteredTranscript = useMemo(() => {
    if (!searchQuery.trim()) return transcript;
    return transcript.filter((item) =>
      item.text.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [transcript, searchQuery]);

  const handleDownload = () => {
    const textContent = transcript
      .map((item) => `[${formatTime(item.start)}] ${item.text}`)
      .join('\n');

    const element = document.createElement('a');
    const file = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `${videoTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_transcript.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="flex flex-col h-full bg-[var(--bg-panel)] border border-[var(--border-subtle)] rounded-3xl overflow-hidden shadow-2xl transition-all duration-300">
      
      {/* Header */}
      <div className="p-4 border-b border-[var(--border-subtle)] flex items-center justify-between gap-4 bg-[var(--bg-panel-80)] backdrop-blur-md">
        <h3 className="font-extrabold text-[var(--text-primary)] text-xs md:text-sm flex items-center gap-2 font-sans">
          <span>Video Transcript</span>
          <span className="text-[10px] py-0.5 px-2.5 bg-[var(--bg-hover)] border border-[var(--border-subtle)] rounded-full font-bold text-[var(--text-secondary)]">
            {transcript.length} segments
          </span>
        </h3>
        <button
          onClick={handleDownload}
          title="Download Transcript"
          className="flex items-center gap-1.5 py-2 px-3.5 rounded-xl hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xs font-bold border border-[var(--border-subtle)] transition-all cursor-pointer hover:shadow-md btn-premium"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download</span>
        </button>
      </div>

      {/* Search Bar with neon focus */}
      <div className="p-3 border-b border-[var(--border-subtle)]/40 flex items-center bg-[var(--bg-panel)]">
        <div className="w-full relative flex items-center rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-main)] focus-within:ring-4 focus-within:ring-[var(--primary)]/10 focus-within:border-[var(--primary)] transition-all duration-300">
          <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 z-10" />
          <input
            type="text"
            placeholder="Search transcript phrases..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-transparent text-[var(--text-primary)] placeholder-[var(--text-muted)] text-xs focus:outline-none transition-all font-semibold relative z-10"
          />
        </div>
      </div>

      {/* Transcript list */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2.5 scrollbar-thin">
        {filteredTranscript.length === 0 ? (
          <div className="text-center py-12 text-[var(--text-secondary)] text-xs font-semibold leading-relaxed">
            No matching phrases found.
          </div>
        ) : (
          filteredTranscript.map((item, idx) => {
            const isHighlight = idx === activeIndex;
            return (
              <div
                key={idx}
                ref={isHighlight ? activeItemRef : null}
                className={`group flex gap-4 p-3 rounded-2xl transition-all duration-200 border ${
                  isHighlight
                    ? 'bg-[var(--accent-glow)] border-[var(--primary)]/40 shadow-md active-item-glow'
                    : 'border-transparent hover:bg-[var(--bg-hover)]/50 hover:border-[var(--border-subtle)]'
                }`}
              >
                {/* Play / Timestamp Button */}
                <button
                  onClick={() => onTimestampClick(item.start)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 h-fit rounded-xl text-[10px] font-extrabold transition-all border cursor-pointer ${
                    isHighlight
                      ? 'bg-[var(--primary)] text-white border-transparent shadow-lg'
                      : 'bg-[var(--bg-hover)] group-hover:bg-[var(--bg-panel)] text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] border-[var(--border-subtle)] hover:border-[var(--primary)]/30'
                  }`}
                >
                  <Play className={`w-2.5 h-2.5 fill-current ${isHighlight ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 transition-opacity'}`} />
                  <Clock className={`w-2.5 h-2.5 ${isHighlight ? 'hidden' : 'group-hover:hidden'}`} />
                  <span>{formatTime(item.start)}</span>
                </button>

                {/* Text */}
                <p className={`flex-1 text-xs leading-relaxed font-medium pt-0.5 transition-colors ${
                  isHighlight
                    ? 'text-[var(--text-primary)] font-extrabold'
                    : 'text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]'
                }`}>
                  {item.text}
                </p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
