import React from 'react';
import { Video } from 'lucide-react';

export default function VideoPlayer({ videoId, startTimestamp }) {
  if (!videoId) {
    return (
      <div className="w-full aspect-video rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-panel)] flex items-center justify-center text-[var(--text-muted)]">
        <Video className="w-12 h-12 stroke-[1.5]" />
      </div>
    );
  }

  const embedUrl = `https://www.youtube.com/embed/${videoId}?start=${Math.floor(startTimestamp)}&autoplay=1&enablejsapi=1`;

  return (
    <div className="w-full aspect-video rounded-3xl overflow-hidden shadow-2xl border border-[var(--border-subtle)] bg-black relative group transition-all duration-300 hover:border-[var(--primary)]/30">
      {/* Cinematic subtle glow overlay */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--primary)]/30 to-transparent z-10 pointer-events-none" />
      <iframe
        key={`${videoId}-${Math.floor(startTimestamp)}`}
        src={embedUrl}
        title="YouTube video player"
        className="w-full h-full relative z-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  );
}
