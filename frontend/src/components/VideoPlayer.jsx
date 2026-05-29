import React from 'react';
import { Video } from 'lucide-react';

export default function VideoPlayer({ videoId, startTimestamp }) {
  if (!videoId) {
    return (
      <div className="w-full aspect-video rounded-3xl border border-[#303030] bg-[#1A1A1A] flex items-center justify-center text-zinc-650">
        <Video className="w-12 h-12 stroke-[1.5]" />
      </div>
    );
  }

  // Generate embed URL with start parameter to seek to timestamp.
  // Add key using startTimestamp to force iframe reload on timestamp click.
  const embedUrl = `https://www.youtube.com/embed/${videoId}?start=${Math.floor(startTimestamp)}&autoplay=1&enablejsapi=1`;

  return (
    <div className="w-full aspect-video rounded-3xl overflow-hidden shadow-2xl border border-[#303030]/60 bg-black relative group transition-all duration-300 hover:border-[#FF0000]/30">
      {/* Cinematic subtle glow overlay */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#FF0000]/30 to-transparent z-10 pointer-events-none" />
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
