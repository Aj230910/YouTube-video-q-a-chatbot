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

  // Find active segment index based on activeTimestamp
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

  // Scroll active item into view
  useEffect(() => {
    if (activeIndex !== -1) {
      activeItemRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [activeIndex]);

  // Filter transcript segments based on search input
  const filteredTranscript = useMemo(() => {
    if (!searchQuery.trim()) return transcript;
    return transcript.filter((item) =>
      item.text.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [transcript, searchQuery]);

  // Download transcript as plain text file
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
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl overflow-hidden shadow-md transition-all duration-300">
      {/* Header */}
      <div className="p-4 border-b border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-900/50">
        <h3 className="font-extrabold text-slate-850 dark:text-slate-150 text-xs md:text-sm flex items-center gap-2">
          <span>Video Transcript</span>
          <span className="text-[10px] py-0.5 px-2 bg-slate-200 dark:bg-slate-800 rounded-full font-bold text-slate-550 dark:text-slate-400">
            {transcript.length} segments
          </span>
        </h3>
        <button
          onClick={handleDownload}
          title="Download Transcript"
          className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-650 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-xs font-bold border border-slate-200/50 dark:border-slate-800/50 transition-all cursor-pointer hover:shadow-sm"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download</span>
        </button>
      </div>

      {/* Search Bar with neon focus */}
      <div className="p-3 border-b border-slate-100 dark:border-slate-800/40 flex items-center">
        <div className="w-full relative flex items-center rounded-xl neon-border">
          <Search className="w-4 h-4 text-slate-450 dark:text-slate-500 absolute left-3 z-10" />
          <input
            type="text"
            placeholder="Search transcript phrases..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 text-xs focus:outline-none transition-all font-semibold relative z-10"
          />
        </div>
      </div>

      {/* Transcript list */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2 scrollbar-thin">
        {filteredTranscript.length === 0 ? (
          <div className="text-center py-12 text-slate-450 dark:text-slate-550 text-xs font-semibold leading-relaxed">
            No matching phrases found.
          </div>
        ) : (
          filteredTranscript.map((item, idx) => {
            const isHighlight = idx === activeIndex;
            return (
              <div
                key={idx}
                ref={isHighlight ? activeItemRef : null}
                className={`group flex gap-4 p-2 rounded-xl transition-all duration-200 border ${
                  isHighlight
                    ? 'bg-brand-50 border-brand-200/60 dark:bg-brand-950/20 dark:border-brand-900/40 shadow-sm'
                    : 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/30'
                }`}
              >
                {/* Play / Timestamp Button */}
                <button
                  onClick={() => onTimestampClick(item.start)}
                  className={`flex items-center gap-1 px-2.5 py-1.5 h-fit rounded-lg text-[10px] font-extrabold transition-all border cursor-pointer ${
                    isHighlight
                      ? 'bg-brand-600 text-white border-brand-500 shadow-sm'
                      : 'bg-slate-100 group-hover:bg-brand-50 dark:bg-slate-800 group-hover:dark:bg-brand-950/45 text-slate-650 group-hover:text-brand-600 dark:text-slate-400 group-hover:dark:text-brand-400 border-transparent hover:border-brand-200/30'
                  }`}
                >
                  <Play className={`w-2.5 h-2.5 fill-current ${isHighlight ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 transition-opacity'}`} />
                  <Clock className={`w-2.5 h-2.5 ${isHighlight ? 'hidden' : 'group-hover:hidden'}`} />
                  <span>{formatTime(item.start)}</span>
                </button>

                {/* Text */}
                <p className={`flex-1 text-xs leading-relaxed font-semibold pt-0.5 transition-colors ${
                  isHighlight
                    ? 'text-slate-900 dark:text-white font-extrabold'
                    : 'text-slate-600 dark:text-slate-350'
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

