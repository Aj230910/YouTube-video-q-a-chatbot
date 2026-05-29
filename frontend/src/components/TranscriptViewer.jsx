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
    <div className="flex flex-col h-full bg-[#1A1A1A] border border-[#303030]/50 rounded-3xl overflow-hidden shadow-2xl transition-all duration-300">
      {/* Header */}
      <div className="p-4 border-b border-[#303030]/50 flex items-center justify-between gap-4 bg-[#1A1A1A]/80 backdrop-blur-md">
        <h3 className="font-extrabold text-white text-xs md:text-sm flex items-center gap-2 font-sans">
          <span>Video Transcript</span>
          <span className="text-[10px] py-0.5 px-2.5 bg-[#212121] border border-[#303030] rounded-full font-bold text-[#AAAAAA]">
            {transcript.length} segments
          </span>
        </h3>
        <button
          onClick={handleDownload}
          title="Download Transcript"
          className="flex items-center gap-1.5 py-2 px-3.5 rounded-xl hover:bg-[#212121] text-[#AAAAAA] hover:text-white text-xs font-bold border border-[#303030] transition-all cursor-pointer hover:shadow-lg btn-premium"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download</span>
        </button>
      </div>

      {/* Search Bar with neon focus */}
      <div className="p-3 border-b border-[#303030]/40 flex items-center">
        <div className="w-full relative flex items-center rounded-2xl border border-[#303030] bg-[#0F0F0F] focus-within:ring-4 focus-within:ring-red-500/10 focus-within:border-[#FF0000] transition-all duration-300">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 z-10" />
          <input
            type="text"
            placeholder="Search transcript phrases..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-transparent text-white placeholder-zinc-650 text-xs focus:outline-none transition-all font-semibold relative z-10"
          />
        </div>
      </div>

      {/* Transcript list */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2.5 scrollbar-thin">
        {filteredTranscript.length === 0 ? (
          <div className="text-center py-12 text-[#AAAAAA] text-xs font-semibold leading-relaxed">
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
                    ? 'bg-red-950/20 border-[#FF0000]/40 shadow-md active-item-glow'
                    : 'border-transparent hover:bg-[#212121]/50 hover:border-[#303030]'
                }`}
              >
                {/* Play / Timestamp Button */}
                <button
                  onClick={() => onTimestampClick(item.start)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 h-fit rounded-xl text-[10px] font-extrabold transition-all border cursor-pointer ${
                    isHighlight
                      ? 'bg-[#FF0000] text-white border-transparent shadow-lg'
                      : 'bg-[#212121] group-hover:bg-[#1A1A1A] text-[#AAAAAA] group-hover:text-white border-[#303030] hover:border-red-500/30'
                  }`}
                >
                  <Play className={`w-2.5 h-2.5 fill-current ${isHighlight ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 transition-opacity'}`} />
                  <Clock className={`w-2.5 h-2.5 ${isHighlight ? 'hidden' : 'group-hover:hidden'}`} />
                  <span>{formatTime(item.start)}</span>
                </button>

                {/* Text */}
                <p className={`flex-1 text-xs leading-relaxed font-medium pt-0.5 transition-colors ${
                  isHighlight
                    ? 'text-white font-extrabold'
                    : 'text-[#AAAAAA] group-hover:text-white'
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
